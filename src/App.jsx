import { lazy, Suspense, useEffect, useState } from 'react'
import { mantras } from './data/index.js'
import AppShell from './components/AppShell.jsx'
import IntroScreen from './components/IntroScreen.jsx'
import MantraExperience from './components/MantraExperience.jsx'
import MantraTeaser from './components/MantraTeaser.jsx'

// Dev-only recording studio; excluded from production builds.
const Studio = import.meta.env.DEV ? lazy(() => import('./studio/Studio.jsx')) : null

// view: { name: 'intro' } | { name: 'experience', mantraId, verse } | { name: 'teaser' }
export default function App() {
  const [view, setView] = useState({ name: 'intro' })
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const home = () => setView({ name: 'intro' })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

  if (Studio && hash.startsWith('#/studio')) {
    return (
      <Suspense fallback={null}>
        <Studio />
      </Suspense>
    )
  }

  if (view.name === 'experience') {
    const mantra = mantras[view.mantraId]
    const hasNextVerse = view.verse < mantra.verses.length - 1
    const isGayatri = view.mantraId === 'gayatri'
    const finish = hasNextVerse
      ? () => setView({ ...view, verse: view.verse + 1 })
      : isGayatri
        ? () => setView({ name: 'teaser' })
        : home
    return (
      <AppShell onHome={home} onExit={home}>
        <MantraExperience
          key={`${view.mantraId}-${view.verse}`}
          mantra={mantra}
          verseIndex={view.verse}
          continueLabel={hasNextVerse ? 'Next verse' : isGayatri ? 'Explore another mantra' : 'Return to Gayatri Mantra'}
          autoContinue={hasNextVerse}
          onFinish={finish}
        />
      </AppShell>
    )
  }

  return (
    <AppShell onHome={home}>
      {view.name === 'teaser' ? (
        <MantraTeaser
          mantra={mantras['shiv-tandav']}
          onExperience={() => setView({ name: 'experience', mantraId: 'shiv-tandav', verse: 0 })}
          onBack={home}
        />
      ) : (
        <IntroScreen mantra={mantras.gayatri} onBegin={() => setView({ name: 'experience', mantraId: 'gayatri', verse: 0 })} />
      )}
    </AppShell>
  )
}
