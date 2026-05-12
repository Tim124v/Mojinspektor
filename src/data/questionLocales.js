import autoTranslations from './autoQuestionTranslations.json'

const TOPIC_TRANSLATIONS = {
  'Символи та свята': {
    pl: 'Symbole i święta',
  },
  'Культура і традиції': {
    pl: 'Kultura i tradycje',
  },
  'Історія Польщі': {
    pl: 'Historia Polski',
  },
  'Державний устрій': {
    pl: 'Ustrój państwowy',
  },
  'Географія Польщі': {
    pl: 'Geografia Polski',
  },
  'Відомі поляки': {
    pl: 'Znani Polacy',
  },
  'Польська мова (базова)': {
    pl: 'Język polski',
  },
  'Польська мова': {
    pl: 'Język polski',
  },
  'Польська політика': {
    pl: 'Polityka polska',
  },
  'Складні питання інспектора': {
    pl: 'Trudne pytania inspektora',
  },
  'Відомі поляки — живі': {
    pl: 'Znani Polacy — żyjący',
  },
  'Відомі поляки — історія': {
    pl: 'Znani Polacy — historia',
  },
}

const QUESTION_TRANSLATIONS = {
  'Як виглядає польський герб?': {
    pl: 'Jak wygląda polski herb?',
  },
  'Які кольори прапора Польщі?': {
    pl: 'Jakie są kolory flagi Polski?',
  },
  'Як офіційно називається Польща?': {
    pl: 'Jak oficjalnie nazywa się Polska?',
  },
  'Як називається гімн Польщі?': {
    pl: 'Jak nazywa się hymn Polski?',
  },
  'Коли відзначається Національне свято Незалежності?': {
    pl: 'Kiedy obchodzony jest Narodowe Święto Niepodległości?',
  },
  'Що таке Wigilia?': {
    pl: 'Co to jest Wigilia?',
  },
  'Що таке Śmigus-Dyngus?': {
    pl: 'Co to jest Śmigus-Dyngus?',
  },
  'Яку пісню співають поляки на день народження?': {
    pl: 'Jaką piosenkę śpiewają Polacy na urodziny?',
  },
  'Коли Польща відновила незалежність?': {
    pl: 'Kiedy Polska odzyskała niepodległość?',
  },
  'Хто був першим правителем Польщі?': {
    pl: 'Kto był pierwszym władcą Polski?',
  },
  "Що таке 'Диво на Віслі'?": {
    pl: "Co to jest 'Cud nad Wisłą'?",
  },
  'Коли розпочалася Друга світова?': {
    pl: 'Kiedy rozpoczęła się II Wojna Światowa?',
  },
  'Що таке Solidarność?': {
    pl: 'Co to jest Solidarność?',
  },
  'Коли в Польщі впав комунізм?': {
    pl: 'Kiedy w Polsce upadł komunizm?',
  },
  'Ким був Микола Коперник?': {
    pl: 'Kim był Mikołaj Kopernik?',
  },
  'Ким був Іван Павло II?': {
    pl: 'Kim był Jan Paweł II?',
  },
  'Ким була Марія Складовська-Кюрі?': {
    pl: 'Kim była Maria Skłodowska-Curie?',
  },
  'Ким був Фредерік Шопен?': {
    pl: 'Kim był Fryderyk Chopin?',
  },
  'Ким був Адам Міцкевич?': {
    pl: 'Kim był Adam Mickiewicz?',
  },
  'Ким був Лех Валенса?': {
    pl: 'Kim był Lech Wałęsa?',
  },
  'Скільки депутатів у Сеймі?': {
    pl: 'Ilu posłów zasiada w Sejmie?',
  },
  'Скільки воєводств у Польщі?': {
    pl: 'Ile województw jest w Polsce?',
  },
  'На який термін обирається Президент?': {
    pl: 'Na jaką kadencję wybierany jest Prezydent?',
  },
  'Скільки кольорів у польському прапорі і які вони?': {
    pl: 'Ile kolorów ma polska flaga i jakie to kolory?',
  },
  'Що зображено на польському гербі?': {
    pl: 'Co przedstawia polski herb?',
  },
  'Які слова перших рядків польського гімну?': {
    pl: 'Jak brzmią pierwsze słowa polskiego hymnu?',
  },
  'Коли святкується День Незалежності Польщі?': {
    pl: 'Kiedy obchodzone jest Święto Niepodległości Polski?',
  },
  'Що святкується 3 травня?': {
    pl: 'Co się świętuje 3 maja?',
  },
  'Коли в Польщі Різдво (Boże Narodzenie)?': {
    pl: 'Kiedy w Polsce obchodzi się Boże Narodzenie?',
  },
  'Коли в Польщі Великдень (Wielkanoc)?': {
    pl: 'Kiedy w Polsce przypada Wielkanoc?',
  },
  'Що таке Dzień Flagi Rzeczypospolitej Polskiej?': {
    pl: 'Co to jest Dzień Flagi Rzeczypospolitej Polskiej?',
  },
  'Коли Польща відзначає Dziady / Dzień Zaduszny?': {
    pl: 'Kiedy Polska obchodzi Dziady / Dzień Zaduszny?',
  },
  'Що таке Dzień Wojska Polskiego і коли він?': {
    pl: 'Co to jest Dzień Wojska Polskiego i kiedy przypada?',
  },
  'Яка офіційна назва Польщі?': {
    pl: 'Jaka jest oficjalna nazwa Polski?',
  },
  'Яка валюта Польщі?': {
    pl: 'Jaka jest waluta Polski?',
  },
  'Скільки населення в Польщі?': {
    pl: 'Ile ludności ma Polska?',
  },
  'Яка столиця Польщі?': {
    pl: 'Jaka jest stolica Polski?',
  },
  'Коли Польща вступила до ЄС?': {
    pl: 'Kiedy Polska wstąpiła do UE?',
  },
}

export function enrichQuestionsWithLocales(questions) {
  const resolveTranslated = (text, lang, manualMap) => {
    if (text == null || text === '') return undefined
    if (manualMap?.[lang]) return manualMap[lang]
    if (autoTranslations?.[text]?.[lang]) return autoTranslations[text][lang]
    return undefined
  }

  const translateOptions = (options, lang) => {
    if (!Array.isArray(options)) return undefined
    const mapped = options.map((opt) => resolveTranslated(opt, lang, {}))
    if (mapped.some((x) => x === undefined)) return undefined
    return mapped
  }

  return questions.map((q) => {
    if (!q) return q

    const topicTranslation = TOPIC_TRANSLATIONS[q.topic] || {}
    const questionTranslation = QUESTION_TRANSLATIONS[q.question] || {}

    const topic_pl = q.topic_pl ?? resolveTranslated(q.topic, 'pl', topicTranslation)
    const question_pl =
      q.question_pl ??
      questionTranslation.pl ??
      autoTranslations?.[q.question]?.pl
    const options_pl = q.options_pl ?? translateOptions(q.options, 'pl')
    const explanation_pl = q.explanation_pl ?? resolveTranslated(q.explanation, 'pl', {})

    return {
      ...q,
      ...(topic_pl != null ? { topic_pl } : {}),
      ...(question_pl != null ? { question_pl } : {}),
      ...(options_pl != null ? { options_pl } : {}),
      ...(explanation_pl != null ? { explanation_pl } : {}),
    }
  })
}

