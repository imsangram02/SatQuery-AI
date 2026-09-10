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

    # Output Artifacts Table
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
        help="Path to input satellite image (.tif, .png, .jpg, etc.) to upload & analyze",
    )
    parser.add_argument(
        "-q", "--query",
        type=str,
        default="Delineate open water bodies and lakes in the scene",
        help="Natural language analytical query (e.g. 'Identify water bodies', 'Detect urban expansion')",
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

    if not args.image and not args.pre and not args.optical:
        print("\n⚠️  No input image specified!")
        print("Usage:")
        print("  python satquery_cli.py --image <image_path> --query \"Delineate water bodies\"")
        print("  python satquery_cli.py --demo")
        print("  python satquery_cli.py --help\n")
        return

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
