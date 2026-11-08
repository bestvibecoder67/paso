"""Draw the Paso app icon (two footprints on orange) as PNGs for phones. Run: py make_icons.py"""
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).parent

def draw(size, rounded=True):
    s = 4  # supersample for smooth edges
    W = 512 * s
    img = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if rounded:
        d.rounded_rectangle([0, 0, W - 1, W - 1], radius=112 * s, fill="#ff7a45")
    else:
        d.rectangle([0, 0, W, W], fill="#ff7a45")

    def foot(cx, cy, rx, ry, angle, color, toes):
        layer = Image.new("RGBA", (W, W), (0, 0, 0, 0))
        ImageDraw.Draw(layer).ellipse([(cx - rx) * s, (cy - ry) * s, (cx + rx) * s, (cy + ry) * s], fill=color)
        layer = layer.rotate(-angle, center=(cx * s, cy * s), resample=Image.BICUBIC)
        img.alpha_composite(layer)
        for tx, ty, r in toes:
            d.ellipse([(tx - r) * s, (ty - r) * s, (tx + r) * s, (ty + r) * s], fill=color)

    foot(206, 300, 62, 96, -12, "#ffffff", [(186, 176, 18), (226, 168, 14)])
    foot(318, 200, 54, 84, 12, "#ffe0cf", [(330, 92, 15), (364, 102, 12)])
    return img.resize((size, size), Image.LANCZOS)

draw(180, rounded=False).convert("RGB").save(root / "icon-180.png")  # iPhone rounds it itself
draw(192).save(root / "icon-192.png")
draw(512).save(root / "icon-512.png")
print("icons written")
