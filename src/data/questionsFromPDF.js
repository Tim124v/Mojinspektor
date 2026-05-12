// ═══════════════════════════════════════════════
// БЛОК 1: СИМВОЛИ ТА СВЯТА (id 301-315)
// ═══════════════════════════════════════════════

import { governmentQuestions } from './governmentPack50.js'
import { geographyQuestions } from './geographyPack15.js'

export const symbolsQuestions = [
  {
    id: 301,
    topic: "Символи та свята",
    topicSlug: "symbols",
    difficulty: "easy",
    question: "Скільки кольорів у польському прапорі і які вони?",
    options: ["Три: червоний, білий, синій", "Два: білий і червоний", "Три: білий, червоний, зелений", "Два: червоний і синій"],
    correctIndex: 1,
    explanation: "Flaga Polski składa się z dwóch poziomych pasów: białego (górny) i czerwonego (dolny). Два кольори — білий і червоний. Ті самі кольори що і на польському гербі."
  },
  {
    id: 302,
    topic: "Символи та свята",
    topicSlug: "symbols",
    difficulty: "easy",
    question: "Що зображено на польському гербі?",
    options: ["Золотий орел на червоному тлі", "Білий орел з короною на червоному тлі", "Чорний орел на білому тлі", "Двоголовий орел"],
    correctIndex: 1,
    explanation: "Herb Polski — Biały Orzeł w złotej koronie na czerwonym tle. Білий орел — один з найстаріших символів Польщі, відомий з X-XI ст. Зображений на монетах, документах і формі польської збірної."
  },
  {
    id: 303,
    topic: "Символи та свята",
    topicSlug: "symbols",
    difficulty: "medium",
    question: "Які слова перших рядків польського гімну?",
    options: [
      "Boże, coś Polskę przez tak liczne wieki...",
      "Mazurek Dąbrowskiego — 'Jeszcze Polska nie zginęła...'",
      "Rotą — 'Nie rzucim ziemi, skąd nasz ród'",
      "Bogurodzica — перша польська пісня"
    ],
    correctIndex: 1,
    explanation: "Mazurek Dąbrowskiego — Гімн Польщі. Перший рядок: 'Jeszcze Polska nie zginęła, kiedy my żyjemy'. Написаний у 1797 р. Дąbrowskim. Починається з тих самих слів що і гімни інших слов'янських народів."
  },
  {
    id: 304,
    topic: "Символи та свята",
    topicSlug: "symbols",
    difficulty: "easy",
    question: "Коли святкується День Незалежності Польщі?",
    options: ["3 травня", "11 листопада", "1 серпня", "17 вересня"],
    correctIndex: 1,
    explanation: "11 listopada — Narodowe Święto Niepodległości. Відзначає відновлення незалежності Польщі в 1918 р. після 123 років поділів. Державне свято з 1989 р. В Варшаві проходить Марш Незалежності."
  },
  {
    id: 305,
    topic: "Символи та свята",
    topicSlug: "symbols",
    difficulty: "medium",
    question: "Що святкується 3 травня?",
    options: ["День Незалежності", "Święto Konstytucji 3 Maja — річниця першої польської конституції 1791 р.", "День перемоги", "День прапора"],
    correctIndex: 1,
    explanation: "3 maja — Święto Konstytucji 3 Maja. Відзначає ухвалення першої польської Конституції 3 травня 1791 р. Перша конституція в Європі і друга в світі. Державне свято."
  },
  {
    id: 306,
    topic: "Символи та свята",
    topicSlug: "symbols",
    difficulty: "easy",
    question: "Коли в Польщі Різдво (Boże Narodzenie)?",
    options: ["24-25 грудня", "6-7 січня", "31 грудня", "25 листопада"],
    correctIndex: 0,
    explanation: "Boże Narodzenie в Польщі святкується 24 і 25 грудня. Wigilia (Святвечір) — 24 грудня ввечері — найважливіший сімейний вечір року. 25 грудня — перший день Різдва, 26 грудня — другий."
  },
  {
    id: 307,
    topic: "Символи та свята",
    topicSlug: "symbols",
    difficulty: "easy",
    question: "Коли в Польщі Великдень (Wielkanoc)?",
    options: ["Завжди 25 квітня", "Нерухоме свято в березні", "Рухоме свято навесні — неділя після першого повного місяця після 21 березня", "1 травня"],
    correctIndex: 2,
    explanation: "Wielkanoc — рухоме свято. Розраховується як перша неділя після першого повного місяця після весняного рівнодення (21 березня). Найважливіше релігійне свято польських католиків."
  },
  {
    id: 308,
    topic: "Символи та свята",
    topicSlug: "symbols",
    difficulty: "medium",
    question: "Що таке Dzień Flagi Rzeczypospolitej Polskiej?",
    options: ["11 листопада", "2 травня", "3 травня", "1 серпня"],
    correctIndex: 1,
    explanation: "2 maja — Dzień Flagi Rzeczypospolitej Polskiej. Встановлений у 2004 р. В цей день поляки вивішують національні прапори. Наступного дня — 3 травня — свято Конституції."
  },
  {
    id: 309,
    topic: "Символи та свята",
    topicSlug: "symbols",
    difficulty: "easy",
    question: "Коли Польща відзначає Dziady / Dzień Zaduszny?",
    options: ["31 жовтня", "1 та 2 листопада", "11 листопада", "24 грудня"],
    correctIndex: 1,
    explanation: "1 listopada — Wszystkich Świętych, 2 listopada — Dzień Zaduszny (День Задушний). Поляки відвідують кладовища, запалюють znicze (свічки). Дуже важлива традиція."
  },
  {
    id: 310,
    topic: "Символи та свята",
    topicSlug: "symbols",
    difficulty: "medium",
    question: "Що таке Dzień Wojska Polskiego і коли він?",
    options: ["1 вересня", "15 серпня", "11 листопада", "3 травня"],
    correctIndex: 1,
    explanation: "15 sierpnia — Dzień Wojska Polskiego. Відзначає 'Диво на Віслі' — перемогу польської армії над більшовиками у 1920 р. Також збігається з католицьким святом Wniebowzięcia NMP."
  },
  {
    id: 311,
    topic: "Символи та свята",
    topicSlug: "symbols",
    difficulty: "easy",
    question: "Яка офіційна назва Польщі?",
    options: ["Польська Народна Республіка", "Rzeczpospolita Polska — Республіка Польща", "Королівство Польське", "Польська Федерація"],
    correctIndex: 1,
    explanation: "Oficjalna nazwa państwa: Rzeczpospolita Polska (Республіка Польща). Слово 'Rzeczpospolita' — від латинського 'res publica' (спільна справа). У повсякденному вжитку — просто 'Polska'."
  },
  {
    id: 312,
    topic: "Символи та свята",
    topicSlug: "symbols",
    difficulty: "medium",
    question: "Яка валюта Польщі?",
    options: ["Євро", "Злотий (PLN — złoty)", "Форинт", "Крона"],
    correctIndex: 1,
    explanation: "Polska waluta — złoty (PLN). 1 złoty = 100 groszy. Польща є членом ЄС, але не перейшла на євро. Злотий — одна з найстабільніших валют Центральної Європи."
  },
  {
    id: 313,
    topic: "Символи та свята",
    topicSlug: "symbols",
    difficulty: "easy",
    question: "Скільки населення в Польщі?",
    options: ["Близько 20 мільйонів", "Близько 38 мільйонів", "Близько 50 мільйонів", "Близько 25 мільйонів"],
    correctIndex: 1,
    explanation: "Polska liczy około 38 milionów mieszkańców. Польща — шоста за населенням країна ЄС. Після 1989 р. населення поступово скорочується через еміграцію і низьку народжуваність."
  },
  {
    id: 314,
    topic: "Символи та свята",
    topicSlug: "symbols",
    difficulty: "easy",
    question: "Яка столиця Польщі?",
    options: ["Краків", "Познань", "Варшава (Warszawa)", "Лодзь"],
    correctIndex: 2,
    explanation: "Warszawa — stolica i największe miasto Polski. Населення близько 1,8 млн осіб. Розташована на Віслі в центрі Мазовецького воєводства. З 1596 р. — столиця польської держави."
  },
  {
    id: 315,
    topic: "Символи та свята",
    topicSlug: "symbols",
    difficulty: "medium",
    question: "Коли Польща вступила до ЄС?",
    options: ["1 травня 2004 року", "2007 року", "1999 року", "2000 року"],
    correctIndex: 0,
    explanation: "1 maja 2004 — Polska wstąpiła do Unii Europejskiej. Разом з 9 іншими країнами (т.з. Велике Розширення). У 2007 р. Польща увійшла до Шенгенської зони. Членство в ЄС — одне з найважливіших досягнень III Речі Посполитої."
  }
];

// ═══════════════════════════════════════════════
// БЛОК 2: КУЛЬТУРА І ТРАДИЦІЇ (id 401-425)
// ═══════════════════════════════════════════════

export const traditionsQuestions = [
  {
    id: 401,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "easy",
    question: "Яка основна релігія в Польщі?",
    options: ["Православ'я", "Протестантизм", "Католицизм (римо-католицька церква)", "Іслам"],
    correctIndex: 2,
    explanation: "Польща — одна з найбільш католицьких країн Європи. Близько 90% поляків охрещені в католицькій вірі. Костел (kościół) відіграє важливу роль в суспільному і культурному житті."
  },
  {
    id: 402,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "easy",
    question: "Що таке Wigilia і скільки страв подається?",
    options: [
      "Різдвяний ярмарок — без обмежень страв",
      "Святвечір 24 грудня — традиційно 12 пісних страв",
      "Пасхальний вечір — 7 страв",
      "Новорічний вечір — 13 страв"
    ],
    correctIndex: 1,
    explanation: "Wigilia — Святий вечір 24 грудня. Найважливіший сімейний вечір в польській традиції. Традиційно подається 12 пісних страв (без м'яса). Починається з появою першої зірки на небі. Діляться опілком (opłatek)."
  },
  {
    id: 403,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "medium",
    question: "Що таке opłatek і коли ним діляться?",
    options: [
      "Польська різдвяна випічка",
      "Тонкий прісний хліб яким діляться на Wigilia перед вечерею",
      "Польська великодня страва",
      "Карнавальний пиріг"
    ],
    correctIndex: 1,
    explanation: "Opłatek — cienki biały opłatek (прісний хліб). Перед вечерею на Wigilia члени сім'ї діляться опілком, промовляючи побажання. Символізує єдність, прощення і любов в родині."
  },
  {
    id: 404,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "medium",
    question: "Що кладуть під скатертину на Wigilię?",
    options: [
      "Гроші — для багатства",
      "Часник — від злих духів",
      "Сіно (siano) — на спомин про ясла де народився Ісус",
      "Ніж — для захисту"
    ],
    correctIndex: 2,
    explanation: "Pod obrus na Wigilię kładzie się siano — сіно на спомин про ясла в Вифлеємі де народився Ісус Христос. Ця традиція зберігається в більшості польських сімей."
  },
  {
    id: 406,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "medium",
    question: "Що таке Święconka і коли її несуть до костелу?",
    options: [
      "Різдвяний кошик, несуть 24 грудня",
      "Великодній кошик з освяченими продуктами — несуть у Велику Суботу",
      "Кошик з фруктами на Новий рік",
      "Подарунки для дітей від Миколая"
    ],
    correctIndex: 1,
    explanation: "Święconka — koszyk wielkanocny з хлібом, ковбасою, шинкою, яйцями, хріном, сіллю і іншими продуктами. Несуть святити до костелу у Велику Суботу (Wielka Sobota)."
  },
  {
    id: 407,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "easy",
    question: "Що таке Śmigus-Dyngus?",
    options: [
      "Польський різдвяний звичай",
      "Лани понеділок — обливання водою на другий день Великодня",
      "Польський карнавал",
      "Свято врожаю"
    ],
    correctIndex: 1,
    explanation: "Śmigus-Dyngus — Lany Poniedziałek — другий день Великодня коли поляки обливають один одного водою. Давня слов'янська традиція що символізує прихід весни і очищення."
  },
  {
    id: 408,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "medium",
    question: "Що таке Tłusty Czwartek і що їдять?",
    options: [
      "Останній четвер перед Великим постом — їдять пончики (pączki) і хмиз (faworki)",
      "Святковий четвер перед Різдвом",
      "Польське свято восени",
      "День коли їдять м'ясо перед постом"
    ],
    correctIndex: 0,
    explanation: "Tłusty Czwartek — ostatni czwartek przed Wielkim Postem. Поляки масово їдять pączki (пончики з начинкою) і faworki (хмиз). У цей день в Польщі з'їдають мільйони пончиків!"
  },
  {
    id: 409,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "medium",
    question: "Що таке Środa Popielcowa (Popielec)?",
    options: [
      "Середа перед Різдвом",
      "Перший день Великого посту — священик посипає голови вірних попелом",
      "Польське свято вогню",
      "День поминання померлих"
    ],
    correctIndex: 1,
    explanation: "Środa Popielcowa (Попільна середа) — перший день Великого посту. В костелі ksiądz posypuje głowy wiernych popiołem зі словами 'Пам'ятай що ти порох і в порох повернешся'."
  },
  {
    id: 410,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "easy",
    question: "Що роблять поляки 1 листопада (Wszystkich Świętych)?",
    options: [
      "Відзначають Halloween",
      "Ідуть на цвинтар, запалюють свічки (znicze) на могилах і моляться за померлих",
      "Святкують початок зими",
      "Відзначають День незалежності"
    ],
    correctIndex: 1,
    explanation: "1 listopada — Dzień Wszystkich Świętych. Польські родини йдуть на цвинтарі (cmentarze), запалюють свічки-зничі (znicze) і моляться за души померлих. Дуже важлива традиція."
  },
  {
    id: 411,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "medium",
    question: "Що таке Andrzejki?",
    options: [
      "День іменин Анджея",
      "Вечір ворожінь в ніч з 29 на 30 листопада",
      "Польський карнавал у лютому",
      "Різдвяний ярмарок"
    ],
    correctIndex: 1,
    explanation: "Andrzejki — wieczór wróżb в ніч з 29 на 30 листопада. Традиційно дівчата ворожили на майбутнє, зокрема ллючи розплавлений віск через ключ у воду і трактуючи форму тіні."
  },
  {
    id: 412,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "medium",
    question: "Що таке Dożynki?",
    options: [
      "Польський Новий рік",
      "Świętо plonów — свято врожаю після жнив",
      "Свято весни",
      "Польський карнавал"
    ],
    correctIndex: 1,
    explanation: "Dożynki — традиційне польське свято врожаю (zakończenie żniw). Святкується наприкінці серпня. Урочисті ходи з вінком з колосся, народна музика і танці. Збереглося з давніх часів."
  },
  {
    id: 413,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "easy",
    question: "Що таке Marzanna і що з нею роблять?",
    options: [
      "Польська народна пісня",
      "Опудало що символізує зиму — топлять у воді навесні",
      "Польська страва",
      "Різдвяна прикраса"
    ],
    correctIndex: 1,
    explanation: "Marzanna — kukła (опудало) що символізує зиму і смерть. Щороку навесні (21 березня) діти топлять або спалюють Marzannę — символічне вигнання зими і зустріч весни."
  },
  {
    id: 414,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "easy",
    question: "Яку пісню співають поляки на день народження?",
    options: ["Happy Birthday", "Sto lat!", "Wszystkiego najlepszego", "Mazurek"],
    correctIndex: 1,
    explanation: "'Sto lat!' (Сто років!) — традиційна польська пісня яку співають на дні народження, іменинах і урочистостях. Означає побажання прожити сто років."
  },
  {
    id: 415,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "medium",
    question: "Яка традиційна польська різдвяна випічка?",
    options: ["Sernik", "Szarlotka", "Makowiec (маківник)", "Babka"],
    correctIndex: 2,
    explanation: "Makowiec — tradycyjne polskie ciasto bożonarodzeniowe з маковою начинкою. Також традиційними є piernik (медяник), kutia і strucla z makiem."
  },
  {
    id: 416,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "easy",
    question: "Які традиційні польські страви?",
    options: [
      "Паста, піца, суші",
      "Pierogi, bigos, kotlet schabowy, żurek, barszcz czerwony",
      "Гуляш і штрудель",
      "Борщ і вареники (по-українськи)"
    ],
    correctIndex: 1,
    explanation: "Традиційні польські страви: pierogi (начинені тісто), bigos (капуста з м'ясом), kotlet schabowy (відбивна з свинини), żurek (кисло-житній суп), barszcz czerwony з uszkami."
  },
  {
    id: 417,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "medium",
    question: "Які традиційні польські танці?",
    options: [
      "Вальс і танго",
      "Polonez, Mazur, Krakowiak, Oberek, Kujawiak",
      "Полька і мазурка",
      "Козак і гопак"
    ],
    correctIndex: 1,
    explanation: "П'ять національних танців Польщі: Polonez (урочистий), Mazur (швидкий, з Мазовії), Krakowiak (з Кракова), Oberek (найшвидший), Kujawiak (ліричний, з Куяв). Polonez танцюють на балах і studniówkach."
  },
  {
    id: 418,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "easy",
    question: "Що таке Jasna Góra?",
    options: [
      "Гора в Татрах",
      "Санктуарій Матері Божої Ченстоховської в Ченстохові",
      "Польський університет",
      "Замок у Кракові"
    ],
    correctIndex: 1,
    explanation: "Jasna Góra w Częstochowie — najważniejsze sanktuarium maryjne w Polsce i jedno z najważniejszych w Europie. Знаходиться ікона Чорної Мадонни (Czarna Madonna). Місце паломництва мільйонів вірян."
  },
  {
    id: 419,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "medium",
    question: "Що таке Lajkonik?",
    options: [
      "Польська народна пісня",
      "Символ Кракова — постать на коні в татарському вбранні",
      "Різновид польського танцю",
      "Традиційна страва Кракова"
    ],
    correctIndex: 1,
    explanation: "Lajkonik — symbol Krakowa. Постать людини в татарському костюмі на коні. За легендою, символізує перемогу над татарами. Щороку після Corpus Christi Lajkonik проходить вулицями Кракова."
  },
  {
    id: 420,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "hard",
    question: "Що таке WOŚP?",
    options: [
      "Польський телеканал",
      "Wielka Orkiestra Świątecznej Pomocy — благодійний фонд Єжи Овсяка",
      "Польська армія",
      "Державна організація охорони здоров'я"
    ],
    correctIndex: 1,
    explanation: "WOŚP — Wielka Orkiestra Świątecznej Pomocy — największa fundacja charytatywna w Polsce. Щороку в січні проводить фінал збору коштів на медичне обладнання для дітей. Заснована Єжи Овсяком (Jerzy Owsiak)."
  },
  {
    id: 421,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "medium",
    question: "Коли в Польщі День матері і День дитини?",
    options: [
      "День матері — 8 березня, День дитини — 1 вересня",
      "День матері — 26 травня, День дитини — 1 червня",
      "День матері — 14 лютого, День дитини — 1 червня",
      "Обидва — 1 червня"
    ],
    correctIndex: 1,
    explanation: "Dzień Matki — 26 maja (26 травня). Dzień Dziecka — 1 czerwca (1 червня). Обидва свята широко відзначаються в Польщі, особливо в школах і дитячих садках."
  },
  {
    id: 422,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "hard",
    question: "Яке традиційне польське сирне ласощі з Татр?",
    options: ["Bryndza", "Oscypek", "Bundz", "Redykołka"],
    correctIndex: 1,
    explanation: "Oscypek — tradycyjny wędzony ser owczy z Tatr, виготовляється вручну пастухами (bacami). Продукт із захищеним позначенням походження ЄС. Купують як сувенір у Закопаному."
  },
  {
    id: 423,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "easy",
    question: "Де знаходиться Вавель (Wawel)?",
    options: ["У Варшаві", "У Познані", "У Кракові", "У Гданьську"],
    correctIndex: 2,
    explanation: "Wawel — zamek królewski w Krakowie. Резиденція польських королів протягом століть. Місце де поховані польські королі і національні герої. Символ польської державності."
  },
  {
    id: 424,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "medium",
    question: "Як називається найстаріший університет Польщі?",
    options: [
      "Варшавський університет",
      "Ягеллонський університет у Кракові (Uniwersytet Jagielloński)",
      "Університет у Познані",
      "Вроцлавський університет"
    ],
    correctIndex: 1,
    explanation: "Uniwersytet Jagielloński w Krakowie — najstarszy w Polsce, założony w 1364 roku przez króla Kazimierza Wielkiego. Другий за віком університет в Центральній Європі. Тут навчався Коперник."
  },
  {
    id: 425,
    topic: "Культура і традиції",
    topicSlug: "culture",
    difficulty: "easy",
    question: "Яке місто вважається культурною столицею Польщі?",
    options: ["Варшава", "Гданськ", "Краків", "Вроцлав"],
    correctIndex: 2,
    explanation: "Kraków jest często nazywany kulturalną stolicą Polski. Стародавня королівська резиденція, Ягеллонський університет, Вавель, Старе місто — ЮНЕСКО. Щороку приймає мільйони туристів."
  }
];

// ═══════════════════════════════════════════════
// БЛОК 3: ІСТОРІЯ ПОЛЬЩІ (унікальні картки; дублікати з sharedQuestions.js прибрані)
// ═══════════════════════════════════════════════

export const historyQuestions = [
  {
    id: 502,
    topic: "Історія Польщі",
    topicSlug: "history",
    difficulty: "easy",
    question: "Коли відбулося хрещення Польщі?",
    options: ["У 966 році", "У 1025 році", "У 1000 році", "У 863 році"],
    correctIndex: 0,
    explanation: "966 rok — Chrzest Polski. Мешко I прийняв хрещення від Чехії. Ця дата вважається початком польської державності і включенням Польщі в коло європейської цивілізації."
  },
  {
    id: 504,
    topic: "Історія Польщі",
    topicSlug: "history",
    difficulty: "medium",
    question: "Коли відбулася Битва під Ґрюнвальдом і проти кого?",
    options: [
      "1410 рік — перемога над Тевтонським орденом",
      "1410 рік — перемога над монголами",
      "1683 рік — оборона Відня",
      "1569 рік — об'єднання з Литвою"
    ],
    correctIndex: 0,
    explanation: "Bitwa pod Grunwaldem — 15 lipca 1410 roku. Польсько-литовські війська під командуванням Владислава Ягайла розгромили Тевтонський орден. Одна з найбільших битв середньовічної Європи."
  },
  {
    id: 505,
    topic: "Історія Польщі",
    topicSlug: "history",
    difficulty: "medium",
    question: "Що таке Унія Люблінська (Unia Lubelska) 1569 року?",
    options: [
      "Союз Польщі з Росією",
      "Об'єднання Польського Королівства і Великого Князівства Литовського в Річ Посполиту",
      "Мирна угода з Тевтонським орденом",
      "Союз польських міст"
    ],
    correctIndex: 1,
    explanation: "Unia Lubelska (1569) — połączenie Królestwa Polskiego i Wielkiego Księstwa Litewskiego w Rzeczpospolitą Obojga Narodów. Одна з найбільших держав Європи того часу."
  },
  {
    id: 506,
    topic: "Історія Польщі",
    topicSlug: "history",
    difficulty: "hard",
    question: "Що таке Конституція 3 травня 1791 року і чому вона важлива?",
    options: [
      "Конституція яка оголосила незалежність від Росії",
      "Перша конституція в Європі і друга в світі — прогресивний документ про устрій держави",
      "Конституція після Другої світової війни",
      "Перша польська конституція комуністичного типу"
    ],
    correctIndex: 1,
    explanation: "Konstytucja 3 Maja 1791 — перша конституція в Європі і друга в світі (після США 1787 р.). Прогресивний документ: розподіл влади, права громадян. Ухвалена під час правління Станіслава Августа Понятовського."
  },
  {
    id: 507,
    topic: "Історія Польщі",
    topicSlug: "history",
    difficulty: "medium",
    question: "Скільки поділів Польщі було і якими державами?",
    options: [
      "Два поділи — Росія і Пруссія",
      "Три поділи (1772, 1793, 1795) — Росія, Пруссія і Австрія",
      "Чотири поділи — Росія, Пруссія, Австрія і Швеція",
      "Один поділ у 1795 році"
    ],
    correctIndex: 1,
    explanation: "Trzy rozbiory Polski: 1772, 1793 і 1795 рр. Між Росією (Rosja), Пруссією (Prusy) і Австрією (Austria). Польща зникла з карти Європи на 123 роки — до 1918 року."
  },
  {
    id: 508,
    topic: "Історія Польщі",
    topicSlug: "history",
    difficulty: "medium",
    question: "Коли Польща відновила незалежність і хто очолив державу?",
    options: [
      "1918 рік — Юзеф Пілсудський",
      "1920 рік — Роман Дмовський",
      "1921 рік — Вінценти Вітос",
      "1917 рік — Ігнаций Падеревський"
    ],
    correctIndex: 0,
    explanation: "11 листопада 1918 — Polska odzyskała niepodległość. Маршал Юзеф Пілсудський (Marszałek Józef Piłsudski) став фактичним главою відродженої Польської держави — II Речі Посполитої."
  },
  {
    id: 509,
    topic: "Історія Польщі",
    topicSlug: "history",
    difficulty: "hard",
    question: "Що таке 'Диво на Віслі' (Cud nad Wisłą)?",
    options: [
      "Будівництво моста через Віслу",
      "Перемога польської армії над більшовиками під Варшавою в серпні 1920 р.",
      "Повінь на Віслі у 1934 році",
      "Переправа польської армії через Віслу у 1939 р."
    ],
    correctIndex: 1,
    explanation: "Cud nad Wisłą — Bitwa Warszawska, серпень 1920 р. Польська армія під командуванням Пілсудського розгромила більшовицьку армію яка рвалась до Берліну. На честь перемоги — Dzień Wojska Polskiego 15 серпня."
  },
  {
    id: 510,
    topic: "Історія Польщі",
    topicSlug: "history",
    difficulty: "easy",
    question: "Коли розпочалася Друга світова війна нападом на Польщу?",
    options: ["1 вересня 1939 року — Німеччина напала на Польщу", "3 вересня 1939 р.", "17 вересня 1939 р.", "1 серпня 1939 р."],
    correctIndex: 0,
    explanation: "1 września 1939 roku Niemcy napadły na Polskę — початок Другої світової. Символом опору став гарнізон Вестерплятте (Westerplatte) в Гданьську. 17 вересня з сходу напав СРСР."
  },
  {
    id: 511,
    topic: "Історія Польщі",
    topicSlug: "history",
    difficulty: "hard",
    question: "Що таке Катинська трагедія (Zbrodnia Katyńska)?",
    options: [
      "Польський концтабір часів ПСВ",
      "Масове вбивство польських офіцерів і інтелігенції НКВС у 1940 р.",
      "Нацистський злочин у Польщі",
      "Польська битва у 1939 р."
    ],
    correctIndex: 1,
    explanation: "Zbrodnia Katyńska — масове вбивство близько 22 000 польських офіцерів, поліцейських і інтелігенції радянським НКВС навесні 1940 р. Радянський Союз визнав відповідальність лише у 1990 р."
  },
  {
    id: 512,
    topic: "Історія Польщі",
    topicSlug: "history",
    difficulty: "medium",
    question: "Що таке Powstanie Warszawskie і коли воно відбулось?",
    options: [
      "Варшавське повстання проти росіян у 1831 р.",
      "Збройне повстання проти нацистської окупації у Варшаві 1944 р. — 1 серпня — 2 жовтня",
      "Єврейське повстання у Варшавському гетто 1943 р.",
      "Польське повстання у 1830-1831 рр."
    ],
    correctIndex: 1,
    explanation: "Powstanie Warszawskie — 1 серпня — 2 жовтня 1944 р. Збройне повстання Армії Крайової (AK) проти нацистської окупації Варшави. Загинуло близько 200 000 мирних жителів. 1 серпня — Dzień Pamięci."
  },
  {
    id: 514,
    topic: "Історія Польщі",
    topicSlug: "history",
    difficulty: "hard",
    question: "Що таке Okrągły Stół (1989)?",
    options: [
      "Польський парламент",
      "Переговори між комуністичним урядом і Солідарністю що призвели до демократичних виборів",
      "Міжнародна конференція про Польщу",
      "Польський суд"
    ],
    correctIndex: 1,
    explanation: "Okrągły Stół — переговори лютий-квітень 1989 р. між владою і опозицією (Солідарністю). Результат: вільні вибори до Сейму 4 червня 1989 р. Початок мирного переходу від комунізму до демократії."
  },
  {
    id: 517,
    topic: "Історія Польщі",
    topicSlug: "history",
    difficulty: "medium",
    question: "Що сталося 10 квітня 2010 року під Смоленськом?",
    options: [
      "Польсько-російські переговори",
      "Авіакатастрофа — загинуло 96 осіб включно з Президентом Лехом Качинським",
      "Польська делегація відвідала Катинь",
      "Підписання польсько-російського договору"
    ],
    correctIndex: 1,
    explanation: "10 kwietnia 2010 — katastrofa lotnicza pod Smoleńskiem. Польська делегація летіла на жалобні заходи з нагоди 70-річчя Катинської трагедії. Загинуло 96 осіб включаючи Президента Леха Качинського і його дружину."
  },
  {
    id: 518,
    topic: "Історія Польщі",
    topicSlug: "history",
    difficulty: "medium",
    question: "Хто такий Казимир Великий і що він зробив для Польщі?",
    options: [
      "Засновник Польщі",
      "Король який 'застав Польщу дерев'яною а залишив кам'яною' — побудував міста і замки",
      "Польський король що підписав Люблінську унію",
      "Останній король Польщі"
    ],
    correctIndex: 1,
    explanation: "Kazimierz Wielki (1310-1370) — найвидатніший польський король. Про нього кажуть: 'Zastał Polskę drewnianą, a zostawił murowaną'. Заснував Ягеллонський університет (1364), побудував 53 замки, реформував право."
  },
  {
    id: 519,
    topic: "Історія Польщі",
    topicSlug: "history",
    difficulty: "medium",
    question: "Що таке Різня Волинська (Rzeź Wołyńska) і коли вона відбулась?",
    options: [
      "Польсько-радянська битва на Волині у 1920 р.",
      "Масові вбивства польського населення Волині і Галичини у 1943-1945 рр. здійснені УПА",
      "Польська військова операція проти партизанів",
      "Голодомор на польській Волині"
    ],
    correctIndex: 1,
    explanation: "Rzeź Wołyńska — масові злочини проти польського цивільного населення на Волині і в Галичині у 1943-1945 рр. За даними істориків загинуло близько 100 тисяч поляків. Польський Сейм визнав їх геноцидом. 11 липня — Narodowy Dzień Pamięci Ofiar Ludobójstwa na Wołyniu."
  },
  {
    id: 520,
    topic: "Історія Польщі",
    topicSlug: "history",
    difficulty: "hard",
    question: "Хто такий Єжи Попєлушко (Jerzy Popiełuszko)?",
    options: [
      "Польський президент",
      "Ксьондз і капелан Солідарності, вбитий комуністичною держбезпекою у 1984 р.",
      "Польський генерал",
      "Лідер Солідарності"
    ],
    correctIndex: 1,
    explanation: "Jerzy Popiełuszko — ksiądz i kapelan Solidarności. Його проповіді надихали опозицію. У жовтні 1984 р. вбитий офіцерами комуністичної держбезпеки (SB). Беатифікований у 2010 р. Символ опору комунізму."
  }
];

// ═══════════════════════════════════════════════
// БЛОК 5: ВІДОМІ ПОЛЯКИ (id 701-712)
// ═══════════════════════════════════════════════

export const famousPolesQuestions = [
  {
    id: 701,
    topic: "Відомі поляки",
    topicSlug: "history",
    difficulty: "easy",
    question: "Ким був Микола Коперник (Mikołaj Kopernik)?",
    options: ["Польський поет", "Великий астроном — 'зупинив Сонце, зрушив Землю'", "Польський король", "Польський генерал"],
    correctIndex: 1,
    explanation: "Mikołaj Kopernik (1473-1543) — wielki astronom. Створив геліоцентричну модель сонячної системи. Про нього кажуть: 'wstrzymał Słońce, wzruszył Ziemię'. Народився у Торуні. Навчався в Кракові."
  },
  {
    id: 702,
    topic: "Відомі поляки",
    topicSlug: "history",
    difficulty: "easy",
    question: "Ким був Іван Павло II (Jan Paweł II)?",
    options: [
      "Польський президент",
      "Польський папа — Кароль Войтила, понтифік 1978-2005 рр.",
      "Польський кардинал у Варшаві",
      "Польський святий середньовіччя"
    ],
    correctIndex: 1,
    explanation: "Jan Paweł II — Karol Wojtyła z Wadowic. Перший польський папа, обраний 16 жовтня 1978 р. Канонізований у 2014 р. Вважається національним героєм — надихнув Солідарність і падіння комунізму."
  },
  {
    id: 703,
    topic: "Відомі поляки",
    topicSlug: "history",
    difficulty: "easy",
    question: "Ким була Марія Складовська-Кюрі (Maria Skłodowska-Curie)?",
    options: [
      "Польська поетка",
      "Фізик і хімік — єдина людина яка отримала дві Нобелівські премії в різних науках",
      "Польська художниця",
      "Польська медик"
    ],
    correctIndex: 1,
    explanation: "Maria Skłodowska-Curie (1867-1934) — fizykiem i chemikiem. Отримала Нобелівську премію з фізики (1903) і хімії (1911). Відкрила полоній і радій. Народилась у Варшаві, працювала в Парижі."
  },
  {
    id: 704,
    topic: "Відомі поляки",
    topicSlug: "history",
    difficulty: "easy",
    question: "Ким був Фредерік Шопен (Fryderyk Chopin)?",
    options: ["Польський поет", "Видатний композитор і піаніст — символ польської музики", "Польський художник", "Польський скрипаль"],
    correctIndex: 1,
    explanation: "Fryderyk Chopin (1810-1849) — wybitny kompozytor i pianista. Один з найбільших романтичних композиторів. Народився поблизу Варшави, більшість життя провів у Парижі. Серце поховане у Варшаві."
  },
  {
    id: 705,
    topic: "Відомі поляки",
    topicSlug: "history",
    difficulty: "easy",
    question: "Ким був Адам Міцкевич (Adam Mickiewicz)?",
    options: [
      "Польський президент XIX ст.",
      "Найбільший польський національний поет — автор 'Пана Тадеуша'",
      "Польський генерал",
      "Польський філософ"
    ],
    correctIndex: 1,
    explanation: "Adam Mickiewicz (1798-1855) — największy polski poeta narodowy. Автор 'Pan Tadeusz' (1834) — польського національного епосу. Також 'Dziady', 'Konrad Wallenrod'. Народився в Новогрудку (тепер Білорусь)."
  },
  {
    id: 706,
    topic: "Відомі поляки",
    topicSlug: "history",
    difficulty: "medium",
    question: "Ким був Юзеф Пілсудський (Józef Piłsudski)?",
    options: [
      "Перший президент Польщі",
      "Маршал Польщі — творець Легіонів, відновив незалежність, 'батько незалежності'",
      "Польський кардинал",
      "Лідер Солідарності"
    ],
    correctIndex: 1,
    explanation: "Józef Piłsudski (1867-1935) — Marszałek Polski. Творець польських Легіонів під час ПСВ. Фактичний голова держави після 1918 р. Переміг більшовиків у 1920 р. Провів державний переворот 1926 р. (zamach majowy)."
  },
  {
    id: 707,
    topic: "Відомі поляки",
    topicSlug: "history",
    difficulty: "medium",
    question: "Ким був Лех Валенса (Lech Wałęsa)?",
    options: [
      "Польський кінорежисер",
      "Лідер Солідарності, Нобелівська премія миру, Президент Польщі 1990-1995",
      "Польський письменник",
      "Польський генерал"
    ],
    correctIndex: 1,
    explanation: "Lech Wałęsa — elektryk z Stoczni Gdańskiej, przywódca Solidarności. Нобелівська премія миру 1983 р. Президент Польщі 1990-1995 рр. Символ боротьби проти комунізму."
  },
  {
    id: 708,
    topic: "Відомі поляки",
    topicSlug: "history",
    difficulty: "medium",
    question: "Хто отримав Нобелівську премію з літератури від Польщі у 2018 році?",
    options: ["Віслава Шимборська", "Чеслав Мілош", "Ольга Токарчук", "Генрік Сенкевич"],
    correctIndex: 2,
    explanation: "Olga Tokarczuk — otrzymała Nagrodę Nobla w dziedzinie literatury w 2018 roku (ogłoszono w 2019). Авторка 'Bieguni' і 'Ksiąg Jakubowych'. Одна з найвидатніших сучасних польських письменниць."
  },
  {
    id: 709,
    topic: "Відомі поляки",
    topicSlug: "history",
    difficulty: "medium",
    question: "Хто така Іга Свьонтек (Iga Świątek)?",
    options: [
      "Польська плавчиня",
      "Польська тенісистка, №1 у світовому рейтингу",
      "Польська акторка",
      "Польська легкоатлетка"
    ],
    correctIndex: 1,
    explanation: "Iga Świątek — polska tenisistka, wielokrotnie zajmowała 1. miejsce w rankingu WTA. Переможниця кількох турнірів Великого Шолома. Символ польського спорту 2020-х років."
  },
  {
    id: 710,
    topic: "Відомі поляки",
    topicSlug: "history",
    difficulty: "medium",
    question: "Ким був Роберт Льовандовський (Robert Lewandowski)?",
    options: ["Польський тренер", "Найвідоміший польський футболіст", "Польський хокеїст", "Польський легкоатлет"],
    correctIndex: 1,
    explanation: "Robert Lewandowski — najsłynniejszy polski piłkarz. Грав за Bayern München і Barcelona. Найкращий бомбардир Ліги чемпіонів у багатьох сезонах. Гордість польського спорту."
  },
  {
    id: 711,
    topic: "Відомі поляки",
    topicSlug: "history",
    difficulty: "hard",
    question: "Ким був Тадеуш Костюшко (Tadeusz Kościuszko)?",
    options: [
      "Польський поет",
      "Генерал — народний герой Польщі і США, керував повстанням 1794 р.",
      "Польський король",
      "Польський кардинал"
    ],
    correctIndex: 1,
    explanation: "Tadeusz Kościuszko (1746-1817) — generał, bohater narodowy Polski i USA. Воював за незалежність США разом з Вашингтоном. Очолив польське повстання 1794 р. проти поділів. Символ боротьби за свободу."
  }
];

export const allNewQuestions = [
  ...symbolsQuestions,
  ...traditionsQuestions,
  ...historyQuestions,
  ...governmentQuestions,
  ...famousPolesQuestions,
  ...geographyQuestions
];
