import { ArrowIcon } from './Icons.jsx'
import { ProgressHairline } from './ActiveWordCard.jsx'

export default function TotalMeaning({ meaning, progress, completed, continueLabel, onContinue }) {
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
      <button
        type="button"
        onClick={onContinue}
        className={`group mt-8 short:mt-5 flex h-12 items-center gap-2.5 rounded-full px-6 text-[14px] transition-all duration-700 ${
          completed ? 'bg-ivory text-ink hover:bg-white' : 'text-ivory/55 ring-1 ring-ivory/15 hover:text-ivory'
        }`}
      >
        {continueLabel}
        <ArrowIcon size={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
    </section>
  )
}
