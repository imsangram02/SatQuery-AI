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


def display_results_in_cli(output: EngineOutput) -> None:
    """Print streamlined, high-signal results, artifact generation status, and image explanation."""
    stats = output.statistics
    audit = output.audit_trace
    artifacts = output.artifacts

    verdict_icons = {
        "VERIFIED": "🟢 VERIFIED (Spectrally Grounded)",
        "PARTIAL": "🟡 PARTIAL (Spectral Inconsistency Detected)",
        "REJECTED": "🔴 REJECTED (Physics Sanity Check Failed)",
    }
    verdict_text = verdict_icons.get(audit.verdict, f"⚪ {audit.verdict}")
    boxes = stats.get("bounding_boxes", [])
    target_class = str(stats.get("specialist_metadata", {}).get("target_class", "Target Feature")).replace("_", " ").title()

    # 1. Artifact Generation Status
    print("\n" + "═" * 82)
    print("  📁 GENERATED ARTIFACTS STATUS")
    print("═" * 82)
    if artifacts:
        items = [
            ("Binary Mask Image", artifacts.mask_image_path),
            ("Probability Heatmap Image", artifacts.heatmap_image_path),
            ("Visual Evidence Overlay", artifacts.overlay_image_path),
            ("Vector GeoJSON (RFC 7946)", artifacts.geojson_path),
            ("JSON Analytical Data", artifacts.report_json_path),
            ("Markdown Audit Report", artifacts.report_markdown_path),
        ]
        for name, p_str in items:
            if p_str:
                p = Path(p_str)
                try:
                    rel = p.relative_to(REPO_ROOT)
                except ValueError:
                    rel = p.name
                status = "✓ GENERATED" if p.exists() else "✗ PENDING"
                icon = "🟢" if p.exists() else "🔴"
                print(f"  {icon} [{status}] {name:<26} : {rel}")
            else:
                print(f"  ⚪ [NOT REQUESTED] {name:<26}")
    else:
        print("  ⚠️  Artifact generation was disabled for this execution.")

    # 2. Key Specifications & Quantitative Analytics
    print("\n" + "─" * 82)
    print("  📊 SPECIFICATIONS & QUANTITATIVE ANALYTICS")
    print("─" * 82)
    print(f"  • Target Classification  : {target_class}")
    print(f"  • Delineated Extent      : {stats.get('area_hectares', 0.0):,.2f} hectares ({stats.get('detected_pixel_count', 0):,} px)")
    print(f"  • Scene Coverage Footprint: {stats.get('coverage_percentage', 0.0):.2f}% of satellite scene")
    print(f"  • Mean Model Confidence  : {stats.get('mean_probability', 0.0) * 100.0:.1f}%")
    print(f"  • Task Specialization    : {output.task_type.value}")
    print(f"  • Specialist Backbone    : {audit.specialist_model}")
    print(f"  • Physics Grounding      : {verdict_text}")
    print(f"  • Inference & Reason Time: {audit.execution_time_ms:.1f} ms (100% Offline Edge)")

    if boxes:
        sectors = ", ".join(sorted(list(set(b.get("sector", "Central") for b in boxes))))
        print(f"  • Localized Core Targets : {len(boxes)} distinct regions ({sectors})")

    if audit.physics_checks:
        checks_summary = ", ".join([f"{c.index_name} ({'PASS' if c.passed else 'FLAGGED'}, {c.coverage_percentage:.0f}% agrmt)" for c in audit.physics_checks])
        print(f"  • Radiometric Checks     : {checks_summary}")

    # 3. Comprehensive Natural Language Image Explanation & VQA Answer
    print("\n" + "─" * 82)
    print("  💬 COMPREHENSIVE IMAGE EXPLANATION & VQA ANSWER")
    print("─" * 82)
    for line in output.summary_text.splitlines():
        print(f"  {line}")
    print("═" * 82 + "\n")


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
    engine = SatQueryEngine(default_crs="EPSG:4326")

    uploaded_primary_path: Path
    uploaded_secondary_path: Optional[Path] = None

    if args.image:
        print(f"📥 Ingesting primary satellite raster: {Path(args.image).name}")
        uploaded_primary_path = upload_image_to_workspace(args.image, upload_dir)

        req = QueryRequest(
            query_text=args.query,
            primary_raster=RasterInput(path=str(uploaded_primary_path)),
            confidence_threshold=args.confidence,
            enable_physics_verification=not args.no_physics,
        )
    elif args.pre and args.post:
        print(f"📥 Ingesting bi-temporal pair: {Path(args.pre).name} & {Path(args.post).name}")
        uploaded_primary_path = upload_image_to_workspace(args.pre, upload_dir)
        uploaded_secondary_path = upload_image_to_workspace(args.post, upload_dir)

        req = QueryRequest(
            query_text=args.query or "Detect land-cover changes between pre and post satellite observations",
            primary_raster=RasterInput(path=str(uploaded_primary_path), timestamp="pre"),
            secondary_raster=RasterInput(path=str(uploaded_secondary_path), timestamp="post"),
            confidence_threshold=args.confidence,
            enable_physics_verification=not args.no_physics,
        )
    elif args.optical and args.sar:
        print(f"📥 Ingesting cross-modal pair: {Path(args.optical).name} (Optical) & {Path(args.sar).name} (SAR)")
        uploaded_primary_path = upload_image_to_workspace(args.optical, upload_dir)
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

    print("🧠 Running neural specialist inference & deterministic physics verification...")
    output = engine.execute_query(req, save_artifacts=True)

    # Print full CLI results
    display_results_in_cli(output)


if __name__ == "__main__":
    run_cli()
