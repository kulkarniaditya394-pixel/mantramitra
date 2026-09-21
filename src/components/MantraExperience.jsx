import { useEffect, useRef } from 'react'
import { useMantraSession } from '../player/useMantraSession.js'
import { PACING, wordAtTime } from '../player/sequence.js'
import MantraHeader from './MantraHeader.jsx'
import MantraText from './MantraText.jsx'
import ActiveWordCard, { ProgressHairline } from './ActiveWordCard.jsx'
import MeaningCard from './MeaningCard.jsx'
import TotalMeaning from './TotalMeaning.jsx'
import ProgressIndicator from './ProgressIndicator.jsx'
import AudioControls from './AudioControls.jsx'

const Eyebrow = ({ children, lang }) => (
  <p lang={lang} className={`rise text-gold/85 ${lang ? 'font-hindi text-[14px]' : 'text-[11px] tracking-[0.3em] uppercase'}`}>
    {children}
  </p>
)

const deva = (n) => n.toLocaleString('hi-IN-u-nu-deva')

/**
 * One verse of a mantra. Multi-verse mantras render this once per verse (keyed by the parent);
 * with `autoContinue`, the next verse follows on its own once this verse's meaning has been heard.
 */
export default function MantraExperience({ mantra, verseIndex = 0, continueLabel, autoContinue, onFinish }) {
  const verse = mantra.verses[verseIndex]
  const multiVerse = mantra.verses.length > 1
  const session = useMantraSession(verse, { onFinish })
  const { step, audio } = session
  const progress = audio.duration ? Math.min(audio.time / audio.duration, 1) : 0
  const word = step.phase === 'word' ? verse.words[step.index] : null

  useEffect(() => {
    if (!session.completed || !autoContinue) return
    const t = setTimeout(onFinish, PACING.betweenVersesMs)
    return () => clearTimeout(t)
  }, [session.completed, autoContinue, onFinish])

  const note =
    audio.status === 'blocked' ? 'blocked' : audio.silent && !session.clipIsSilentByDesign && !session.completed ? 'silent' : null

  useKeyboard(session)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8">
      <MantraHeader mantra={mantra} verseLabel={multiVerse ? `श्लोक ${deva(verseIndex + 1)} / ${deva(mantra.verses.length)}` : null} />

      {word && (
        <MantraText
          words={verse.words}
          mode="follow"
          activeIndex={step.index}
          onSelect={session.playWord}
          className="rise mt-4 text-[clamp(1.05rem,min(4.4vw,2.6vh),1.55rem)] leading-[1.7] sm:mt-6 short:mt-2 short:leading-[1.55]"
        />
      )}

      <div className="flex flex-1 items-center justify-center py-5 sm:py-8 short:py-2">
        {step.phase === 'intro' && (
          <div key={`intro-${step.run}`} className="flex flex-col items-center text-center">
            <Eyebrow lang="hi">{multiVerse ? `श्लोक ${deva(verseIndex + 1)}` : 'शब्द-दर-शब्द'}</Eyebrow>
            <MantraText words={verse.words} className="rise-late mt-7 text-[clamp(1.5rem,6.4vw,2.6rem)] leading-[1.7]" />
            <p className="rise-later mt-7 text-[14px] text-ivory/50">
              {verse.words.length} words. Each one, understood.
            </p>
          </div>
        )}

        {word && (
          <div key={`${word.id}-${step.run}`} className="flex flex-col items-center" aria-live="polite">
            <ActiveWordCard word={word} progress={progress} playing={session.isPlaying} />
            <MeaningCard meaning={word.hindiMeaning} grammar={word.grammar} />
          </div>
        )}

        {step.phase === 'full' && (
          <div key={`full-${step.run}`} className="relative flex flex-col items-center text-center">
            <div className="halo" data-playing={session.isPlaying ? '' : undefined} aria-hidden="true" />
            <Eyebrow lang="hi">{multiVerse ? 'पूरा श्लोक' : 'पूरा मंत्र'}</Eyebrow>
            <MantraText
              words={verse.words}
              activeIndex={wordAtTime(verse.words, audio.time)}
              className="rise-late relative mt-7 text-[clamp(1.6rem,7vw,2.9rem)] leading-[1.7] drop-shadow-[0_0_22px_rgb(200_169_106_/_0.22)]"
            />
            <ProgressHairline value={progress} className="rise-later mt-8 w-32" />
          </div>
        )}

        {step.phase === 'meaning' && (
          <TotalMeaning
            key={`meaning-${step.run}`}
            meaning={verse.totalMeaningHindi}
            source={verse.source}
            progress={progress}
            completed={session.completed}
            continueLabel={continueLabel}
            onContinue={onFinish}
          />
        )}
      </div>

      <footer className="mx-auto flex w-full max-w-md flex-col items-center gap-3 short:gap-1">
        <ProgressIndicator words={verse.words} step={step} onSelect={session.playWord} />
        <AudioControls session={session} note={note} />
      </footer>
    </div>
  )
}

/** Space = play/pause, ← / → = previous / next. Ignored while a control has focus. */
function useKeyboard(session) {
  const latest = useRef(session)
  latest.current = session
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest('button, input, textarea, select, a')) return
      const s = latest.current
      if (e.key === ' ') s.toggle()
      else if (e.key === 'ArrowRight') s.next()
      else if (e.key === 'ArrowLeft') s.previous()
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
