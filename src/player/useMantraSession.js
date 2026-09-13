import { useCallback, useEffect, useRef, useState } from 'react'
import { useAudio } from '../audio/useAudio.js'
import { clipFor, nextStep, prevStep } from './sequence.js'

/**
 * Drives one verse's journey. Each step plays its clip; when the clip's audio *ends*, the session
 * waits a short hold and advances. UI components only read the returned state and call actions.
 */
export function useMantraSession(verse, { onFinish }) {
  const [audio, player] = useAudio()
  const [step, setStep] = useState({ phase: 'intro', index: 0, run: 0 })
  const [paused, setPaused] = useState(false)
  const [completed, setCompleted] = useState(false)
  const hold = useRef(null)
  const count = verse.words.length

  const go = useCallback((s) => {
    clearTimeout(hold.current)
    setPaused(false)
    setCompleted(false)
    setStep((prev) => ({ phase: s.phase, index: s.index, run: prev.run + 1 }))
  }, [])

  const advanceFrom = useCallback(
    (s) => {
      const next = nextStep(s, count)
      if (next) go(next)
      else setCompleted(true)
    },
    [count, go],
  )

  useEffect(() => {
    const clip = clipFor(verse, step)
    player.play(clip.src, {
      fallbackMs: clip.fallbackMs,
      onEnded: () => {
        hold.current = setTimeout(() => advanceFrom(step), clip.holdMs)
      },
    })
    return () => {
      clearTimeout(hold.current)
      player.stop()
    }
  }, [verse, step, player, advanceFrom])

  const pause = useCallback(() => {
    clearTimeout(hold.current)
    player.pause()
    setPaused(true)
  }, [player])

  const resume = useCallback(() => {
    setPaused(false)
    if (completed) go(step) // replay the closing meaning
    else if (audio.status === 'ended') advanceFrom(step) // was paused during the hold
    else if (audio.status === 'unavailable') go(step)
    else player.resume()
  }, [audio.status, completed, step, go, advanceFrom, player])

  const next = useCallback(() => {
    const s = nextStep(step, count)
    s ? go(s) : onFinish()
  }, [step, count, go, onFinish])

  const isPlaying = !paused && !completed && !['blocked', 'unavailable'].includes(audio.status)

  return {
    step,
    audio,
    completed,
    isPlaying,
    clipIsSilentByDesign: !!clipFor(verse, step).silent,
    playWord: (index) => go({ phase: 'word', index }),
    pause,
    resume,
    toggle: () => (isPlaying ? pause() : resume()),
    next,
    previous: () => go(prevStep(step, count)),
    restart: () => go({ phase: 'intro', index: 0 }),
    replay: () => go(step),
    playFullMantra: () => go({ phase: 'full', index: 0 }),
  }
}
