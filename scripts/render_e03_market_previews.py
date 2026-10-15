#!/usr/bin/env python3
"""Gate-2 SVG raster and scaled-viewport snapshots; NOT real browser/device QA."""
from pathlib import Path
import json
import sys
from io import BytesIO
import cairosvg
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
EP = ROOT / "content" / "season-01" / "s01e03"
SOURCE = EP / "MARKET_LANE_LAYERED_R2.svg"
GRAPH = json.loads((EP / "MARKET_LANE_TOPOLOGY_R2.json").read_text())
OUT = ROOT / "artifacts" / "e03-market-r2"
OUT.mkdir(parents=True, exist_ok=True)
BASIS = {"full_1600x900": (1600, 900),
         "landscape_667x375": (667, 375),
         "landscape_568x320": (568, 320),
         "portrait_390x844": (390, 844)}
svg_bytes = SOURCE.read_bytes()
assert b"layer-path-level" in svg_bytes
assert b"<text" not in svg_bytes
reports = []

for name, (width, height) in BASIS.items():
    # Source coordinates are always 1600 x 900; portrait is FIT-CONTAIN, not stretched.
    scale = min(width / 1600, height / 900)
    iw, ih = round(1600 * scale), round(900 * scale)
    raw = cairosvg.svg2png(bytestring=svg_bytes, output_width=iw, output_height=ih)
    scene = Image.open(BytesIO(raw)).convert("RGBA")
    # Diagnostic image emulates unused letterboxed space only; not an actual game dock.
    canvas = Image.new("RGBA", (width, height), "#eee5d1")
    px, py = (width - iw) // 2, (height - ih) // 2
    canvas.alpha_composite(scene, (px, py))
    clean = OUT / (name + "_clean.png")
    canvas.save(clean)
    # QA-only overlay; never production art or screenshot of playable UI.
    marked = canvas.copy()
    paint = ImageDraw.Draw(marked, "RGBA")
    for node_id, pos in GRAPH["nodes"].items():
        x = px + round(pos["x"] * scale)
        y = py + round(pos["y"] * scale)
        if x < 0 or x >= width or y < 0 or y >= height:
            raise RuntimeError("Waypoint outside canvas: " + node_id)
        radius = max(2, round(9 * scale))
        paint.ellipse((x-radius, y-radius, x+radius, y+radius),
                      fill=(246, 196, 85, 225), outline=(35, 53, 59, 255))
        if width > 600:
            paint.text((x+5, y-12), node_id, fill=(31, 45, 50, 255))
    if height < width:
        dock_y = round(height * 705 / 900)
        paint.rectangle((0, dock_y, width-1, height-1), fill=(35, 55, 63, 205))
        paint.text((8, dock_y+6), "SIMULATED dock | NOT game UI", fill=(255, 245, 226, 255))
    marked_path = OUT / (name + "_diagnostic.png")
    marked.save(marked_path)
    pixel = canvas.convert("RGB")
    extrema = pixel.getextrema()
    assert any(high-low > 60 for low, high in extrema), "Blank/low variance rendered image"
    reports.append({"size":name, "rendered_pixels": [width, height],
                    "svg_fit": [iw, ih], "scene_bbox": [px, py, px+iw, py+ih],
                    "clean":clean.name, "diagnostic":marked_path.name,
                    "actual_browser_qa": False})
(OUT / "report.json").write_text(json.dumps({"status": "CAIROSVG_RASTER_PASS_NOT_BROWSER_QA",
         "source": str(SOURCE.relative_to(ROOT)), "frames": reports,
         "physical_cart_clearances": "NOT_TESTED", "owner_art_pass": False}, indent=2) + "\n")
print("Gate 2 CairoSVG raster previews generated:", len(reports))
for item in reports:
    print(item["size"], item["svg_fit"])
