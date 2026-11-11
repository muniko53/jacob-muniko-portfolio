"""Mask personal details in screenshots before publishing them.

The source screenshots are not committed. Point this script at the folder that
contains `linklet-images/` and `mica-images/` (default: ~/Downloads) and it
writes the cleaned WebP files into src/assets/img/.

Only the rectangles listed below are blurred. Keep the boxes tight so the
interface stays readable and no unintended area is hidden.
"""

import sys
from pathlib import Path

from PIL import Image, ImageFilter

SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "Downloads"
DST = Path(__file__).resolve().parent.parent / "src" / "assets" / "img"

LINKLET = SRC / "linklet-images"
MICA = SRC / "mica-images"

# (output name, source path, list of (x0, y0, x1, y1) rectangles)
JOBS = [
    # ---- Linklet ----
    # No personal data beyond the account initials in the header.
    ("linklet-home", LINKLET / "Screenshot 2026-11-10 224144.png", [(1455, 5, 1500, 50)]),
    ("linklet-sell", LINKLET / "Screenshot 2026-11-10 224110.png", [(1455, 5, 1500, 50)]),
    (
        "linklet-listings-auth",
        LINKLET / "Screenshot 2026-11-10 224241.png",
        [
            (1455, 5, 1500, 50),  # account initials
            (980, 478, 1160, 522),  # seller phone number
        ],
    ),
    (
        "linklet-chat",
        LINKLET / "Screenshot 2026-11-10 224020.png",
        [(455, 0, 990, 670)],  # other participant's name, avatar, and messages
    ),
    # ---- MICA ----
    (
        "mica-chat",
        MICA / "Screenshot 2026-11-10 225039.png",
        [
            (320, 555, 375, 605),  # assistant avatar
            (1175, 470, 1245, 515),  # "YOU" badge
            (1360, 60, 1420, 120),  # top-right avatar
        ],
    ),
    (
        "mica-models",
        MICA / "Screenshot 2026-11-10 225016.png",
        [(1385, 55, 1445, 115)],  # top-right avatar
    ),
    (
        "mica-projects",
        MICA / "Screenshot 2026-11-10 224956.png",
        [
            (95, 110, 150, 170),  # assistant avatar
            (1360, 60, 1420, 120),  # top-right avatar
        ],
    ),
]

RADIUS = 26


def mask(img, boxes):
    for x0, y0, x1, y1 in boxes:
        x0 = max(0, x0)
        y0 = max(0, y0)
        x1 = min(img.width, x1)
        y1 = min(img.height, y1)
        if x1 <= x0 or y1 <= y0:
            continue
        region = img.crop((x0, y0, x1, y1))
        img.paste(region.filter(ImageFilter.GaussianBlur(RADIUS)), (x0, y0))
    return img


for name, source, boxes in JOBS:
    img = Image.open(source).convert("RGB")
    mask(img, boxes)
    out = DST / f"{name}.webp"
    img.save(out, "WEBP", quality=88, method=6)
    print(f"{name} {img.size[0]}x{img.size[1]} -> {out.name} {out.stat().st_size // 1024} KB")
