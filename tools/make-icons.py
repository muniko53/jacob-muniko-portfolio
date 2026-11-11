"""Generate favicons, touch icon, and manifest icons from the brand logo.

Source: src/assets/img/brand-logo.png (transparent JM mark).
Output: src/assets/img/favicon-*.png, apple-touch-icon.png, icon-192.png,
icon-512.png, favicon.ico.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "assets" / "img" / "brand-logo.png"
DST = ROOT / "src" / "assets" / "img"

BG = (13, 20, 17)
MARK = (238, 240, 230)

logo = Image.open(SRC).convert("RGBA")
bbox = logo.getchannel("A").getbbox()
if not bbox:
    raise SystemExit("brand-logo.png has no visible mark")
logo = logo.crop(bbox)


def make(size, color=MARK, bg=BG):
    canvas = Image.new("RGBA", (size, size), bg)
    scale = 0.62
    mark = logo.resize((int(size * scale), int(size * scale)), Image.LANCZOS)
    px = mark.load()
    for y in range(mark.height):
        for x in range(mark.width):
            _, _, _, alpha = px[x, y]
            if alpha:
                px[x, y] = color + (alpha,)
    canvas.alpha_composite(mark, ((size - mark.width) // 2, (size - mark.height) // 2))
    return canvas


for size in (16, 32, 48, 64):
    make(size).convert("RGB").save(DST / f"favicon-{size}.png", "PNG")
    print(f"favicon-{size}.png")

make(180).convert("RGB").save(DST / "apple-touch-icon.png", "PNG")
make(192).convert("RGB").save(DST / "icon-192.png", "PNG")
make(512).convert("RGB").save(DST / "icon-512.png", "PNG")
print("apple-touch-icon.png, icon-192.png, icon-512.png")

icons = [make(s) for s in (16, 32, 48, 64)]
icons[-1].save(DST / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print("favicon.ico")
