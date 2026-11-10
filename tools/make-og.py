from PIL import Image, ImageDraw, ImageFont, ImageOps
from pathlib import Path

ROOT = Path(r"C:\Users\jacob\Desktop\jacob-muniko-portfolio")
IMG = ROOT / "src" / "assets" / "img"
OUT = IMG

W, H = 1200, 630
BG = (13, 20, 17)
INK = (238, 240, 230)
SOFT = (203, 212, 201)
MUTED = (147, 162, 152)
RULE = (41, 58, 49)
TEAL = (95, 208, 182)
AMBER = (226, 165, 99)
SURFACE = (22, 35, 29)

SERIF = r"C:\Windows\Fonts\georgia.ttf"
SERIF_B = r"C:\Windows\Fonts\georgiab.ttf"
SERIF_I = r"C:\Windows\Fonts\georgiai.ttf"
SANS = r"C:\Windows\Fonts\segoeui.ttf"
SANS_SB = r"C:\Windows\Fonts\seguisb.ttf"

def font(path, size):
    return ImageFont.truetype(path, size)

def wrap(draw, text, fnt, max_width):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textlength(candidate, font=fnt) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines

def draw_lines(draw, lines, fnt, x, y, fill, leading):
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += leading
    return y

def base_canvas():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, W, 4), fill=TEAL)
    return img, draw

def footer(draw):
    draw.line((72, 552, 1128, 552), fill=RULE, width=1)
    draw.text((72, 572), "Jacob Muniko, technology builder", font=font(SANS, 18), fill=SOFT)
    draw.text((520, 572), "Karatina, Kenya. EAT (UTC+3).", font=font(SANS, 18), fill=MUTED)
    url = "muniko53.github.io/jacob-muniko-portfolio"
    url_font = font(SANS, 17)
    draw.text((1128 - draw.textlength(url, font=url_font), 572), url, font=url_font, fill=MUTED)

def label(draw, text):
    draw.line((72, 62, 104, 62), fill=AMBER, width=2)
    draw.text((122, 48), text, font=font(SANS, 19), fill=AMBER)

def frame_image(img, path, box):
    x, y, w, h = box
    screen = Image.open(path).convert("RGB")
    screen = ImageOps.fit(screen, (w, h), Image.LANCZOS, centering=(0.5, 0.0))
    draw = ImageDraw.Draw(img)
    draw.rectangle((x - 1, y - 1, x + w + 1, y + h + 1), fill=RULE)
    img.paste(screen, (x, y))
    draw.rectangle((x, y, x + w, y + h), outline=(61, 81, 70), width=1)

def home_og():
    img, draw = base_canvas()
    label(draw, "Jacob Muniko, technology builder")
    title_font = font(SERIF, 76)
    title = "Software that has to work outside the demo."
    lines = wrap(draw, title, title_font, 520)
    y = draw_lines(draw, lines, title_font, 72, 132, INK, 82)

    sub_font = font(SANS, 21)
    sub = "Marketplaces, local AI tools, Windows utilities, and automation. Built around the constraint."
    sub_lines = wrap(draw, sub, sub_font, 520)
    draw_lines(draw, sub_lines, sub_font, 72, y + 26, SOFT, 30)

    # Current work list, echoing the homepage.
    x, y = 704, 132
    draw.line((x, y, 1128, y), fill=INK, width=2)
    draw.text((x, y + 18), "Current work", font=font(SANS_SB, 18), fill=INK)
    draw.text((1128 - draw.textlength("November 2026", font=font(SANS, 16)), y + 20), "November 2026", font=font(SANS, 16), fill=MUTED)
    rows = [
        ("Linklet", "Campus marketplace", "Live", TEAL),
        ("MICA", "Local-first AI assistant", "In development", (157, 182, 200)),
        ("FilePilot", "Windows file intelligence", "Beta", AMBER),
        ("NSE Intelligence Agent", "Automated market report", "Scheduled", AMBER),
    ]
    ry = y + 66
    for name, note, status, color in rows:
        draw.line((x, ry, 1128, ry), fill=RULE, width=1)
        draw.text((x, ry + 16), name, font=font(SERIF, 28), fill=INK)
        draw.text((x, ry + 50), note, font=font(SANS, 15), fill=MUTED)
        pill_w = draw.textlength(status, font=font(SANS, 14)) + 26
        pill_x = 1128 - pill_w
        draw.rounded_rectangle((pill_x, ry + 26, 1128, ry + 52), radius=13, outline=color, width=1)
        draw.ellipse((pill_x + 9, ry + 35, pill_x + 15, ry + 41), fill=color)
        draw.text((pill_x + 20, ry + 30), status, font=font(SANS, 14), fill=color)
        ry += 84

    footer(draw)
    img.save(OUT / "og-home.png", optimize=True)
    print("og-home.png", img.size)

def project_og(slug, kicker, title, subtitle, image=None, accent=TEAL, extra=None):
    img, draw = base_canvas()
    label(draw, kicker)
    title_font = font(SERIF, 68 if len(title) < 18 else 52)
    title_lines = wrap(draw, title, title_font, 500)
    y = draw_lines(draw, title_lines, title_font, 72, 126, INK, 72 if len(title) < 18 else 58)

    sub_font = font(SANS, 21)
    sub_lines = wrap(draw, subtitle, sub_font, 500)
    y = draw_lines(draw, sub_lines, sub_font, 72, y + 24, SOFT, 30)

    if image:
        frame_image(img, image, (680, 128, 448, 330))
        draw = ImageDraw.Draw(img)
        draw.text((680, 472), "Evidence from the build", font=font(SANS, 15), fill=MUTED)
    elif extra:
        # A simple local-first diagram for MICA.
        x, y0 = 680, 128
        draw.rectangle((x, y0, 1128, y0 + 334), outline=RULE, fill=SURFACE)
        draw.text((x + 24, y0 + 24), "Local machine", font=font(SANS_SB, 16), fill=MUTED)
        draw.rectangle((x + 24, y0 + 62, x + 424, y0 + 128), outline=(61, 81, 70), fill=(17, 27, 22))
        draw.text((x + 42, y0 + 78), "Browser console + native companion", font=font(SANS, 16), fill=INK)
        draw.text((x + 42, y0 + 101), "127.0.0.1, launcher token", font=font(SANS, 14), fill=MUTED)
        draw.line((x + 224, y0 + 128, x + 224, y0 + 168), fill=TEAL, width=2)
        draw.rectangle((x + 24, y0 + 168, x + 424, y0 + 234), outline=TEAL, fill=(18, 35, 28))
        draw.text((x + 42, y0 + 184), "Tool runner", font=font(SANS_SB, 16), fill=INK)
        draw.text((x + 42, y0 + 207), "approval gate before consequential actions", font=font(SANS, 14), fill=TEAL)
        draw.line((x + 224, y0 + 234, x + 224, y0 + 270), fill=AMBER, width=2)
        draw.text((x + 24, y0 + 282), "Optional providers leave the machine", font=font(SANS, 14), fill=MUTED)
        draw.text((x + 24, y0 + 304), "Gemini   Groq   OpenAI", font=font(SANS_SB, 15), fill=AMBER)
        draw.text((680, 472), "The local boundary is the product", font=font(SANS, 15), fill=MUTED)

    footer(draw)
    img.save(OUT / f"og-{slug}.png", optimize=True)
    print(f"og-{slug}.png", img.size)

home_og()
project_og(
    "linklet",
    "Case file / marketplace platform",
    "Linklet",
    "A campus marketplace built from zero, with verified accounts, real-time messaging, offers, and admin tools.",
    IMG / "linklet-home.webp",
)
project_og(
    "mica",
    "Case file / local AI assistant",
    "MICA",
    "A Windows assistant that can act, built around an approval gate, a local server, and optional providers.",
    IMG / "mica-chat.webp",
)
project_og(
    "filepilot",
    "Case file / Windows desktop utility",
    "FilePilot",
    "Make the disk legible. Make deletion safe. A local PySide6 tool with a plan-bound approval flow.",
    IMG / "filepilot-storage.webp",
    accent=AMBER,
)
project_og(
    "nse",
    "Case file / automation",
    "NSE Intelligence Agent",
    "A weekday market report that survives a broken source, with a deterministic path when no model is available.",
    IMG / "nse-report.webp",
    accent=AMBER,
)
