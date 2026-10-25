"""
GMDA pixel-mascot system — hand-crafted sprite builder.

Every pixel is placed intentionally on a 64x64 grid per character.
Silhouette → stepped ramps (5 body shades) → selective #14142B outline →
face + props. Re-run: npm run pixel

Outputs (public/pixel/):
  {mori,pip,koda,milo}.png        64x64 transparent sprites
  {name}-32.png                   32x32 recognition test
  gmda-pixel-sheet.png            character-development sheet
"""

from PIL import Image, ImageDraw, ImageFont

SIZE = 64

# ---- palette (exact brief colors) -----------------------------------------
INDIGO = (20, 20, 43)          # #14142B outline / bg
LIME = (200, 242, 60)          # #C8F23C status accents
IVORY = (245, 243, 236)        # #F5F3EC highlights / catchlights
PERI = (42, 42, 85)            # #2A2A55 deep periwinkle
SLATE = (168, 165, 188)        # #A8A5BC soft slate

MORI = (245, 240, 230)         # #F5F0E6
PIP = (255, 213, 107)          # #FFD56B
KODA = (139, 197, 255)         # #8BC5FF
MILO = (198, 167, 255)         # #C6A7FF

BLUSH = (232, 150, 160)
BLUSH_D = (200, 112, 128)
GREEN = (150, 200, 130)
GREEN_D = (96, 150, 92)
BROWN = (138, 106, 74)
BROWN_D = (96, 72, 50)
LENS = (216, 224, 236)
PERI_L = (78, 78, 130)


def mix(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def ramp(base):
    """5 body shades: 2 dark steps into indigo, base, 2 light steps into ivory."""
    return {
        "shade2": mix(base, INDIGO, 0.42),
        "shade1": mix(base, INDIGO, 0.22),
        "base": base,
        "light1": mix(base, IVORY, 0.26),
        "light2": mix(base, IVORY, 0.52),
    }


class Sprite:
    def __init__(self, size=SIZE):
        self.n = size
        self.px = [[None] * size for _ in range(size)]

    def set(self, x, y, c):
        if 0 <= x < self.n and 0 <= y < self.n:
            self.px[y][x] = c

    def get(self, x, y):
        return self.px[y][x] if 0 <= x < self.n and 0 <= y < self.n else None

    def ellipse(self, cx, cy, rx, ry, c):
        for y in range(int(cy - ry - 1), int(cy + ry + 2)):
            for x in range(int(cx - rx - 1), int(cx + rx + 2)):
                if ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1.0:
                    self.set(x, y, c)

    def rect(self, x0, y0, x1, y1, c):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.set(x, y, c)

    def polygon(self, pts, c):
        xs = [p[0] for p in pts]
        ys = [p[1] for p in pts]
        n = len(pts)
        for y in range(min(ys), max(ys) + 1):
            for x in range(min(xs), max(xs) + 1):
                inside = False
                j = n - 1
                for i in range(n):
                    xi, yi = pts[i]
                    xj, yj = pts[j]
                    if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi + 1e-9) + xi:
                        inside = not inside
                    j = i
                if inside:
                    self.set(x, y, c)

    def rrect(self, x0, y0, x1, y1, r, c):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                dx = max(x0 + r - x, 0, x - (x1 - r))
                dy = max(y0 + r - y, 0, y - (y1 - r))
                if dx * dx + dy * dy <= r * r:
                    self.set(x, y, c)

    def line(self, x0, y0, x1, y1, c, w=1):
        steps = max(abs(x1 - x0), abs(y1 - y0), 1)
        for i in range(steps + 1):
            x = round(x0 + (x1 - x0) * i / steps)
            y = round(y0 + (y1 - y0) * i / steps)
            for oy in range(w):
                for ox in range(w):
                    self.set(x + ox, y + oy, c)

    def paint_over(self, other, only_on=None):
        for y in range(self.n):
            for x in range(self.n):
                c = other.px[y][x]
                if c is not None and (only_on is None or self.px[y][x] in only_on):
                    self.px[y][x] = c

    def silhouette(self):
        s = set()
        for y in range(self.n):
            for x in range(self.n):
                if self.px[y][x] is not None:
                    s.add((x, y))
        return s

    def outline(self, color=INDIGO, break_ratio=0.24):
        """1px outline with selective breaks on the bottom-right shadow side."""
        body = self.silhouette()
        cand = set()
        for (x, y) in body:
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                if (x + dx, y + dy) not in body:
                    cand.add((x + dx, y + dy))
        for (x, y) in cand:
            if x + y > self.n * 1.05 and ((x * 7 + y * 13) % 100) < break_ratio * 100:
                continue  # selective break in the shadow
            self.set(x, y, color)

    def to_image(self, bg=None):
        im = Image.new("RGBA", (self.n, self.n), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        for y in range(self.n):
            for x in range(self.n):
                c = self.px[y][x]
                if c is not None:
                    d.point((x, y), fill=(*c, 255))
        return im


def shade_body(sp, shapes, r):
    """Stepped shading restricted to the given body shapes only."""
    region = Sprite(sp.n)
    for shape in shapes:
        shape(region, True)
    region_set = region.silhouette()
    shadow = Sprite(sp.n)
    for shape in shapes:
        shape(shadow, True)
    for shift, col in ((3, r["shade1"]), (6, r["shade2"])):
        layer = Sprite(sp.n)
        for y in range(sp.n):
            for x in range(sp.n):
                if shadow.px[y][x] is not None:
                    layer.set(x + shift, y + shift, col)
        for y in range(sp.n):
            for x in range(sp.n):
                if layer.px[y][x] is not None and (x, y) in region_set:
                    sp.set(x, y, layer.px[y][x])
    for shift, col in ((2, r["light1"]),):
        layer = Sprite(sp.n)
        for y in range(sp.n):
            for x in range(sp.n):
                if shadow.px[y][x] is not None:
                    layer.set(x - shift, y - shift, col)
        for y in range(sp.n):
            for x in range(sp.n):
                if layer.px[y][x] is not None and (x, y) in region_set:
                    sp.set(x, y, layer.px[y][x])
    # subtle internal clusters on the shadow side only
    for (x, y) in ((40, 46), (36, 50)):
        if (x, y) in region_set:
            sp.set(x, y, r["shade1"])


def draw_eye(sp, x, y, w, h, r_look=(0, 0), lid=False):
    """Shared eye language: dark block, ivory catchlights, optional half-lid."""
    for j in range(h):
        for i in range(w):
            sp.set(x + i, y + j, INDIGO)
    if lid:
        for i in range(w):
            sp.set(x + i, y, None)
            sp.set(x + i, y - 1, None)
        # thin lid line of body-ish dark handled by caller shading
    cx, cy = r_look
    sp.set(x + w - 2 + cx, y + 1 + cy, IVORY)          # big catchlight
    sp.set(x + w - 3 + cx, y + 2 + cy, IVORY)
    sp.set(x + 1 + cx, y + h - 2 + cy, mix(IVORY, INDIGO, 0.45))  # small glint


def draw_blush(sp, x, y):
    sp.set(x, y, BLUSH)
    sp.set(x + 1, y, BLUSH)
    sp.set(x, y + 1, BLUSH_D)
    sp.set(x + 1, y + 1, BLUSH)


# ---------------------------------------------------------------------------
# MORI — research. Pear body, spiral sprout, magnifier over one eye (the
# magnified eye inside the lens = the "discovery" detail).
# ---------------------------------------------------------------------------
def build_mori():
    sp = Sprite()
    r = ramp(MORI)

    def body(s, c):
        s.ellipse(32, 38, 17, 18, c)
        s.ellipse(32, 28, 14.5, 13, c)
        s.ellipse(24, 51, 7, 5, c)
    t = Sprite(); body(t, r["base"]); sp.paint_over(t)
    shade_body(sp, (body,), r)

    # sprout (drawn after shading so its green stays clean)
    sp.line(31, 16, 34, 8, GREEN_D, 2)
    sp.ellipse(36, 6, 3, 3, GREEN)
    sp.set(35, 5, mix(GREEN, IVORY, 0.5))
    sp.set(34, 3, mix(GREEN, IVORY, 0.25))
    sp.set(37, 7, GREEN_D)

    # magnifier: ring + pale lens + handle + tiny hand
    for y in range(20, 43):
        for x in range(6, 30):
            d2 = ((x + 0.5 - 18) ** 2 + (y + 0.5 - 31) ** 2) ** 0.5
            if 4.8 <= d2 <= 6.4:
                sp.set(x, y, BROWN)
                if d2 <= 5.3:
                    sp.set(x, y, mix(BROWN, IVORY, 0.35))
            elif d2 < 4.8:
                sp.set(x, y, LENS)
    sp.line(13, 38, 8, 46, BROWN, 2)
    sp.line(8, 45, 7, 48, BROWN_D, 2)
    sp.ellipse(21, 47, 3.5, 3, r["base"])
    sp.set(19, 46, r["light1"])
    # magnified eye inside the lens
    for x, y in ((17, 29), (18, 29), (19, 29), (16, 30), (17, 30), (18, 30), (19, 30),
                 (20, 30), (16, 31), (17, 31), (18, 31), (19, 31), (20, 31), (17, 32), (18, 32), (19, 32)):
        sp.set(x, y, INDIGO)
    sp.set(17, 29, IVORY)
    sp.set(16, 30, IVORY)

    # rim highlights
    sp.set(22, 19, r["light2"]); sp.set(20, 21, r["light2"]); sp.set(17, 25, r["light1"])

    # face
    draw_eye(sp, 36, 28, 3, 4)
    sp.set(34, 26, mix(MORI, INDIGO, 0.5))
    sp.set(35, 25, mix(MORI, INDIGO, 0.5))
    sp.set(36, 25, mix(MORI, INDIGO, 0.5))
    sp.set(38, 35, mix(MORI, INDIGO, 0.65))
    sp.set(39, 35, mix(MORI, INDIGO, 0.65))
    sp.set(38, 36, mix(MORI, INDIGO, 0.65))
    sp.set(39, 36, mix(MORI, INDIGO, 0.65))
    draw_blush(sp, 42, 33)

    # feet
    sp.ellipse(25, 57, 5, 3, r["base"])
    sp.ellipse(40, 57, 5, 3, r["base"])
    sp.set(23, 58, r["shade1"]); sp.set(24, 58, r["shade1"])
    sp.set(38, 58, r["shade1"]); sp.set(39, 58, r["shade1"])
    sp.outline()
    return sp


# ---------------------------------------------------------------------------
# PIP — writing. Irregular star, folded seams, sparks + pencil, biggest eyes.
# ---------------------------------------------------------------------------
def build_pip():
    sp = Sprite()
    r = ramp(PIP)

    def body(s, c):
        s.ellipse(32, 38, 15.5, 14, c)
        s.polygon([(34, 4), (25, 21), (41, 20)], c)          # top point (leans right)
        s.polygon([(7, 31), (21, 25), (22, 42)], c)          # left arm point
        s.polygon([(57, 34), (43, 27), (42, 43)], c)         # right arm point
        s.ellipse(17, 34, 6, 7, c)
        s.ellipse(47, 35, 6, 7, c)
        s.ellipse(24, 50, 7, 6, c)
        s.ellipse(41, 51, 7, 6, c)
    t = Sprite(); body(t, r["base"]); sp.paint_over(t)
    shade_body(sp, (body,), r)

    # fold seams near the top point
    sp.set(31, 14, r["shade1"]); sp.set(32, 15, r["shade1"]); sp.set(33, 16, r["shade1"])
    sp.set(35, 13, r["shade1"]); sp.set(36, 14, r["shade1"])
    sp.set(30, 6, r["light2"]); sp.set(28, 11, r["light2"]); sp.set(23, 18, r["light1"])
    sp.set(11, 28, r["light2"]); sp.set(9, 31, r["light2"])

    # face — big sparkly eyes, wide smile
    draw_eye(sp, 25, 29, 4, 5, r_look=(0, -1))
    draw_eye(sp, 37, 29, 4, 5, r_look=(0, -1))
    sp.set(29, 36, mix(PIP, INDIGO, 0.7)); sp.set(30, 37, mix(PIP, INDIGO, 0.7))
    sp.set(31, 37, mix(PIP, INDIGO, 0.7)); sp.set(32, 37, mix(PIP, INDIGO, 0.7))
    sp.set(33, 37, mix(PIP, INDIGO, 0.7)); sp.set(34, 36, mix(PIP, INDIGO, 0.7))
    draw_blush(sp, 21, 35)
    draw_blush(sp, 42, 35)

    # creativity: idea sparks + tiny pencil at the right hand
    sp.set(11, 18, IVORY); sp.set(12, 16, IVORY); sp.set(10, 15, IVORY)
    sp.set(53, 15, IVORY); sp.set(54, 13, IVORY)
    sp.line(50, 44, 55, 39, IVORY, 1)
    sp.set(55, 38, mix(PIP, INDIGO, 0.55)); sp.set(56, 38, mix(PIP, INDIGO, 0.55))

    # feet
    sp.ellipse(24, 56, 5, 3, r["base"])
    sp.ellipse(41, 57, 5, 3, r["base"])
    sp.outline()
    return sp


# ---------------------------------------------------------------------------
# KODA — coding. Soft square, twin antennae (lime status), laptop, calm eyes.
# ---------------------------------------------------------------------------
def build_koda():
    sp = Sprite()
    r = ramp(KODA)

    def body(s, c):
        s.rrect(15, 16, 49, 54, 8, c)
        s.ellipse(32, 36, 17, 16, c)
        s.ellipse(22, 52, 7, 5, c)
    t = Sprite(); body(t, r["base"]); sp.paint_over(t)
    shade_body(sp, (body,), r)

    # antennae
    sp.line(26, 17, 22, 8, PERI, 2)
    sp.line(38, 17, 43, 7, PERI, 2)
    sp.ellipse(21, 6, 2.5, 2.5, GREEN)
    sp.set(20, 5, mix(GREEN, IVORY, 0.5))
    sp.ellipse(44, 5, 2.5, 2.5, PERI_L)
    sp.set(43, 4, mix(PERI_L, IVORY, 0.5))
    sp.set(45, 5, LIME)                     # status indicator
    sp.set(45, 4, mix(LIME, IVORY, 0.55))

    # laptop at the feet
    sp.rrect(20, 45, 45, 56, 3, PERI)
    sp.rect(22, 46, 43, 52, PERI_L)
    sp.rect(24, 47, 41, 51, mix(PERI_L, SLATE, 0.4))
    sp.set(23, 46, mix(PERI, IVORY, 0.4))
    sp.set(27, 54, LIME)                    # laptop status dot

    # rim
    sp.set(19, 20, r["light2"]); sp.set(17, 24, r["light2"]); sp.set(22, 17, r["light1"])

    # face — calm half-lidded eyes
    draw_eye(sp, 25, 28, 3, 4)
    draw_eye(sp, 37, 28, 3, 4)
    for x in (24, 25, 26, 27):
        sp.set(x, 27, mix(KODA, INDIGO, 0.6))
    for x in (36, 37, 38, 39):
        sp.set(x, 27, mix(KODA, INDIGO, 0.6))
    sp.set(30, 35, mix(KODA, INDIGO, 0.7))
    sp.set(31, 36, mix(KODA, INDIGO, 0.7))
    sp.set(32, 36, mix(KODA, INDIGO, 0.7))
    sp.set(33, 35, mix(KODA, INDIGO, 0.7))
    draw_blush(sp, 20, 33)
    draw_blush(sp, 41, 33)
    sp.outline()
    return sp


# ---------------------------------------------------------------------------
# MILO — monitoring. Tall egg, headphones, radar dish sweeping, attentive eyes.
# ---------------------------------------------------------------------------
def build_milo():
    sp = Sprite()
    r = ramp(MILO)

    def body(s, c):
        s.ellipse(32, 34, 15, 20, c)
        s.ellipse(32, 26, 13.5, 13, c)
        s.ellipse(38, 48, 9, 8, c)
    t = Sprite(); body(t, r["base"]); sp.paint_over(t)
    shade_body(sp, (body,), r)

    # headphones: proper arc band + cups
    import math
    for i in range(25):
        a = math.pi * i / 24
        x = 32 - 17 * math.cos(a)
        y = 21 - 9 * math.sin(a)
        sp.set(int(x), int(y), PERI)
        sp.set(int(x), int(y) + 1, PERI)
    sp.line(15, 21, 15, 29, PERI, 2)
    sp.line(49, 21, 49, 29, PERI, 2)
    sp.rrect(10, 27, 18, 38, 3, PERI)
    sp.rrect(46, 27, 54, 38, 3, PERI)
    sp.rrect(12, 29, 16, 36, 2, PERI_L)
    sp.rrect(48, 29, 52, 36, 2, PERI_L)
    sp.set(13, 30, mix(PERI_L, IVORY, 0.5))
    sp.set(49, 30, mix(PERI_L, IVORY, 0.5))

    # radar dish
    sp.line(23, 14, 19, 8, PERI_L, 2)
    sp.ellipse(17, 6, 4, 2.5, SLATE)
    sp.set(15, 5, mix(SLATE, IVORY, 0.6))
    sp.set(16, 4, IVORY)

    # rim
    sp.set(23, 17, r["light2"]); sp.set(20, 21, r["light2"]); sp.set(18, 27, r["light1"])

    # face — attentive glance up-right
    draw_eye(sp, 26, 30, 3, 4, r_look=(1, -1))
    draw_eye(sp, 37, 30, 3, 4, r_look=(1, -1))
    sp.set(31, 37, mix(MILO, INDIGO, 0.7))
    sp.set(32, 38, mix(MILO, INDIGO, 0.7))
    sp.set(33, 37, mix(MILO, INDIGO, 0.7))
    draw_blush(sp, 22, 35)
    draw_blush(sp, 42, 35)

    # feet
    sp.ellipse(26, 56, 5, 3, r["base"])
    sp.ellipse(39, 56, 5, 3, r["base"])
    sp.outline()
    return sp


BUILDERS = {"mori": build_mori, "pip": build_pip, "koda": build_koda, "milo": build_milo}


def save_sprites(out="public/pixel"):
    import os
    os.makedirs(out, exist_ok=True)
    imgs = {}
    for name, fn in BUILDERS.items():
        sp = fn()
        im = sp.to_image()
        im.save(f"{out}/{name}.png")
        im.resize((32, 32), Image.NEAREST).save(f"{out}/{name}-32.png")
        imgs[name] = im
        print(f"{name}: {sum(1 for row in sp.px for c in row if c)} px")
    return imgs


if __name__ == "__main__":
    save_sprites()
    print("sprites done")
