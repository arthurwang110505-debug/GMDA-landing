"""Compose the GMDA pixel-mascot character-development sheet. npm run pixel"""

from PIL import Image, ImageDraw, ImageFont
import sys

sys.path.insert(0, "scripts")
from pixel_mascots import (  # noqa: E402
    INDIGO, LIME, IVORY, PERI, SLATE, MORI, PIP, KODA, MILO,
    BUILDERS, ramp,
)

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_R = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

W, H = 1600, 1300
PANEL = (27, 27, 51)      # slightly lifted indigo
PANEL_LINE = (38, 38, 68)

CHARS = [
    ("mori", "MORI", "Research", MORI, "sprout · magnifier · discovery"),
    ("pip", "PIP", "Writing", PIP, "star points · pencil · sparks"),
    ("koda", "KODA", "Coding", KODA, "antennae · status light · laptop"),
    ("milo", "MILO", "Monitoring", MILO, "headphones · radar sweep"),
]


def font(size, bold=True):
    return ImageFont.truetype(FONT if bold else FONT_R, size)


def main():
    sprites = {n: fn().to_image() for n, fn in BUILDERS.items()}
    sheet = Image.new("RGBA", (W, H), (*INDIGO, 255))
    d = ImageDraw.Draw(sheet)

    # subtle pixel grid
    for y in range(0, H, 32):
        for x in range(0, W, 32):
            d.point((x, y), fill=(34, 34, 62, 255))

    # ---- header ----
    d.text((56, 42), "GMDA", font=font(40), fill=(*LIME, 255))
    d.text((222, 48), "PIXEL MASCOT SYSTEM", font=font(34), fill=(*IVORY, 255))
    d.text((56, 100), "official character-development sheet  ·  hand-placed pixels  ·  64×64 base grid  ·  #14142B selective outline",
           font=font(16, bold=False), fill=(*SLATE, 255))

    # ---- team lineup ----
    d.text((56, 152), "TEAM", font=font(20), fill=(*SLATE, 255))
    d.line([(56, 182), (W - 56, 182)], fill=(*PANEL_LINE, 255), width=1)
    lineup_y = {"mori": 208, "pip": 196, "koda": 210, "milo": 202}
    lineup_x = {"mori": 220, "pip": 560, "koda": 900, "milo": 1240}
    for key, name, role, color, _ in CHARS:
        sp = sprites[key].resize((128, 128), Image.NEAREST)
        x, y = lineup_x[key], lineup_y[key]
        # dithered ground shadow (2-row ellipse)
        for gy in (y + 130, y + 132):
            for gx in range(x + 8, x + 120, 2):
                t = abs(gx - (x + 64)) / 64
                if t < 0.86:
                    d.point((gx, gy), fill=(11, 11, 24, 255))
                    d.point((gx + 1, gy), fill=(11, 11, 24, 255))
        sheet.alpha_composite(sp, (x, y))
        d.text((x + 4, y + 156), name, font=font(24), fill=(*IVORY, 255))
        d.text((x + 4, y + 188), role.upper(), font=font(13, bold=False), fill=(*SLATE, 255))

    # ---- individual character panels ----
    d.text((56, 452), "CHARACTER SHEET", font=font(20), fill=(*SLATE, 255))
    d.line([(56, 482), (W - 56, 482)], fill=(*PANEL_LINE, 255), width=1)
    for i, (key, name, role, color, detail) in enumerate(CHARS):
        px = 56 + i * 380
        py = 512
        d.rounded_rectangle([px, py, px + 350, py + 380], radius=10, fill=(*PANEL, 255), outline=(*PANEL_LINE, 255))
        sp = sprites[key].resize((192, 192), Image.NEAREST)
        sheet.alpha_composite(sp, (px + 79, py + 30))
        d.text((px + 24, py + 252), name, font=font(26), fill=(*IVORY, 255))
        d.text((px + 24, py + 288), role.upper(), font=font(14, bold=False), fill=(*LIME, 255))
        d.text((px + 24, py + 316), detail, font=font(13, bold=False), fill=(*SLATE, 255))
        # body ramp chips
        r = ramp(color)
        for j, k in enumerate(("shade2", "shade1", "base", "light1", "light2")):
            cx = px + 24 + j * 34
            d.rectangle([cx, py + 344, cx + 26, py + 364], fill=(*r[k], 255))
        d.text((px + 210, py + 346), "stepped ramp", font=font(12, bold=False), fill=(*SLATE, 255))

    # ---- scale tests ----
    d.text((56, 930), "SCALE RECOGNITION", font=font(20), fill=(*SLATE, 255))
    d.line([(56, 960), (W - 56, 960)], fill=(*PANEL_LINE, 255), width=1)
    rows = [(32, 1.0, "32 × 32  (recognition floor)"), (64, 1.0, "64 × 64  (base grid)"), (128, 2.0, "128 × 128  (2x detail)")]
    ry = 988
    for size, scale, label in rows:
        d.text((56, ry + size // 2 - 8), label, font=font(13, bold=False), fill=(*SLATE, 255))
        for i, (key, *_rest) in enumerate(CHARS):
            sp = sprites[key]
            if size == 32:
                sp = sp.resize((32, 32), Image.NEAREST)
            elif size == 64:
                pass
            else:
                sp = sp.resize((128, 128), Image.NEAREST)
            sheet.alpha_composite(sp, (420 + i * 200, ry))
        ry += size + 18

    # ---- footer palette strip ----
    d.text((56, H - 44), "brand", font=font(12, bold=False), fill=(*SLATE, 255))
    for j, c in enumerate((INDIGO, PERI, SLATE, IVORY, LIME, MORI, PIP, KODA, MILO)):
        d.rectangle([120 + j * 34, H - 46, 146 + j * 34, H - 26], fill=(*c, 255))
    d.text((W - 420, H - 44), "GMDA · pixel mascot system · v1", font=font(13, bold=False), fill=(*SLATE, 255))

    sheet.save("public/pixel/gmda-pixel-sheet.png")
    print("sheet saved:", sheet.size)


if __name__ == "__main__":
    main()
