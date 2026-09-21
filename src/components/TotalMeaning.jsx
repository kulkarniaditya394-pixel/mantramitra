import { ArrowIcon } from './Icons.jsx'
import { ProgressHairline } from './ActiveWordCard.jsx'

/** Provenance line: which text, ṛṣi, deity and metre this reading comes from. */
function SourceLine({ source }) {
  if (!source) return null
  const parts = [source.scripture, source.rishi && `ऋषि ${source.rishi}`, source.devata && `देवता ${source.devata}`, source.chhanda && `छन्द ${source.chhanda}`]
  return (
    <div className="rise-later mt-5 max-w-md">
      <p lang="hi" className="font-hindi text-[12px] leading-relaxed text-ivory/45">
        {parts.filter(Boolean).join(' · ')}
      </p>
      {source.note && (
        <p lang="hi" className="mt-1.5 font-hindi text-[11.5px] leading-relaxed text-ivory/30">
          {source.note}
        </p>
      )}
    </div>
  )
}

export default function TotalMeaning({ meaning, source, progress, completed, continueLabel, onContinue }) {
  return (
    <section className="flex w-full max-w-xl flex-col items-center text-center" aria-labelledby="total-meaning">
      <h2 id="total-meaning" lang="hi" className="rise font-hindi text-[15px] text-gold/85">
        सम्पूर्ण अर्थ
      </h2>
      <ProgressHairline value={progress} className="rise mt-5 w-16" />
      <blockquote
        lang="hi"
        className="rise-late mt-8 short:mt-5 rounded-[28px] border border-ivory/10 bg-gradient-to-b from-ivory/[0.045] to-transparent px-6 py-8 font-deva text-[clamp(1.2rem,4.6vw,1.6rem)] leading-[1.85] short:py-6 short:text-[clamp(1.05rem,4.2vw,1.35rem)] short:leading-[1.7] text-ivory/90 sm:px-10 sm:py-10"
      >
        {meaning}
      </blockquote>
      <SourceLine source={source} />
      <button
        type="button"
        onClick={onContinue}
        className={`group mt-6 short:mt-4 flex h-12 items-center gap-2.5 rounded-full px-6 text-[14px] transition-all duration-700 ${
          completed ? 'bg-ivory text-ink hover:bg-white' : 'text-ivory/55 ring-1 ring-ivory/15 hover:text-ivory'
        }`}
      >
        {continueLabel}
        <ArrowIcon size={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
    </section>
  )
}
