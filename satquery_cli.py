"""
SatQuery AI — Interactive Command-Line Interface (CLI)
Enables uploading/specifying satellite rasters, running actual neural specialist inference,
cross-examining with deterministic physics, saving masks, heatmaps, overlays, and reports,
and displaying comprehensive analytical results in the CLI.
"""

import argparse
from datetime import datetime, timezone
import os
from pathlib import Path
import shutil
import sys
import time
from typing import Optional, Union


# Ensure repository root is on sys.path
REPO_ROOT = Path(__file__).resolve().parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

# Force UTF-8 encoding on Windows console
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from satquery_core.src.controller.schemas import (
    EngineOutput,
    QueryRequest,
    RasterInput,
    SensorModality,
    TaskType,
)
from satquery_core.src.engine import SatQueryEngine


def print_banner() -> None:
    """Display CLI application banner."""
    print("=" * 82)
    print("      🛰️   S A T Q U E R Y   A I  —  G E O S P A T I A L   E N G I N E        ")
    print("   Offline Satellite Neural Reasoning, Physics Grounding & Analytical Reports  ")
    print("=" * 82)


def upload_image_to_workspace(image_path: Union[str, Path], upload_dir: Path) -> Path:
    """
    Store uploaded input image into the standardized input directory:
    E:\\SatQuery-AI\\data\\inputs\\uploads\\
    """
    src_path = Path(image_path).resolve()
    if not src_path.exists():
        raise FileNotFoundError(f"Input image not found at: {src_path}")

    upload_dir.mkdir(parents=True, exist_ok=True)
    timestamp = int(time.time())
    dest_filename = f"upload_{timestamp}_{src_path.name}"
    dest_path = upload_dir / dest_filename

    # If file is already inside upload_dir, reuse it
    if src_path.parent == upload_dir:
        return src_path

    shutil.copy2(src_path, dest_path)
    return dest_path


def format_table_row(col1: str, col2: str, width1: int = 30, width2: int = 48) -> str:
    return f"  │ {col1:<{width1}} │ {col2:<{width2}} │"


def format_table_divider(width1: int = 30, width2: int = 48, sep_char: str = "─") -> str:
    return f"  ├─{sep_char * width1}─┼─{sep_char * width2}─┤"


def display_results_in_cli(output: EngineOutput) -> None:
    """Print beautifully structured results, metrics, and artifact locations in the CLI."""
    stats = output.statistics
    audit = output.audit_trace
    artifacts = output.artifacts

    verdict_icons = {
        "VERIFIED": "🟢 VERIFIED (Physically Grounded)",
        "PARTIAL": "🟡 PARTIAL (Spectral Inconsistency Detected)",
        "REJECTED": "🔴 REJECTED (Physics Sanity Check Failed)",
    }
    verdict_text = verdict_icons.get(audit.verdict, f"⚪ {audit.verdict}")

    print("\n" + "─" * 82)
    print("  📊 PREDICTION RESULTS & QUANTITATIVE ANALYTICS")
    print("─" * 82)
    print(f"  ┌{'─' * 32}┬{'─' * 46}┐")
    print(format_table_row("Metric", "Value", 30, 44))
    print(format_table_divider(30, 44))
    print(format_table_row("Target Classification", str(stats.get("specialist_metadata", {}).get("target_class", "Target Entity")), 30, 44))
    print(format_table_row("Delineated Surface Area", f"{stats.get('area_hectares', 0.0):.2f} hectares", 30, 44))
    print(format_table_row("Detected Pixels", f"{stats.get('detected_pixel_count', 0):,} px", 30, 44))
    print(format_table_row("Scene Coverage", f"{stats.get('coverage_percentage', 0.0):.2f}%", 30, 44))
    print(format_table_row("Mean Model Confidence", f"{stats.get('mean_probability', 0.0) * 100.0:.1f}%", 30, 44))
    print(format_table_row("Routed Task Specialization", str(output.task_type.value), 30, 44))
    print(format_table_row("Agentic Controller Decoder", str(getattr(audit, "controller_model", "Qwen3-VL-7B (BigEarthNet LoRA)")), 30, 44))
    print(format_table_row("Neural Specialist Backbone", str(audit.specialist_model), 30, 44))
    print(format_table_row("Inference & Reasoning Time", f"{audit.execution_time_ms:.1f} ms", 30, 44))
    print(format_table_row("Physics Grounding Verdict", verdict_text, 30, 44))
    print(f"  └{'─' * 32}┴{'─' * 46}┘")

    # Physics Verification Table
    if audit.physics_checks:
        print("\n  🔬 DETERMINISTIC PHYSICS GROUNDING CHECKS:")
        for check in audit.physics_checks:
            status_str = "✅ PASS" if check.passed else "⚠️ FLAGGED"
            print(f"    • {check.index_name:<6} : {status_str} | Agreement: {check.coverage_percentage:.1f}% | Mean: {check.mean_value:.3f} | Bounds: [{check.min_value:.3f}, {check.max_value:.3f}]")
            if check.discrepancy_note:
                print(f"      ↳ Note: {check.discrepancy_note}")

    # Bounding Box Grounding Table
    boxes = stats.get("bounding_boxes", [])
    if boxes:
        print("\n  🎯 PRECISE BOUNDING BOX GROUNDINGS & LOCALIZED TARGETS:")
        print(f"  ┌{'─' * 8}┬{'─' * 18}┬{'─' * 28}┬{'─' * 12}┬{'─' * 8}┐")
        print(f"  │ {'ID':<6} │ {'Sector':<16} │ {'Pixel Box [x0,y0,x1,y1]':<26} │ {'Area':<10} │ {'Conf':<6} │")
        print(f"  ├{'─' * 8}┼{'─' * 18}┼{'─' * 28}┼{'─' * 12}┼{'─' * 8}┤")
        for b in boxes:
            b_id = b.get("id", "")
            sector = b.get("sector", "Central")
            pbox = str(b.get("pixel_box", [b.get("x"), b.get("y"), b.get("width"), b.get("height")]))
            b_ha = f"{b.get('area_hectares', 0.0):.1f} ha" if 'area_hectares' in b else f"{b.get('pixel_count', 0)} px"
            b_conf = f"{b.get('confidence', 0)}%"
            print(f"  │ {b_id:<6} │ {sector:<16} │ {pbox:<26} │ {b_ha:<10} │ {b_conf:<6} │")
        print(f"  └{'─' * 8}┴{'─' * 18}┴{'─' * 28}┴{'─' * 12}┴{'─' * 8}┘")
    if artifacts:
        print("\n" + "─" * 82)
        print("  📁 STORAGE & GENERATED FILE ARTIFACT LOCATIONS")
        print("─" * 82)
        print(f"  ┌{'─' * 28}┬{'─' * 50}┐")
        print(format_table_row("Artifact Description", "File Storage Location", 26, 48))
        print(format_table_divider(26, 48))
        print(format_table_row("Input Image Uploaded", str(Path(artifacts.input_image_path).name), 26, 48))
        print(format_table_row("  ↳ Full Input Path", str(artifacts.input_image_path), 26, 48))
        if artifacts.secondary_image_path:
            print(format_table_row("Secondary Image", str(artifacts.secondary_image_path), 26, 48))
        print(format_table_divider(26, 48, "─"))
        print(format_table_row("Output Mask Image", str(artifacts.mask_image_path), 26, 48))
        print(format_table_row("Output Heatmap Image", str(artifacts.heatmap_image_path), 26, 48))
        print(format_table_row("Output Visual Overlay", str(artifacts.overlay_image_path), 26, 48))
        print(format_table_row("RFC 7946 Vector GeoJSON", str(artifacts.geojson_path), 26, 48))
        print(format_table_divider(26, 48, "─"))
        print(format_table_row("JSON Analytical Report", str(artifacts.report_json_path), 26, 48))
        print(format_table_row("Markdown Audit Report", str(artifacts.report_markdown_path), 26, 48))
        print(f"  └{'─' * 28}┴{'─' * 50}┘")

    # Natural Language Summary
    print("\n" + "─" * 82)
    print("  💬 NATURAL LANGUAGE SYNTHESIS & FORENSIC AUDIT")
    print("─" * 82)
    for line in output.summary_text.splitlines():
        print(f"  {line}")
    print("=" * 82 + "\n")


def run_cli() -> None:
    """CLI Argument Parser and Execution Flow."""
    parser = argparse.ArgumentParser(
        description="SatQuery AI — Satellite Reasoning & Prediction CLI",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument(
        "-i", "--image",
        type=str,
        default=None,
        help="Path to input satellite image (.tif, .png, .jpg, etc.) to upload & analyze (defaults to uploaded image)",
    )
    parser.add_argument(
        "-q", "--query",
        type=str,
        default=None,
        help="Natural language analytical query (e.g. 'Detect urban structures, buildings, and built-up areas')",
    )
    parser.add_argument(
        "--pre",
        type=str,
        help="Pre-event satellite observation raster for bi-temporal change detection",
    )
    parser.add_argument(
        "--post",
        type=str,
        help="Post-event satellite observation raster for bi-temporal change detection",
    )
    parser.add_argument(
        "--optical",
        type=str,
        help="Optical Sentinel-2 raster for cross-modal fusion",
    )
    parser.add_argument(
        "--sar",
        type=str,
        help="SAR Sentinel-1 radar raster for cross-modal fusion",
    )
    parser.add_argument(
        "--secondary",
        type=str,
        help="Secondary satellite observation raster (bi-temporal post-event or cross-modal SAR)",
    )
    parser.add_argument(
        "-c", "--confidence",
        type=float,
        default=0.45,
        help="Confidence threshold in [0.0, 1.0] (default: 0.45)",
    )
    parser.add_argument(
        "--no-physics",
        action="store_true",
        help="Disable deterministic physical index verification",
    )
    parser.add_argument(
        "--demo",
        action="store_true",
        help="Run an end-to-end demonstration using built-in satellite samples",
    )
    parser.add_argument(
        "--bitemporal",
        action="store_true",
        help="Run bi-temporal change detection on pre- and post-flood satellite scenes",
    )
    parser.add_argument(
        "--crossmodal",
        action="store_true",
        help="Run cross-modal fusion on paired Optical (S2) and SAR (S1) satellite scenes",
    )
    parser.add_argument(
        "--list-reports",
        action="store_true",
        help="List all saved reports in data/outputs/reports/",
    )

    args = parser.parse_args()

    print_banner()

    upload_dir = REPO_ROOT / "data" / "inputs" / "uploads"
    samples_dir = REPO_ROOT / "data" / "inputs" / "samples"
    reports_dir = REPO_ROOT / "data" / "outputs" / "reports"

    # List reports command
    if args.list_reports:
        print("\n📋 Saved Analytical Reports in data/outputs/reports/:")
        if not reports_dir.exists():
            print("  No reports found yet.")
            return
        report_files = sorted(list(reports_dir.glob("*.md")), reverse=True)
        if not report_files:
            print("  No reports found yet.")
            return
        for r in report_files:
            print(f"  • {r.name}  ({r.stat().st_size / 1024:.1f} KB)")
        print()
        return

    # Demo mode
    if args.demo:
        print("\n🚀 Running Automated Demonstration with Built-in Satellite Scene...")
        demo_image = samples_dir / "sentinel2_godavari_pre.tif"
        if not demo_image.exists():
            print(f"Creating sample fixtures at {samples_dir}...")
            from satquery_core.test_pipeline import create_synthetic_s2_geotiff
            samples_dir.mkdir(parents=True, exist_ok=True)
            create_synthetic_s2_geotiff(demo_image)

        args.image = str(demo_image)
        args.query = "Delineate all open water bodies, rivers and lakes in the scene"

    # Bi-temporal change detection shortcut
    if args.bitemporal:
        print("\n🚀 Preparing Bi-Temporal Pre/Post Satellite Scenes...")
        if (upload_dir / "Image_1_s2.png").exists() and (upload_dir / "Image_2_s2.png").exists():
            args.pre = str(upload_dir / "Image_1_s2.png")
            args.post = str(upload_dir / "Image_2_s2.png")
        else:
            args.pre = str(samples_dir / "sentinel2_godavari_pre.tif")
            args.post = str(samples_dir / "sentinel2_godavari_post.tif")
        if not args.query:
            args.query = "Detect land-cover change between pre and post satellite observations"
        args.image = None

    # Cross-modal fusion shortcut
    if args.crossmodal:
        print("\n🚀 Preparing Cross-Modal Optical (S2) + SAR (S1) Satellite Scenes...")
        if (upload_dir / "Image_1_s2.png").exists() and (upload_dir / "Image_1_s1.png").exists():
            args.optical = str(upload_dir / "Image_1_s2.png")
            args.sar = str(upload_dir / "Image_1_s1.png")
        else:
            args.optical = str(samples_dir / "sentinel2_godavari_pre.tif")
            args.sar = str(samples_dir / "sentinel1_godavari_sar.tif")
        if not args.query:
            args.query = "Fuse optical and SAR radar imagery for cloud-penetrating water and structure detection"
        args.image = None

    if args.secondary:
        q_lower = (args.query or "").lower()
        if any(k in q_lower for k in ["sar", "radar", "fuse", "fusion", "cross-modal", "cloud"]):
            if not args.sar:
                args.sar = args.secondary
        else:
            if not args.post:
                args.post = args.secondary

    if args.image and args.post and not args.pre:
        args.pre = args.image
        args.image = None
    if args.image and args.sar and not args.optical:
        args.optical = args.image
        args.image = None

    if args.pre or args.optical:
        args.image = None

    if not args.image and not args.pre and not args.optical:
        # Check if an image is present in data/inputs/uploads/
        uploads_images = sorted(list(upload_dir.glob("*.png")) + list(upload_dir.glob("*.tif")) + list(upload_dir.glob("*.jpg")))
        if uploads_images:
            # Prefer optical s2 image or Image_1_s2.png if present
            s2_images = [f for f in uploads_images if "s2" in f.name.lower() or "roi" in f.name.lower()]
            selected_file = s2_images[0] if s2_images else uploads_images[0]
            args.image = str(selected_file)
            print(f"\n📂 Auto-selected input image from uploads: {selected_file.name}")
        else:
            print("\n⚠️  No input image specified and no uploads found!")
            print("Usage:")
            print("  python satquery_cli.py --image <image_path> --query \"Detect urban structures, buildings, and built-up areas\"")
            print("  python satquery_cli.py --demo")
            print("  python satquery_cli.py --help\n")
            return

    # Auto-formulate query according to input image if not specified
    if not args.query:
        img_name = Path(args.image).name.lower() if args.image else ""
        if "roi" in img_name or "urban" in img_name:
            args.query = "Detect urban structures, buildings, and built-up areas"
        elif "crop" in img_name or "farm" in img_name:
            args.query = "Detect agricultural crops and vegetation fields"
        else:
            args.query = "Delineate open water bodies, lakes, and rivers"
        print(f"💬 Auto-formulated query: '{args.query}'")

    # Initialize Engine
    print("\n⏳ Initializing SatQuery AI Engine & Ingestion Pipeline...")
    engine = SatQueryEngine(default_crs="EPSG:4326")

    uploaded_primary_path: Path
    uploaded_secondary_path: Optional[Path] = None

    if args.image:
        print(f"📥 Uploading & indexing primary raster: {args.image}")
        uploaded_primary_path = upload_image_to_workspace(args.image, upload_dir)
        print(f"  ✓ Stored at: {uploaded_primary_path}")

        req = QueryRequest(
            query_text=args.query,
            primary_raster=RasterInput(path=str(uploaded_primary_path)),
            confidence_threshold=args.confidence,
            enable_physics_verification=not args.no_physics,
        )
    elif args.pre and args.post:
        print(f"📥 Uploading bi-temporal pre-event raster: {args.pre}")
        uploaded_primary_path = upload_image_to_workspace(args.pre, upload_dir)
        print(f"📥 Uploading bi-temporal post-event raster: {args.post}")
        uploaded_secondary_path = upload_image_to_workspace(args.post, upload_dir)

        req = QueryRequest(
            query_text=args.query or "Detect land-cover changes between pre and post satellite observations",
            primary_raster=RasterInput(path=str(uploaded_primary_path), timestamp="pre"),
            secondary_raster=RasterInput(path=str(uploaded_secondary_path), timestamp="post"),
            confidence_threshold=args.confidence,
            enable_physics_verification=not args.no_physics,
        )
    elif args.optical and args.sar:
        print(f"📥 Uploading optical raster: {args.optical}")
        uploaded_primary_path = upload_image_to_workspace(args.optical, upload_dir)
        print(f"📥 Uploading SAR raster: {args.sar}")
        uploaded_secondary_path = upload_image_to_workspace(args.sar, upload_dir)

        req = QueryRequest(
            query_text=args.query or "Fuse optical and SAR radar imagery for cloud-penetrating water detection",
            primary_raster=RasterInput(path=str(uploaded_primary_path), modality=SensorModality.OPTICAL),
            secondary_raster=RasterInput(path=str(uploaded_secondary_path), modality=SensorModality.SAR),
            confidence_threshold=args.confidence,
            enable_physics_verification=not args.no_physics,
        )
    else:
        print("⚠️ Invalid arguments. Run with --help for documentation.")
        return

    print("🧠 Executing neural specialist inference & deterministic physics verification...")
    output = engine.execute_query(req, save_artifacts=True)

    # Print full CLI results
    display_results_in_cli(output)


if __name__ == "__main__":
    run_cli()
