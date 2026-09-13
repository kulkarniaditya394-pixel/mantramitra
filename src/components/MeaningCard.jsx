export default function MeaningCard({ meaning }) {
  return (
    <div className="rise-later mt-5 max-w-md text-center sm:mt-7 short:mt-3">
      <p lang="hi" className="font-hindi text-[13px] text-gold/80">शब्द का अर्थ</p>
      <p lang="hi" className="mt-2.5 font-hindi text-[clamp(1.3rem,5.2vw,1.75rem)] leading-snug font-light text-ivory/95">
        {meaning}
      </p>
    </div>
  )
}
