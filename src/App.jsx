import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Cards from './pages/Cards.jsx'
import Progress from './pages/Progress.jsx'
import BottomNav from './components/BottomNav.jsx'
import Header from './components/Header.jsx'
import Onboarding from './components/Onboarding.jsx'
import useAppStore from './store/appStore.js'
import { getCurrentUser } from './services/firebase.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { resetFreemiumIfManipulated } from './config/freemium.js'

const Inspector = lazy(() => import('./pages/Inspector.jsx'))
const Resident = lazy(() => import('./pages/Resident.jsx'))
const B1Exam = lazy(() => import('./pages/B1Exam.jsx'))
const B1Writing = lazy(() => import('./pages/B1Writing.jsx'))
const B1Speaking = lazy(() => import('./pages/B1Speaking.jsx'))
const B1Reading = lazy(() => import('./pages/B1Reading.jsx'))
const B1Listening = lazy(() => import('./pages/B1Listening.jsx'))
const B1Grammar = lazy(() => import('./pages/B1Grammar.jsx'))
const Upgrade = lazy(() => import('./pages/Upgrade.jsx'))
const AnthemStudy = lazy(() => import('./pages/AnthemStudy.jsx'))
const Privacy = lazy(() => import('./pages/Privacy.jsx'))
const Terms = lazy(() => import('./pages/Terms.jsx'))

export default function App() {
  const isFirstLaunch = useAppStore((s) => s.isFirstLaunch)

  useEffect(() => {
    if (!isFirstLaunch) {
      useAppStore.getState().syncPremiumFromFirestore()
    }
  }, [isFirstLaunch])

  useEffect(() => {
    const run = () => {
      resetFreemiumIfManipulated(useAppStore)
      if (getCurrentUser()?.uid) {
        useAppStore.getState().loadProgress()
      }
    }
    run()
    const unsub = useAppStore.persist?.onFinishHydration?.(run)
    return typeof unsub === 'function' ? unsub : undefined
  }, [])

  if (isFirstLaunch) {
    return <Onboarding />
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-container">
        <Header />
        <main className="flex min-h-0 flex-1 flex-col pb-20" style={{ minHeight: '100%' }}>
          <ErrorBoundary>
            <Suspense
              fallback={
                <div
                  className="flex items-center justify-center text-gray-600 text-sm"
                  style={{ minHeight: '50vh' }}
                >
                  Завантаження...
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cards" element={<Cards />} />
                <Route path="/inspector" element={<Inspector />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/resident" element={<Resident />} />
                <Route path="/b1exam" element={<B1Exam />} />
                <Route path="/b1exam/writing" element={<B1Writing />} />
                <Route path="/b1exam/speaking" element={<B1Speaking />} />
                <Route path="/b1exam/reading" element={<B1Reading />} />
                <Route path="/b1exam/listening" element={<B1Listening />} />
                <Route path="/b1exam/grammar" element={<B1Grammar />} />
                <Route path="/upgrade" element={<Upgrade />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/anthem" element={<AnthemStudy />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
