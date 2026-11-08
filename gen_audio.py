"""Generate natural Spanish audio for every phrase and word tile in js/course.js.
Writes one pack per unit: audio/<unit>.json  { "lowercased text": "<base64 mp3>" }.
Only new phrases are generated; existing ones are reused. Run: py gen_audio.py
Uses edge-tts (free Microsoft neural voices, no account needed)."""
import asyncio, base64, json, re
from pathlib import Path
import edge_tts

VOICE = "es-ES-ElviraNeural"
root = Path(__file__).parent
src = (root / "js" / "course.js").read_text(encoding="utf-8")
out_dir = root / "audio"
out_dir.mkdir(exist_ok=True)

PUNCT = re.compile(r'[¿¡.,!?;:"«»„“”]')
STR = r"'((?:[^'\\]|\\.)*)'"
PAIR = re.compile(r"\[\s*" + STR + r"\s*,\s*" + STR)

def key(t):
    return t.strip().lower()

# split the file into units
starts = [(m.start(), m.group(1)) for m in re.finditer(r"id: '(u\d+)', title", src)]
units = {}
for i, (pos, uid) in enumerate(starts):
    chunk = src[pos: starts[i + 1][0] if i + 1 < len(starts) else len(src)]
    texts = set()
    for es, _lt in PAIR.findall(chunk):
        es = es.replace("\\'", "'")
        texts.add(es)
        for w in PUNCT.sub("", es).split():
            texts.add(w)
    units[uid] = texts

sem = asyncio.Semaphore(6)

async def tts(text, voice=VOICE):
    async with sem:
        for attempt in range(4):
            try:
                buf = bytearray()
                async for chunk in edge_tts.Communicate(text, voice).stream():
                    if chunk["type"] == "audio":
                        buf.extend(chunk["data"])
                if buf:
                    return base64.b64encode(bytes(buf)).decode()
            except Exception as e:  # network hiccup: retry
                err = e
            await asyncio.sleep(1 + attempt)
        print("FAILED:", text)
        return None

async def main():
    total_new = 0
    for uid, texts in units.items():
        path = out_dir / f"{uid}.json"
        pack = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
        wanted = {key(t): t for t in texts}
        todo = [k for k in wanted if k not in pack]
        results = await asyncio.gather(*(tts(wanted[k]) for k in todo))
        for k, b in zip(todo, results):
            if b:
                pack[k] = b
        pack = {k: v for k, v in pack.items() if k in wanted}
        path.write_text(json.dumps(pack, ensure_ascii=False), encoding="utf-8")
        total_new += len(todo)
        print(f"{uid}: {len(pack)} clips ({len(todo)} new), {path.stat().st_size // 1024} KB")
    print("done, new clips:", total_new)
    await stories()

# ---- stories: one voice per character, consistent across all stories ----
NARRATOR = "es-MX-DaliaNeural"
VOICES = {"f": ["es-ES-ElviraNeural", "es-ES-XimenaNeural"], "m": ["es-ES-AlvaroNeural", "es-MX-JorgeNeural"]}

async def stories():
    p = root / "js" / "stories.js"
    if not p.exists():
        return
    t = p.read_text(encoding="utf-8")
    data = json.loads(t[t.index("["): t.rindex("]") + 1])
    assigned, used = {}, {"f": 0, "m": 0}
    for st in data:
        for name, g in st.get("cast", {}).items():
            if name not in assigned:
                lst = VOICES.get(g, VOICES["f"])
                assigned[name] = lst[used[g] % len(lst)] if g in used else lst[0]
                used[g] = used.get(g, 0) + 1
    wanted = {}  # key -> (voice, text)
    for st in data:
        for i, ln in enumerate(st["lines"]):
            if "q" in ln:
                if ln.get("es"):
                    wanted[f"{st['id']}:{i}"] = (assigned.get(ln.get("who", ""), NARRATOR), ln["options"][ln["answer"]])
            else:
                wanted[f"{st['id']}:{i}"] = (assigned.get(ln.get("who", ""), NARRATOR), ln["es"])
        for es, _lt in st.get("pairs", []):
            wanted[key(es)] = (VOICE, es)
    path = out_dir / "stories.json"
    pack = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
    meta = pack.get("_meta", {})
    todo = [k for k, vt in wanted.items() if k not in pack or meta.get(k) != "|".join(vt)]
    results = await asyncio.gather(*(tts(wanted[k][1], wanted[k][0]) for k in todo))
    for k, b in zip(todo, results):
        if b:
            pack[k] = b
            meta[k] = "|".join(wanted[k])
    pack = {k: v for k, v in pack.items() if k in wanted}
    pack["_meta"] = {k: v for k, v in meta.items() if k in wanted}
    path.write_text(json.dumps(pack, ensure_ascii=False), encoding="utf-8")
    print(f"stories: {len(pack) - 1} clips ({len(todo)} new), voices: {assigned}, {path.stat().st_size // 1024} KB")

asyncio.run(main())
