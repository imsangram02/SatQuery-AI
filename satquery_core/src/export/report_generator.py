"""
SatQuery AI — Comprehensive Report Generator Module
Produces structured JSON audit records and publication-ready Markdown inspection reports
documenting model inference, physics grounding, spatial vector metrics, and visual evidence paths.
"""

from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Any, Dict, Optional, Union


class ReportGenerator:
    """
    Synthesizes and exports comprehensive analytical reports in JSON and Markdown formats.
    """

    @classmethod
    def save_json_report(
        cls,
        report_data: Dict[str, Any],
        output_path: Union[str, Path],
    ) -> str:
        """
        Export full analytical audit data as a structured JSON file.
        """
        out_path = Path(output_path).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)

        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)

        return str(out_path)

    @classmethod
    def save_markdown_report(
        cls,
        report_data: Dict[str, Any],
        output_path: Union[str, Path],
    ) -> str:
        """
        Generate a publication-grade, human-readable Markdown inspection report.
        """
        out_path = Path(output_path).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)

        meta = report_data.get("metadata", {})
        stats = report_data.get("statistics", {})
        audit = report_data.get("audit_trace", {})
        artifacts = report_data.get("artifacts", {})
        physics_checks = audit.get("physics_checks", [])

        verdict = audit.get("verdict", "UNVERIFIED")
        verdict_badge = {
            "VERIFIED": "🟢 **VERIFIED (Physically & Spectrally Grounded)**",
            "PARTIAL": "🟡 **PARTIAL AGREEMENT (Review Recommended)**",
            "REJECTED": "🔴 **REJECTED (Radiometric Inconsistency)**",
        }.get(verdict, f"⚪ **{verdict}**")

        lines = [
            f"# SatQuery AI — Geospatial Analysis & Forensic Audit Report",
            f"",
            f"**Report ID:** `{meta.get('report_id', 'N/A')}`  ",
            f"**Generated:** {meta.get('timestamp', datetime.now(timezone.utc).isoformat())}  ",
            f"**Physics Grounding Verdict:** {verdict_badge}  ",
            f"",
            f"---",
            f"",
            f"## 1. Executive Summary",
            f"",
            f"> {report_data.get('summary_text', 'No summary generated.')}",
            f"",
            f"- **User Query:** \"{report_data.get('query_text', '')}\"",
            f"- **Routed Task Specialization:** `{report_data.get('task_type', '')}`",
            f"- **Deep Learning Specialist Backbone:** `{audit.get('specialist_model', '')}`",
            f"- **Execution Latency:** {audit.get('execution_time_ms', 0):.1f} ms",
            f"",
            f"---",
            f"",
            f"## 2. Quantitative Spatial Analytics",
            f"",
            f"| Metric | Value | Description |",
            f"| :--- | :--- | :--- |",
            f"| **Identified Target Class** | `{stats.get('specialist_metadata', {}).get('target_class', 'Target Entity')}` | Primary classified entity |",
            f"| **Delineated Extent** | **{stats.get('area_hectares', 0.0):.2f} ha** | Total surface footprint area in hectares |",
            f"| **Pixel Detection Count** | **{stats.get('detected_pixel_count', 0):,} px** | Detected raster pixel count |",
            f"| **Scene Coverage** | **{stats.get('coverage_percentage', 0.0):.2f}%** | Percentage of overall satellite observation |",
            f"| **Mean Model Confidence** | **{stats.get('mean_probability', 0.0) * 100.0:.1f}%** | Mean posterior probability across detections |",
            f"",
            f"---",
            f"",
            f"## 3. Deterministic Physics Grounding Audit",
            f"",
            f"Deterministic optical and SAR radiometric indices were computed to cross-examine neural activations:",
            f"",
        ]

        if physics_checks:
            lines.extend([
                f"| Physical Index | Status | Agreement (%) | Mean Value | Bounds [Min, Max] | Note |",
                f"| :--- | :---: | :---: | :---: | :---: | :--- |",
            ])
            for chk in physics_checks:
                status_str = "✅ PASSED" if chk.get("passed", False) else "⚠️ FLAGGED"
                cov = chk.get("coverage_percentage", 0.0)
                mean_val = chk.get("mean_value", 0.0)
                min_v = chk.get("min_value", 0.0)
                max_v = chk.get("max_value", 0.0)
                note = chk.get("discrepancy_note") or "Aligned with physical reflectance model"
                lines.append(
                    f"| **{chk.get('index_name', 'Index')}** | {status_str} | {cov:.1f}% | {mean_val:.3f} | [{min_v:.3f}, {max_v:.3f}] | {note} |"
                )
            lines.append("")
        else:
            lines.append("*(No conflicting radiometric anomaly or index required for this task type)*\n")

        lines.extend([
            f"---",
            f"",
            f"## 4. File Artifacts & Generated Deliverables",
            f"",
            f"All inputs and prediction outputs are persisted in the standardized storage structure:",
            f"",
            f"| Artifact Type | Storage Location | Format |",
            f"| :--- | :--- | :--- |",
            f"| **Input Image** | `{artifacts.get('input_image_path', 'N/A')}` | Multi-band GeoTIFF / Standard Raster |",
        ])

        if artifacts.get("secondary_image_path"):
            lines.append(f"| **Secondary Image** | `{artifacts.get('secondary_image_path')}` | Pre/Post or SAR Multi-temporal Raster |")

        lines.extend([
            f"| **Output Mask Image** | `{artifacts.get('mask_image_path', 'N/A')}` | 8-Bit Grayscale Binary Mask (PNG) |",
            f"| **Output Heatmap Image** | `{artifacts.get('heatmap_image_path', 'N/A')}` | Colorized Probability Heatmap (PNG) |",
            f"| **Output Overlay Image** | `{artifacts.get('overlay_image_path', 'N/A')}` | Visual Evidence Overlay with Bounding Boxes (PNG) |",
            f"| **Vector Delineation** | `{artifacts.get('geojson_path', 'N/A')}` | RFC 7946 Standard GeoJSON FeatureCollection |",
            f"| **JSON Audit Record** | `{artifacts.get('report_json_path', 'N/A')}` | Machine-readable JSON Audit Payload |",
            f"| **Markdown Report** | `{artifacts.get('report_markdown_path', 'N/A')}` | Self-contained Analytical Report |",
            f"",
            f"---",
            f"",
            f"*Generated by SatQuery AI — 100% Offline Edge/On-Premise Satellite Reasoning Engine.*",
        ])

        with open(out_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

        return str(out_path)
