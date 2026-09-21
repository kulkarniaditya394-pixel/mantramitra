import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { mantras } from '../data/index.js'

/**
 * Recording studio (dev only, at #/studio).
 *
 * A reciter works down one list: the screen shows what to say, they record, hear it back, keep or
 * redo. Each keep is written straight to the mp3 the app already points at — no file naming, no
 * audio editing, no engineer in the loop. This is how a real voice gets into the catalogue at scale.
 */

/** Every clip one verse needs, in the order a reciter should record them. */
function clipsFor(mantra, verse, verseIndex) {
  const label = mantra.verses.length > 1 ? `${mantra.subtitle} — verse ${verseIndex + 1}` : mantra.subtitle
  return [
    ...verse.words.map((w, i) => ({
      key: w.id,
      path: w.audio,
      group: label,
      kind: 'word',
      step: `Word ${i + 1} of ${verse.words.length}`,
      say: w.sanskrit,
      hint: `${w.transliteration} · ${w.hindiMeaning}`,
      lang: 'sa',
    })),
    {
      key: `${verse.id}-full`,
      path: verse.fullMantraAudio,
      group: label,
      kind: 'full',
      step: 'Full recitation',
      say: verse.words.map((w) => w.recited + (w.joinNext ? '' : ' ')).join('').trim(),
      hint: 'Recite the whole verse at chanting pace, as you normally would.',
      lang: 'sa',
    },
    {
      key: `${verse.id}-meaning`,
      path: verse.totalMeaningAudio,
      group: label,
      kind: 'meaning',
      step: 'Meaning (Hindi)',
      say: verse.totalMeaningHindi,
      hint: 'Read this in a calm, explaining voice — not chanting.',
      lang: 'hi',
    },
  ]
}

const ALL_CLIPS = Object.values(mantras).flatMap((m) => m.verses.flatMap((v, i) => clipsFor(m, v, i)))

export default function Studio() {
  const [index, setIndex] = useState(0)
  const [existing, setExisting] = useState({})
  const [recorder, setRecorder] = useState(null) // null | 'arming' | 'recording'
  const [take, setTake] = useState(null) // { url, blob }
  const [error, setError] = useState(null)
  const [level, setLevel] = useState(0)
  const media = useRef({})

  const clip = ALL_CLIPS[index]
  const done = useMemo(() => ALL_CLIPS.filter((c) => existing[c.path]).length, [existing])

  const refresh = useCallback(() => {
    fetch('/__studio/status')
      .then((r) => r.json())
      .then(setExisting)
      .catch(() => {})
  }, [])
  useEffect(refresh, [refresh])

  const stopTracks = () => {
    media.current.stream?.getTracks().forEach((t) => t.stop())
    media.current.ctx?.close().catch(() => {})
    media.current = {}
    setLevel(0)
  }
  useEffect(() => stopTracks, [])

  async function startRecording() {
    setError(null)
    setTake(null)
    setRecorder('arming')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: false, noiseSuppression: true, autoGainControl: false },
      })
      const rec = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm' })
      const chunks = []
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data)
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: rec.mimeType })
        setTake({ blob, url: URL.createObjectURL(blob) })
        setRecorder(null)
        stopTracks()
      }

      // Live level meter, so a dead mic is obvious before a whole session is wasted.
      const ctx = new AudioContext()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      ctx.createMediaStreamSource(stream).connect(analyser)
      const buf = new Float32Array(analyser.fftSize)
      const tick = () => {
        if (!media.current.ctx) return
        analyser.getFloatTimeDomainData(buf)
        setLevel(Math.min(1, Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length) * 6))
        media.current.raf = requestAnimationFrame(tick)
      }
      media.current = { stream, ctx, rec }
      tick()

      rec.start()
      setRecorder('recording')
    } catch (err) {
      setError(err.name === 'NotAllowedError' ? 'Microphone permission was refused.' : String(err.message || err))
      setRecorder(null)
      stopTracks()
    }
  }

  const stopRecording = () => media.current.rec?.state === 'recording' && media.current.rec.stop()

  async function keepTake() {
    if (!take) return
    try {
      const res = await fetch('/__studio/clip', { method: 'POST', headers: { 'x-clip-path': clip.path }, body: take.blob })
      const out = await res.json()
      if (out.error) throw new Error(out.error)
      setTake(null)
      refresh()
      setIndex((i) => Math.min(i + 1, ALL_CLIPS.length - 1))
    } catch (err) {
      setError(String(err.message || err))
    }
  }

  // Space bar is the whole interface once a reciter gets going.
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'Space' || e.target.closest('button, input')) return
      e.preventDefault()
      if (recorder === 'recording') stopRecording()
      else if (take) keepTake()
      else startRecording()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-6 py-6">
      <header className="flex items-center justify-between text-[11px] tracking-[0.3em] text-ivory/50 uppercase">
        <span>Recording studio</span>
        <span className="tabular-nums">
          {done} / {ALL_CLIPS.length} recorded
        </span>
      </header>

      <div className="mt-3 flex gap-[2px]">
        {ALL_CLIPS.map((c, i) => (
          <button
            key={c.key}
            onClick={() => {
              setTake(null)
              setIndex(i)
            }}
            title={`${c.group} — ${c.step}`}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i === index ? 'bg-gold' : existing[c.path] ? 'bg-ivory/45' : 'bg-ivory/12 hover:bg-ivory/25'}`}
          />
        ))}
      </div>

      <main className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-[11px] tracking-[0.3em] text-ivory/45 uppercase">
          {clip.group} · {clip.step}
        </p>
        <p
          lang={clip.lang}
          className={`mt-6 ${clip.lang === 'hi' ? 'font-hindi text-[clamp(1.1rem,3.4vw,1.5rem)] leading-relaxed' : 'font-deva text-[clamp(2rem,7vw,3.5rem)] leading-[1.35]'} text-ivory`}
        >
          {clip.say}
        </p>
        <p className="mt-4 max-w-md text-[13px] leading-relaxed text-ivory/45">{clip.hint}</p>

        {existing[clip.path] && !take && (
          <audio key={clip.path} controls src={clip.path} className="mt-6 h-9 w-64 max-w-full opacity-70" />
        )}
        {take && <audio key="take" controls autoPlay src={take.url} className="mt-6 h-9 w-64 max-w-full" />}

        <div className="mt-8 flex h-1.5 w-40 overflow-hidden rounded-full bg-ivory/10">
          <div className="bg-gold transition-[width] duration-75" style={{ width: `${Math.round(level * 100)}%` }} />
        </div>

        <div className="mt-6 flex items-center gap-3">
          {recorder === 'recording' ? (
            <button onClick={stopRecording} className="h-14 rounded-full bg-red-500/90 px-8 text-[15px] font-medium text-white">
              Stop
            </button>
          ) : take ? (
            <>
              <button onClick={keepTake} className="h-14 rounded-full bg-ivory px-8 text-[15px] font-medium text-ink">
                Keep &amp; next
              </button>
              <button onClick={startRecording} className="h-14 rounded-full px-6 text-[14px] text-ivory/60 ring-1 ring-ivory/15">
                Redo
              </button>
            </>
          ) : (
            <button
              onClick={startRecording}
              disabled={recorder === 'arming'}
              className="h-14 rounded-full bg-ivory px-8 text-[15px] font-medium text-ink disabled:opacity-50"
            >
              {existing[clip.path] ? 'Re-record' : 'Record'}
            </button>
          )}
        </div>

        <p className="mt-4 h-5 text-[12px] text-ivory/40">
          {error ? <span className="text-red-400/80">{error}</span> : 'Space: record · stop · keep'}
        </p>

        <div className="mt-6 flex gap-4 text-[13px] text-ivory/45">
          <button onClick={() => { setTake(null); setIndex((i) => Math.max(0, i - 1)) }}>← Previous</button>
          <button onClick={() => { setTake(null); setIndex((i) => Math.min(ALL_CLIPS.length - 1, i + 1)) }}>Skip →</button>
        </div>
      </main>

      <footer className="text-center text-[12px] text-ivory/35">
        Recordings are saved straight into the app. Reload the experience to hear them.
      </footer>
    </div>
  )
}
