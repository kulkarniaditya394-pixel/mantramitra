import MantraText from './MantraText.jsx'
import { ArrowIcon } from './Icons.jsx'

export default function MantraTeaser({ mantra, onExperience, onBack }) {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-center">
      <p className="rise text-[11px] tracking-[0.36em] text-gold/80 uppercase">Explore another mantra</p>
      <span className="rise my-9 h-px w-10 bg-gold/40" aria-hidden="true" />

      <h2 className="rise-late">
        <span lang="sa" className="block font-deva text-[clamp(2.4rem,10vw,4.25rem)] leading-[1.3] text-ivory">
          {mantra.title}
        </span>
        <span className="mt-2 block font-display text-xl text-ivory/55 italic">{mantra.subtitle}</span>
      </h2>

      <MantraText
        words={mantra.verses[0].words.filter((w) => w.line < 2)}
        className="rise-later mt-10 text-[clamp(1.05rem,4.4vw,1.5rem)] leading-[1.8] opacity-70 [mask-image:linear-gradient(to_bottom,black_45%,transparent_105%)]"
      />

      <p className="rise-later mt-8 max-w-xs text-[15px] leading-relaxed text-ivory/55">
        The same word-by-word understanding, for every stotra.
      </p>

      <div className="rise-later mt-9 flex w-full max-w-xs flex-col items-center gap-3">
        <button
          type="button"
          onClick={onExperience}
          className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-ivory text-[15px] font-medium text-ink transition-[transform,background-color] duration-300 hover:bg-white active:scale-[0.98]"
        >
          Experience
          <ArrowIcon size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
        <button type="button" onClick={onBack} className="h-11 rounded-full px-5 text-[14px] text-ivory/55 transition-colors hover:text-ivory">
          Return to Gayatri Mantra
        </button>
      </div>
    </section>
  )
}
