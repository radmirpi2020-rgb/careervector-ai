import type { QuizQuestion } from '../types';

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1_data',
    scenario: 'Вы пришли в проект, где накопился ворох сырых данных о поведении пользователей, и никто не знает, что с ними делать.',
    options: [
      { id: 'a', text: 'Сначала построю модель данных: выявлю закономерности и численно проверю гипотезы', riasec: { investigative: 2, realistic: 1 }, prefs: { ambiguityTolerance: 0.15 } },
      { id: 'b', text: 'Пойду поговорю с пользователями и коллегами — что для них важно и как они используют продукт', riasec: { social: 2 }, prefs: { peopleInteractionLoad: 0.2 } },
      { id: 'c', text: 'Быстро соберу прототип отчёта и покажу рынку/команде, а уже по реакции пойму, что ценно', riasec: { enterprising: 2, investigative: 1 }, prefs: { ambiguityTolerance: 0.2, autonomyPreference: 0.1 } },
      { id: 'd', text: 'Оформлю регламент: кто, как и когда обновляет данные, и стандарт отчётности', riasec: { conventional: 2 }, prefs: { autonomyPreference: -0.15 } },
      { id: 'e', text: 'Придумаю нестандартный формат презентации этих данных — так, чтобы их заметили', riasec: { artistic: 2 }, prefs: { ambiguityTolerance: 0.1 } }
    ]
  },
  {
    id: 'q2_crisis',
    scenario: 'За неделю до релиза выясняется, что половина запланированного не готова. Ваш первый шаг?',
    options: [
      { id: 'a', text: 'Разберу, что конкретно не готово, оценю риски и пересоберу план с новыми приоритетами', riasec: { investigative: 2, conventional: 1 }, prefs: { ambiguityTolerance: 0.1 } },
      { id: 'b', text: 'Соберу команду, распределю задачи по силам и буду координировать в ежедневном режиме', riasec: { enterprising: 2, social: 1 }, prefs: { peopleInteractionLoad: 0.25 } },
      { id: 'c', text: 'Сяду и сам доделаю критичный кусок — надёжнее, чем ждать других', riasec: { realistic: 2 }, prefs: { autonomyPreference: 0.1 } },
      { id: 'd', text: 'Договорюсь с заказчиком о переносе части объёма на следующий релиз', riasec: { social: 2, enterprising: 1 }, prefs: { peopleInteractionLoad: 0.15 } },
      { id: 'e', text: 'Строго зафиксирую оставшийся скоуп в плане и буду действовать по нему шаг за шагом', riasec: { conventional: 2 }, prefs: { ambiguityTolerance: -0.1 } }
    ]
  },
  {
    id: 'q3_routine',
    scenario: 'Вам регулярно достаются однотипные задачи. Что вы делаете с ними?',
    options: [
      { id: 'a', text: 'Автоматизирую: скрипт/шаблон/инструмент, чтобы задача делалась сама', riasec: { realistic: 2, investigative: 1 }, prefs: { autonomyPreference: 0.15 } },
      { id: 'b', text: 'Предложу пересмотреть процесс: может, такие задачи вообще можно убрать из работы', riasec: { enterprising: 2, conventional: 1 } },
      { id: 'c', text: 'Буду аккуратно выполнять по инструкции — стабильность важнее новизны', riasec: { conventional: 2 }, prefs: { ambiguityTolerance: -0.1, autonomyPreference: -0.1 } },
      { id: 'd', text: 'Придумаю, как сделать эту рутину интереснее и полезнее для других', riasec: { artistic: 2, social: 1 }, prefs: { ambiguityTolerance: 0.1 } },
      { id: 'e', text: 'Обсужу с командой, как распределить рутину справедливо', riasec: { social: 2 }, prefs: { peopleInteractionLoad: 0.15 } }
    ]
  },
  {
    id: 'q4_ambiguity',
    scenario: 'Руководитель ставит задачу без ТЗ: «Сделай что-нибудь с этим направлением, видно, что у нас там проседает». Ваша реакция?',
    options: [
      { id: 'a', text: 'Мне нравится свобода — я сам разберусь, что проседает, и предложу решение', riasec: { investigative: 2, enterprising: 1 }, prefs: { ambiguityTolerance: 0.25, autonomyPreference: 0.2 } },
      { id: 'b', text: 'Попрошу уточнить границы, цели и критерии успеха, прежде чем начинать', riasec: { conventional: 2, investigative: 1 }, prefs: { ambiguityTolerance: -0.2 } },
      { id: 'c', text: 'Соберу фокус-группу и интервью, чтобы понять проблему глазами пользователей', riasec: { social: 2 }, prefs: { peopleInteractionLoad: 0.2, ambiguityTolerance: 0.1 } },
      { id: 'd', text: 'Сделаю несколько быстрых вариантов «на вкус» и покажу на выбор', riasec: { artistic: 2, enterprising: 1 }, prefs: { ambiguityTolerance: 0.2 } },
      { id: 'e', text: 'Сяду и методично изучу все данные по направлению, прежде чем что-то предлагать', riasec: { realistic: 2, investigative: 1 }, prefs: { ambiguityTolerance: -0.1 } }
    ]
  },
  {
    id: 'q5_conflict',
    scenario: 'Два сильных специалиста в команде конфликтуют из-за архитектурного решения, и это блокирует работу.',
    options: [
      { id: 'a', text: 'Организую встречу, где каждый аргументирует позицию, и сведу спор к фактам и метрикам', riasec: { investigative: 2, social: 1 }, prefs: { peopleInteractionLoad: 0.2 } },
      { id: 'b', text: 'Проведу фасилитацию и помогу им самим найти решение — моя роль не судить, а направлять', riasec: { social: 2 }, prefs: { peopleInteractionLoad: 0.2 } },
      { id: 'c', text: 'Приму решение сам и чётко объясню, почему — дедлайн не ждёт', riasec: { enterprising: 2 }, prefs: { autonomyPreference: 0.1 } },
      { id: 'd', text: 'Предложу нестандартный компромисс: прототипировать оба варианта и решить по результатам', riasec: { artistic: 2, investigative: 1 }, prefs: { ambiguityTolerance: 0.15 } },
      { id: 'e', text: 'Зафиксирую регламент принятия решений, чтобы такие споры больше не блокировали работу', riasec: { conventional: 2 }, prefs: { autonomyPreference: -0.1 } }
    ]
  },
  {
    id: 'q6_idea',
    scenario: 'У вас появилась идея продукта, которая может выстрелить. Что делаете дальше?',
    options: [
      { id: 'a', text: 'Напишу бизнес-план: расчёты, каналы, юнит-экономика — и оценю реалистичность', riasec: { enterprising: 2, conventional: 1 } },
      { id: 'b', text: 'Сделаю минимальный прототип и покажу живым людям, а не бумаге', riasec: { realistic: 2, enterprising: 1 }, prefs: { ambiguityTolerance: 0.2 } },
      { id: 'c', text: 'Проведу опрос/интервью с потенциальными клиентами — важно услышать спрос', riasec: { social: 2 }, prefs: { peopleInteractionLoad: 0.2 } },
      { id: 'd', text: 'Поищу исследования рынка и конкурентов, чтобы понять, где точка входа', riasec: { investigative: 2 }, prefs: { ambiguityTolerance: -0.1 } },
      { id: 'e', text: 'Придумаю креативную упаковку и историю бренда — она решает', riasec: { artistic: 2 } }
    ]
  },
  {
    id: 'q7_help',
    scenario: 'Новичок в команде снова и снова задаёт вопросы, которые вам кажутся очевидными. Что вы чувствуете и делаете?',
    options: [
      { id: 'a', text: 'Терпеливо объясняю и записываю ответы в базу знаний — потом всем будет проще', riasec: { social: 2, conventional: 1 }, prefs: { peopleInteractionLoad: 0.15 } },
      { id: 'b', text: 'Показываю, как самому найти ответ: инструменты, документация, логика поиска', riasec: { investigative: 2, realistic: 1 }, prefs: { peopleInteractionLoad: 0.1 } },
      { id: 'c', text: 'Беру новичка под крыло: регулярные созвоны, разборы задач, честный фидбек', riasec: { social: 2 }, prefs: { peopleInteractionLoad: 0.2 } },
      { id: 'd', text: 'Договариваюсь, что вопросы копим и разбираем пачкой в одно время — иначе работа не идёт', riasec: { conventional: 2 }, prefs: { peopleInteractionLoad: -0.15 } },
      { id: 'e', text: 'Мне это сложно — я предпочитаю работать с теми, кто уже на одном уровне со мной', riasec: { realistic: 2 }, prefs: { peopleInteractionLoad: -0.25, autonomyPreference: 0.15 } }
    ]
  },
  {
    id: 'q8_hands_on',
    scenario: 'На тестовом стенде всё сломалось, и никто не знает почему. Доставка результата — завтра.',
    options: [
      { id: 'a', text: 'Беру отвёртку/терминал/логи и разбираюсь руками, пока не заработает', riasec: { realistic: 2, investigative: 1 } },
      { id: 'b', text: 'Зову всех, кто хоть что-то знает об этом стенде, и разбираемся вместе в режиме моба', riasec: { social: 2 }, prefs: { peopleInteractionLoad: 0.2 } },
      { id: 'c', text: 'Аккуратно фиксирую изменения, чтобы понять, что именно сломало систему', riasec: { conventional: 2, investigative: 1 } },
      { id: 'd', text: 'Быстро ищу обходной путь — сейчас важнее результат, чем причина', riasec: { enterprising: 2 }, prefs: { ambiguityTolerance: 0.1 } },
      { id: 'e', text: 'Соберу команду экспертов и проведу мозговой штурм с нестандартными идеями', riasec: { artistic: 2, enterprising: 1 }, prefs: { peopleInteractionLoad: 0.1 } }
    ]
  },
  {
    id: 'q9_sell',
    scenario: 'Вам нужно убедить совет директоров выделить бюджет на проект, в который вы верите, но данные по нему пока слабые.',
    options: [
      { id: 'a', text: 'Соберу все доступные цифры, посчитаю ROI и подготовлю безупречную презентацию', riasec: { enterprising: 2, investigative: 1 } },
      { id: 'b', text: 'Заранее переговорю с каждым влиятельным лицом индивидуально и сниму возражения', riasec: { social: 2, enterprising: 1 }, prefs: { peopleInteractionLoad: 0.2 } },
      { id: 'c', text: 'Сделаю красивую историю и визуализацию — решения принимаются эмоциями', riasec: { artistic: 2, enterprising: 1 } },
      { id: 'd', text: 'Сначала докажу гипотезу на малом пилоте, а потом пойду с результатами', riasec: { realistic: 2 }, prefs: { ambiguityTolerance: 0.15 } },
      { id: 'e', text: 'Подготовлю подробный план-график с этапами, бюджетами и контрольными точками', riasec: { conventional: 2 }, prefs: { ambiguityTolerance: -0.1 } }
    ]
  },
  {
    id: 'q10_process',
    scenario: 'Ваш отдел утонул в хаосе: задачи теряются, встречи безрезультатны. Кто-то должен навести порядок.',
    options: [
      { id: 'a', text: 'Введу лёгкий процесс: бэклог, приоритеты, регулярные синки — и буду его вести', riasec: { conventional: 2, enterprising: 1 }, prefs: { autonomyPreference: -0.1 } },
      { id: 'b', text: 'Проведу ретро и вместе с командой придумаем процесс, под который все готовы жить', riasec: { social: 2 }, prefs: { peopleInteractionLoad: 0.2 } },
      { id: 'c', text: 'Автоматизирую трекинг задач и напоминания, чтобы процесс вёл инструмент, а не человек', riasec: { realistic: 2 }, prefs: { autonomyPreference: 0.1 } },
      { id: 'd', text: 'Посмотрю на данные: где реально теряются задачи и время, и нацелюсь туда', riasec: { investigative: 2 }, prefs: { ambiguityTolerance: 0.1 } },
      { id: 'e', text: 'Предложу полностью пересобрать формат работы — по-новому и красиво', riasec: { artistic: 2 } }
    ]
  },
  {
    id: 'q11_autonomy',
    scenario: 'Вы отлично умеете делать X, но в компании внедряют строгие регламенты, которые ограничивают вашу свободу действий.',
    options: [
      { id: 'a', text: 'Регламенты напрягают — я лучше уйду в среду с большей свободой (или создам её сам)', riasec: { enterprising: 2, artistic: 1 }, prefs: { autonomyPreference: 0.3, ambiguityTolerance: 0.1 } },
      { id: 'b', text: 'Приму правила и найду, как в них делать качественно — стабильность дороже', riasec: { conventional: 2 }, prefs: { autonomyPreference: -0.25 } },
      { id: 'c', text: 'Попробую договориться об исключениях там, где регламент реально мешает делу', riasec: { social: 2, enterprising: 1 }, prefs: { peopleInteractionLoad: 0.15, autonomyPreference: 0.1 } },
      { id: 'd', text: 'Проверю на данных, ухудшились ли показатели после регламентов, и докажу это руководству', riasec: { investigative: 2 }, prefs: { autonomyPreference: 0.1 } },
      { id: 'e', text: 'Мне комфортнее, когда чётко прописано, что делать — меньше устаю от выбора', riasec: { conventional: 2, realistic: 1 }, prefs: { ambiguityTolerance: -0.2, autonomyPreference: -0.2 } }
    ]
  },
  {
    id: 'q12_mentor',
    scenario: 'Вам предложили вырасти: выбрать между углублением в экспертизу и управлением людьми. Что ближе по духу?',
    options: [
      { id: 'a', text: 'Углубиться в технологии и решать задачи высочайшей сложности самому', riasec: { investigative: 2, realistic: 1 }, prefs: { peopleInteractionLoad: -0.25, autonomyPreference: 0.15 } },
      { id: 'b', text: 'Расти в лидера: отвечать за результат команды, развивать людей', riasec: { enterprising: 2, social: 1 }, prefs: { peopleInteractionLoad: 0.25 } },
      { id: 'c', text: 'Стать тем, кто учит других: менторить, создавать обучающие материалы', riasec: { social: 2, artistic: 1 }, prefs: { peopleInteractionLoad: 0.15 } },
      { id: 'd', text: 'Развиваться в организатора: процессы, методологии, чтобы всё работало как часы', riasec: { conventional: 2 }, prefs: { ambiguityTolerance: -0.15 } },
      { id: 'e', text: 'Совмещать и то и другое: экспертиза + влияние на стратегию, без рутины менеджмента', riasec: { enterprising: 2, investigative: 1 }, prefs: { ambiguityTolerance: 0.15, autonomyPreference: 0.1 } }
    ]
  },
  {
    id: 'q13_visual',
    scenario: 'Вам нужно донести сложную идею до людей, которые вообще не в теме. Как вы это сделаете?',
    options: [
      { id: 'a', text: 'Нарисую схему/инфографику или соберу наглядный макет — картинка объясняет лучше слов', riasec: { artistic: 2, investigative: 1 } },
      { id: 'b', text: 'Расскажу простыми словами, с историями и примерами из жизни', riasec: { social: 2 }, prefs: { peopleInteractionLoad: 0.1 } },
      { id: 'c', text: 'Разложу по шагам: инструкция, этапы, чек-лист — каждый сам разберётся', riasec: { conventional: 2 } },
      { id: 'd', text: 'Покажу работающий прототип — пусть потрогают руками', riasec: { realistic: 2 }, prefs: { ambiguityTolerance: 0.1 } },
      { id: 'e', text: 'Соберу ключевые цифры в наглядные метрики — данные убеждают сами', riasec: { investigative: 2, conventional: 1 } }
    ]
  },
  {
    id: 'q14_market',
    scenario: 'Вам предлагают два проекта: стабильный внутренний с понятными задачами и новый рыночный с большими рисками и потенциальным ростом.',
    options: [
      { id: 'a', text: 'Выберу рыночный: там можно сделать имя, получить признание и быстро вырасти', riasec: { enterprising: 2 }, prefs: { ambiguityTolerance: 0.25 } },
      { id: 'b', text: 'Выберу стабильный: предсказуемость и понятные рамки дороже азарта', riasec: { conventional: 2 }, prefs: { ambiguityTolerance: -0.25 } },
      { id: 'c', text: 'Оценю цифры и риски обоих и выберу по расчёту, а не по ощущению', riasec: { investigative: 2 }, prefs: { ambiguityTolerance: 0.05 } },
      { id: 'd', text: 'Пойду туда, где интереснее задачи и больше свободы самому решать', riasec: { artistic: 2 }, prefs: { autonomyPreference: 0.2, ambiguityTolerance: 0.1 } },
      { id: 'e', text: 'Совмещу: договорюсь о стабильной базе и добавлю немного нового в рамках неё', riasec: { social: 2, conventional: 1 }, prefs: { ambiguityTolerance: -0.05 } }
    ]
  },
  {
    id: 'q15_craft',
    scenario: 'Когда вы выполняете сложную задачу и всё наконец сходится, что вас больше всего радует?',
    options: [
      { id: 'a', text: 'Что я лично сделал это руками — виден конкретный результат', riasec: { realistic: 2 }, prefs: { autonomyPreference: 0.1 } },
      { id: 'b', text: 'Что я понял, как это устроено, и могу объяснить логику другим', riasec: { investigative: 2 } },
      { id: 'c', text: 'Что результат получился красивым и элегантным', riasec: { artistic: 2 } },
      { id: 'd', text: 'Что благодаря мне команда/заказчик довольны и работа двигается дальше', riasec: { social: 2 }, prefs: { peopleInteractionLoad: 0.15 } },
      { id: 'e', text: 'Что задача закрыта в срок по плану и все показатели сходятся', riasec: { conventional: 2 } }
    ]
  },
  {
    id: 'q16_growth',
    scenario: 'Вы долго учились новому навыку, но компания пока не даёт его применять. Что сделаете?',
    options: [
      { id: 'a', text: 'Найду проект/команду, где он нужен, или предложу новый продукт под него', riasec: { enterprising: 2 }, prefs: { autonomyPreference: 0.15 } },
      { id: 'b', text: 'Буду прокачивать навык в своём объёме: pet-проект, комьюнити, конференции', riasec: { artistic: 2, investigative: 1 }, prefs: { autonomyPreference: 0.2 } },
      { id: 'c', text: 'Проведу внутренний воркшоп и покажу команде пользу — спрос появится', riasec: { social: 2 }, prefs: { peopleInteractionLoad: 0.15 } },
      { id: 'd', text: 'Терпеливо продолжу делать текущую работу на отлично — применение придёт само', riasec: { conventional: 2 }, prefs: { autonomyPreference: -0.15 } },
      { id: 'e', text: 'Проанализирую рынок: где этот навык востребован, и приму решение по фактам', riasec: { investigative: 2 }, prefs: { ambiguityTolerance: 0.05 } }
    ]
  },
  {
    id: 'q17_feedback',
    scenario: 'После долгой работы вы получаете разгромный отзыв о своём результате. Первая реакция?',
    options: [
      { id: 'a', text: 'Разберу каждый пункт отзыва, проверю по фактам и исправлю то, что обоснованно', riasec: { investigative: 2, realistic: 1 }, prefs: { ambiguityTolerance: 0.05 } },
      { id: 'b', text: 'Расстроюсь, но быстро переключусь: отзыв — это данные, а не приговор', riasec: { realistic: 2 }, prefs: { peopleInteractionLoad: -0.1, ambiguityTolerance: 0.15 } },
      { id: 'c', text: 'Пойду обсуждать с теми, кто критиковал, — важно понять их настоящую боль', riasec: { social: 2 }, prefs: { peopleInteractionLoad: 0.2 } },
      { id: 'd', text: 'Соберу альтернативные точки зрения и решения, чтобы ответить нестандартно', riasec: { artistic: 2 }, prefs: { ambiguityTolerance: 0.1 } },
      { id: 'e', text: 'Составлю план исправлений с чёткими сроками и отчитаюсь по нему', riasec: { conventional: 2 } }
    ]
  }
];

export const RIASEC_LABELS: Record<string, { short: string; full: string }> = {
  realistic: { short: 'R', full: 'Прагматик' },
  investigative: { short: 'I', full: 'Исследователь' },
  artistic: { short: 'A', full: 'Творец' },
  social: { short: 'S', full: 'Коммуникатор' },
  enterprising: { short: 'E', full: 'Лидер' },
  conventional: { short: 'C', full: 'Систематизатор' }
};
