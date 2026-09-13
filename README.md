# MantraMitra — prototype

Understand what you chant. A client-facing proof of concept of the core interaction:
Sanskrit word → spoken audio → simple Hindi meaning, word by word, then the complete meaning.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static build in dist/ — deploy anywhere
npm test           # journey + content-model checks (node:test, no extra deps)
```

Keyboard: `Space` play/pause · `←` / `→` previous / next.

## Structure

```
public/audio/            drop-in audio (see public/audio/README.md)
src/data/                content — the only place mantra text and audio paths live
  gayatri.js             1 verse: 14 words, full-mantra audio, total meaning
  shivTandav.js          prototype preview: verses 1 and 2, 22 word-parts each
  index.js               catalogue + line grouping
src/audio/
  audioPlayer.js         framework-free player: one <audio> element, silent fallback, error handling
  useAudio.js            React binding (stops on unmount, pauses on pagehide)
src/player/
  sequence.js            one verse's journey as pure functions + PACING constants
  useMantraSession.js    playWord / pause / resume / next / previous / restart / replay / playFullMantra
src/components/          UI only — reads session state, calls session actions
```

Flow per verse: intro → word 1…n → full verse → सम्पूर्ण अर्थ. Multi-verse mantras continue to the
next verse automatically (`PACING.betweenVersesMs`). Gayatri → Shiv Tandav teaser → verse 1 → verse 2.

## Audio

Each word clip plays on a real `<audio>` element; the session advances on its `ended` event
(plus a short breathing hold, `PACING.holdAfterWordMs`). The word's hairline progress is driven
by `currentTime / duration`.

If a file is missing, fails, or is in an unsupported format, the player never throws: word, full and
meaning steps continue silently on a temporary clock (`PACING.fallback*`) with a quiet
"Audio arriving soon" note. Browser autoplay refusal shows "Tap listen to allow audio".

### AI voice (Indic Parler-TTS)

`scripts/generate_voice.py` generates every file with AI4Bharat's open Indic Parler-TTS model, which
speaks Sanskrit natively: speaker "Aryan" for Sanskrit, "Divya" for Hindi meanings. Runs locally on
the GPU (CUDA) or CPU. Full verses are generated line by line and each word's `fullMantraAt` is written
back into `src/data/` for synced highlighting. Replace with human recordings before public release.

One-time setup (the Python venv is already installed in `.venv`):
1. Log in at huggingface.co, open https://huggingface.co/ai4bharat/indic-parler-tts and accept the terms.
2. Create a Read token at https://huggingface.co/settings/tokens, then run `.venv/Scripts/hf auth login`.

Generate (node + ffmpeg on PATH):

```bash
.venv/Scripts/python scripts/generate_voice.py --force               # everything
.venv/Scripts/python scripts/generate_voice.py --force shiv-2-13     # redo one word
.venv/Scripts/python scripts/generate_voice.py --force shiv-v2       # redo one verse
```

A word sounds wrong? Redo it with a different take (`--force <word id> --take 1`, then 2, 3…), or add a
spelling hint to `PRONOUNCE` in the script.

To add real recordings: put files in `public/audio/...` with the names in `public/audio/README.md`, reload.
To use other formats or hosted URLs: change the path strings in `src/data/*.js`.
For word highlighting during full-mantra playback, fill in each word's `fullMantraAt` (seconds).

## Content status

All Hindi meanings are **draft** and need approval by a Sanskrit/Hindi reviewer before release.
