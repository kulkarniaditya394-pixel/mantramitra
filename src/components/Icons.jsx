// Thin-stroke icons, drawn to match the typography. Decorative — buttons carry their own labels.
const Svg = ({ children, size = 20, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
    {children}
  </svg>
)

export const PlayIcon = (p) => (
  <Svg {...p}>
    <path d="M8 5.5v13l10.5-6.5L8 5.5z" fill="currentColor" stroke="none" />
  </Svg>
)
export const PauseIcon = (p) => (
  <Svg {...p}>
    <path d="M8.5 5.5v13M15.5 5.5v13" strokeWidth="2" />
  </Svg>
)
export const PrevIcon = (p) => (
  <Svg {...p}>
    <path d="M6 5.5v13M18 6l-8.5 6 8.5 6V6z" />
  </Svg>
)
export const NextIcon = (p) => (
  <Svg {...p}>
    <path d="M18 5.5v13M6 6l8.5 6L6 18V6z" />
  </Svg>
)
export const ReplayIcon = (p) => (
  <Svg {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v3.7h3.7" />
  </Svg>
)
export const RestartIcon = (p) => (
  <Svg {...p}>
    <path d="M5 5v14M19 12H9m0 0 4-4m-4 4 4 4" />
  </Svg>
)
export const WaveIcon = (p) => (
  <Svg {...p}>
    <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" />
  </Svg>
)
export const CloseIcon = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
)
export const MutedIcon = (p) => (
  <Svg {...p}>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4v-5zM16 9.5l5 5M21 9.5l-5 5" />
  </Svg>
)
export const ArrowIcon = (p) => (
  <Svg {...p}>
    <path d="M5 12h14m-5-5 5 5-5 5" />
  </Svg>
)
