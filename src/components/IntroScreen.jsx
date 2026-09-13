import { useAudio } from '../audio/useAudio.js'
import { wordAtTime } from '../player/sequence.js'
import MantraText from './MantraText.jsx'
import { ArrowIcon, WaveIcon } from './Icons.jsx'

export default function IntroScreen({ mantra, onBegin }) {
  const [audio, player] = useAudio()
  const listening = audio.status === 'playing' || audio.status === 'loading'
  const unavailable = audio.status === 'unavailable'

  const toggleListen = () => {
    if (listening) player.pause()
    else if (audio.status === 'paused' || audio.status === 'blocked') player.resume()
    else player.play(mantra.verses[0].fullMantraAudio)
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pt-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-center">
      <p className="rise font-display text-lg text-ivory/60 italic sm:text-xl">Understand what you chant.</p>

      <span className="rise-late my-9 h-px w-10 bg-gold/50 sm:my-12 short:my-6" aria-hidden="true" />

      <h1 className="rise-late">
        <span lang="sa" className="block font-deva text-[clamp(2.6rem,11vw,4.5rem)] leading-[1.25] text-ivory">
          {mantra.title}
        </span>
        <span className="mt-1 block text-[11px] tracking-[0.36em] text-gold/80 uppercase">{mantra.subtitle}</span>
      </h1>

      <MantraText
        words={mantra.verses[0].words}
        activeIndex={listening ? wordAtTime(mantra.verses[0].words, audio.time) : -1}
        className={`rise-later mt-10 text-[clamp(1.35rem,5.4vw,2.1rem)] leading-[1.75] transition-[filter] duration-700 sm:mt-12 short:mt-6 ${listening ? 'drop-shadow-[0_0_18px_rgb(200_169_106_/_0.25)]' : ''}`}
      />

      <p className="rise-later mt-10 max-w-xs text-[15px] leading-relaxed text-ivory/55 sm:mt-12 short:mt-6">{mantra.tagline}</p>

      <div className="rise-later mt-9 short:mt-6 flex w-full max-w-xs flex-col items-center gap-3">
        <button
          type="button"
          onClick={onBegin}
          className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-ivory text-[15px] font-medium text-ink transition-[transform,background-color] duration-300 hover:bg-white active:scale-[0.98]"
        >
          Begin Experience
          <ArrowIcon size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>

        <button
          type="button"
          onClick={toggleListen}
          aria-pressed={listening}
          className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full text-[14px] text-ivory/70 transition-colors hover:bg-ivory/5 hover:text-ivory"
        >
          {listening ? (
            <span className="listening-bars flex h-3 items-center gap-[3px] text-gold" aria-hidden="true">
              <span /><span /><span />
            </span>
          ) : (
            <WaveIcon size={17} className="text-gold/80" />
          )}
          <span lang="hi" className="font-hindi">{listening ? 'रोकें' : audio.status === 'paused' ? 'जारी रखें' : 'पूरा मंत्र सुनें'}</span>
          <span className="text-ivory/35">·</span>
          <span>{listening ? 'Pause' : 'Listen to full mantra'}</span>
        </button>

        <p className="h-5 text-[12px] text-ivory/40" role="status">
          {unavailable && 'Full recitation arriving soon.'}
          {audio.status === 'blocked' && 'Tap again to allow audio.'}
        </p>
      </div>
    </section>
  )
}
