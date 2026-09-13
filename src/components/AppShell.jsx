import { CloseIcon } from './Icons.jsx'

export default function AppShell({ onHome, onExit, children }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="atmosphere" aria-hidden="true" />
      <header className="mx-auto flex h-16 w-full short:h-12 max-w-5xl shrink-0 items-center justify-between px-5 pt-[env(safe-area-inset-top)] sm:px-8">
        <button
          type="button"
          onClick={onHome}
          className="flex items-center gap-2.5 text-[11px] font-medium tracking-[0.42em] text-ivory/75 uppercase transition-colors hover:text-ivory"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
          MantraMitra
        </button>
        {onExit && (
          <button
            type="button"
            onClick={onExit}
            aria-label="Leave and return to start"
            className="-mr-2 grid h-10 w-10 place-items-center rounded-full text-ivory/55 transition-colors hover:bg-ivory/5 hover:text-ivory"
          >
            <CloseIcon size={18} />
          </button>
        )}
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
