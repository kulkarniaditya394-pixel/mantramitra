import { Fragment } from 'react'
import { groupLines } from '../data/index.js'

/**
 * The complete mantra, rendered from its words so any word can be highlighted in place.
 *   mode "follow": words already spoken are dimmed, upcoming ones fainter, the active one lit.
 *   mode "lit":    every word fully visible; `activeIndex` (if ≥ 0) is still highlighted.
 */
export default function MantraText({ words, activeIndex = -1, mode = 'lit', onSelect, className = '' }) {
  const stateOf = (i) => {
    if (i === activeIndex) return 'active'
    if (mode === 'lit') return 'lit'
    return i < activeIndex ? 'past' : 'upcoming'
  }

  return (
    <div lang="sa" className={`font-deva text-center ${className}`}>
      {groupLines(words).map((line, li) => (
        <p key={li}>
          {line.map(({ word, i }) => (
            <Fragment key={word.id}>
              <span
                className="mantra-word"
                data-state={stateOf(i)}
                data-clickable={onSelect ? '' : undefined}
                aria-current={i === activeIndex ? 'true' : undefined}
                onClick={onSelect && (() => onSelect(i))}
              >
                {word.recited}
              </span>
              {word.joinNext ? <wbr /> : ' '}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  )
}
