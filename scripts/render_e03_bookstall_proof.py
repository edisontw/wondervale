#!/usr/bin/env python3
"""E03 Bookstall independent transparent proof, NOT owner art or gameplay PASS."""
from io import BytesIO
from pathlib import Path
import json
import hashlib
import cairosvg
from PIL import Image, ImageChops, ImageDraw, ImageStat

ROOT=Path(__file__).resolve().parents[1]
EP=ROOT/"content/season-01/s01e03"
OUT=ROOT/"artifacts/e03-bookstall-proof"
OUT.mkdir(parents=True,exist_ok=True)
graph=json.loads((EP/"MARKET_LANE_TOPOLOGY_R2.json").read_text())
b=graph["nodes"]["B"]
assert (b["x"],b["y"])==(1350,335), "R2 bookstall arrival moved: stop"
SOURCE=EP/"MARKET_BOOKSTALL_COMPONENT_R1.svg"
src=SOURCE.read_bytes()
assert b'viewBox="0 0 340 286"' in src and b"<text" not in src and b"<image" not in src
component=Image.open(BytesIO(cairosvg.svg2png(bytestring=src, output_width=680, output_height=572))).convert("RGBA").resize((340,286),Image.Resampling.LANCZOS)
alpha=component.getchannel("A")
bbox=alpha.getbbox()
assert bbox is not None
coverage=sum(1 for v in alpha.getdata() if v>20)/(340*286)
assert .15<coverage<.89, f"Expected genuine alpha silhouette, got {coverage}"
assert max(alpha.getpixel(p) for p in [(0,0),(339,0),(0,285),(339,285)])==0, "opaque cutout corners"
component.save(OUT/"bookstall_transparent_340x286.png")
before=(EP/"MARKET_LANE_LAYERED_R2.svg").read_bytes()
scene=Image.open(BytesIO(cairosvg.svg2png(bytestring=before,output_width=1600,output_height=900))).convert("RGBA")
decor=Image.open(BytesIO(cairosvg.svg2png(bytestring=(EP/"MARKET_LANE_DECOR_OVERLAY_R1.svg").read_bytes(), output_width=1600,output_height=900))).convert("RGBA")
assert scene.size==(1600,900)
placement={"x":1170,"y":-4,"width":340,"height":286}
# Hard guarantee: no nontransparent component alpha intersects the bookstall destination
# approach disk radius 40 at the actual R2 B node, or path portion near that node.
fullAlpha=Image.new("L",(1600,900),0)
fullAlpha.paste(alpha,(placement["x"],placement["y"]))
for node_id in ["B","J","T","W"]:
    n=graph["nodes"][node_id]
    rr=40 if node_id=="B" else 28
    for y in range(max(0,n["y"]-rr),min(900,n["y"]+rr+1)):
        for x in range(max(0,n["x"]-rr),min(1600,n["x"]+rr+1)):
            if (x-n["x"])**2+(y-n["y"])**2<rr**2 and fullAlpha.getpixel((x,y))>15:
                raise AssertionError("Bookstall sprite obstructs visual approach disk at "+node_id)
frame0=scene.copy()
frame1=scene.copy()
frame1.alpha_composite(component,(placement["x"],placement["y"]))
frame2=scene.copy()
frame2.alpha_composite(decor)
frame2.alpha_composite(component,(placement["x"],placement["y"]))
w,h=1600,900
for name,img in [("base",frame0),("bookstall_only",frame1),("decor_plus_bookstall",frame2)]:
    img.convert("RGB").save(OUT/("full_1600x900_"+name+".png"))
    img.resize((568,320),Image.Resampling.LANCZOS).convert("RGB").save(OUT/("landscape_568x320_"+name+".png"))
canvas=Image.new("RGB",(568*3,320),"white")
for i,img in enumerate([frame0,frame1,frame2]):
    canvas.paste(img.resize((568,320),Image.Resampling.LANCZOS).convert("RGB"),(568*i,0))
canvas.save(OUT/"landscape_comparison_triptych.png")
report={"status":"COMPONENT_SOURCE_AND_RASTER_QA_ONLY","source_sha256":hashlib.sha256(src).hexdigest(),"pixel_size":list(component.size),"coverage_alpha_gt20":round(coverage,4),"alpha_bbox":bbox,"placement":placement,"arrival_anchor_B":[b["x"],b["y"]],"protected_approach_disks":["B","J","T","W"],"output_files":sorted(f.name for f in OUT.glob("*.png")),"full_scene_geometry_modified":False,"actual_browser_or_device_qa":"NOT_RUN","owner_art_pass":"PENDING"}
(OUT/"report.json").write_text(json.dumps(report,indent=2)+"\n")
print(json.dumps(report,indent=2))
