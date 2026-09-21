/**
 * Framework-agnostic audio player over a single <audio> element.
 *
 * The rest of the app only uses play / pause / resume / stop / destroy and the onChange state,
 * so this module can later be swapped for hosted URLs or a streaming service untouched elsewhere.
 *
 * Missing, failed or unsupported sources never throw:
 *   - with `fallbackMs` the clip is "played" silently on a clock (state.silent = true), so the
 *     experience keeps its rhythm until the real recording exists;
 *   - without it the status becomes 'unavailable'.
 * Sources that fail once are remembered and skipped for the rest of the session.
 *
 * status: idle | loading | playing | paused | blocked (autoplay denied) | ended | unavailable
 */
const TICK_MS = 100
const MIME = { mp3: 'audio/mpeg', wav: 'audio/wav', m4a: 'audio/mp4', aac: 'audio/aac', ogg: 'audio/ogg', opus: 'audio/ogg', webm: 'audio/webm' }

export const IDLE_STATE = { status: 'idle', silent: false, time: 0, duration: 0 }

export function createAudioPlayer(onChange) {
  const el = new Audio()
  el.preload = 'auto'
  const failed = new Set()
  let clip = null // { id, src, fallbackMs, onEnded, mode: 'audio' | 'clock', elapsed }
  let clock = null
  let seq = 0
  let state = IDLE_STATE

  const set = (patch) => {
    state = { ...state, ...patch }
    onChange(state)
  }
  const isCurrent = (c) => c && clip === c

  const canPlay = (src) => {
    const mime = MIME[src.split('?')[0].split('.').pop().toLowerCase()]
    return !mime || el.canPlayType(mime) !== ''
  }

  function unload() {
    el.pause()
    if (el.getAttribute('src')) {
      el.removeAttribute('src')
      el.load()
    }
  }

  function stopClock() {
    clearInterval(clock)
    clock = null
  }

  function startClock(c) {
    stopClock()
    clock = setInterval(() => {
      c.elapsed += TICK_MS
      set({ time: Math.min(c.elapsed, c.fallbackMs) / 1000 })
      if (c.elapsed >= c.fallbackMs) finish(c)
    }, TICK_MS)
  }

  function finish(c) {
    if (!isCurrent(c)) return
    stopClock()
    clip = null
    set({ status: 'ended', time: state.duration })
    c.onEnded?.()
  }

  function fallBack(c) {
    if (!isCurrent(c) || c.mode !== 'audio') return
    if (c.src) failed.add(c.src)
    c.mode = 'clock'
    unload()
    if (!c.fallbackMs) {
      clip = null
      return set({ status: 'unavailable', silent: true, time: 0, duration: 0 })
    }
    set({ status: 'playing', silent: true, time: 0, duration: c.fallbackMs / 1000 })
    startClock(c)
  }

  function attemptPlay(c) {
    el.play()
      .then(() => isCurrent(c) && set({ status: 'playing' }))
      .catch((err) => {
        if (!isCurrent(c)) return
        if (err.name === 'NotAllowedError') set({ status: 'blocked' })
        else if (err.name !== 'AbortError') fallBack(c) // NotSupportedError, network failure
      })
  }

  const syncTime = () => {
    if (clip?.mode === 'audio') set({ time: el.currentTime, duration: Number.isFinite(el.duration) ? el.duration : 0 })
  }
  el.addEventListener('loadedmetadata', syncTime)
  el.addEventListener('timeupdate', syncTime)
  el.addEventListener('ended', () => clip?.mode === 'audio' && finish(clip))
  el.addEventListener('error', () => {
    // Only trust an error that belongs to the clip currently loaded. Skipping quickly aborts the
    // previous load, and that abort must not condemn the new clip's file (which would blacklist a
    // perfectly good recording for the rest of the session).
    if (clip?.mode !== 'audio' || el.getAttribute('src') !== clip.src) return
    if (el.error?.code === MediaError.MEDIA_ERR_ABORTED) return
    fallBack(clip)
  })

  function stop() {
    stopClock()
    clip = null
    unload()
    set(IDLE_STATE)
  }

  return {
    /** Play a clip. `onEnded` fires once, after real or simulated playback completes. */
    play(src, { fallbackMs = 0, onEnded } = {}) {
      stop()
      const c = { id: ++seq, src, fallbackMs, onEnded, mode: 'audio', elapsed: 0 }
      clip = c
      if (!src || failed.has(src) || !canPlay(src)) return fallBack(c)
      set({ status: 'loading', silent: false, time: 0, duration: 0 })
      el.src = src
      attemptPlay(c)
    },
    pause() {
      if (!clip) return
      if (clip.mode === 'clock') stopClock()
      else el.pause()
      set({ status: 'paused' })
    },
    resume() {
      if (!clip) return
      if (clip.mode === 'clock') {
        set({ status: 'playing' })
        startClock(clip)
      } else {
        attemptPlay(clip)
      }
    },
    stop,
    destroy() {
      stop()
      onChange = () => {}
    },
  }
}
