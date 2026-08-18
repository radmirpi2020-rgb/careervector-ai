import type { PsychologicalVector } from '../types';
import { PSY } from './roles';

export interface DirectionGroup {
  key: string;
  label: string;
  roleIds: string[];
}

export interface CareerDirection {
  id: string;
  title: string;
  tagline: string;
  anchor: keyof typeof PSY;
  groups: DirectionGroup[];
}

export interface DirectionQuestion {
  id: string;
  statement: string;
  weights: Partial<Record<string, number>>;
}

export interface SpecializationQuestion extends DirectionQuestion {
  riasec?: Partial<Pick<PsychologicalVector, 'realistic' | 'investigative' | 'artistic' | 'social' | 'enterprising' | 'conventional'>>;
}

export const ANSWER_OPTIONS = [
  { id: 'strongly_yes', label: 'Да', factor: 2 },
  { id: 'yes', label: 'Скорее да', factor: 1 },
  { id: 'no', label: 'Скорее нет', factor: -1 },
  { id: 'strongly_no', label: 'Нет', factor: -2 }
] as const;

export type AnswerOptionId = (typeof ANSWER_OPTIONS)[number]['id'];

export function answerFactor(id: string): number {
  return ANSWER_OPTIONS.find((o) => o.id === id)?.factor ?? 0;
}

// ===================== НАПРАВЛЕНИЯ =====================

export const DIRECTIONS: CareerDirection[] = [
  {
    id: 'dev',
    title: 'Разработка',
    tagline: 'Код, сервисы, продукты из кода',
    anchor: 'dev',
    groups: [
      { key: 'g_backend', label: 'Бэкенд', roleIds: ['backend_python', 'backend_go', 'backend_java', 'backend_node', 'backend_php', 'backend_csharp', 'backend_rust'] },
      { key: 'g_frontend', label: 'Фронтенд', roleIds: ['frontend_developer', 'vue_developer', 'angular_developer', 'fullstack_developer'] },
      { key: 'g_mobile', label: 'Мобильная разработка', roleIds: ['mobile_ios_dev', 'mobile_android_dev', 'flutter_dev', 'react_native_dev'] },
      { key: 'g_gamedev', label: 'Геймдев', roleIds: ['unity_dev', 'unreal_dev', 'game_developer', 'game_designer'] },
      { key: 'g_embedded', label: 'Встраиваемые системы', roleIds: ['systems_cpp', 'embedded_dev', 'iot_dev', 'robotics_engineer'] },
      { key: 'g_nocode', label: 'No-code / RPA', roleIds: ['no_code_dev', 'rpa_developer'] },
      { key: 'g_blockchain', label: 'Web3 / Blockchain', roleIds: ['blockchain_developer'] },
      { key: 'g_qa', label: 'QA / Тестирование', roleIds: ['qa_manual', 'qa_automation', 'qa_lead', 'performance_tester', 'mobile_qa'] }
    ]
  },
  {
    id: 'data',
    title: 'Данные и аналитика',
    tagline: 'Цифры, метрики, предсказания',
    anchor: 'data',
    groups: [
      { key: 'g_analytics', label: 'Аналитика', roleIds: ['data_analyst', 'product_analyst', 'business_analyst', 'system_analyst', 'web_analyst'] },
      { key: 'g_science', label: 'Data Science / ML', roleIds: ['data_scientist', 'ml_engineer', 'llm_engineer'] },
      { key: 'g_engineering', label: 'Data Engineering', roleIds: ['analytics_engineer', 'data_engineer', 'bi_developer', 'mlops_engineer', 'data_architect'] },
      { key: 'g_finance', label: 'Финансы и риск', roleIds: ['financial_analyst', 'risk_analyst'] }
    ]
  },
  {
    id: 'product',
    title: 'Продукт и дизайн',
    tagline: 'Смысл, форма и опыт пользователя',
    anchor: 'product',
    groups: [
      { key: 'g_product', label: 'Продукт-менеджмент', roleIds: ['product_manager', 'technical_pm', 'product_owner'] },
      { key: 'g_design', label: 'UX/UI-дизайн', roleIds: ['ux_researcher', 'ux_designer', 'product_designer', 'ux_writer'] },
      { key: 'g_visual', label: 'Визуал: иллюстрация, моушн, 3D', roleIds: ['graphic_designer', 'motion_designer', 'illustrator', 'artist_3d'] }
    ]
  },
  {
    id: 'marketing',
    title: 'Маркетинг и продажи',
    tagline: 'Рост, бренд и клиенты',
    anchor: 'marketing',
    groups: [
      { key: 'g_digital', label: 'Digital-маркетинг', roleIds: ['performance_marketer', 'media_buyer', 'affiliate_manager', 'seo_specialist', 'smm_specialist', 'content_marketer', 'email_marketer'] },
      { key: 'g_brand', label: 'Бренд и рост', roleIds: ['product_marketing_manager', 'brand_manager', 'pr_manager', 'community_manager', 'growth_marketer'] },
      { key: 'g_sales', label: 'Продажи и клиенты', roleIds: ['b2b_sales_manager', 'business_developer', 'presales_engineer', 'customer_success_manager', 'account_manager'] }
    ]
  },
  {
    id: 'mgmt',
    title: 'Менеджмент',
    tagline: 'Команды, проекты, решения',
    anchor: 'mgmt',
    groups: [
      { key: 'g_teams', label: 'Лидерство', roleIds: ['team_lead_dev', 'engineering_manager', 'product_lead', 'head_of_analytics', 'head_of_design', 'head_of_marketing', 'it_director'] },
      { key: 'g_projects', label: 'Проекты и Agile', roleIds: ['scrum_master', 'agile_coach', 'project_manager', 'delivery_manager', 'program_manager'] },
      { key: 'g_architecture', label: 'Архитектура решений', roleIds: ['it_architect', 'solution_architect'] }
    ]
  },
  {
    id: 'infra',
    title: 'Инженерия и инфраструктура',
    tagline: 'Надёжность, сети, безопасность',
    anchor: 'infra',
    groups: [
      { key: 'g_devops', label: 'DevOps / SRE / Cloud', roleIds: ['devops_engineer', 'sre', 'cloud_architect'] },
      { key: 'g_security', label: 'Информационная безопасность', roleIds: ['security_engineer'] },
      { key: 'g_ops', label: 'Сети и администрирование', roleIds: ['sysadmin', 'network_engineer', 'database_administrator', 'logistics_manager'] },
      { key: 'g_support', label: 'Поддержка пользователей', roleIds: ['support_engineer'] }
    ]
  },
  {
    id: 'people',
    title: 'Люди и обучение',
    tagline: 'HR, развитие, документация',
    anchor: 'training',
    groups: [
      { key: 'g_hr', label: 'HR / Рекрутинг / L&D', roleIds: ['it_recruiter', 'hr_analyst', 'lnd_specialist', 'it_trainer'] },
      { key: 'g_docs', label: 'Документация и DevRel', roleIds: ['technical_writer', 'devrel'] }
    ]
  }
];

export const DIRECTION_BY_ID: Record<string, CareerDirection> = Object.fromEntries(DIRECTIONS.map((d) => [d.id, d]));

export function anchorVector(directionId: string): PsychologicalVector {
  return PSY[DIRECTION_BY_ID[directionId]?.anchor ?? 'dev'];
}

export function groupOfRole(roleId: string): { directionId: string; groupKey: string; label: string } | null {
  for (const d of DIRECTIONS) {
    for (const g of d.groups) {
      if (g.roleIds.includes(roleId)) return { directionId: d.id, groupKey: g.key, label: g.label };
    }
  }
  return null;
}

export function directionOfRole(roleId: string): string | null {
  return groupOfRole(roleId)?.directionId ?? null;
}

// ===================== ТЕСТ 1: НАПРАВЛЕНИЯ (да/нет) =====================

export const STAGE1_QUESTIONS: DirectionQuestion[] = [
  { id: 'd1', statement: 'Мне нравится строить цифровые системы: код, сервисы, автоматизация', weights: { dev: 2, infra: 1, data: 0.5 } },
  { id: 'd2', statement: 'Цифры, метрики и закономерности в данных меня затягивают', weights: { data: 2, product: 0.5, mgmt: 0.5 } },
  { id: 'd3', statement: 'Я хочу создавать продукты и интерфейсы, которыми пользуются люди', weights: { product: 2, marketing: 0.5, dev: 0.5 } },
  { id: 'd4', statement: 'Убеждать, продавать и развивать бизнес — моя стихия', weights: { marketing: 2, mgmt: 0.5 } },
  { id: 'd5', statement: 'Мне нравится управлять людьми и процессами, отвечать за результат команды', weights: { mgmt: 2, people: 0.5 } },
  { id: 'd6', statement: 'Надёжность инфраструктуры, сети и безопасность — я готов(а) отвечать за «железо»', weights: { infra: 2, dev: 0.5 } },
  { id: 'd7', statement: 'Работа с людьми: подбор, обучение, развитие — мне это по душе', weights: { people: 2, marketing: 0.5 } },
  { id: 'd8', statement: 'Визуальная эстетика: формы, цвета, композиция — мой язык', weights: { product: 1.5, marketing: 0.5 } },
  { id: 'd9', statement: 'Люблю исследовать причины явлений и ставить эксперименты', weights: { data: 1.5, dev: 0.5, product: 0.5 } },
  { id: 'd10', statement: 'Мне нравится объяснять сложное простыми словами и писать', weights: { people: 1.5, marketing: 1 } },
  { id: 'd11', statement: 'Автоматизация рутины и оптимизация процессов доставляют удовольствие', weights: { dev: 1, data: 1, mgmt: 0.5, infra: 0.5 } },
  { id: 'd12', statement: 'Хочу видеть осязаемый результат своего труда', weights: { infra: 1.5, dev: 1, product: 0.5 } },
  { id: 'd13', statement: 'Мне интересно разбираться, как устроены сложные системы изнутри', weights: { dev: 1.5, infra: 1, data: 0.5 } },
  { id: 'd14', statement: 'Каждый день много общаться, вести переговоры и убеждать — это норма для меня', weights: { marketing: 1.5, mgmt: 1.5, people: 1 } },
  { id: 'd15', statement: 'Большие объёмы информации, поиск аномалий и закономерностей — мой конёк', weights: { data: 1.5, dev: 0.5, product: 0.5 } },
  { id: 'd16', statement: 'Создавать обучающие материалы и помогать другим расти — моё призвание', weights: { people: 2, marketing: 0.5 } },
  { id: 'd17', statement: 'Мне нравится быстро видеть эффект своих действий в цифрах продаж', weights: { marketing: 2, mgmt: 0.5 } },
  { id: 'd18', statement: 'Планирование, приоритеты и контроль сроков даются мне легко', weights: { mgmt: 1.5, infra: 0.5, data: 0.5 } },
  { id: 'd19', statement: 'Хочу проектировать продукты, которыми удобно и приятно пользоваться', weights: { product: 1.5, dev: 0.5, marketing: 0.5 } },
  { id: 'd20', statement: 'Готов(а) разбираться в низкоуровневых деталях: протоколы, память, ядра', weights: { dev: 1, infra: 1.5 } },
  { id: 'd21', statement: 'Запуск и масштабирование продукта с нуля меня заряжает', weights: { product: 1.5, marketing: 1, mgmt: 1 } },
  { id: 'd22', statement: 'Аналитические отчёты и презентации для руководства — моя сильная сторона', weights: { data: 1, mgmt: 1.5, product: 0.5 } },
  { id: 'd23', statement: 'Работа с сообществом: форумы, митапы, ответы на вопросы', weights: { people: 1.5, marketing: 1, dev: 0.5 } },
  { id: 'd24', statement: 'Настраивать технику, ремонтировать и собирать устройства — у меня хорошо получается', weights: { infra: 1.5, dev: 1 } }
];

// ===================== ТЕСТ 2: СПЕЦИАЛИЗАЦИИ (да/нет) =====================

export const STAGE2_QUESTIONS: Record<string, SpecializationQuestion[]> = {
  dev: [
    {
      id: 'dev1', statement: 'Код — мой основной инструмент, я готов(а) писать его каждый день',
      weights: { g_backend: 2, g_frontend: 2, g_mobile: 2, g_gamedev: 1.5, g_embedded: 1.5, g_blockchain: 2, g_qa: 0.5 },
      riasec: { realistic: 0.3, investigative: 0.3 }
    },
    {
      id: 'dev2', statement: 'Мне важно видеть, как пользователи взаимодействуют с интерфейсом в браузере',
      weights: { g_frontend: 2, g_mobile: 0.5, g_backend: 0.5 },
      riasec: { artistic: 0.4 }
    },
    {
      id: 'dev3', statement: 'Мир приложений на телефоне мне ближе, чем веб',
      weights: { g_mobile: 2 },
      riasec: { realistic: 0.3 }
    },
    {
      id: 'dev4', statement: 'Игровые механики, миры и персонажи меня завораживают',
      weights: { g_gamedev: 2 },
      riasec: { artistic: 0.4 }
    },
    {
      id: 'dev5', statement: 'Хочу работать ближе к «железу»: устройства, роботы, микроконтроллеры',
      weights: { g_embedded: 2 },
      riasec: { realistic: 0.4 }
    },
    {
      id: 'dev6', statement: 'Довести продукт до идеального качества для меня важнее скорости',
      weights: { g_qa: 2 },
      riasec: { conventional: 0.3 }
    },
    {
      id: 'dev7', statement: 'Децентрализация и защита данных на блокчейне меня привлекают',
      weights: { g_blockchain: 2, g_embedded: 0.5 },
      riasec: { investigative: 0.3 }
    },
    {
      id: 'dev8', statement: 'Реляционные базы данных и оптимизация запросов мне интересны',
      weights: { g_backend: 2 },
      riasec: { investigative: 0.2, conventional: 0.2 }
    },
    {
      id: 'dev9', statement: 'Вёрстка и визуальные детали интерфейса: пиксель-перфект, CSS-анимации',
      weights: { g_frontend: 2 },
      riasec: { artistic: 0.3 }
    },
    {
      id: 'dev10', statement: 'Хочу собирать мобильное приложение под ключ с нуля',
      weights: { g_mobile: 2, g_frontend: 0.5 },
      riasec: { realistic: 0.3 }
    },
    {
      id: 'dev11', statement: 'Математика и физика игрового движка привлекают больше, чем логика бизнес-приложений',
      weights: { g_gamedev: 2, g_embedded: 0.5 },
      riasec: { investigative: 0.3 }
    },
    {
      id: 'dev12', statement: 'Отладка на уровне аппаратуры и осциллографа мне по душе',
      weights: { g_embedded: 2, g_backend: 0.5 },
      riasec: { realistic: 0.4 }
    },
    {
      id: 'dev13', statement: 'Оптимизация рутинных бизнес-процессов готовыми инструментами без кода — это моё',
      weights: { g_nocode: 2 },
      riasec: { enterprising: 0.2, conventional: 0.3 }
    },
    {
      id: 'dev14', statement: 'Смарт-контракты и децентрализованные приложения — технология будущего',
      weights: { g_blockchain: 2, g_backend: 0.5 },
      riasec: { investigative: 0.3 }
    },
    {
      id: 'dev15', statement: 'Писать автотесты и строить системы проверки качества — интереснее фич',
      weights: { g_qa: 2, g_backend: 0.5 },
      riasec: { conventional: 0.3 }
    },
    {
      id: 'dev16', statement: 'Быстрое прототипирование: Notion, Airtable, Zapier — мой основной инструментарий',
      weights: { g_nocode: 2, g_qa: 0.5 },
      riasec: { enterprising: 0.2 }
    }
  ],
  data: [
    {
      id: 'data1', statement: 'Отвечать на бизнес-вопросы с помощью отчётов и дашбордов — моя работа мечты',
      weights: { g_analytics: 2, g_finance: 1 },
      riasec: { conventional: 0.3, investigative: 0.2 }
    },
    {
      id: 'data2', statement: 'Модели машинного обучения и предсказания — вершина интересности',
      weights: { g_science: 2, g_engineering: 0.5 },
      riasec: { investigative: 0.4 }
    },
    {
      id: 'data3', statement: 'Построение пайплайнов и хранилищ данных интереснее, чем отчёты',
      weights: { g_engineering: 2 },
      riasec: { realistic: 0.3 }
    },
    {
      id: 'data4', statement: 'Финансы, инвестиции и управление рисками привлекают меня',
      weights: { g_finance: 2 },
      riasec: { enterprising: 0.2, conventional: 0.2 }
    },
    {
      id: 'data5', statement: 'Глубокие исследования причин и статистические методы — моя зона',
      weights: { g_science: 1.5, g_analytics: 1 },
      riasec: { investigative: 0.3 }
    },
    {
      id: 'data6', statement: 'Построение дашбордов и визуализаций для бизнеса — моя ежедневная работа',
      weights: { g_analytics: 2 },
      riasec: { conventional: 0.3 }
    },
    {
      id: 'data7', statement: 'Применять нейросети и генеративные модели к реальным задачам компании',
      weights: { g_science: 2, g_engineering: 0.5 },
      riasec: { investigative: 0.3 }
    },
    {
      id: 'data8', statement: 'Настраивать хранилища данных и ETL-процессы интереснее, чем отчёты',
      weights: { g_engineering: 2, g_analytics: 0.5 },
      riasec: { realistic: 0.3 }
    },
    {
      id: 'data9', statement: 'Оценка кредитных и рыночных рисков — работа, где важна точность',
      weights: { g_finance: 2 },
      riasec: { conventional: 0.3, enterprising: 0.2 }
    },
    {
      id: 'data10', statement: 'A/B-тесты и продуктовые эксперименты — мой основной рабочий инструмент',
      weights: { g_analytics: 2, g_science: 1 },
      riasec: { investigative: 0.3 }
    },
    {
      id: 'data11', statement: 'Прогнозы временных рядов и моделирование продаж меня затягивают',
      weights: { g_science: 1.5, g_analytics: 1.5, g_finance: 1 },
      riasec: { investigative: 0.3 }
    },
    {
      id: 'data12', statement: 'Оптимизировать инфраструктуру данных: скорость, стоимость, надёжность',
      weights: { g_engineering: 2, g_science: 0.5 },
      riasec: { realistic: 0.3 }
    },
    {
      id: 'data13', statement: 'Разбираться в продукте и отвечать на вопрос «почему упала метрика»',
      weights: { g_analytics: 2, g_finance: 0.5 },
      riasec: { investigative: 0.2, enterprising: 0.2 }
    },
    {
      id: 'data14', statement: 'Инвестиционный анализ и оценка компаний — моя сфера интереса',
      weights: { g_finance: 2, g_science: 0.5 },
      riasec: { enterprising: 0.3, conventional: 0.2 }
    }
  ],
  product: [
    {
      id: 'prod1', statement: 'Стратегия, приоритеты и ответственность за продукт целиком — это моё',
      weights: { g_product: 2, g_design: 0.5 },
      riasec: { enterprising: 0.4 }
    },
    {
      id: 'prod2', statement: 'Исследование пользователей и интервью — основа, с которой я начинаю работу',
      weights: { g_design: 2 },
      riasec: { social: 0.3, investigative: 0.2 }
    },
    {
      id: 'prod3', statement: 'Проектирование интерфейсов и взаимодействия — моё призвание',
      weights: { g_design: 1.5, g_visual: 1 },
      riasec: { artistic: 0.3 }
    },
    {
      id: 'prod4', statement: 'Иллюстрации, анимация и 3D-графика — мой инструментарий',
      weights: { g_visual: 2 },
      riasec: { artistic: 0.4 }
    },
    {
      id: 'prod5', statement: 'Тексты интерфейсов: понятные подписи и микро-копирайт — мне интересно',
      weights: { g_design: 1, g_product: 0.5 },
      riasec: { artistic: 0.2, social: 0.2 }
    },
    {
      id: 'prod6', statement: 'Проводить продуктовые эксперименты и итеративно улучшать продукт',
      weights: { g_product: 2, g_design: 0.5 },
      riasec: { enterprising: 0.3, investigative: 0.2 }
    },
    {
      id: 'prod7', statement: 'Юзабилити-тестирование: наблюдать за пользователями и их сложностями',
      weights: { g_design: 2 },
      riasec: { social: 0.3, investigative: 0.2 }
    },
    {
      id: 'prod8', statement: 'Создавать дизайн-системы и UI-киты для целой команды',
      weights: { g_design: 1.5, g_visual: 1 },
      riasec: { artistic: 0.3, conventional: 0.2 }
    },
    {
      id: 'prod9', statement: 'Иллюстрации в стиле бренда и инфографика — моя сильная сторона',
      weights: { g_visual: 2 },
      riasec: { artistic: 0.4 }
    },
    {
      id: 'prod10', statement: 'Согласование требований, приоритеты и написание ТЗ — мой конёк',
      weights: { g_product: 2, g_design: 0.5 },
      riasec: { enterprising: 0.3, conventional: 0.2 }
    },
    {
      id: 'prod11', statement: 'Анимация интерфейсов и моушн-сцены привлекают меня',
      weights: { g_visual: 1.5, g_design: 1 },
      riasec: { artistic: 0.4 }
    },
    {
      id: 'prod12', statement: 'Голосовые интерфейсы и чат-боты — интересная область продуктов',
      weights: { g_product: 1.5, g_design: 1 },
      riasec: { investigative: 0.2 }
    },
    {
      id: 'prod13', statement: 'Прототипирование в Figma — мой второй дом, я живу в прототипах',
      weights: { g_design: 2, g_visual: 0.5 },
      riasec: { artistic: 0.3 }
    }
  ],
  marketing: [
    {
      id: 'mkt1', statement: 'Реклама, таргетинг и воронки с цифрами — моя стихия',
      weights: { g_digital: 2 },
      riasec: { enterprising: 0.3, conventional: 0.2 }
    },
    {
      id: 'mkt2', statement: 'Создание бренда и управление его репутацией мне интересно',
      weights: { g_brand: 2 },
      riasec: { artistic: 0.3, enterprising: 0.2 }
    },
    {
      id: 'mkt3', statement: 'Продажи лицом к лицу и переговоры — то, что меня заряжает',
      weights: { g_sales: 2 },
      riasec: { enterprising: 0.4, social: 0.2 }
    },
    {
      id: 'mkt4', statement: 'Соцсети и контент для аудитории — моя зона комфорта',
      weights: { g_digital: 1.5, g_brand: 1 },
      riasec: { social: 0.3, artistic: 0.2 }
    },
    {
      id: 'mkt5', statement: 'Помогать клиентам достигать целей с продуктом — моя миссия',
      weights: { g_sales: 1.5, g_brand: 0.5 },
      riasec: { social: 0.4 }
    },
    {
      id: 'mkt6', statement: 'Настройка рекламных кампаний с тщательным контролем бюджета',
      weights: { g_digital: 2 },
      riasec: { conventional: 0.3, enterprising: 0.2 }
    },
    {
      id: 'mkt7', statement: 'Разработка креативов и офферов для рекламы — моя зона',
      weights: { g_digital: 1.5, g_brand: 1 },
      riasec: { artistic: 0.3, enterprising: 0.2 }
    },
    {
      id: 'mkt8', statement: 'Стратегия вывода нового продукта на рынок меня вдохновляет',
      weights: { g_brand: 2, g_sales: 0.5 },
      riasec: { enterprising: 0.4 }
    },
    {
      id: 'mkt9', statement: 'Ведение клиентов по воронке и закрытие сделок — то, что меня заряжает',
      weights: { g_sales: 2 },
      riasec: { enterprising: 0.4, social: 0.2 }
    },
    {
      id: 'mkt10', statement: 'SEO и органический трафик — мой конёк, люблю долгую игру',
      weights: { g_digital: 2 },
      riasec: { investigative: 0.2, conventional: 0.2 }
    },
    {
      id: 'mkt11', statement: 'Партнёрства и коллаборации с другими брендами — интересная задача',
      weights: { g_brand: 1.5, g_sales: 1 },
      riasec: { social: 0.3, enterprising: 0.2 }
    },
    {
      id: 'mkt12', statement: 'Работа с прессой и антикризисные коммуникации — моя зона ответственности',
      weights: { g_brand: 2 },
      riasec: { social: 0.3, enterprising: 0.2 }
    },
    {
      id: 'mkt13', statement: 'Анализ конкурентов и позиционирование — с этого я начинаю любую задачу',
      weights: { g_brand: 1.5, g_digital: 1 },
      riasec: { investigative: 0.3 }
    }
  ],
  mgmt: [
    {
      id: 'mgmt1', statement: 'Развитие людей и построение команды — моя главная ответственность',
      weights: { g_teams: 2 },
      riasec: { social: 0.4 }
    },
    {
      id: 'mgmt2', statement: 'Процессы, методологии и ритм проекта — моя зона',
      weights: { g_projects: 2 },
      riasec: { conventional: 0.3 }
    },
    {
      id: 'mgmt3', statement: 'Проектирование архитектуры решений ближе, чем управление людьми',
      weights: { g_architecture: 2 },
      riasec: { investigative: 0.3 }
    },
    {
      id: 'mgmt4', statement: 'Я предпочитаю влиять на стратегию, а не контролировать детали',
      weights: { g_teams: 1.5, g_architecture: 1 },
      riasec: { enterprising: 0.3 }
    },
    {
      id: 'mgmt5', statement: 'Разрешение конфликтов и коммуникация со стейкхолдерами — моя суперсила',
      weights: { g_projects: 1.5, g_teams: 1 },
      riasec: { social: 0.3 }
    },
    {
      id: 'mgmt6', statement: 'Найм, адаптация и развитие новых сотрудников — моя ответственность',
      weights: { g_teams: 2 },
      riasec: { social: 0.4 }
    },
    {
      id: 'mgmt7', statement: 'Ведение стендапов, бэклога и ритма поставок — мой ежедневный ритм',
      weights: { g_projects: 2 },
      riasec: { conventional: 0.3 }
    },
    {
      id: 'mgmt8', statement: 'Выбор технологического стека и оценка решений — моя компетенция',
      weights: { g_architecture: 2, g_teams: 0.5 },
      riasec: { investigative: 0.3 }
    },
    {
      id: 'mgmt9', statement: 'Построение OKR и контроль целей команды — мой инструмент управления',
      weights: { g_teams: 2, g_projects: 1 },
      riasec: { enterprising: 0.3 }
    },
    {
      id: 'mgmt10', statement: 'Управление рисками и бюджетом проекта — я чувствую себя уверенно',
      weights: { g_projects: 2, g_architecture: 0.5 },
      riasec: { conventional: 0.3, enterprising: 0.2 }
    },
    {
      id: 'mgmt11', statement: 'Реорганизация процессов внутри компании — интересная задача для меня',
      weights: { g_teams: 1.5, g_projects: 1.5 },
      riasec: { enterprising: 0.3 }
    },
    {
      id: 'mgmt12', statement: 'Технические собеседования и оценка кандидатов — мне это нравится',
      weights: { g_teams: 1.5, g_architecture: 1 },
      riasec: { social: 0.2, investigative: 0.2 }
    },
    {
      id: 'mgmt13', statement: 'Внедрение Agile-практик в команде — моя зона влияния',
      weights: { g_projects: 2, g_teams: 0.5 },
      riasec: { social: 0.2, conventional: 0.2 }
    }
  ],
  infra: [
    {
      id: 'infra1', statement: 'CI/CD, контейнеры и облачная инфраструктура — моя ежедневная работа',
      weights: { g_devops: 2 },
      riasec: { realistic: 0.3, investigative: 0.2 }
    },
    {
      id: 'infra2', statement: 'Защита систем от атак и безопасность данных — моя зона ответственности',
      weights: { g_security: 2 },
      riasec: { investigative: 0.4 }
    },
    {
      id: 'infra3', statement: 'Сети, серверы и базы данных под контролем — мне это нравится',
      weights: { g_ops: 2 },
      riasec: { realistic: 0.4 }
    },
    {
      id: 'infra4', statement: 'Помогать пользователям решать их проблемы — моя мотивация',
      weights: { g_support: 2 },
      riasec: { social: 0.4 }
    },
    {
      id: 'infra5', statement: 'Стабильность 24/7 и мониторинг — я готов(а) дежурить',
      weights: { g_devops: 1.5, g_ops: 1 },
      riasec: { conventional: 0.3 }
    },
    {
      id: 'infra6', statement: 'Терраформ и инфраструктура как код — мой любимый инструмент',
      weights: { g_devops: 2 },
      riasec: { realistic: 0.3, investigative: 0.2 }
    },
    {
      id: 'infra7', statement: 'Пентест и поиск уязвимостей — работа, где нужны хладнокровие и логика',
      weights: { g_security: 2 },
      riasec: { investigative: 0.4 }
    },
    {
      id: 'infra8', statement: 'Балансировка нагрузки и оптимизация серверов — моя зона',
      weights: { g_ops: 2, g_devops: 1 },
      riasec: { realistic: 0.4 }
    },
    {
      id: 'infra9', statement: 'Траблшутинг: находить первопричину инцидента — моя суперсила',
      weights: { g_devops: 1.5, g_ops: 1.5 },
      riasec: { investigative: 0.3 }
    },
    {
      id: 'infra10', statement: 'Проектирование сетевой архитектуры офиса или ЦОД мне интересно',
      weights: { g_ops: 2 },
      riasec: { realistic: 0.3, conventional: 0.2 }
    },
    {
      id: 'infra11', statement: 'Внедрение систем мониторинга и алертинга — моя задача',
      weights: { g_devops: 2, g_ops: 0.5 },
      riasec: { conventional: 0.3 }
    },
    {
      id: 'infra12', statement: 'Обучение коллег работе с инструментами — мне это нравится',
      weights: { g_support: 2, g_ops: 0.5 },
      riasec: { social: 0.4 }
    },
    {
      id: 'infra13', statement: 'Соответствие стандартам безопасности (ISO, PCI) — моя зона ответственности',
      weights: { g_security: 2 },
      riasec: { conventional: 0.4 }
    }
  ],
  people: [
    {
      id: 'people1', statement: 'Подбор и найм людей, оценка кандидатов — моя профессия',
      weights: { g_hr: 2 },
      riasec: { social: 0.4, enterprising: 0.2 }
    },
    {
      id: 'people2', statement: 'Обучение и развитие сотрудников — моя миссия',
      weights: { g_hr: 2 },
      riasec: { social: 0.4 }
    },
    {
      id: 'people3', statement: 'Анализ HR-метрик и зарплатных вилок — интересно, как в аналитике',
      weights: { g_hr: 1.5 },
      riasec: { investigative: 0.2, conventional: 0.2 }
    },
    {
      id: 'people4', statement: 'Писать документацию, понятную разработчикам, — моё призвание',
      weights: { g_docs: 2 },
      riasec: { conventional: 0.3 }
    },
    {
      id: 'people5', statement: 'Связь компании с техническим сообществом, митапы, контент — моя зона',
      weights: { g_docs: 2, g_hr: 0.5 },
      riasec: { social: 0.3, artistic: 0.2 }
    },
    {
      id: 'people6', statement: 'Проведение интервью и онбординг новичков — моя ежедневная работа',
      weights: { g_hr: 2, g_docs: 0.5 },
      riasec: { social: 0.4 }
    },
    {
      id: 'people7', statement: 'Разработка программ обучения и треков развития — моя миссия',
      weights: { g_hr: 2 },
      riasec: { social: 0.4, investigative: 0.2 }
    },
    {
      id: 'people8', statement: 'Внутренние коммуникации и корпоративная культура — моя зона',
      weights: { g_hr: 1.5, g_docs: 1 },
      riasec: { social: 0.4 }
    },
    {
      id: 'people9', statement: 'База знаний и инструкции для команды — я люблю наводить порядок в информации',
      weights: { g_docs: 2 },
      riasec: { conventional: 0.4 }
    },
    {
      id: 'people10', statement: 'Хантинг редких специалистов — задача, где нужны настойчивость и чутьё',
      weights: { g_hr: 2 },
      riasec: { enterprising: 0.3, social: 0.3 }
    },
    {
      id: 'people11', statement: 'Конференции: подготовка спикеров и организация стенда — моё призвание',
      weights: { g_docs: 1.5, g_hr: 1 },
      riasec: { social: 0.3, artistic: 0.2 }
    }
  ]
};

export function stage2QuestionsFor(directionId: string): SpecializationQuestion[] {
  return STAGE2_QUESTIONS[directionId] ?? [];
}

export function totalStage2Questions(): number {
  return Object.values(STAGE2_QUESTIONS).reduce((acc, qs) => acc + qs.length, 0);
}

// ===================== ЛЕЙБЛЫ ПСИХОТИПОВ =====================

export const RIASEC_LABELS: Record<string, { short: string; full: string }> = {
  realistic: { short: 'R', full: 'Прагматик' },
  investigative: { short: 'I', full: 'Исследователь' },
  artistic: { short: 'A', full: 'Творец' },
  social: { short: 'S', full: 'Коммуникатор' },
  enterprising: { short: 'E', full: 'Лидер' },
  conventional: { short: 'C', full: 'Систематизатор' }
};
