export const FREEMIUM = {
  FREE_INSPECTOR_LIMIT: 2,
  FREE_CARDS_PER_TOPIC: 20,
  FREE_B1_CHECKS: 1,
  PRICE_PLN: 59,
  PRICE_USD: 15,

  /** Перша безкоштовна симуляція — коротка проба */
  TRIAL_SIMULATION_MESSAGES: 10,
  FULL_SIMULATION_MESSAGES: 20,
  /** Premium — розширена симуляція */
  PREMIUM_SIMULATION_MESSAGES: 30,
}

export function canUse(feature, store) {
  if (store.isPremium) return { allowed: true }

  switch (feature) {
    case 'inspector':
      return {
        allowed: store.freeInspectorUsed < FREEMIUM.FREE_INSPECTOR_LIMIT,
        used: store.freeInspectorUsed,
        limit: FREEMIUM.FREE_INSPECTOR_LIMIT,
        message: `Використано ${store.freeInspectorUsed} з ${FREEMIUM.FREE_INSPECTOR_LIMIT} безкоштовних симуляцій`,
      }
    case 'b1_writing':
      return {
        allowed: store.freeB1Used < FREEMIUM.FREE_B1_CHECKS,
        used: store.freeB1Used,
        limit: FREEMIUM.FREE_B1_CHECKS,
        message: `Використано ${store.freeB1Used} з ${FREEMIUM.FREE_B1_CHECKS} безкоштовних перевірок`,
      }
    case 'cards_full':
      return {
        allowed: false,
        message: 'Повна база питань доступна в Premium',
      }
    default:
      return { allowed: true }
  }
}

/** Захист від маніпуляцій у збереженому стані: від’ємні лічильники → 0. */
export function resetFreemiumIfManipulated(store) {
  const s = store.getState()
  const patch = {}
  if (typeof s.freeInspectorUsed === 'number' && s.freeInspectorUsed < 0) {
    patch.freeInspectorUsed = 0
  }
  if (typeof s.freeB1Used === 'number' && s.freeB1Used < 0) {
    patch.freeB1Used = 0
  }
  if (Object.keys(patch).length > 0) {
    store.setState(patch)
    return true
  }
  return false
}
