/**
 * One verse's journey as pure data: intro → word 0…n-1 → full verse → total meaning.
 * Multi-verse mantras simply run this once per verse.
 * A step is { phase, index }.
 */

// Timing in ms. Holds are breathing room *after* real audio ends — never a replacement for it.
// fallback* values only apply while a recording is missing.
export const PACING = {
  introMs: 2800,
  holdAfterWordMs: 2200, // word clips are ~0.7s; this leaves time to read the meaning
  holdAfterFullMs: 1200,
  betweenVersesMs: 3000, // after a verse's meaning ends, before the next verse begins
  fallbackWordMs: 2600,
  fallbackFullMs: 9000,
  fallbackMeaningMs: 10000,
}

export function nextStep({ phase, index }, wordCount) {
  if (phase === 'intro') return { phase: 'word', index: 0 }
  if (phase === 'word') return index < wordCount - 1 ? { phase: 'word', index: index + 1 } : { phase: 'full', index: 0 }
  if (phase === 'full') return { phase: 'meaning', index: 0 }
  return null
}

export function prevStep({ phase, index }, wordCount) {
  if (phase === 'word' && index > 0) return { phase: 'word', index: index - 1 }
  if (phase === 'full') return { phase: 'word', index: wordCount - 1 }
  if (phase === 'meaning') return { phase: 'full', index: 0 }
  return { phase: 'intro', index: 0 }
}

/** What to play for a step of one verse. `silent` steps are pauses by design, not missing audio. */
export function clipFor(verse, { phase, index }) {
  switch (phase) {
    case 'word':
      return { src: verse.words[index].audio, fallbackMs: PACING.fallbackWordMs, holdMs: PACING.holdAfterWordMs }
    case 'full':
      return { src: verse.fullMantraAudio, fallbackMs: PACING.fallbackFullMs, holdMs: PACING.holdAfterFullMs }
    case 'meaning':
      return { src: verse.totalMeaningAudio, fallbackMs: PACING.fallbackMeaningMs, holdMs: 0 }
    default:
      return { src: null, fallbackMs: PACING.introMs, holdMs: 0, silent: true }
  }
}

/** Index of the word being recited at `time` inside the full-mantra audio, or -1 without timings. */
export function wordAtTime(words, time) {
  let found = -1
  words.forEach((w, i) => {
    if (w.fullMantraAt != null && w.fullMantraAt <= time) found = i
  })
  return found
}
