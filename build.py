"""Bundle Paso into one self-contained page (dist/paso.html) for online hosting.
Run: py build.py"""
from pathlib import Path

root = Path(__file__).parent
read = lambda p: (root / p).read_text(encoding="utf-8")

page = f"""<meta charset="utf-8">
<title>Paso</title>
<meta name="theme-color" content="#ff7a45">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet">
<style>
{read("styles.css")}
</style>
<div id="app"></div>
<div id="toast"></div>
<script>
{read("js/course.js")}
</script>
<script>
{read("js/stories.js") if (root / "js/stories.js").exists() else ""}
</script>
<script>
{read("js/app.js")}
</script>
"""
out = root / "dist" / "paso.html"
out.parent.mkdir(exist_ok=True)
out.write_text(page, encoding="utf-8")
print(f"wrote {out} ({len(page) // 1024} KB)")
