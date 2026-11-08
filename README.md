# Paso

A small Spanish course for Lithuanian speakers: lesson path, exercises, XP, streaks, spaced-repetition review and Legendary levels.

Plain HTML/JS, no build step. Progress is stored in the browser on each device.

- Course content: `js/course.js` (add `[spanish, lithuanian]` pairs; exercises are generated from them)
- Voice: `py gen_audio.py` makes natural Spanish clips (edge-tts, voice es-ES-ElviraNeural) into `audio/<unit>.json`; run it after adding content. Missing clips fall back to the phone's built-in voice.
- Publish: `py build.py` bundles `dist/paso.html`; publish it together with the `audio/` files.
- Run locally: `start.bat` (needs Python), then open http://localhost:8000
