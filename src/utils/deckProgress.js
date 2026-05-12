/** Ids з відповідей, що досі є в поточній колоді (після дедупу / зміни набору). */
export function filterAnsweredIdsForDeck(answeredIds, deck) {
  if (!deck?.length) return []
  const valid = new Set(deck.map((c) => c.id))
  const arr = Array.isArray(answeredIds) ? answeredIds : []
  return [...new Set(arr)].filter((id) => valid.has(id))
}

/**
 * Скільки карток теми вважати «пройденими» для головної / смуги прогресу:
 * беремо max(унікальні вірні, скільки карток уже відкрили по lastIndex), а не topicProgress.studied
 * (його можна завищити після зміни колоди або зайвих інкрементів).
 */
export function getDisplayStudiedForTopicDeck(deck, topicProgressFragment, cardEntry) {
  const total = deck.length
  const studied = topicProgressFragment?.studied ?? 0
  if (!total) {
    return 0
  }

  const studiedClamped = Math.min(studied, total)

  if (!cardEntry) {
    return studiedClamped
  }

  const mastered = filterAnsweredIdsForDeck(cardEntry.answeredIds, deck).length
  const last = cardEntry.lastIndex
  const reached =
    typeof last === 'number' && !Number.isNaN(last)
      ? Math.min(total, Math.max(0, last) + 1)
      : 0

  return Math.min(total, Math.max(mastered, reached))
}
