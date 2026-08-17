import type { CareerRoleTarget, PsychologicalVector, RequiredSkill } from '../types';
import { SKILLS } from './skills';

const psych = (
  realistic: number, investigative: number, artistic: number, social: number,
  enterprising: number, conventional: number,
  ambiguityTolerance = 0.5, peopleInteractionLoad = 0.5, autonomyPreference = 0.5
): PsychologicalVector => ({
  realistic, investigative, artistic, social, enterprising, conventional,
  ambiguityTolerance, peopleInteractionLoad, autonomyPreference
});

const PSY = {
  dev: psych(0.62, 0.76, 0.28, 0.3, 0.38, 0.42, 0.6, 0.32, 0.78),
  data: psych(0.38, 0.86, 0.2, 0.32, 0.34, 0.5, 0.62, 0.32, 0.7),
  product: psych(0.18, 0.52, 0.58, 0.66, 0.8, 0.36, 0.78, 0.68, 0.52),
  design: psych(0.28, 0.42, 0.92, 0.58, 0.44, 0.32, 0.72, 0.5, 0.72),
  marketing: psych(0.18, 0.46, 0.55, 0.62, 0.82, 0.44, 0.74, 0.62, 0.5),
  qa: psych(0.5, 0.62, 0.3, 0.42, 0.28, 0.76, 0.5, 0.4, 0.6),
  infra: psych(0.82, 0.7, 0.16, 0.26, 0.34, 0.56, 0.55, 0.28, 0.8),
  mgmt: psych(0.3, 0.52, 0.3, 0.76, 0.86, 0.48, 0.76, 0.84, 0.45),
  support: psych(0.6, 0.5, 0.3, 0.6, 0.35, 0.6, 0.5, 0.6, 0.5),
  creative: psych(0.35, 0.45, 0.95, 0.55, 0.5, 0.25, 0.75, 0.45, 0.75),
  sales: psych(0.2, 0.4, 0.35, 0.7, 0.9, 0.4, 0.7, 0.7, 0.55),
  content: psych(0.25, 0.45, 0.8, 0.62, 0.55, 0.35, 0.7, 0.55, 0.6)
} as const;

type PsyKey = keyof typeof PSY;

const req = (skillId: string, minLevel: RequiredSkill['minLevel'] = 3, isMandatory = false): RequiredSkill =>
  ({ skillId, minLevel, isMandatory });

const R = (
  id: string, title: string, industry: string, medianSalaryRub: number, marketGrowthTrendPercent: number,
  psyKey: PsyKey, skills: RequiredSkill[], description?: string
): CareerRoleTarget => ({
  id,
  title,
  industry,
  medianSalaryRub,
  marketGrowthTrendPercent,
  requiredPsychology: PSY[psyKey],
  requiredSkills: skills,
  description: description ?? `${title} — позиция в сфере ${industry}. Ключевые требования: ${skills.map((s) => SKILLS[s.skillId]?.name ?? s.skillId).join(', ')}.`
});

// ============ БАЗОВЫЕ РОЛИ ============

const BASE_ROLES: CareerRoleTarget[] = [
  // ---------- Данные и аналитика ----------
  R('data_analyst', 'Аналитик данных', 'Данные и аналитика', 150000, 12, 'data', [
    req('data_analysis', 3, true), req('sql', 3, true), req('statistics'), req('pandas'),
    req('excel'), req('dashboards'), req('matplotlib'), req('product_analytics'), req('communication')
  ]),
  R('product_analyst', 'Продуктовый аналитик', 'IT-продукты', 185000, 15, 'data', [
    req('product_analytics', 3, true), req('data_analysis', 3, true), req('sql', 3, true),
    req('ab_testing', 3), req('funnels'), req('statistics'), req('dashboards'), req('cohorts'), req('communication')
  ]),
  R('business_analyst', 'Бизнес-аналитик', 'IT / Консалтинг', 170000, 8, 'data', [
    req('requirements_analysis', 3, true), req('sql', 3), req('communication', 3, true),
    req('excel'), req('documentation'), req('stakeholder_management'), req('data_analysis'), req('project_planning')
  ]),
  R('system_analyst', 'Системный аналитик', 'IT / Enterprise', 175000, 9, 'data', [
    req('requirements_analysis', 3, true), req('sql', 3), req('documentation', 3, true),
    req('communication', 3, true), req('data_analysis'), req('estimation'), req('stakeholder_management'), req('rest_api')
  ]),
  R('data_scientist', 'Data Scientist', 'Данные и аналитика', 265000, 18, 'data', [
    req('python', 3, true), req('machine_learning', 3, true), req('statistics', 3, true),
    req('probability'), req('sql'), req('ab_testing'), req('deep_learning'), req('nlp'), req('communication')
  ]),
  R('ml_engineer', 'ML-инженер', 'Данные и аналитика', 255000, 16, 'data', [
    req('python', 3, true), req('machine_learning', 3, true), req('mlops', 3, true),
    req('docker'), req('system_design'), req('statistics'), req('unit_testing'), req('cloud_aws'), req('git')
  ]),
  R('llm_engineer', 'LLM-инженер', 'Данные и аналитика', 285000, 25, 'data', [
    req('llm', 3, true), req('python', 3, true), req('machine_learning', 3),
    req('nlp'), req('mlops'), req('rest_api'), req('docker'), req('git')
  ]),
  R('analytics_engineer', 'Analytics Engineer', 'Данные и аналитика', 215000, 14, 'data', [
    req('sql', 3, true), req('dbt', 3, true), req('data_warehousing', 3),
    req('python'), req('etl'), req('git'), req('dashboards'), req('statistics')
  ]),
  R('data_engineer', 'Инженер данных', 'Данные и аналитика', 235000, 12, 'infra', [
    req('python', 3, true), req('sql', 3, true), req('etl', 3, true),
    req('spark'), req('kafka'), req('docker'), req('data_warehousing'), req('linux')
  ]),
  R('bi_developer', 'BI-разработчик', 'Данные и аналитика', 160000, 6, 'data', [
    req('sql', 3, true), req('powerbi', 3, true), req('dashboards', 3, true),
    req('excel'), req('etl'), req('data_warehousing'), req('communication')
  ]),
  R('mlops_engineer', 'MLOps-инженер', 'Данные и аналитика', 265000, 20, 'infra', [
    req('docker', 3, true), req('kubernetes', 3, true), req('python', 3, true),
    req('mlops', 3, true), req('ci_cd'), req('cloud_aws'), req('monitoring'), req('linux')
  ]),
  R('financial_analyst', 'Финансовый аналитик', 'Финансы', 195000, 7, 'data', [
    req('excel', 3, true), req('financial_modeling', 3, true), req('data_analysis', 3),
    req('statistics'), req('sql'), req('communication'), req('presentation')
  ]),
  R('risk_analyst', 'Риск-аналитик', 'Финансы', 205000, 7, 'data', [
    req('statistics', 3, true), req('financial_modeling', 3), req('data_analysis', 3, true),
    req('probability'), req('excel'), req('sql'), req('risk_management')
  ]),
  R('web_analyst', 'Веб-аналитик', 'Digital / Маркетинг', 145000, 7, 'data', [
    req('data_analysis', 3, true), req('google_sheets', 3), req('dashboards'),
    req('funnels'), req('sql'), req('crm'), req('communication')
  ]),

  // ---------- Разработка ----------
  R('frontend_developer', 'Frontend-разработчик (React)', 'Разработка', 185000, 10, 'dev', [
    req('javascript', 3, true), req('html_css', 3, true), req('react', 3, true),
    req('typescript', 3), req('git'), req('unit_testing'), req('rest_api')
  ]),
  R('vue_developer', 'Frontend-разработчик (Vue)', 'Разработка', 178000, 9, 'dev', [
    req('vue', 3, true), req('javascript', 3, true), req('html_css', 3, true),
    req('typescript'), req('git'), req('unit_testing')
  ]),
  R('angular_developer', 'Frontend-разработчик (Angular)', 'Разработка', 182000, 8, 'dev', [
    req('angular', 3, true), req('typescript', 3, true), req('html_css', 3),
    req('git'), req('unit_testing'), req('rest_api')
  ]),
  R('fullstack_developer', 'Fullstack-разработчик', 'Разработка', 225000, 11, 'dev', [
    req('javascript', 3, true), req('nodejs', 3, true), req('react', 3),
    req('sql'), req('rest_api'), req('typescript'), req('git'), req('docker')
  ]),
  R('backend_python', 'Backend-разработчик (Python)', 'Разработка', 205000, 10, 'dev', [
    req('python', 3, true), req('rest_api', 3, true), req('sql', 3),
    req('docker'), req('postgres'), req('git'), req('linux'), req('microservices')
  ]),
  R('backend_go', 'Backend-разработчик (Go)', 'Разработка', 225000, 12, 'dev', [
    req('go', 3, true), req('rest_api', 3, true), req('sql', 3),
    req('docker'), req('postgres'), req('git'), req('microservices'), req('kafka')
  ]),
  R('backend_java', 'Backend-разработчик (Java)', 'Разработка', 215000, 9, 'dev', [
    req('java', 3, true), req('sql', 3), req('rest_api', 3, true),
    req('docker'), req('design_patterns'), req('microservices'), req('git')
  ]),
  R('backend_node', 'Backend-разработчик (Node.js)', 'Разработка', 195000, 10, 'dev', [
    req('nodejs', 3, true), req('javascript', 3, true), req('rest_api', 3),
    req('sql'), req('postgres'), req('docker'), req('git')
  ]),
  R('backend_php', 'Backend-разработчик (PHP)', 'Разработка', 145000, 3, 'dev', [
    req('php', 3, true), req('sql', 3, true), req('rest_api', 3),
    req('git'), req('html_css')
  ]),
  R('backend_csharp', 'Backend-разработчик (C#/.NET)', 'Разработка', 205000, 8, 'dev', [
    req('csharp', 3, true), req('sql', 3), req('rest_api', 3, true),
    req('design_patterns'), req('docker'), req('git')
  ]),
  R('backend_rust', 'Backend-разработчик (Rust)', 'Разработка', 245000, 12, 'dev', [
    req('rust', 3, true), req('rest_api', 3), req('linux', 3),
    req('sql'), req('git'), req('microservices')
  ]),
  R('mobile_ios_dev', 'iOS-разработчик', 'Мобильная разработка', 235000, 10, 'dev', [
    req('swift', 3, true), req('mobile_ios', 3, true), req('rest_api', 3),
    req('git'), req('design_patterns')
  ]),
  R('mobile_android_dev', 'Android-разработчик', 'Мобильная разработка', 225000, 10, 'dev', [
    req('kotlin', 3, true), req('mobile_android', 3, true), req('rest_api', 3),
    req('git'), req('design_patterns')
  ]),
  R('flutter_dev', 'Flutter-разработчик', 'Мобильная разработка', 195000, 9, 'dev', [
    req('flutter', 3, true), req('rest_api', 3), req('git'),
    req('mobile_ios'), req('mobile_android'), req('design_patterns')
  ]),
  R('react_native_dev', 'React Native-разработчик', 'Мобильная разработка', 205000, 9, 'dev', [
    req('react_native', 3, true), req('javascript', 3, true), req('rest_api', 3),
    req('git'), req('mobile_ios')
  ]),
  R('unity_dev', 'Unity-разработчик', 'Геймдев', 165000, 6, 'dev', [
    req('unity', 3, true), req('csharp', 3, true), req('gamedev_domain', 3),
    req('rest_api'), req('design_patterns')
  ]),
  R('unreal_dev', 'Unreal-разработчик', 'Геймдев', 180000, 7, 'dev', [
    req('unreal', 3, true), req('cpp', 3, true), req('gamedev_domain', 3),
    req('design_patterns'), req('git')
  ]),
  R('systems_cpp', 'C++-разработчик (системный)', 'Разработка / Инфраструктура', 225000, 7, 'dev', [
    req('cpp', 3, true), req('c', 3, true), req('linux', 3),
    req('git'), req('networks'), req('design_patterns')
  ]),
  R('embedded_dev', 'Embedded-разработчик', 'Embedded / IoT', 215000, 7, 'dev', [
    req('c', 3, true), req('cpp', 3, true), req('linux', 3),
    req('git'), req('networks')
  ]),
  R('iot_dev', 'IoT-разработчик', 'Embedded / IoT', 185000, 8, 'dev', [
    req('c', 3, true), req('cpp', 3), req('python', 3),
    req('networks', 3), req('linux'), req('rest_api')
  ]),
  R('no_code_dev', 'No-code разработчик (Internal Tools)', 'IT-продукты', 150000, 10, 'dev', [
    req('rest_api', 3, true), req('sql', 3), req('crm', 3),
    req('google_sheets'), req('product_analytics'), req('funnels')
  ]),
  R('rpa_developer', 'RPA-разработчик', 'Разработка / Автоматизация', 175000, 7, 'dev', [
    req('python', 3, true), req('rest_api', 3), req('crm', 3),
    req('sql'), req('linux'), req('git')
  ]),

  // ---------- DevOps / Инфраструктура / Безопасность ----------
  R('devops_engineer', 'DevOps-инженер', 'Инфраструктура', 245000, 14, 'infra', [
    req('docker', 3, true), req('ci_cd', 3, true), req('linux', 3, true),
    req('kubernetes', 3), req('terraform'), req('cloud_aws'), req('bash'), req('git'), req('monitoring')
  ]),
  R('sre', 'SRE-инженер', 'Инфраструктура', 255000, 13, 'infra', [
    req('linux', 3, true), req('kubernetes', 3, true), req('monitoring', 3, true),
    req('bash'), req('python'), req('docker'), req('ci_cd'), req('cloud_aws')
  ]),
  R('cloud_architect', 'Cloud-архитектор', 'Инфраструктура', 305000, 12, 'infra', [
    req('cloud_aws', 3, true), req('architecture', 3, true), req('system_design', 3),
    req('docker'), req('kubernetes'), req('terraform'), req('networks'), req('linux')
  ]),
  R('security_engineer', 'Security-инженер', 'Инфраструктура / Безопасность', 245000, 12, 'infra', [
    req('security', 3, true), req('linux', 3), req('networks', 3),
    req('python'), req('docker'), req('pentesting')
  ]),
  R('sysadmin', 'Системный администратор', 'Инфраструктура', 125000, 4, 'infra', [
    req('linux', 3, true), req('networks', 3, true), req('bash', 3),
    req('monitoring'), req('docker'), req('nginx')
  ]),
  R('network_engineer', 'Сетевой инженер', 'Инфраструктура', 195000, 6, 'infra', [
    req('networks', 3, true), req('linux', 3, true), req('bash', 3),
    req('security'), req('monitoring')
  ]),
  R('database_administrator', 'Администратор БД (DBA)', 'Инфраструктура', 195000, 6, 'infra', [
    req('postgres', 3, true), req('sql', 3, true), req('linux', 3),
    req('bash'), req('monitoring'), req('redis'), req('networks')
  ]),

  // ---------- QA ----------
  R('qa_manual', 'QA-инженер (ручное тестирование)', 'QA', 120000, 5, 'qa', [
    req('manual_testing', 3, true), req('test_design', 3, true), req('api_testing', 3),
    req('sql'), req('communication'), req('documentation')
  ]),
  R('qa_automation', 'QA Automation-инженер (Playwright)', 'QA', 185000, 9, 'qa', [
    req('automation_testing', 3, true), req('playwright', 3, true), req('test_design', 3, true),
    req('javascript'), req('python'), req('api_testing'), req('git'), req('sql')
  ]),
  R('qa_lead', 'QA-лид', 'QA', 235000, 7, 'qa', [
    req('automation_testing', 3, true), req('manual_testing', 3), req('test_design', 3, true),
    req('leadership', 3), req('mentoring'), req('project_planning'), req('communication'), req('stakeholder_management')
  ]),
  R('performance_tester', 'Инженер нагрузочного тестирования', 'QA', 185000, 5, 'qa', [
    req('performance_testing', 3, true), req('linux', 3), req('api_testing', 3),
    req('python'), req('monitoring')
  ]),
  R('mobile_qa', 'Мобильный QA-инженер', 'QA', 135000, 5, 'qa', [
    req('mobile_testing', 3, true), req('manual_testing', 3, true), req('test_design', 3),
    req('api_testing'), req('documentation')
  ]),

  // ---------- Продукт ----------
  R('product_manager', 'Продуктовый менеджер', 'IT-продукты', 245000, 12, 'product', [
    req('product_management', 3, true), req('product_strategy', 3, true), req('roadmap_planning', 3, true),
    req('discovery'), req('user_research'), req('funnels'), req('data_analysis'),
    req('communication', 3, true), req('presentation'), req('stakeholder_management')
  ]),
  R('technical_pm', 'Технический продукт-менеджер', 'IT-продукты', 265000, 13, 'product', [
    req('product_management', 3, true), req('roadmap_planning', 3), req('data_analysis', 3, true),
    req('ab_testing'), req('product_analytics'), req('sql'), req('presentation'),
    req('communication', 3, true), req('discovery')
  ]),
  R('product_owner', 'Product Owner', 'IT / Enterprise', 225000, 9, 'product', [
    req('scrum', 3, true), req('roadmap_planning', 3, true), req('requirements_analysis', 3, true),
    req('stakeholder_management'), req('communication', 3, true), req('product_management'), req('estimation')
  ]),
  R('game_designer', 'Геймдизайнер', 'Геймдев', 165000, 7, 'creative', [
    req('gamedev_domain', 3, true), req('critical_thinking', 3), req('data_analysis', 3),
    req('presentation'), req('figma'), req('unity'), req('communication')
  ]),

  // ---------- Дизайн ----------
  R('ux_researcher', 'UX-исследователь', 'Дизайн', 195000, 9, 'design', [
    req('user_research', 3, true), req('usability_testing', 3, true), req('data_analysis', 3),
    req('communication', 3, true), req('presentation'), req('critical_thinking'), req('discovery')
  ]),
  R('ux_designer', 'UX/UI-дизайнер', 'Дизайн', 185000, 9, 'design', [
    req('ux_design', 3, true), req('ui_design', 3, true), req('figma', 3, true),
    req('wireframing', 3), req('user_research'), req('usability_testing'), req('design_systems'), req('communication')
  ]),
  R('product_designer', 'Продуктовый дизайнер', 'Дизайн / IT-продукты', 205000, 10, 'design', [
    req('ui_design', 3, true), req('ux_design', 3, true), req('figma', 3, true),
    req('wireframing', 3, true), req('design_systems'), req('user_research'), req('accessibility')
  ]),
  R('graphic_designer', 'Графический дизайнер', 'Дизайн', 135000, 4, 'design', [
    req('figma', 3, true), req('illustration', 3), req('branding', 3),
    req('ui_design'), req('motion_design')
  ]),
  R('motion_designer', 'Motion-дизайнер', 'Дизайн', 155000, 6, 'creative', [
    req('motion_design', 3, true), req('figma', 3), req('illustration', 3),
    req('branding'), req('ui_design')
  ]),
  R('illustrator', 'Иллюстратор / 2D-художник', 'Дизайн', 115000, 4, 'creative', [
    req('illustration', 3, true), req('figma', 3, true), req('branding'),
    req('motion_design')
  ]),
  R('artist_3d', '3D-художник', 'Дизайн / Геймдев', 135000, 5, 'creative', [
    req('illustration', 3, true), req('gamedev_domain'), req('figma')
  ]),
  R('ux_writer', 'UX-писатель / контент-дизайнер', 'Дизайн / IT-продукты', 155000, 8, 'content', [
    req('copywriting', 3, true), req('ux_design', 3), req('communication', 3, true),
    req('user_research'), req('accessibility'), req('ui_design')
  ]),

  // ---------- Маркетинг и рост ----------
  R('growth_marketer', 'Growth-маркетолог', 'IT-продукты', 205000, 11, 'marketing', [
    req('growth_hacking', 3, true), req('product_analytics', 3, true), req('funnels', 3),
    req('data_analysis'), req('ab_testing'), req('crm'), req('communication'), req('performance_marketing')
  ]),
  R('performance_marketer', 'Performance-маркетолог', 'Digital / Маркетинг', 175000, 8, 'marketing', [
    req('performance_marketing', 3, true), req('sem', 3, true), req('attribution', 3),
    req('funnels'), req('google_sheets'), req('data_analysis'), req('crm')
  ]),
  R('media_buyer', 'Медиабайер', 'Digital / Маркетинг', 155000, 7, 'marketing', [
    req('sem', 3, true), req('performance_marketing', 3, true), req('attribution', 3),
    req('data_analysis'), req('funnels'), req('google_sheets')
  ]),
  R('affiliate_manager', 'Affiliate-менеджер', 'Digital / Маркетинг', 165000, 7, 'sales', [
    req('performance_marketing', 3, true), req('negotiation', 3, true), req('funnels', 3),
    req('communication'), req('attribution'), req('google_sheets')
  ]),
  R('seo_specialist', 'SEO-специалист', 'Digital / Маркетинг', 145000, 5, 'marketing', [
    req('seo', 3, true), req('content_marketing', 3), req('html_css', 3),
    req('google_sheets'), req('data_analysis'), req('crm')
  ]),
  R('smm_specialist', 'SMM-специалист', 'Digital / Маркетинг', 125000, 5, 'content', [
    req('smm', 3, true), req('content_marketing', 3, true), req('copywriting', 3),
    req('community_management'), req('figma'), req('communication')
  ]),
  R('content_marketer', 'Контент-маркетолог', 'Digital / Маркетинг', 145000, 6, 'content', [
    req('content_marketing', 3, true), req('copywriting', 3, true), req('seo', 3),
    req('email_marketing'), req('presentation'), req('figma')
  ]),
  R('email_marketer', 'Email-маркетолог', 'Digital / Маркетинг', 145000, 6, 'marketing', [
    req('email_marketing', 3, true), req('copywriting', 3), req('crm', 3, true),
    req('funnels'), req('ab_testing'), req('google_sheets')
  ]),
  R('product_marketing_manager', 'Product Marketing Manager', 'IT-продукты', 225000, 10, 'marketing', [
    req('market_research', 3, true), req('product_management', 3), req('content_marketing', 3),
    req('funnels'), req('presentation'), req('communication', 3, true), req('copywriting')
  ]),
  R('brand_manager', 'Бренд-менеджер', 'Маркетинг / FMCG', 195000, 7, 'marketing', [
    req('brand_marketing', 3, true), req('market_research', 3), req('content_marketing', 3),
    req('smm'), req('pr'), req('presentation')
  ]),
  R('pr_manager', 'PR-менеджер', 'Маркетинг / Коммуникации', 155000, 6, 'content', [
    req('pr', 3, true), req('content_marketing', 3), req('copywriting', 3, true),
    req('communication', 3, true), req('community_management'), req('presentation')
  ]),
  R('community_manager', 'Community-менеджер', 'IT-продукты', 125000, 5, 'content', [
    req('community_management', 3, true), req('smm', 3), req('content_marketing', 3),
    req('copywriting'), req('communication', 3, true), req('facilitation')
  ]),

  // ---------- Управление ----------
  R('team_lead_dev', 'Team Lead (разработка)', 'Разработка', 285000, 10, 'mgmt', [
    req('leadership', 3, true), req('mentoring', 3, true), req('system_design', 3),
    req('estimation'), req('scrum'), req('communication', 3, true), req('conflict_resolution'), req('project_planning')
  ]),
  R('engineering_manager', 'Engineering Manager', 'Разработка', 325000, 9, 'mgmt', [
    req('leadership', 3, true), req('mentoring', 3, true), req('project_planning', 3, true),
    req('stakeholder_management'), req('communication', 3, true), req('risk_management'), req('scrum')
  ]),
  R('product_lead', 'Продуктовый лид', 'IT-продукты', 305000, 11, 'product', [
    req('product_strategy', 3, true), req('leadership', 3, true), req('product_management', 3, true),
    req('roadmap_planning'), req('stakeholder_management'), req('data_analysis'), req('presentation')
  ]),
  R('it_architect', 'IT-архитектор', 'Разработка / Enterprise', 325000, 10, 'dev', [
    req('architecture', 3, true), req('system_design', 3, true), req('microservices', 3),
    req('cloud_aws'), req('design_patterns'), req('stakeholder_management'), req('communication'), req('estimation')
  ]),
  R('solution_architect', 'Solution-архитектор', 'IT / Enterprise', 305000, 10, 'dev', [
    req('architecture', 3, true), req('system_design', 3, true), req('microservices', 3),
    req('requirements_analysis'), req('stakeholder_management'), req('communication', 3, true), req('presentation')
  ]),
  R('scrum_master', 'Scrum-мастер', 'IT / Управление', 185000, 7, 'mgmt', [
    req('scrum', 3, true), req('facilitation', 3, true), req('communication', 3, true),
    req('kanban'), req('conflict_resolution'), req('mentoring'), req('okr')
  ]),
  R('agile_coach', 'Agile-коуч', 'IT / Управление', 225000, 6, 'mgmt', [
    req('scrum', 3, true), req('facilitation', 3, true), req('mentoring', 3, true),
    req('kanban'), req('okr'), req('leadership'), req('communication')
  ]),
  R('project_manager', 'Менеджер проектов', 'IT / Управление', 215000, 8, 'mgmt', [
    req('project_planning', 3, true), req('risk_management', 3, true), req('estimation', 3, true),
    req('scrum'), req('communication', 3, true), req('stakeholder_management'), req('documentation'), req('time_management')
  ]),
  R('delivery_manager', 'Delivery Manager', 'IT / Управление', 265000, 9, 'mgmt', [
    req('project_planning', 3, true), req('scrum', 3, true), req('stakeholder_management', 3, true),
    req('risk_management'), req('leadership'), req('estimation'), req('kanban')
  ]),
  R('program_manager', 'Программ-менеджер', 'IT / Enterprise', 325000, 8, 'mgmt', [
    req('project_planning', 3, true), req('risk_management', 3, true), req('stakeholder_management', 3, true),
    req('leadership'), req('product_strategy'), req('estimation'), req('negotiation')
  ]),
  R('it_director', 'IT-директор (CIO/CTO)', 'Управление / Топ-менеджмент', 405000, 8, 'mgmt', [
    req('leadership', 3, true), req('architecture', 3), req('project_planning', 3, true),
    req('stakeholder_management', 3), req('risk_management'), req('product_strategy'), req('negotiation')
  ]),
  R('head_of_analytics', 'Руководитель аналитики', 'Данные и аналитика', 355000, 10, 'mgmt', [
    req('leadership', 3, true), req('product_analytics', 3, true), req('data_warehousing', 3),
    req('machine_learning'), req('stakeholder_management'), req('project_planning'), req('presentation')
  ]),
  R('head_of_design', 'Дизайн-директор', 'Дизайн / Управление', 325000, 8, 'mgmt', [
    req('leadership', 3, true), req('design_systems', 3), req('ux_design', 3, true),
    req('ui_design', 3), req('stakeholder_management'), req('presentation'), req('mentoring')
  ]),
  R('head_of_marketing', 'Маркетинг-директор (CMO)', 'Маркетинг / Управление', 345000, 8, 'mgmt', [
    req('leadership', 3, true), req('brand_marketing', 3, true), req('market_research', 3),
    req('performance_marketing'), req('funnels'), req('negotiation'), req('presentation'), req('stakeholder_management')
  ]),

  // ---------- Продажи и партнёрства ----------
  R('b2b_sales_manager', 'IT-менеджер по продажам (B2B)', 'IT / Продажи', 185000, 9, 'sales', [
    req('b2b_sales', 3, true), req('negotiation', 3, true), req('communication', 3, true),
    req('presentation'), req('crm'), req('enterprise'), req('sales_funnels')
  ]),
  R('business_developer', 'Бизнес-девелопер (IT)', 'IT / Стратегия', 255000, 9, 'sales', [
    req('b2b_sales', 3, true), req('negotiation', 3, true), req('product_strategy', 3),
    req('market_research'), req('enterprise'), req('communication'), req('presentation'), req('risk_management')
  ]),
  R('presales_engineer', 'Presales-инженер', 'IT / Продажи', 245000, 9, 'sales', [
    req('b2b_sales', 3), req('system_design', 3, true), req('presentation', 3, true),
    req('communication', 3, true), req('enterprise'), req('cloud_aws'), req('architecture')
  ]),
  R('customer_success_manager', 'Customer Success-менеджер', 'IT-продукты', 155000, 7, 'support', [
    req('communication', 3, true), req('crm', 3, true), req('negotiation', 3),
    req('enterprise'), req('teamwork'), req('product_analytics')
  ]),

  // ---------- HR / Обучение / Коммуникации ----------
  R('it_recruiter', 'IT-рекрутер', 'HR / IT', 135000, 9, 'sales', [
    req('communication', 3, true), req('negotiation', 3), req('market_research', 3),
    req('crm'), req('teamwork'), req('time_management')
  ]),
  R('it_trainer', 'IT-тренер / специалист по обучению (L&D)', 'Образование / EdTech', 155000, 6, 'content', [
    req('mentoring', 3, true), req('presentation', 3, true), req('communication', 3, true),
    req('documentation'), req('facilitation'), req('content_marketing')
  ]),
  R('technical_writer', 'Технический писатель', 'IT / Документация', 145000, 6, 'content', [
    req('documentation', 3, true), req('communication', 3, true), req('english', 3),
    req('html_css'), req('git')
  ]),
  R('devrel', 'Developer Relations-менеджер', 'IT-продукты', 205000, 8, 'content', [
    req('communication', 3, true), req('content_marketing', 3, true), req('presentation', 3),
    req('community_management'), req('mentoring'), req('english')
  ]),
  R('support_engineer', 'Инженер поддержки (L2/L3)', 'IT / Поддержка', 125000, 5, 'support', [
    req('linux', 3, true), req('networks', 3), req('communication', 3, true),
    req('sql'), req('bash'), req('monitoring'), req('documentation')
  ])
];

// ============ СТЕКОВЫЕ ВАРИАНТЫ ============

function stackVariant(base: CareerRoleTarget, id: string, title: string, skills: RequiredSkill[], salaryMult = 1, growthDelta = 0): CareerRoleTarget {
  return {
    ...base,
    id,
    title,
    medianSalaryRub: Math.round(base.medianSalaryRub * salaryMult),
    marketGrowthTrendPercent: base.marketGrowthTrendPercent + growthDelta,
    requiredSkills: skills,
    description: `${title} — позиция в сфере ${base.industry}. Ключевые требования: ${skills.map((s) => SKILLS[s.skillId]?.name ?? s.skillId).join(', ')}.`
  };
}

const qaAutomationPython = stackVariant(
  BASE_ROLES.find((r) => r.id === 'qa_automation')!,
  'qa_automation_python',
  'QA Automation-инженер (Python)',
  [req('automation_testing', 3, true), req('python', 3, true), req('selenium', 3, true), req('test_design', 3, true), req('api_testing'), req('git'), req('sql')],
  1.0
);

const qaAutomationSelenium = stackVariant(
  BASE_ROLES.find((r) => r.id === 'qa_automation')!,
  'qa_automation_java',
  'QA Automation-инженер (Java + Selenium)',
  [req('automation_testing', 3, true), req('java', 3, true), req('selenium', 3, true), req('test_design', 3, true), req('api_testing'), req('git'), req('sql')],
  1.02
);

// ============ ДОМЕННЫЕ ВАРИАНТЫ ============

const DOMAINS: Record<string, { skillId: string; label: string; salaryMult: number; growthDelta: number }> = {
  fintech: { skillId: 'fintech_domain', label: 'FinTech', salaryMult: 1.15, growthDelta: 2 },
  edtech: { skillId: 'edtech_domain', label: 'EdTech', salaryMult: 1.05, growthDelta: 1 },
  ecommerce: { skillId: 'ecommerce_domain', label: 'E-commerce', salaryMult: 1.08, growthDelta: 1 },
  medtech: { skillId: 'healthcare_domain', label: 'MedTech', salaryMult: 1.1, growthDelta: 2 },
  govtech: { skillId: 'govtech_domain', label: 'GovTech', salaryMult: 1.0, growthDelta: 0 }
};

const DOMAIN_VARIANT_ROLES = ['data_analyst', 'product_analyst', 'backend_java', 'backend_go', 'frontend_developer', 'qa_manual', 'system_analyst', 'ml_engineer', 'security_engineer', 'project_manager', 'smm_specialist', 'unity_dev'];

function domainVariant(base: CareerRoleTarget, domainKey: string): CareerRoleTarget {
  const d = DOMAINS[domainKey];
  const skills = [
    ...base.requiredSkills.filter((s) => s.skillId !== d.skillId),
    { ...req(d.skillId, 3, false) }
  ];
  return stackVariant(
    base,
    `${base.id}_${domainKey}`,
    `${base.title} (${d.label})`,
    skills,
    d.salaryMult,
    d.growthDelta
  );
}

const domainVariants: CareerRoleTarget[] = [];
for (const baseId of DOMAIN_VARIANT_ROLES) {
  const base = BASE_ROLES.find((r) => r.id === baseId);
  if (!base) continue;
  for (const key of Object.keys(DOMAINS)) {
    domainVariants.push(domainVariant(base, key));
  }
}

// ============ ИТОГОВЫЙ КАТАЛОГ ============

export const ROLES: CareerRoleTarget[] = [
  ...BASE_ROLES,
  qaAutomationPython,
  qaAutomationSelenium,
  ...domainVariants
];

export const ROLE_BY_ID: Record<string, CareerRoleTarget> = Object.fromEntries(ROLES.map((r) => [r.id, r]));
