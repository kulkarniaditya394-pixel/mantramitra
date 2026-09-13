const pad = (n) => String(n).padStart(2, '0')

/** "03 / 14" plus one quiet segment per word. Segments double as a keyboard-reachable word index. */
export default function ProgressIndicator({ words, step, onSelect }) {
  const reached = step.phase === 'word' ? step.index : step.phase === 'intro' ? -1 : words.length

  return (
    <nav aria-label="Mantra progress" className="w-full">
      <p className="mb-2 text-center text-[11px] tracking-[0.25em] text-ivory/50 tabular-nums" aria-live="polite">
        {step.phase === 'intro' ? (
          <span lang="hi" className="font-hindi text-[12.5px]">आरम्भ</span>
        ) : (
          <>
            <span className="text-ivory/85">{pad(Math.min(reached + 1, words.length))}</span> / {pad(words.length)}
          </>
        )}
      </p>
      <ol className="flex items-center gap-[3px]">
        {words.map((w, i) => (
          <li key={w.id} className="flex-1">
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Word ${i + 1}: ${w.transliteration}`}
              aria-current={step.phase === 'word' && step.index === i ? 'step' : undefined}
              className="group block w-full py-2.5"
            >
              <span
                className={`block h-[2px] rounded-full transition-colors duration-500 ${
                  i === reached ? 'bg-gold' : i < reached ? 'bg-ivory/45' : 'bg-ivory/12 group-hover:bg-ivory/30'
                }`}
              />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
