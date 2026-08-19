import { STAGE2_QUESTIONS } from './directions';

export interface ItmoProgram {
  id: string;
  title: string;
  code: string;
  directionId: string;
  priority: number;
  tagline: string;
}

export interface ItmoRequirements {
  /** Альтернативные комбинации ЕГЭ (каждая — набор из 3 предметов) */
  exams: string[][];
  /** Базовый минимум по каждому предмету комбинации (баллы ЕГЭ) */
  minBalls: number;
  /** Повышенные минимумы по отдельным предметам (например 75) */
  minBySubject?: Record<string, number>;
  /** Творческое испытание (если есть) */
  creative?: string;
  /** Средний балл ЕГЭ зачисленных, 2025 (0–100 по предмету, по данным abit.itmo.ru) */
  avg2025?: number;
  /** БВИ: олимпиады, дающие поступление без вступительных испытаний */
  bvi?: string;
  note?: string;
}

export interface ItmoTestQuestion {
  id: string;
  directionId: string;
  statement: string;
  priority: number;
}

export const ITMO_EXAM_SETS: Record<string, string[]> = {
  MIR: ['Математика (профиль)', 'Информатика и ИКТ', 'Русский язык'],
  MFR: ['Математика (профиль)', 'Физика', 'Русский язык'],
  MBR: ['Математика (профиль)', 'Биология', 'Русский язык'],
  MHR: ['Математика (профиль)', 'Химия', 'Русский язык'],
  MOR: ['Математика (профиль)', 'Обществознание', 'Русский язык'],
  MIYaR: ['Математика (профиль)', 'Иностранный язык', 'Русский язык'],
  LOR: ['Литература', 'Обществознание', 'Русский язык']
};

/**
 * Требования к поступлению на программы ИТМО.
 * ЕГЭ-комбинации и минимумы — по правилам приёма ИТМО (abit.itmo.ru, приём 2025–2026),
 * средние баллы 2025 — по данным приёмной кампании ИТМО. Уточняйте на abit.itmo.ru.
 */
export const ITMO_REQUIREMENTS: Record<string, ItmoRequirements> = {
  itmo_software: {
    exams: [ITMO_EXAM_SETS.MIR],
    minBalls: 60,
    avg2025: 97.9,
    bvi: 'Олимпиады РСОШ и ВсОШ по информатике, математике, физике — призёрам и победителям'
  },
  itmo_sys_sw: { exams: [ITMO_EXAM_SETS.MIR], minBalls: 60, bvi: 'Олимпиады РСОШ и ВсОШ по информатике и математике' },
  itmo_cst: { exams: [ITMO_EXAM_SETS.MIR], minBalls: 60, avg2025: 91.2, bvi: 'Олимпиады РСОШ и ВсОШ по информатике и математике' },
  itmo_neuro: { exams: [ITMO_EXAM_SETS.MIR], minBalls: 60, bvi: 'Олимпиады РСОШ и ВсОШ по информатике и математике' },
  itmo_games: { exams: [ITMO_EXAM_SETS.MIR], minBalls: 60, note: 'Профильное направление геймдева; отдельного творческого испытания нет' },
  itmo_cloud_dev: { exams: [ITMO_EXAM_SETS.MIR], minBalls: 60 },
  itmo_ml: {
    exams: [ITMO_EXAM_SETS.MIR],
    minBalls: 60,
    minBySubject: { 'Математика (профиль)': 75, 'Информатика и ИКТ': 75 },
    avg2025: 97.8,
    bvi: 'Олимпиады РСОШ по информатике и математике; Мегаконкурс ИТМО'
  },
  itmo_ai_eng: { exams: [ITMO_EXAM_SETS.MIR], minBalls: 60, avg2025: 99.3, bvi: 'Олимпиады РСОШ по информатике и математике' },
  itmo_comp_tech: {
    exams: [ITMO_EXAM_SETS.MIR],
    minBalls: 60,
    minBySubject: { 'Математика (профиль)': 75, 'Информатика и ИКТ': 75 },
    avg2025: 97.8,
    bvi: 'Олимпиады РСОШ по информатике и математике'
  },
  itmo_llm: { exams: [ITMO_EXAM_SETS.MIR], minBalls: 60, bvi: 'Олимпиады РСОШ по информатике и математике' },
  itmo_physics: { exams: [ITMO_EXAM_SETS.MFR], minBalls: 60, avg2025: 95.9, note: 'Дополнительные баллы за победы в олимпиадах по физике (приоритетны на зачисление)' },
  itmo_chem: { exams: [ITMO_EXAM_SETS.MHR], minBalls: 60, avg2025: 96.5 },
  itmo_bio: { exams: [ITMO_EXAM_SETS.MBR], minBalls: 60, note: 'Учитываются русский язык и профильная математика — по данным приёмной комиссии ИТМО' },
  itmo_eco: { exams: [ITMO_EXAM_SETS.MBR], minBalls: 60, avg2025: 83.6 },
  itmo_sec: { exams: [ITMO_EXAM_SETS.MIR], minBalls: 60, bvi: 'Олимпиады РСОШ и ВсОШ по информатике и математике' },
  itmo_photonics: { exams: [ITMO_EXAM_SETS.MFR], minBalls: 60, note: 'Программа физико-технического мегафакультета ИТМО' },
  itmo_laser: { exams: [ITMO_EXAM_SETS.MFR], minBalls: 60, note: 'Программа физико-технического мегафакультета ИТМО' },
  itmo_nano: { exams: [ITMO_EXAM_SETS.MFR], minBalls: 60, note: 'Программа физико-технического мегафакультета ИТМО' },
  itmo_robotics: { exams: [ITMO_EXAM_SETS.MFR, ITMO_EXAM_SETS.MIR], minBalls: 60, note: 'По выбору: физика или информатика' },
  itmo_design_dev: { exams: [ITMO_EXAM_SETS.MIR], minBalls: 60, note: 'Программа на стыке ИТ и дизайна; приём по направлению 09.03.04' },
  itmo_design: {
    exams: [ITMO_EXAM_SETS.LOR],
    minBalls: 60,
    creative: 'Творческое испытание «Рисунок и композиция» (мин. 60 баллов)',
    note: 'Точный перечень и форму испытания уточняйте на abit.itmo.ru — для 54.03.01 действуют особые правила приёма'
  },
  itmo_bizinf: { exams: [ITMO_EXAM_SETS.MOR, ITMO_EXAM_SETS.MIYaR], minBalls: 60, note: 'Обществознание или иностранный язык — по выбору поступающего' },
  itmo_innov: { exams: [ITMO_EXAM_SETS.MFR, ITMO_EXAM_SETS.MIR], minBalls: 60, note: 'По выбору: физика или информатика' }
};

export const ITMO_PROGRAMS: ItmoProgram[] = [
  // ============ Разработка ============
  { id: 'itmo_software', title: 'Разработка ПО / Software Engineering', code: '09.03.02', directionId: 'dev', priority: 5, tagline: 'Флагманская программа разработки: от алгоритмов до продакшена' },
  { id: 'itmo_sys_sw', title: 'Системное и прикладное ПО', code: '09.03.04', directionId: 'dev', priority: 5, tagline: 'Бэкенд, распределённые системы, системное программирование' },
  { id: 'itmo_cst', title: 'Компьютерные системы и технологии', code: '09.03.01', directionId: 'dev', priority: 4, tagline: 'Информатика и вычислительная техника: ядро инженерной разработки' },
  { id: 'itmo_neuro', title: 'Нейротехнологии и программирование', code: '09.03.04', directionId: 'dev', priority: 4, tagline: 'Программирование на стыке с нейронаукой и биосигналами' },
  { id: 'itmo_games', title: 'Технологии разработки компьютерных игр', code: '11.03.02', directionId: 'dev', priority: 4, tagline: 'Геймдев: движки, геймдизайн, графика' },
  { id: 'itmo_cloud_dev', title: 'Автоматизация разработки и управления ИС', code: '11.03.02', directionId: 'dev', priority: 3, tagline: 'DevOps-инструментарий и жизненный цикл информационных систем' },
  // ============ Данные и аналитика ============
  { id: 'itmo_ml', title: 'AI360: ML Native', code: '01.03.02', directionId: 'data', priority: 5, tagline: 'Искусственный интеллект как способ мышления, а не инструмент' },
  { id: 'itmo_ai_eng', title: 'Инженерия искусственного интеллекта', code: '02.03.03', directionId: 'data', priority: 5, tagline: 'Построение и эксплуатация ИИ-систем в масштабе' },
  { id: 'itmo_comp_tech', title: 'Компьютерные технологии', code: '01.03.02', directionId: 'data', priority: 4, tagline: 'Прикладная математика: математические модели, алгоритмы, данные' },
  { id: 'itmo_llm', title: 'Языковые модели и искусственный интеллект', code: '01.03.02', directionId: 'data', priority: 4, tagline: 'LLM: от промпт-инжиниринга до обучения моделей' },
  { id: 'itmo_physics', title: 'Теоретическая и экспериментальная физика', code: '03.03.02', directionId: 'data', priority: 3, tagline: 'Наука и исследования: физика как способ понимать мир' },
  { id: 'itmo_chem', title: 'Инфохимия', code: '04.03.01', directionId: 'data', priority: 3, tagline: 'Данные, R&D и цифровые методы в химии' },
  { id: 'itmo_bio', title: 'Биоинженерия', code: '12.03.04', directionId: 'data', priority: 3, tagline: 'Биотехнические системы: инженерия на стыке с биологией' },
  { id: 'itmo_eco', title: 'Экотехнологии и устойчивое развитие', code: '05.03.06', directionId: 'data', priority: 2, tagline: 'Экология и устойчивое развитие с опорой на данные' },
  // ============ Инженерия и инфраструктура ============
  { id: 'itmo_sec', title: 'Технологии защиты информации', code: '10.03.01', directionId: 'infra', priority: 5, tagline: 'Кибербезопасность: защита данных, сетей и систем' },
  { id: 'itmo_photonics', title: 'Физика фотонных технологий', code: '12.03.03', directionId: 'infra', priority: 4, tagline: 'Фотоника: оптика, лазеры, фоточувствительные системы' },
  { id: 'itmo_laser', title: 'Лазерные технологии', code: '12.03.05', directionId: 'infra', priority: 4, tagline: 'Лазерная техника: от лаборатории до промышленности' },
  { id: 'itmo_nano', title: 'Физика наноструктур', code: '12.03.03', directionId: 'infra', priority: 3, tagline: 'Наноматериалы и микроэлектронные структуры' },
  { id: 'itmo_robotics', title: 'Робототехника и искусственный интеллект', code: '15.03.06', directionId: 'infra', priority: 4, tagline: 'Роботы, мехатроника, автономные системы управления' },
  // ============ Продукт и дизайн ============
  { id: 'itmo_design_dev', title: 'Компьютерные технологии в дизайне', code: '09.03.04 — 54.03.01', directionId: 'product', priority: 5, tagline: 'Код и дизайн: интерактивные системы, генеративный дизайн' },
  { id: 'itmo_design', title: 'Дизайн', code: '54.03.01', directionId: 'product', priority: 4, tagline: 'UX/UI, предметный и цифровой дизайн' },
  // ============ Менеджмент ============
  { id: 'itmo_bizinf', title: 'Бизнес-информатика', code: '38.03.05', directionId: 'mgmt', priority: 5, tagline: 'ИТ и бизнес: архитектура процессов, аналитика, управление' },
  { id: 'itmo_innov', title: 'Инноватика', code: '27.03.05', directionId: 'mgmt', priority: 4, tagline: 'Технологическое предпринимательство и управление инновациями' }
];

export const ITMO_PROGRAM_BY_ID: Record<string, ItmoProgram> = Object.fromEntries(
  ITMO_PROGRAMS.map((p) => [p.id, p])
);

export function itmoDirections(): string[] {
  return [...new Set(ITMO_PROGRAMS.map((p) => p.directionId))];
}

export function itmoRequirements(p: ItmoProgram): ItmoRequirements {
  return (
    ITMO_REQUIREMENTS[p.id] ?? { exams: [ITMO_EXAM_SETS.MIR], minBalls: 60, note: 'Требования уточняйте на abit.itmo.ru' }
  );
}

// ===================== РАНДОМАЙЗЕР ТЕСТА =====================

function shake<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function seededRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Собирает рандомизированный тест ИТМО: по k вопросов на каждое выбранное
 * направление (в равной мере), затем общая перетасовка. Каждый вопрос несёт
 * priority — базовый приоритет программ своего направления.
 */
export function buildItmoTest(
  directionIds: string[],
  questionsPerDirection = 2,
  rng: () => number = Math.random
): ItmoTestQuestion[] {
  const pickedByDir: ItmoTestQuestion[][] = [];

  for (const dirId of directionIds) {
    const pool = STAGE2_QUESTIONS[dirId] ?? [];
    const programs = ITMO_PROGRAMS.filter((p) => p.directionId === dirId);
    const avgPriority = programs.length
      ? Math.round(programs.reduce((acc, p) => acc + p.priority, 0) / programs.length)
      : 1;
    const picked = shake(pool, rng)
      .slice(0, questionsPerDirection)
      .map((q) => ({
        id: `${dirId}:${q.id}`,
        directionId: dirId,
        statement: q.statement,
        priority: avgPriority
      }));
    pickedByDir.push(picked);
  }

  return shake(pickedByDir.flat(), rng);
}

// ===================== СКОРИНГ ПРОГРАММ =====================

export interface ItmoProgramScore {
  program: ItmoProgram;
  directionTitle: string;
  score: number;
  percent: number;
}

export function computeItmoScores(
  answers: Record<string, string>,
  questions: ItmoTestQuestion[],
  factorOf: (optionId: string) => number
): ItmoProgramScore[] {
  const scores = new Map<string, { raw: number; max: number }>();
  const dirTitles: Record<string, string> = {
    dev: 'Разработка', data: 'Данные и аналитика', product: 'Продукт и дизайн',
    marketing: 'Маркетинг и продажи', mgmt: 'Менеджмент', infra: 'Инженерия и инфраструктура',
    people: 'Люди и обучение'
  };

  for (const q of questions) {
    const optionId = answers[q.id];
    if (!optionId) continue;
    const f = factorOf(optionId);
    for (const p of ITMO_PROGRAMS.filter((x) => x.directionId === q.directionId)) {
      const cur = scores.get(p.id) ?? { raw: 0, max: 0 };
      cur.raw += f * p.priority;
      cur.max += 2 * p.priority;
      scores.set(p.id, cur);
    }
  }

  return ITMO_PROGRAMS.map((p) => {
    const s = scores.get(p.id) ?? { raw: 0, max: 0 };
    return {
      program: p,
      directionTitle: dirTitles[p.directionId] ?? p.directionId,
      score: s.raw,
      percent: s.max > 0 ? Math.max(0, Math.min(100, Math.round((s.raw / s.max) * 100))) : 0
    };
  })
    .filter((x) => x.percent > 0 || x.score > 0)
    .sort((a, b) => b.percent - a.percent || b.program.priority - a.program.priority)
    .slice(0, 6);
}

export function seededRngFactory(seed: number): () => number {
  return seededRng(seed);
}