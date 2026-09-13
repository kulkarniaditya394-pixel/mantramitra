import { MutedIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon, ReplayIcon, RestartIcon, WaveIcon } from './Icons.jsx'

const quiet =
  'flex h-10 short:h-9 items-center gap-2 rounded-full px-3.5 text-[13px] text-ivory/55 transition-colors hover:bg-ivory/5 hover:text-ivory'
const round =
  'grid h-12 w-12 place-items-center rounded-full text-ivory/70 transition-colors hover:bg-ivory/5 hover:text-ivory disabled:opacity-25 disabled:hover:bg-transparent'

export default function AudioControls({ session, note }) {
  const { isPlaying, step } = session
  const atStart = step.phase === 'intro'

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-5">
        <button type="button" className={round} onClick={session.previous} disabled={atStart} aria-label="Previous">
          <PrevIcon />
        </button>
        <button
          type="button"
          onClick={session.toggle}
          aria-label={isPlaying ? 'Pause' : 'Listen'}
          className="grid h-16 w-16 short:h-14 short:w-14 place-items-center rounded-full bg-ivory/[0.06] text-ivory ring-1 ring-ivory/15 transition-[background-color,box-shadow,transform] duration-300 hover:bg-ivory/10 hover:ring-ivory/30 active:scale-95"
        >
          {isPlaying ? <PauseIcon size={22} /> : <PlayIcon size={22} className="translate-x-px" />}
        </button>
        <button type="button" className={round} onClick={session.next} aria-label={step.phase === 'meaning' ? 'Continue' : 'Next word'}>
          <NextIcon />
        </button>
      </div>

      <div className="mt-3 short:mt-1 flex flex-wrap items-center justify-center gap-1">
        <button type="button" className={quiet} onClick={session.replay} aria-label="Replay current">
          <ReplayIcon size={16} /> Replay
        </button>
        <button
          type="button"
          className={`${quiet} ${step.phase === 'full' ? 'text-gold hover:text-gold' : ''}`}
          onClick={session.playFullMantra}
          aria-label="Play full mantra"
          aria-pressed={step.phase === 'full'}
        >
          <WaveIcon size={16} /> <span lang="hi" className="font-hindi">पूरा मंत्र</span>
        </button>
        <button type="button" className={quiet} onClick={session.restart} aria-label="Restart from the beginning">
          <RestartIcon size={16} /> Restart
        </button>
      </div>

      {/* Fades out with a delay so it doesn't flicker while the next clip is being probed. */}
      <p
        className={`mt-2 short:mt-0 flex h-5 items-center gap-1.5 text-[11.5px] text-ivory/35 transition-opacity duration-500 ${note ? 'opacity-100' : 'opacity-0 delay-700'}`}
        role="status"
        aria-hidden={!note}
      >
        {note === 'blocked' ? (
          'Tap listen to allow audio'
        ) : (
          <>
            <MutedIcon size={13} /> Audio arriving soon — following along silently
          </>
        )}
      </p>
    </div>
  )
}
