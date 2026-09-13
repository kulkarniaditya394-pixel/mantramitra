import { test } from 'node:test'
import assert from 'node:assert/strict'
import { nextStep, prevStep, clipFor, wordAtTime } from './sequence.js'
import { mantras, groupLines } from '../data/index.js'

const verses = Object.values(mantras).flatMap((m) => m.verses)

test('walks intro → every word → full → meaning → end', () => {
  const words = mantras.gayatri.verses[0].words
  const seen = []
  for (let s = { phase: 'intro', index: 0 }; s; s = nextStep(s, words.length)) seen.push(`${s.phase}${s.phase === 'word' ? s.index : ''}`)
  assert.deepEqual(seen, ['intro', ...words.map((_, i) => `word${i}`), 'full', 'meaning'])
})

test('previous steps back one stage and floors at intro', () => {
  assert.deepEqual(prevStep({ phase: 'meaning', index: 0 }, 14), { phase: 'full', index: 0 })
  assert.deepEqual(prevStep({ phase: 'full', index: 0 }, 14), { phase: 'word', index: 13 })
  assert.deepEqual(prevStep({ phase: 'word', index: 0 }, 14), { phase: 'intro', index: 0 })
})

test('every clip resolves to audio fields from the content model', () => {
  for (const v of verses) {
    v.words.forEach((w, i) => assert.equal(clipFor(v, { phase: 'word', index: i }).src, w.audio))
    assert.equal(clipFor(v, { phase: 'full', index: 0 }).src, v.fullMantraAudio)
    assert.equal(clipFor(v, { phase: 'meaning', index: 0 }).src, v.totalMeaningAudio)
  }
})

test('content model is well-formed: unique ids and audio, contiguous lines, no join at line end', () => {
  const all = verses.flatMap((v) => v.words)
  assert.equal(new Set(all.map((w) => w.id)).size, all.length)
  const audio = [...all.map((w) => w.audio), ...verses.flatMap((v) => [v.fullMantraAudio, v.totalMeaningAudio])]
  assert.equal(new Set(audio).size, audio.length, 'no two clips share a file')
  for (const v of verses) {
    const lines = groupLines(v.words)
    assert.ok(lines.every(Boolean), `${v.id}: no empty lines`)
    lines.forEach((line) => assert.ok(!line.at(-1).word.joinNext, `${v.id}: last word of a line must not join`))
  }
})

test('full-mantra sync uses timings when present', () => {
  const words = [{ fullMantraAt: 0 }, { fullMantraAt: 1.5 }, { fullMantraAt: 3 }]
  assert.equal(wordAtTime(words, 2), 1)
  assert.equal(wordAtTime([{ fullMantraAt: null }, { fullMantraAt: null }], 5), -1)
})
