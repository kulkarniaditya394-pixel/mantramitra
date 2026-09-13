export default function MantraHeader({ mantra, verseLabel }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center whitespace-nowrap">
      <span lang="sa" className="font-deva text-[15px] text-ivory/80">{mantra.title}</span>
      <span className="h-3 w-px bg-ivory/20" aria-hidden="true" />
      <span className="text-[10px] tracking-[0.3em] text-ivory/45 uppercase">{mantra.subtitle}</span>
      {(verseLabel || mantra.preview) && (
        <span className="flex basis-full items-center justify-center gap-2.5">
          {verseLabel && (
            <span lang="hi" className="font-hindi text-[12.5px] text-gold/85">{verseLabel}</span>
          )}
          {mantra.preview && (
            <span className="rounded-full border border-gold/30 px-2.5 py-0.5 text-[9px] tracking-[0.22em] text-gold/85 uppercase">
              Prototype Preview
            </span>
          )}
        </span>
      )}
    </div>
  )
}
