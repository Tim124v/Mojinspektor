import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  getCurrentUser,
  signInAnonymously,
  checkPremiumInFirestore,
  enablePremiumInFirestore,
  saveProgressToFirestore,
  loadProgressFromFirestore,
} from '../services/firebase.js'

function newerActivityDate(local, remote) {
  if (remote == null) return local ?? null
  if (local == null) return remote
  const dl = new Date(local).getTime()
  const dr = new Date(remote).getTime()
  if (Number.isNaN(dl)) return remote
  if (Number.isNaN(dr)) return local
  return dl >= dr ? local : remote
}

function mergeB1Progress(local = {}, remote = {}) {
  const keys = new Set([...Object.keys(local), ...Object.keys(remote)])
  const out = {}
  keys.forEach((k) => {
    const L = local[k] || {}
    const R = remote[k] || {}
    out[k] = {
      ...L,
      completed: Math.max(L.completed || 0, R.completed || 0),
      totalScore: Math.max(L.totalScore || 0, R.totalScore || 0),
      correct: Math.max(L.correct || 0, R.correct || 0),
      lastMax: Math.max(L.lastMax || 0, R.lastMax || 0),
      lastScore:
        L.lastScore != null && R.lastScore != null
          ? Math.max(L.lastScore, R.lastScore)
          : L.lastScore ?? R.lastScore ?? null,
    }
  })
  return out
}

function mergeResidentProgress(local = {}, remote = {}) {
  return {
    infoRead: Boolean(local.infoRead || remote.infoRead),
    cardsStudied: Math.max(local.cardsStudied || 0, remote.cardsStudied || 0),
    simulationsDone: Math.max(local.simulationsDone || 0, remote.simulationsDone || 0),
    lastScore:
      local.lastScore != null && remote.lastScore != null
        ? Math.max(local.lastScore, remote.lastScore)
        : local.lastScore ?? remote.lastScore ?? null,
  }
}

const useAppStore = create(
  persist(
    (set, get) => ({
      streak: 0,
      lastActivityDate: null,
      cardsLearnedToday: 0,
      totalCardsStudied: 0,
      sessions: [],
      isFirstLaunch: true,
      topicProgress: {
        history: { studied: 0, correct: 0 },
        culture: { studied: 0, correct: 0 },
        symbols: { studied: 0, correct: 0 },
        inspector: { studied: 0, correct: 0 },
        resident: { studied: 0, correct: 0 },
        government: { studied: 0, correct: 0 },
        geography: { studied: 0, correct: 0 },
        znani_zywy: { studied: 0, correct: 0 },
        znani_hist: { studied: 0, correct: 0 },
        hymn: { studied: 0, correct: 0 },
      },
      b1Progress: {
        writing: { completed: 0, totalScore: 0, lastScore: null, lastMax: 30 },
        speaking: { completed: 0, totalScore: 0, lastScore: null, lastMax: 40 },
        reading: { completed: 0, correct: 0, lastScore: null, lastMax: 30 },
        listening: { completed: 0, correct: 0, lastScore: null, lastMax: 30 },
        grammar: { completed: 0, correct: 0, lastScore: null, lastMax: 30 },
      },
      residentProgress: {
        infoRead: false,
        cardsStudied: 0,
        simulationsDone: 0,
        lastScore: null,
      },
      inspectorSessions: [],
      inspectorMessages: [],
      language: 'uk',
      questionLanguage: 'uk',
      isPremium: false,
      firebaseUid: null,
      freeInspectorUsed: 0,
      freeB1Used: 0,
      cardProgress: {},
      inspectorSession: {
        mode: null,
        messages: [],
        messageCount: 0,
        isActive: false,
        timerExpired: false,
        lastSaved: null,
        simSlot: null,
      },
      b1WritingDraft: {
        topicId: null,
        topicText: '',
        draftText: '',
        lastSaved: null,
      },

      setLanguage: (lang) => set({ language: lang }),
      setQuestionLanguage: (lang) =>
        set({ questionLanguage: lang === 'pl' ? 'pl' : 'uk' }),
      setPremium: (value) => set({ isPremium: value }),
      setFirebaseUid: (uid) => set({ firebaseUid: uid ?? null }),

      /** Джерело істини Premium — Firestore + /api/check-access; isPremium у localStorage лише кеш. */
      syncPremiumFromFirestore: async () => {
        try {
          const currentUser = getCurrentUser()
          let uid

          if (currentUser && !currentUser.isAnonymous) {
            uid = currentUser.uid
            set({ firebaseUid: uid })
          } else if (currentUser?.isAnonymous) {
            uid = currentUser.uid
            set({ firebaseUid: uid })
          } else {
            const anon = await signInAnonymously()
            if (!anon.success) return
            uid = anon.uid
            set({ firebaseUid: uid })
          }

          let premium = await checkPremiumInFirestore(uid)
          try {
            const accessRes = await fetch('/api/check-access', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ uid, feature: 'inspector' }),
            })
            const access = await accessRes.json().catch(() => ({}))
            if (access.source !== 'fallback' && typeof access.isPremium === 'boolean') {
              premium = access.isPremium
            }
          } catch {
            /* залишаємо premium з checkPremiumInFirestore */
          }

          if (premium === true) set({ isPremium: true })
          const cu = getCurrentUser()
          if (premium === false && cu && !cu.isAnonymous) {
            set({ isPremium: false })
          }
          await get().loadProgress()
        } catch (e) {
          console.warn('syncPremiumFromFirestore', e)
        }
      },

      saveProgress: async () => {
        try {
          const uid = getCurrentUser()?.uid
          if (!uid) return
          const s = get()
          const progressData = {
            streak: s.streak,
            lastActivityDate: s.lastActivityDate,
            cardsLearnedToday: s.cardsLearnedToday,
            totalCardsStudied: s.totalCardsStudied,
            topicProgress: s.topicProgress,
            b1Progress: s.b1Progress,
            residentProgress: s.residentProgress,
            cardProgress: s.cardProgress,
            inspectorSessions: s.inspectorSessions,
          }
          await saveProgressToFirestore(uid, progressData)
        } catch (e) {
          console.warn('saveProgress', e)
        }
      },

      loadProgress: async () => {
        try {
          const uid = getCurrentUser()?.uid
          if (!uid) return
          const result = await loadProgressFromFirestore(uid)
          if (!result.success || !result.data) return
          const s = get()
          const remote = result.data
          const merged = {
            streak: Math.max(s.streak, remote.streak ?? 0),
            totalCardsStudied: Math.max(s.totalCardsStudied, remote.totalCardsStudied ?? 0),
            cardsLearnedToday: Math.max(s.cardsLearnedToday, remote.cardsLearnedToday ?? 0),
            lastActivityDate: newerActivityDate(s.lastActivityDate, remote.lastActivityDate),
            topicProgress: { ...s.topicProgress },
            b1Progress: mergeB1Progress(s.b1Progress, remote.b1Progress),
            residentProgress: mergeResidentProgress(s.residentProgress, remote.residentProgress),
            cardProgress: { ...remote.cardProgress, ...s.cardProgress },
            inspectorSessions: [
              ...(remote.inspectorSessions || []),
              ...(s.inspectorSessions || []),
            ],
          }
          const topicKeys = new Set([
            ...Object.keys(s.topicProgress || {}),
            ...Object.keys(remote.topicProgress || {}),
          ])
          topicKeys.forEach((key) => {
            const local = s.topicProgress[key] ?? { studied: 0, correct: 0 }
            const rem = remote.topicProgress?.[key] ?? { studied: 0, correct: 0 }
            merged.topicProgress[key] = {
              studied: Math.max(local.studied, rem.studied),
              correct: Math.max(local.correct, rem.correct),
            }
          })
          set(merged)
        } catch (e) {
          console.warn('loadProgress', e)
        }
      },

      activatePremiumWithFirestore: async (uid) => {
        if (!uid) return { success: false, error: 'no uid' }
        const result = await enablePremiumInFirestore(uid)
        if (result.success) {
          set({ isPremium: true, firebaseUid: uid })
        }
        return result
      },

      /**
       * Після успішної оплати Stripe: anon auth за потреби + запис Premium у Firestore.
       * Якщо Firestore недоступний — усе одно вмикаємо локальний Premium (оплата пройшла).
       */
      finalizePremiumAfterStripe: async () => {
        let uid = getCurrentUser()?.uid
        if (!uid) {
          const anon = await signInAnonymously()
          uid = anon.success ? anon.uid : null
        }
        if (uid) {
          set({ firebaseUid: uid })
          const res = await get().activatePremiumWithFirestore(uid)
          if (!res.success) set({ isPremium: true })
        } else {
          set({ isPremium: true })
        }
      },

      incrementInspectorUsed: () => set((state) => ({
        freeInspectorUsed: state.freeInspectorUsed + 1,
      })),
      incrementB1Used: () => set((state) => ({
        freeB1Used: state.freeB1Used + 1,
      })),
      saveCardProgress: (topicSlug, lastIndex, answeredIds = [], cardOrderIds) =>
        set((state) => ({
          cardProgress: {
            ...state.cardProgress,
            [topicSlug]: {
              lastIndex,
              answeredIds,
              cardOrderIds: cardOrderIds || state.cardProgress?.[topicSlug]?.cardOrderIds || [],
              lastVisited: new Date().toISOString(),
            },
          },
        })),
      clearCardProgress: (topicSlug) =>
        set((state) => {
          const updated = { ...state.cardProgress }
          delete updated[topicSlug]
          return { cardProgress: updated }
        }),
      saveInspectorSession: (mode, messages, timerExpired = false, simSlot) =>
        set((state) => {
          const prev = state.inspectorSession
          return {
            inspectorSession: {
              mode,
              messages,
              messageCount: messages.length,
              isActive: messages.length > 0 && !timerExpired,
              timerExpired,
              lastSaved: new Date().toISOString(),
              simSlot: simSlot !== undefined ? simSlot : (prev?.simSlot ?? null),
            },
          }
        }),
      clearInspectorSession: () =>
        set({
          inspectorSession: {
            mode: null,
            messages: [],
            messageCount: 0,
            isActive: false,
            timerExpired: false,
            lastSaved: null,
            simSlot: null,
          },
        }),
      saveB1WritingDraft: (topicId, topicText, draftText) =>
        set({
          b1WritingDraft: {
            topicId,
            topicText,
            draftText,
            lastSaved: new Date().toISOString(),
          },
        }),
      clearB1WritingDraft: () =>
        set({
          b1WritingDraft: {
            topicId: null,
            topicText: '',
            draftText: '',
            lastSaved: null,
          },
        }),
      markFirstLaunchDone: () => {
        set({ isFirstLaunch: false })
      },

      updateTopicProgress: (topicSlug, isCorrect) =>
        set((state) => ({
          topicProgress: {
            ...state.topicProgress,
            [topicSlug]: {
              studied: (state.topicProgress[topicSlug]?.studied || 0) + 1,
              correct: (state.topicProgress[topicSlug]?.correct || 0) + (isCorrect ? 1 : 0),
            },
          },
          totalCardsStudied: state.totalCardsStudied + 1,
          cardsLearnedToday: state.cardsLearnedToday + 1,
        })),

      updateStreak: () => {
        const today = new Date().toDateString()
        const { lastActivityDate, streak } = get()
        if (lastActivityDate === today) return
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const wasYesterday = lastActivityDate === yesterday.toDateString()
        set({
          streak: wasYesterday ? streak + 1 : 1,
          lastActivityDate: today,
          cardsLearnedToday: 0,
        })
      },

      addSession: (session) => {
        set({
          sessions: [...get().sessions, session],
        })
      },

      updateB1Progress: (section, data) => {
        const { b1Progress } = get()
        set({
          b1Progress: {
            ...b1Progress,
            [section]: { ...b1Progress[section], ...data },
          },
        })
      },
      resetB1Progress: () => set({
        b1Progress: {
          writing: { completed: 0, totalScore: 0, lastScore: null, lastMax: 30 },
          speaking: { completed: 0, totalScore: 0, lastScore: null, lastMax: 40 },
          reading: { completed: 0, correct: 0, lastScore: null, lastMax: 30 },
          listening: { completed: 0, correct: 0, lastScore: null, lastMax: 30 },
          grammar: { completed: 0, correct: 0, lastScore: null, lastMax: 30 },
        },
        b1WritingDraft: {
          topicId: null,
          topicText: '',
          draftText: '',
          lastSaved: null,
        },
      }),

      updateResidentProgress: (data) => {
        set((state) => ({
          residentProgress: { ...state.residentProgress, ...data },
        }))
      },

      addInspectorSession: (session) => {
        set((state) => ({
          inspectorSessions: [...state.inspectorSessions, session],
        }))
      },

      markInfoAsRead: () => {
        set((state) => ({
          residentProgress: { ...state.residentProgress, infoRead: true },
        }))
      },

      setInspectorMessages: (messages) => {
        set({ inspectorMessages: messages })
      },

      clearInspectorMessages: () => {
        set({ inspectorMessages: [] })
      },
    }),
    {
      name: 'polakapp-storage',
      partialize: (state) => ({
        isPremium: state.isPremium,
        firebaseUid: state.firebaseUid,
        freeInspectorUsed: state.freeInspectorUsed,
        freeB1Used: state.freeB1Used,
        streak: state.streak,
        lastActivityDate: state.lastActivityDate,
        totalCardsStudied: state.totalCardsStudied,
        cardsLearnedToday: state.cardsLearnedToday,
        topicProgress: state.topicProgress,
        b1Progress: state.b1Progress,
        residentProgress: state.residentProgress,
        language: state.language,
        questionLanguage: state.questionLanguage,
        isFirstLaunch: state.isFirstLaunch,
        cardProgress: state.cardProgress,
        inspectorSession: state.inspectorSession,
        b1WritingDraft: state.b1WritingDraft,
        sessions: state.sessions,
        inspectorSessions: state.inspectorSessions,
        inspectorMessages: state.inspectorMessages,
      }),
    }
  )
)

export default useAppStore
