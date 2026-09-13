import { useEffect, useMemo, useRef, useState } from 'react'
import { createAudioPlayer, IDLE_STATE } from './audioPlayer.js'

/** One audio player bound to the component's lifetime. Stops on unmount; pauses when the page is left. */
export function useAudio() {
  const [state, setState] = useState(IDLE_STATE)
  const ref = useRef(null)

  useEffect(() => {
    const player = createAudioPlayer(setState)
    ref.current = player
    const onLeave = () => player.pause()
    window.addEventListener('pagehide', onLeave)
    return () => {
      window.removeEventListener('pagehide', onLeave)
      player.destroy()
      ref.current = null
    }
  }, [])

  const controls = useMemo(
    () => ({
      play: (src, opts) => ref.current?.play(src, opts),
      pause: () => ref.current?.pause(),
      resume: () => ref.current?.resume(),
      stop: () => ref.current?.stop(),
    }),
    [],
  )

  return [state, controls]
}
