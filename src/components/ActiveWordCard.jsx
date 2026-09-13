// Long compound parts (e.g. धगद्धगद्धगत्) step down so they always fit one line on a phone.
const sizeFor = (text) =>
  text.length <= 9
    ? 'text-[clamp(3.5rem,min(19vw,12vh),8.5rem)]'
    : text.length <= 13
      ? 'text-[clamp(2.75rem,min(13vw,10vh),6.5rem)]'
      : 'text-[clamp(2.25rem,min(10vw,8vh),5rem)]'

/** The word being spoken, brought into focus. Remounted per word (keyed) so it animates in. */
export default function ActiveWordCard({ word, progress, playing }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="halo" data-playing={playing ? '' : undefined} aria-hidden="true" />
      <p lang="sa" className={`rise relative font-deva leading-[1.3] whitespace-nowrap text-ivory ${sizeFor(word.sanskrit)}`}>
        {word.sanskrit}
      </p>
      <p className="rise-late relative font-display text-xl text-ivory/55 italic sm:text-2xl">{word.transliteration}</p>
      <ProgressHairline value={progress} />
    </div>
  )
}

/** A thin line that fills as the current clip plays — the visible link between sound and word. */
export function ProgressHairline({ value, className = 'mt-5 w-24 sm:mt-7 short:mt-3' }) {
  return (
    <div className={`relative h-px overflow-hidden bg-ivory/12 ${className}`} aria-hidden="true">
      <div
        className="absolute inset-y-0 left-0 bg-gold/80 transition-[width] duration-150 ease-linear"
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  )
}
