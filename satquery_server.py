"""
SatQuery AI — REST API Backend Server
Provides HTTP endpoints for uploading satellite images, executing neural reasoning queries,
and serving actual prediction artifacts (masks, heatmaps, visual overlays, and reports).
"""

from datetime import datetime, timezone
import json
import os
from pathlib import Path
import shutil
import sys
import time
from typing import Any, Dict, List

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Ensure repository root is on sys.path
REPO_ROOT = Path(__file__).resolve().parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from satquery_core.src.controller.schemas import (
    EngineOutput,
    QueryRequest,
    RasterInput,
    SensorModality,
    TaskType,
)
from satquery_core.src.engine import SatQueryEngine

# Initialize Flask application
app = Flask(__name__)
CORS(app)

# Standardized folder paths
DATA_DIR = REPO_ROOT / "data"
INPUTS_DIR = DATA_DIR / "inputs"
UPLOADS_DIR = INPUTS_DIR / "uploads"
SAMPLES_DIR = INPUTS_DIR / "samples"
OUTPUTS_DIR = DATA_DIR / "outputs"
MASKS_DIR = OUTPUTS_DIR / "masks"
HEATMAPS_DIR = OUTPUTS_DIR / "heatmaps"
OVERLAYS_DIR = OUTPUTS_DIR / "overlays"
GEOJSON_DIR = OUTPUTS_DIR / "geojson"
REPORTS_DIR = OUTPUTS_DIR / "reports"

for d in [UPLOADS_DIR, SAMPLES_DIR, MASKS_DIR, HEATMAPS_DIR, OVERLAYS_DIR, GEOJSON_DIR, REPORTS_DIR]:
    d.mkdir(parents=True, exist_ok=True)

# Initialize Engine
engine = SatQueryEngine(default_crs="EPSG:4326")

ALLOWED_EXTENSIONS = {".tif", ".tiff", ".png", ".jpg", ".jpeg", ".bmp", ".webp", ".jp2"}


def allowed_file(filename: str) -> bool:
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check and engine status."""
    return jsonify({
        "status": "healthy",
        "engine": "SatQuery AI",
        "version": "2.0.0-offline",
        "device": str(engine.get_specialist("single_image_s2").device),
        "paths": {
            "inputs_upload": str(UPLOADS_DIR),
            "outputs_masks": str(MASKS_DIR),
            "outputs_heatmaps": str(HEATMAPS_DIR),
            "outputs_overlays": str(OVERLAYS_DIR),
            "outputs_reports": str(REPORTS_DIR),
        },
    })


@app.route("/api/upload", methods=["POST"])
def upload_file():
    """
    Upload an image file directly to data/inputs/uploads/.
    Expects multipart/form-data with key 'file'.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({
            "error": f"Unsupported file type. Supported: {', '.join(ALLOWED_EXTENSIONS)}"
        }), 400

    safe_name = secure_filename(file.filename)
    timestamp = int(time.time())
    saved_filename = f"upload_{timestamp}_{safe_name}"
    target_path = UPLOADS_DIR / saved_filename

    file.save(target_path)

    return jsonify({
        "message": "File uploaded successfully",
        "filename": saved_filename,
        "original_name": file.filename,
        "file_path": str(target_path),
        "file_size_bytes": target_path.stat().st_size,
        "url": f"/api/inputs/uploads/{saved_filename}",
    })


@app.route("/api/analyze", methods=["POST"])
def analyze_query():
    """
    Execute real satellite prediction query.
    Accepts JSON payload:
    {
        "query_text": "...",
        "image_path": "...",  # Can be absolute path or filename in uploads/ or samples/
        "secondary_image_path": "...", # Optional
        "confidence_threshold": 0.45,
        "enable_physics_verification": true
    }
    """
    data = request.get_json(force=True) if request.is_json else request.form.to_dict()

    query_text = data.get("query_text")
    image_path_str = data.get("image_path")
    secondary_path_str = data.get("secondary_image_path")
    confidence = float(data.get("confidence_threshold", 0.45))
    enable_physics = bool(data.get("enable_physics_verification", True))

    # Also check if file was uploaded in the same multipart request
    if not image_path_str and "file" in request.files:
        file = request.files["file"]
        if file.filename and allowed_file(file.filename):
            safe_name = secure_filename(file.filename)
            saved_filename = f"upload_{int(time.time())}_{safe_name}"
            target_path = UPLOADS_DIR / saved_filename
            file.save(target_path)
            image_path_str = str(target_path)

    # Auto-select uploaded input image if no image path provided or if prototype fallback is sent
    default_upload = UPLOADS_DIR / "ROIs1970_fall_s2_2_p6.png"
    if not image_path_str:
        if default_upload.exists():
            image_path_str = str(default_upload)
        else:
            upload_list = sorted(list(UPLOADS_DIR.glob("*.png")) + list(UPLOADS_DIR.glob("*.tif")))
            if upload_list:
                image_path_str = str(upload_list[0])
            else:
                return jsonify({"error": "image_path is required"}), 400

    # Auto-route urban queries from frontend prototype fallback to the uploaded scene
    if image_path_str and "sentinel2_godavari_pre.tif" in image_path_str and default_upload.exists():
        if not query_text or any(k in (query_text or "").lower() for k in ["urban", "building", "structure", "city", "built-up", "settlement"]):
            image_path_str = str(default_upload)

    # Set default analytical query according to the input image
    if not query_text or query_text.strip() == "":
        query_text = "Detect urban structures, buildings, and built-up areas"

    # Resolve primary image path
    primary_path = Path(image_path_str)
    if not primary_path.is_absolute():
        if (UPLOADS_DIR / image_path_str).exists():
            primary_path = UPLOADS_DIR / image_path_str
        elif (SAMPLES_DIR / image_path_str).exists():
            primary_path = SAMPLES_DIR / image_path_str
        elif (REPO_ROOT / image_path_str).exists():
            primary_path = REPO_ROOT / image_path_str

    if not primary_path.exists():
        return jsonify({"error": f"Image not found at: {image_path_str}"}), 404

    # Resolve secondary image path if provided
    secondary_path = None
    if secondary_path_str:
        sec_p = Path(secondary_path_str)
        if not sec_p.is_absolute():
            if (UPLOADS_DIR / secondary_path_str).exists():
                sec_p = UPLOADS_DIR / secondary_path_str
            elif (SAMPLES_DIR / secondary_path_str).exists():
                sec_p = SAMPLES_DIR / secondary_path_str
            elif (REPO_ROOT / secondary_path_str).exists():
                sec_p = REPO_ROOT / secondary_path_str
        if sec_p.exists():
            secondary_path = sec_p

    req = QueryRequest(
        query_text=query_text,
        primary_raster=RasterInput(path=str(primary_path)),
        secondary_raster=RasterInput(path=str(secondary_path)) if secondary_path else None,
        confidence_threshold=confidence,
        enable_physics_verification=enable_physics,
    )

    try:
        output: EngineOutput = engine.execute_query(req, save_artifacts=True)

        art = output.artifacts
        artifact_urls = {}
        if art:
            artifact_urls = {
                "mask_url": f"/api/outputs/masks/{Path(art.mask_image_path).name}" if art.mask_image_path else None,
                "heatmap_url": f"/api/outputs/heatmaps/{Path(art.heatmap_image_path).name}" if art.heatmap_image_path else None,
                "overlay_url": f"/api/outputs/overlays/{Path(art.overlay_image_path).name}" if art.overlay_image_path else None,
                "geojson_url": f"/api/outputs/geojson/{Path(art.geojson_path).name}" if art.geojson_path else None,
                "report_json_url": f"/api/outputs/reports/{Path(art.report_json_path).name}" if art.report_json_path else None,
                "report_markdown_url": f"/api/outputs/reports/{Path(art.report_markdown_path).name}" if art.report_markdown_path else None,
            }

        return jsonify({
            "success": True,
            "query_text": output.query_text,
            "task_type": output.task_type.value,
            "summary_text": output.summary_text,
            "statistics": output.statistics,
            "audit_trace": output.audit_trace.model_dump(),
            "geojson": output.geojson,
            "artifacts": art.model_dump() if art else {},
            "urls": artifact_urls,
        })
    except Exception as exc:
        return jsonify({"error": f"Inference failed: {str(exc)}"}), 500


@app.route("/api/outputs/<folder>/<filename>", methods=["GET"])
def serve_output(folder: str, filename: str):
    """Serve generated prediction output images and reports."""
    safe_folder = secure_filename(folder)
    target_dir = OUTPUTS_DIR / safe_folder
    if not target_dir.exists():
        return jsonify({"error": "Folder not found"}), 404
    return send_from_directory(target_dir, filename)


@app.route("/api/inputs/<folder>/<filename>", methods=["GET"])
def serve_input(folder: str, filename: str):
    """Serve uploaded or sample input images."""
    safe_folder = secure_filename(folder)
    target_dir = INPUTS_DIR / safe_folder
    if not target_dir.exists():
        return jsonify({"error": "Folder not found"}), 404
    return send_from_directory(target_dir, filename)


@app.route("/api/reports", methods=["GET"])
def list_reports():
    """List all saved analytical reports."""
    reports = []
    for f in sorted(list(REPORTS_DIR.glob("*.json")), reverse=True):
        try:
            with open(f, "r", encoding="utf-8") as rf:
                data = json.load(rf)
                reports.append({
                    "id": data.get("metadata", {}).get("report_id", f.stem),
                    "filename": f.name,
                    "query_text": data.get("query_text", ""),
                    "task_type": data.get("task_type", ""),
                    "timestamp": data.get("metadata", {}).get("timestamp", ""),
                    "area_hectares": data.get("statistics", {}).get("area_hectares", 0.0),
                    "verdict": data.get("audit_trace", {}).get("verdict", "UNVERIFIED"),
                    "json_url": f"/api/outputs/reports/{f.name}",
                    "md_url": f"/api/outputs/reports/{f.stem}.md",
                })
        except Exception:
            continue
    return jsonify({"reports": reports})


@app.route("/api/samples", methods=["GET"])
def list_samples():
    """List available pre-populated sample satellite datasets."""
    samples = []
    for f in sorted(list(SAMPLES_DIR.glob("*.*"))):
        samples.append({
            "name": f.name,
            "size_bytes": f.stat().st_size,
            "path": str(f),
            "url": f"/api/inputs/samples/{f.name}",
        })
    return jsonify({"samples": samples})


@app.route("/api/uploads", methods=["GET"])
def list_uploads():
    """List available uploaded satellite images in data/inputs/uploads/."""
    uploads = []
    for f in sorted(list(UPLOADS_DIR.glob("*.*")), reverse=True):
        if allowed_file(f.name):
            uploads.append({
                "name": f.name,
                "size_bytes": f.stat().st_size,
                "path": str(f),
                "url": f"/api/inputs/uploads/{f.name}",
            })
    return jsonify({"uploads": uploads})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"\n🚀 SatQuery AI Server starting on http://127.0.0.1:{port}")
    print(f"  • Input Uploads Directory: {UPLOADS_DIR}")
    print(f"  • Output Predictions Directory: {OUTPUTS_DIR}")
    print(f"  • Analytical Reports Directory: {REPORTS_DIR}\n")
    app.run(host="0.0.0.0", port=port, debug=False)
