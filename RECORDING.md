# Recording a real voice

The fastest way to make the app stop sounding synthetic. One reciter, one sitting, no audio editing.

## Why this matters

Sanskrit recitation carries *svara* (pitch accent) and a metrical cadence. Every text-to-speech
model — including the Sanskrit-capable one this project uses — is trained on conversational speech
and reads a mantra like prose. That is the "AI sounding" quality, and no amount of tuning removes it.
AI voice stays useful for drafting and for the long tail; flagship mantras should be human.

## What you need

- A quiet room (soft furnishings, no fan/AC, phone on silent)
- A decent mic: a USB mic, earphones with a mic, or a phone held a hand's width away and slightly
  off to the side (so breath doesn't hit it)
- Chrome or Edge, and this project running: `npm run dev`

## The session

1. Open **http://localhost:5173/#/studio**
2. Allow microphone access.
3. The screen shows one thing to say at a time. The whole interface is the space bar:
   **space** to record → **space** to stop → hear it back → **space** to keep and move on.
   "Redo" if it wasn't clean. The bar under the buttons shows your mic level — if it doesn't move,
   the mic isn't working.
4. Work down the list. For each verse it asks for:
   - **every word on its own** (this is the traditional *pada-pāṭha*, word-by-word recitation)
   - **the full verse**, recited at normal chanting pace
   - **the meaning in Hindi**, read in a calm explaining voice — not chanted

Each take is saved straight into the app as the file it expects. Reload the experience to hear it.

## Guidance for the reciter

- Keep one steady pace and one distance from the mic for the whole session — consistency matters
  more than perfection on any single word.
- Pause for a beat before and after each word; the silence gets trimmed automatically.
- For single words, say the word plainly — no trailing rise in pitch, as if reading a list.
- If you cough or stumble, just press Redo. Nothing is lost.
- A full verse takes about 20 minutes including word-by-word.

## After recording

The word-by-word highlighting during the full recitation needs to know when each word is spoken.
Either re-run the generator's timing step, or POST tapped timings to `/__studio/timings` as
`{ "<word id>": seconds }`. Until timings are updated, playback still works — the whole verse simply
stays lit instead of lighting word by word.

## Consent

If you record someone else, get written permission covering use of their voice in the app, and keep
it on file. If a voice is ever cloned to generate more mantras, that permission must say so
explicitly. Do not clone a recitation taken from the internet.
