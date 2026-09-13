import { gayatri } from './gayatri.js'
import { shivTandav } from './shivTandav.js'

// Local static catalogue. A backend later only needs to return objects of this same shape.
export const mantras = { [gayatri.id]: gayatri, [shivTandav.id]: shivTandav }

/** Groups words into the lines of the complete mantra: [[{ word, i }, ...], ...] */
export function groupLines(words) {
  const lines = []
  words.forEach((word, i) => (lines[word.line] ??= []).push({ word, i }))
  return lines
}
