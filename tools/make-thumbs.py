#!/usr/bin/env python3
"""Generate card-sized thumbnails for the projects page.

The projects page shows one thumbnail per case study. Reusing the full-size
case-study screenshots there pulls roughly 400 KB of images into the page. Each
thumbnail is the same 16:10 crop the browser makes with object-fit: cover and
object-position: top, resized to 1200 px wide, so the card renders the same
picture in a fraction of the bytes.

Run from the repository root:

    python tools/make-thumbs.py
"""

import json
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = os.path.join(ROOT, "src", "content", "work")
IMG = os.path.join(ROOT, "src", "assets", "img")

TARGET_WIDTH = 1200
TARGET_RATIO = 16 / 10
QUALITY = 74


def cover_crop(image: Image.Image) -> Image.Image:
    """Crop like CSS object-fit: cover with object-position: top."""
    width, height = image.size
    target_height = round(TARGET_WIDTH / TARGET_RATIO)
    scale = max(TARGET_WIDTH / width, target_height / height)
    scaled = image.resize(
        (max(1, round(width * scale)), max(1, round(height * scale))),
        Image.LANCZOS,
    )
    scaled_width, scaled_height = scaled.size
    left = (scaled_width - TARGET_WIDTH) // 2
    return scaled.crop((left, 0, left + TARGET_WIDTH, target_height))


def main() -> int:
    if not os.path.isdir(WORK):
        print("work content folder not found:", WORK)
        return 1

    total_before = 0
    total_after = 0
    for name in sorted(os.listdir(WORK)):
        if not name.endswith(".json"):
            continue
        with open(os.path.join(WORK, name), encoding="utf-8") as handle:
            data = json.load(handle)
        hero = data.get("hero")
        if not hero:
            continue
        source = os.path.join(IMG, hero)
        if not os.path.exists(source):
            print("missing source image:", hero)
            return 1

        target_name = f"thumb-{hero}"
        target = os.path.join(IMG, target_name)
        with Image.open(source) as image:
            thumb = cover_crop(image.convert("RGB"))
            thumb.save(target, "WEBP", quality=QUALITY, method=6)

        before = os.path.getsize(source)
        after = os.path.getsize(target)
        total_before += before
        total_after += after
        print(f"{target_name:34} {before / 1024:7.1f} KB -> {after / 1024:6.1f} KB  {thumb.size[0]}x{thumb.size[1]}")

    if total_after:
        print(f"\ntotal {total_before / 1024:.1f} KB -> {total_after / 1024:.1f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
