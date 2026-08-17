import type { ResourceLink } from '../types';

const docs = (title: string, url: string, type: ResourceLink['type'] = 'DOCS'): ResourceLink => ({ title, url, type });

export const RESOURCES: Record<string, ResourceLink[]> = {
  javascript: [
    docs('JavaScript — MDN Web Docs', 'https://developer.mozilla.org/ru/docs/Web/JavaScript'),
    docs('javascript.info — современный учебник', 'https://learn.javascript.ru/'),
    docs('Роадмап фронтендера (roadmap.sh)', 'https://roadmap.sh/frontend', 'REPO')
  ],
  typescript: [
    docs('Официальная документация TypeScript', 'https://www.typescriptlang.org/docs/'),
    docs('Типизация JS: бесплатный курс на Codecademy', 'https://www.codecademy.com/learn/learn-typescript', 'COURSE')
  ],
  html_css: [
    docs('MDN: HTML', 'https://developer.mozilla.org/ru/docs/Web/HTML'),
    docs('MDN: CSS', 'https://developer.mozilla.org/ru/docs/Web/CSS'),
    docs('Flexbox Froggy — тренажёр CSS', 'https://flexboxfroggy.com/', 'COURSE')
  ],
  react: [
    docs('Официальная документация React (react.dev)', 'https://react.dev/learn'),
    docs('Роадмап React (roadmap.sh)', 'https://roadmap.sh/react', 'REPO')
  ],
  vue: [docs('Официальная документация Vue.js', 'https://vuejs.org/guide/introduction.html')],
  svelte: [docs('Официальная документация Svelte', 'https://svelte.dev/docs')],
  angular: [docs('Официальная документация Angular', 'https://angular.dev/docs')],
  nextjs: [docs('Документация Next.js', 'https://nextjs.org/docs')],
  nodejs: [
    docs('Документация Node.js', 'https://nodejs.org/docs/latest/api/'),
    docs('Официальные уроки Node.js', 'https://nodejs.org/en/learn')
  ],
  python: [
    docs('Официальный учебник Python (python.org)', 'https://docs.python.org/3/tutorial/index.html'),
    docs('pythontutor — визуализатор кода', 'https://pythontutor.com/', 'COURSE'),
    docs('Бесплатный курс Python на Stepik', 'https://stepik.org/course/67', 'COURSE')
  ],
  java: [
    docs('Спецификация Java (Oracle)', 'https://docs.oracle.com/en/java/'),
    docs('Бесплатный курс Java на Stepik', 'https://stepik.org/course/187', 'COURSE')
  ],
  go: [
    docs('Документация Go (go.dev)', 'https://go.dev/doc/'),
    docs('A Tour of Go — интерактивный тур', 'https://go.dev/tour/', 'COURSE')
  ],
  rust: [docs('Книга Rust (The Book, русский перевод)', 'https://doc.rust-lang.org/book/ru/')],
  php: [docs('Документация PHP (php.net)', 'https://www.php.net/manual/ru/')],
  csharp: [docs('Документация C# (Microsoft Learn)', 'https://learn.microsoft.com/ru-ru/dotnet/csharp/')],
  cpp: [docs('Документация C++ (cppreference)', 'https://en.cppreference.com/w/')],
  kotlin: [docs('Документация Kotlin', 'https://kotlinlang.org/docs/home.html')],
  swift: [docs('Документация Swift', 'https://docs.swift.org/swift-book/')],
  flutter: [docs('Официальный курс Flutter', 'https://docs.flutter.dev/get-started/install', 'COURSE')],
  unity: [docs('Unity Learn — официальные курсы', 'https://learn.unity.com/', 'COURSE')],
  sql: [
    docs('SQLZoo — интерактивные тренажёры', 'https://sqlzoo.net/', 'COURSE'),
    docs('Курс SQL на Stepik', 'https://stepik.org/course/63054', 'COURSE')
  ],
  postgres: [
    docs('Документация PostgreSQL', 'https://www.postgresql.org/docs/'),
    docs('pgexercises — тренажёр по SQL', 'https://pgexercises.com/', 'COURSE')
  ],
  mongo: [docs('Документация MongoDB University (бесплатно)', 'https://learn.mongodb.com/', 'COURSE')],
  redis: [docs('Документация Redis', 'https://redis.io/docs/latest/')],
  graphql: [docs('Официальная документация GraphQL', 'https://graphql.org/learn/')],
  git: [
    docs('Pro Git (книга, русский перевод)', 'https://git-scm.com/book/ru/v2'),
    docs('Learn Git Branching — интерактив', 'https://learngitbranching.js.org/', 'COURSE')
  ],
  linux: [docs('The Linux Command Line (книга онлайн)', 'https://linuxcommand.org/tlcl.php')],
  bash: [docs('Руководство по Bash (GNU)', 'https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html')],
  docker: [
    docs('Документация Docker: Get Started', 'https://docs.docker.com/get-started/'),
    docs('Docker curriculum (docker-curriculum.com)', 'https://docker-curriculum.com/', 'COURSE')
  ],
  kubernetes: [
    docs('Документация Kubernetes', 'https://kubernetes.io/docs/'),
    docs('Бесплатный курс K8s на Stepik', 'https://stepik.org/course/130241', 'COURSE')
  ],
  ci_cd: [docs('GitHub Actions: официальное руководство', 'https://docs.github.com/ru/actions')],
  terraform: [docs('Документация Terraform', 'https://developer.hashicorp.com/terraform/docs')],
  cloud_aws: [docs('AWS Skill Builder (бесплатные курсы)', 'https://skillbuilder.aws/', 'COURSE')],
  cloud_gcp: [docs('Google Cloud Skills Boost', 'https://www.cloudskillsboost.google/', 'COURSE')],
  cloud_azure: [docs('Microsoft Learn: Azure', 'https://learn.microsoft.com/ru-ru/training/azure/', 'COURSE')],
  networks: [docs('Курс «Сети для разработчиков» (Stepik)', 'https://stepik.org/course/79', 'COURSE')],
  monitoring: [docs('Документация Grafana', 'https://grafana.com/docs/')],
  security: [docs('OWASP Top 10', 'https://owasp.org/www-project-top-ten/')],
  pentesting: [docs('PortSwigger Web Security Academy', 'https://portswigger.net/web-security', 'COURSE')],
  data_analysis: [
    docs('Курс «Анализ данных» (Stepik)', 'https://stepik.org/course/128485', 'COURSE'),
    docs('Kaggle Learn: Data Analysis', 'https://www.kaggle.com/learn/data-analysis', 'COURSE')
  ],
  statistics: [
    docs('Курс «Основы статистики» (Stepik)', 'https://stepik.org/course/2152', 'COURSE'),
    docs('Seeing Theory — визуальная статистика', 'https://seeing-theory.brown.edu/', 'COURSE')
  ],
  probability: [docs('Курс «Теория вероятностей» (Stepik)', 'https://stepik.org/course/3089', 'COURSE')],
  pandas: [docs('Документация Pandas', 'https://pandas.pydata.org/docs/')],
  numpy: [docs('Документация NumPy', 'https://numpy.org/doc/stable/')],
  matplotlib: [docs('Документация Matplotlib', 'https://matplotlib.org/stable/')],
  ab_testing: [
    docs('Курс «A/B-тесты» (Stepik)', 'https://stepik.org/course/125785', 'COURSE'),
    docs('Evan Miller: Sample Size Calculator', 'https://www.evanmiller.org/ab-testing/sample-size.html', 'REPO')
  ],
  machine_learning: [
    docs('Kaggle Learn: Intro to ML', 'https://www.kaggle.com/learn/intro-to-machine-learning', 'COURSE'),
    docs('Курс «Машинное обучение» (Stepik)', 'https://stepik.org/course/4852', 'COURSE')
  ],
  deep_learning: [
    docs('Deep Learning Specialization (Coursera, аудит бесплатен)', 'https://www.coursera.org/specializations/deep-learning', 'COURSE'),
    docs('d2l.ai — Dive into Deep Learning', 'https://d2l.ai/', 'REPO')
  ],
  nlp: [docs('Hugging Face NLP Course (бесплатно)', 'https://huggingface.co/learn/nlp-course', 'COURSE')],
  computer_vision: [docs('Курс Computer Vision (Stanford, бесплатно)', 'https://www.cs231n.stanford.edu/', 'COURSE')],
  llm: [
    docs('Prompt Engineering Guide', 'https://www.promptingguide.ai/', 'COURSE'),
    docs('Курс «LLM» (Coursera, аудит)', 'https://www.coursera.org/learn/llm-toolchains', 'COURSE')
  ],
  mlops: [docs('Made With ML: MLOps (бесплатно)', 'https://madewithml.com/', 'REPO')],
  etl: [docs('Статья: ETL-пайплайны с нуля (Habr)', 'https://habr.com/ru/search/?q=etl', 'ARTICLE')],
  dbt: [docs('Документация dbt', 'https://docs.getdbt.com/')],
  data_warehousing: [docs('Курс «Хранилища данных» (Stepik)', 'https://stepik.org/course/92699', 'COURSE')],
  spark: [docs('Документация Apache Spark', 'https://spark.apache.org/docs/latest/')],
  kafka: [docs('Документация Kafka (Confluent)', 'https://docs.confluent.io/kafka/introduction.html')],
  excel: [docs('Excel — Microsoft Learn', 'https://learn.microsoft.com/ru-ru/training/excel/', 'COURSE')],
  tableau: [docs('Tableau: бесплатные учебные материалы', 'https://www.tableau.com/learn', 'COURSE')],
  powerbi: [docs('Microsoft Learn: Power BI', 'https://learn.microsoft.com/ru-ru/training/powerplatform/power-bi', 'COURSE')],
  product_analytics: [docs('Гайд по продуктовой аналитике (Habr)', 'https://habr.com/ru/search/?q=продуктовая аналитика', 'ARTICLE')],
  funnels: [docs('Юнит-экономика: понятный гайд (vc.ru)', 'https://vc.ru/search?q=юнит-экономика', 'ARTICLE')],
  dashboards: [docs('Курс по дашбордам на Power BI (Stepik)', 'https://stepik.org/course/125789', 'COURSE')],
  product_management: [
    docs('Курс «Продуктовый менеджмент» (Stepik)', 'https://stepik.org/course/128593', 'COURSE'),
    docs('Бесплатный курс Product School (аудит)', 'https://www.productschool.com/free-courses', 'COURSE')
  ],
  product_strategy: [docs('Статья: Product Strategy (productplan.com)', 'https://www.productplan.com/learn/product-strategy/', 'ARTICLE')],
  roadmap_planning: [docs('Гайд по приоритизации (productplan.com)', 'https://www.productplan.com/learn/how-to-prioritize-product-features/', 'ARTICLE')],
  discovery: [docs('Гайд по Product Discovery (ProductTalk)', 'https://producttalk.org/workshops/product-discovery/', 'ARTICLE')],
  user_research: [docs('Nielsen Norman Group: UX-исследования', 'https://www.nngroup.com/topic/research/')],
  ux_design: [
    docs('Курс UX Design (Google, Coursera, аудит)', 'https://www.coursera.org/professional-certificates/google-ux-design', 'COURSE'),
    docs('Хейкинг UX (русскоязычный блог)', 'https://ux-journal.ru/', 'ARTICLE')
  ],
  ui_design: [docs('Курс «UI-дизайн» (Stepik)', 'https://stepik.org/course/124517', 'COURSE')],
  figma: [docs('Бесплатные уроки Figma (официальные)', 'https://www.figma.com/learn/', 'COURSE')],
  wireframing: [docs('Статья: Wireframing (NN/g)', 'https://www.nngroup.com/articles/wireflows/', 'ARTICLE')],
  usability_testing: [docs('NN/g: Usability Testing', 'https://www.nngroup.com/topic/usability-testing/')],
  design_systems: [docs('Design Systems 101 (NN/g)', 'https://www.nngroup.com/articles/design-systems-101/', 'ARTICLE')],
  accessibility: [docs('WebAIM: руководство по a11y', 'https://webaim.org/standards/wcag/checklist')],
  motion_design: [docs('Курс по Motion Design (Skillshare, бесплатный триал)', 'https://www.skillshare.com/', 'COURSE')],
  seo: [docs('Гайд по SEO (Google Search Central)', 'https://developers.google.com/search/docs', 'ARTICLE')],
  sem: [docs('Google Skillshop: реклама (бесплатно)', 'https://skillshop.exceedlms.com/student/catalog/list', 'COURSE')],
  smm: [docs('Гайд по SMM (vc.ru)', 'https://vc.ru/search?q=smm', 'ARTICLE')],
  content_marketing: [docs('Content Marketing Institute: блог', 'https://contentmarketinginstitute.com/blog/', 'ARTICLE')],
  email_marketing: [docs('Гайд по email-маркетингу (Mailchimp)', 'https://mailchimp.com/resources/email-marketing/', 'ARTICLE')],
  copywriting: [docs('Copyblogger: ресурсы', 'https://copyblogger.com/blog/', 'ARTICLE')],
  performance_marketing: [docs('Курс Performance-маркетинг (Stepik)', 'https://stepik.org/course/125786', 'COURSE')],
  growth_hacking: [docs('GrowthHackers: кейсы и статьи', 'https://growthhackers.com/', 'ARTICLE')],
  crm: [docs('Курс по CRM (Stepik)', 'https://stepik.org/course/92699', 'COURSE')],
  community_management: [docs('Гайд по сообществам (FeverBee)', 'https://www.feverbee.com/', 'ARTICLE')],
  market_research: [docs('Курс «Маркетинговые исследования» (Stepik)', 'https://stepik.org/course/127826', 'COURSE')],
  manual_testing: [
    docs('Курс «Основы тестирования ПО» (Stepik)', 'https://stepik.org/course/151430', 'COURSE'),
    docs('Глоссарий ISTQB (русский)', 'https://glossary.istqb.org/ru/')
  ],
  test_design: [docs('Курс «Тест-дизайн» (Stepik)', 'https://stepik.org/course/151431', 'COURSE')],
  automation_testing: [docs('Курс по автоматизации (Test Automation University)', 'https://testautomationu.applitools.com/', 'COURSE')],
  playwright: [docs('Официальная документация Playwright', 'https://playwright.dev/docs/intro')],
  selenium: [docs('Документация Selenium', 'https://www.selenium.dev/documentation/')],
  api_testing: [docs('Курс по API-тестированию (Postman)', 'https://academy.postman.com/', 'COURSE')],
  communication: [docs('Курс «Деловая коммуникация» (Stepik)', 'https://stepik.org/course/100562', 'COURSE')],
  negotiation: [docs('Курс «Переговоры» (Coursera, аудит)', 'https://www.coursera.org/learn/negotiation-skills', 'COURSE')],
  leadership: [docs('Курс «Лидерство» (Coursera, аудит)', 'https://www.coursera.org/learn/leadership-development', 'COURSE')],
  mentoring: [docs('Статья: как стать ментором (Software Lead Weekly)', 'https://softwareleadweekly.com/', 'ARTICLE')],
  presentation: [docs('Гайд по презентациям (SlideShare / Canva)', 'https://www.canva.com/learn/presentation-design/', 'ARTICLE')],
  stakeholder_management: [docs('Курс по стейкхолдерам (Coursera, аудит)', 'https://www.coursera.org/learn/engaging-stakeholders', 'COURSE')],
  time_management: [docs('Курс «Тайм-менеджмент» (Stepik)', 'https://stepik.org/course/126102', 'COURSE')],
  critical_thinking: [docs('Курс «Критическое мышление» (Stepik)', 'https://stepik.org/course/90400', 'COURSE')],
  teamwork: [docs('Курс «Командная работа» (Coursera, аудит)', 'https://www.coursera.org/learn/teamwork-skills', 'COURSE')],
  conflict_resolution: [docs('Гайд по разрешению конфликтов (MindTools)', 'https://www.mindtools.com/community/pages/article/newLDR_81.php', 'ARTICLE')],
  facilitation: [docs('Библиотека фасилитации (SessionLab)', 'https://www.sessionlab.com/library', 'REPO')],
  analytical_thinking: [docs('Курс «Аналитическое мышление» (Stepik)', 'https://stepik.org/course/101833', 'COURSE')],
  decision_making: [docs('Гайд по решениям (Farnam Street)', 'https://fs.blog/mental-models/', 'ARTICLE')],
  documentation: [docs('Write the Docs: гайды', 'https://www.writethedocs.org/guide/', 'ARTICLE')],
  requirements_analysis: [docs('Курс по анализу требований (BA-лекции)', 'https://analyst.by/', 'ARTICLE')],
  estimation: [docs('Статья: оценка в IT (Habr)', 'https://habr.com/ru/search/?q=оценка задач', 'ARTICLE')],
  risk_management: [docs('PMI: основы управления рисками', 'https://www.pmi.org/learning/library/risk-management-101-8978', 'ARTICLE')],
  project_planning: [docs('Курс «Управление проектами» (Stepik)', 'https://stepik.org/course/107770', 'COURSE')],
  scrum: [docs('Scrum Guide (русский)', 'https://scrumguides.org/docs/scrumguide/v1/Scrum-Guide-RU.pdf')],
  kanban: [docs('Гид по Kanban (Atlassian)', 'https://www.atlassian.com/agile/kanban', 'ARTICLE')],
  okr: [docs('Что такое OKR (What Matters)', 'https://www.whatmatters.com/faqs', 'ARTICLE')],
  english: [docs('Курс английского для IT (Stepik)', 'https://stepik.org/course/126102', 'COURSE')],
  b2b_sales: [docs('Курс по B2B-продажам (Coursera, аудит)', 'https://www.coursera.org/learn/b2b-sales-strategy', 'COURSE')],
  financial_modeling: [docs('Финансовое моделирование (Corporate Finance Institute, бесплатно)', 'https://corporatefinanceinstitute.com/', 'COURSE')]
};

const FALLBACK: ResourceLink[] = [
  docs('Поиск курсов по теме (Stepik)', 'https://stepik.org/catalog', 'COURSE'),
  docs('Статьи по теме (Habr)', 'https://habr.com/ru/search/?q=обучение', 'ARTICLE')
];

export function resourcesForSkill(skillId: string): ResourceLink[] {
  return RESOURCES[skillId] ?? FALLBACK;
}
