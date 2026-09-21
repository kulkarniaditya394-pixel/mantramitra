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

### Recording a real voice

TTS reads a mantra like prose — it cannot chant. For flagship mantras, record a human:
`npm run dev`, open **/#/studio**, and work down the list with the space bar. Each take is written
straight to the file the app expects. See [RECORDING.md](RECORDING.md). The studio is dev-only and
is not part of a production build.

## Content status

Every verse carries a `source` block — scripture reference, ṛṣi, devatā, metre — and the app shows
it under the meaning, so it is always clear *which* reading is on screen. This matters because
traditions differ: Gayatri's `savitṛ` is the solar deity in the Vedic/Sāyaṇa reading, while Ārya
Samāj and Advaita readings render it as Īśvara/Brahman. Record the chosen tradition per mantra
rather than treating one rendering as "the" meaning.

Gayatri follows the mainstream Vedic reading (Ṛgveda 3.62.10, devatā Savitṛ), cross-checked against
Sāyaṇa via Wilson (1866), Griffith (1896) and Monier-Williams.

All Hindi meanings remain **draft** until approved by the client's Sanskrit/Hindi reviewer.
