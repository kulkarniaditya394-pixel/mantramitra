# Audio drop-in folder

Place recordings here with exactly these names. The app picks them up on reload — no code changes.
Any file that is missing keeps the experience running silently with an "Audio arriving soon" note.

```
gayatri/
  word-01.mp3 … word-14.mp3   one clip per word, in order (ॐ … प्रचोदयात्)
  full-mantra.mp3             complete recitation
  total-meaning.mp3           सम्पूर्ण अर्थ narration in Hindi

shiv-tandav/verse-1/          verse 1 (जटाटवीगलज्जल… शिवः शिवम्)
  word-01.mp3 … word-22.mp3   one clip per word part, in order
  full.mp3                    the verse recited continuously
  meaning.mp3                 its Hindi meaning narration

shiv-tandav/verse-2/          verse 2 (जटाकटाहसम्भ्रम… प्रतिक्षणं मम) — same 24 names
```

Files can be generated with `scripts/generate_voice.py` (see project README), or overwritten with real
recordings of the same name. The mapping lives in `src/data/gayatri.js` and `src/data/shivTandav.js`
(`audio`, `fullMantraAudio`, `totalMeaningAudio`). For .wav/.m4a or hosted URLs, change only those strings.
