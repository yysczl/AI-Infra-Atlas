import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { learningPaths, modules, stackLayers } from '../src/content/curriculum.js';
import { lessons } from '../src/content/lessons.js';
import { labs } from '../src/content/labs.js';
import { labGuides } from '../src/content/lab-guides.js';
import { stageAssessments, QUIZ_PASS_SCORE } from '../src/content/stage-assessments.js';
import { courseLessons } from '../src/features/inference-course/data.js';
import { topicModules, TOPIC_MODULE_BY_ID } from '../src/features/topics/catalog.js';
import { topicsHref, parseTopicRoute } from '../src/features/topics/routes.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const resources = JSON.parse(readFileSync(join(root, 'src/content/resources.json'), 'utf8'));
const errors = [];
const moduleIds = new Set(modules.map((item) => item.id));
const resourceIds = new Set();

function required(item, fields, label) {
  fields.forEach((field) => {
    if (item[field] === undefined || item[field] === null || item[field] === '') errors.push(`${label} 缺少字段 ${field}`);
  });
}
function duplicates(items, label) {
  const seen = new Set();
  items.forEach((item) => {
    if (seen.has(item.id)) errors.push(`${label} 存在重复 ID：${item.id}`);
    seen.add(item.id);
  });
}

duplicates(modules, '领域');
duplicates(resources, '资源');
duplicates(labs, '实验');
const topicIds = new Set();
modules.forEach((module) => {
  required(module, ['id', 'title', 'en', 'description', 'level', 'hours', 'topics'], `领域 ${module.id || 'unknown'}`);
  if (!Array.isArray(module.topics) || module.topics.length === 0) errors.push(`领域 ${module.id} 没有主题`);
  module.topics.forEach((topic) => {
    required(topic, ['id', 'title', 'summary', 'question'], `主题 ${topic.id || 'unknown'}`);
    if (topicIds.has(topic.id)) errors.push(`主题存在重复 ID：${topic.id}`);
    topicIds.add(topic.id);
  });
});
resources.forEach((resource) => {
  required(resource, ['id', 'title', 'url', 'category', 'type', 'level', 'lang', 'description'], `资源 ${resource.id || 'unknown'}`);
  resourceIds.add(resource.id);
  if (!moduleIds.has(resource.category)) errors.push(`资源 ${resource.id} 的 category 无效：${resource.category}`);
  try { new URL(resource.url); } catch { errors.push(`资源 ${resource.id} 的 URL 无效`); }
});
topicIds.forEach((id) => {
  const lesson = lessons[id];
  if (!lesson) {
    errors.push(`主题 ${id} 缺少站内微课`);
    return;
  }
  required(lesson, ['minutes', 'content', 'practice', 'expected', 'pitfall', 'quiz', 'resourceIds'], `微课 ${id}`);
  if (!Number.isFinite(lesson.minutes) || lesson.minutes <= 0) errors.push(`微课 ${id} 的 minutes 必须是正数`);
  required(lesson.quiz || {}, ['question', 'answer'], `微课 ${id} 自测`);
  if (!Array.isArray(lesson.resourceIds) || lesson.resourceIds.length === 0) {
    errors.push(`微课 ${id} 缺少有序学习资源`);
  } else {
    lesson.resourceIds.forEach((resourceId) => {
      if (!resourceIds.has(resourceId)) errors.push(`微课 ${id} 引用了无效资源 ${resourceId}`);
    });
  }
});
Object.keys(lessons).forEach((id) => {
  if (!topicIds.has(id)) errors.push(`微课 ${id} 没有对应主题`);
});
learningPaths.forEach((path) => path.moduleIds.forEach((id) => {
  if (!moduleIds.has(id)) errors.push(`学习路径 ${path.id} 引用了无效领域 ${id}`);
}));
stackLayers.forEach((layer) => layer.moduleIds.forEach((id) => {
  if (!moduleIds.has(id)) errors.push(`技术栈 ${layer.id} 引用了无效领域 ${id}`);
}));
labs.forEach((lab) => {
  required(lab, ['id', 'title', 'level', 'duration', 'environment', 'moduleId', 'goal', 'steps', 'deliverable'], `实验 ${lab.id || 'unknown'}`);
  if (!moduleIds.has(lab.moduleId)) errors.push(`实验 ${lab.id} 的 moduleId 无效`);
  lab.resourceIds.forEach((id) => { if (!resourceIds.has(id)) errors.push(`实验 ${lab.id} 引用了无效资源 ${id}`); });
  const guide = labGuides[lab.id];
  if (!guide) {
    errors.push(`实验 ${lab.id} 缺少完整操作指南`);
    return;
  }
  required(guide, ['requirements', 'safety', 'steps', 'troubleshooting', 'cleanup'], `实验指南 ${lab.id}`);
  if (!Array.isArray(guide.requirements) || guide.requirements.length === 0) errors.push(`实验指南 ${lab.id} 缺少环境要求`);
  if (!Array.isArray(guide.steps) || guide.steps.length !== lab.steps.length) errors.push(`实验指南 ${lab.id} 的步骤数与实验摘要不一致`);
  guide.steps?.forEach((step, index) => {
    if (!step.blocks?.length && !step.expected) errors.push(`实验指南 ${lab.id} 第 ${index + 1} 步缺少命令或验证方式`);
    if (!step.expected) errors.push(`实验指南 ${lab.id} 第 ${index + 1} 步缺少结果验证`);
    step.blocks?.forEach((block) => required(block, ['title', 'code'], `实验指南 ${lab.id} 第 ${index + 1} 步`));
  });
});
Object.keys(labGuides).forEach((id) => {
  if (!labs.some((lab) => lab.id === id)) errors.push(`实验指南 ${id} 没有对应实验`);
});
readdirSync(join(root, 'src/content/notes')).filter((name) => name.endsWith('.md')).forEach((name) => {
  const raw = readFileSync(join(root, 'src/content/notes', name), 'utf8');
  if (!raw.startsWith('---\n') || !raw.includes('\ntitle:') || !raw.includes('\ndate:')) errors.push(`笔记 ${name} 缺少 frontmatter、title 或 date`);
});

const pathIds = new Set(learningPaths.map((path) => path.id));
const assessmentQuestionIds = new Set();
let assessmentQuestionCount = 0;
if (!Number.isFinite(QUIZ_PASS_SCORE) || QUIZ_PASS_SCORE < 0 || QUIZ_PASS_SCORE > 100) errors.push('结业测验通过分数必须在 0–100 之间');
Object.keys(stageAssessments).forEach((id) => {
  if (!pathIds.has(id)) errors.push(`阶段考核 ${id} 没有对应学习路径`);
});
learningPaths.forEach((path) => {
  const assessment = stageAssessments[path.id];
  if (!assessment) { errors.push(`学习路径 ${path.id} 缺少综合项目与结业测验`); return; }
  required(assessment, ['project', 'quiz'], `阶段考核 ${path.id}`);
  const project = assessment.project || {};
  const quiz = assessment.quiz;
  required(project, ['title', 'subtitle', 'duration', 'environment', 'brief', 'steps', 'deliverables', 'rubric'], `综合项目 ${path.id}`);
  if (!Array.isArray(project.steps) || project.steps.length !== 4) errors.push(`综合项目 ${path.id} 必须恰好包含四步`);
  else project.steps.forEach((step, index) => required(step, ['title', 'detail', 'expected'], `综合项目 ${path.id} 第 ${index + 1} 步`));
  if (!Array.isArray(project.deliverables) || project.deliverables.length === 0 || project.deliverables.some((item) => typeof item !== 'string' || !item.trim())) {
    errors.push(`综合项目 ${path.id} 的交付物清单无效`);
  }
  if (!Array.isArray(project.rubric) || project.rubric.length === 0) errors.push(`综合项目 ${path.id} 缺少评分量规`);
  else {
    project.rubric.forEach((row) => {
      required(row, ['item', 'points', 'description'], `综合项目 ${path.id} 评分项`);
      if (!Number.isFinite(row.points) || row.points <= 0) errors.push(`综合项目 ${path.id} 存在无效分值`);
    });
    const points = project.rubric.reduce((sum, row) => sum + (Number.isFinite(row.points) ? row.points : 0), 0);
    if (points !== 100) errors.push(`综合项目 ${path.id} 的评分量规合计 ${points} 分，必须为 100 分`);
  }
  if (!Array.isArray(quiz) || quiz.length !== 5) { errors.push(`阶段 ${path.id} 必须恰好包含五道结业题`); return; }
  quiz.forEach((question) => {
    assessmentQuestionCount += 1;
    required(question, ['id', 'topicId', 'question', 'options', 'answer', 'explanation'], `结业题 ${question.id || `${path.id}-unknown`}`);
    if (assessmentQuestionIds.has(question.id)) errors.push(`结业题存在重复 ID：${question.id}`);
    assessmentQuestionIds.add(question.id);
    if (!topicIds.has(question.topicId)) errors.push(`结业题 ${question.id} 的复习主题无效：${question.topicId}`);
    if (!Array.isArray(question.options) || question.options.length !== 4 || question.options.some((item) => typeof item !== 'string' || !item.trim())) {
      errors.push(`结业题 ${question.id} 必须包含四个非空选项`);
    } else if (new Set(question.options).size !== 4) errors.push(`结业题 ${question.id} 的选项不能重复`);
    if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) errors.push(`结业题 ${question.id} 的正确答案索引无效`);
  });
});


// Published topics share the original app shell and register their own reader.
duplicates(topicModules, '专题模块');
if (Object.getPrototypeOf(TOPIC_MODULE_BY_ID) !== null) errors.push('专题模块索引必须避免原型属性被当作模块');
topicModules.forEach(module => {
  required(module, ['id', 'title', 'description', 'lessonCount', 'prerequisites', 'format', 'load', 'getProps'], `专题 ${module.id}`);
  if (!/^[a-z][a-z0-9-]*$/.test(module.id)) errors.push(`专题 ID 无效：${module.id}`);
  if (!Number.isInteger(module.lessonCount) || module.lessonCount <= 0) errors.push(`专题 ${module.id} 课程数量无效`);
  for (const field of ['title', 'description', 'prerequisites', 'format']) {
    if (typeof module[field] !== 'string' || !module[field].trim()) errors.push(`专题 ${module.id} 的 ${field} 必须为非空说明`);
  }
  if (typeof module.load !== 'function' || typeof module.getProps !== 'function') errors.push(`专题 ${module.id} 缺少页面加载或上下文连接函数`);
  if (TOPIC_MODULE_BY_ID[module.id] !== module) errors.push(`专题索引未指向配置：${module.id}`);
  const route = parseTopicRoute(topicsHref(module.id));
  if (!route || route.topicId !== module.id || route.lessonId !== null) errors.push(`专题 ${module.id} 的入口地址不能还原模块`);
});
if (topicsHref() !== '#/topics' || parseTopicRoute('#/topics')?.topicId !== null || parseTopicRoute('#/dashboard') !== null) errors.push('专题总览与原站页面路由边界无效');
if (TOPIC_MODULE_BY_ID.inference?.lessonCount !== courseLessons.length) errors.push('推理入门模块标注的课程数与正文配置不一致');
for (const lesson of courseLessons) {
  const section = '一个段落';
  const route = parseTopicRoute(topicsHref('inference', lesson.id, section));
  if (route?.topicId !== 'inference' || route.lessonId !== lesson.id || route.section !== section) errors.push(`专题课程 ${lesson.id} 的深链接无法还原`);
  const legacy = parseTopicRoute(`#/inference/${lesson.id}?section=${encodeURIComponent(section)}`);
  if (legacy?.topicId !== 'inference' || legacy.lessonId !== lesson.id || legacy.section !== section) errors.push(`旧推理地址 ${lesson.id} 不兼容`);
}

// The new area has its own content and progress; the original curriculum stays intact.
const courseDirectory = join(root, 'src/features/inference-course/content');
const courseIds = new Set(courseLessons.map(lesson => lesson.id));
const courseDemos = new Set(['tokens', 'attention', 'decode', 'kv-flow', 'kv', 'batch', 'benchmark']);
const headingId = title => title.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-');
duplicates(courseLessons, '推理入门课程');
courseLessons.forEach((lesson, index) => {
  required(lesson, ['id', 'title', 'summary', 'minutes', 'prerequisites', 'labIds', 'quiz'], `推理入门 ${lesson.id}`);
  if (!Number.isFinite(lesson.minutes) || lesson.minutes <= 0) errors.push(`推理入门 ${lesson.id} 时长无效`);
  required(lesson.quiz || {}, ['question', 'answer'], `推理入门 ${lesson.id} 自测`);
  for (const id of lesson.prerequisites || []) {
    if (!courseIds.has(id) && !topicIds.has(id)) errors.push(`推理入门 ${lesson.id} 先修内容不存在：${id}`);
    if (courseIds.has(id) && courseLessons.findIndex(item => item.id === id) >= index) errors.push(`推理入门 ${lesson.id} 的先修顺序不正确：${id}`);
  }
  for (const id of lesson.labIds || []) {
    if (!labs.some(lab => lab.id === id)) errors.push(`推理入门 ${lesson.id} 关联了不存在的实验：${id}`);
  }
  try {
    const body = readFileSync(join(courseDirectory, `${lesson.id}.md`), 'utf8');
    if (!body.trim()) errors.push(`推理入门 ${lesson.id} 正文为空`);
    const headings = [...body.matchAll(/^#{2,3} (.+)$/gm)].map(match => headingId(match[1].replace(/[`*]/g, '')));
    if (headings.length === 0 || headings.some(id => !id) || new Set(headings).size !== headings.length) errors.push(`推理入门 ${lesson.id} 缺少目录或有无效、重复的段落锚点`);
    if (headings.includes('self-check') || headings.includes('related-labs')) errors.push(`推理入门 ${lesson.id} 的段落锚点与阅读器保留名称冲突`);
    for (const [, name] of body.matchAll(/```atlas-demo\s*\n([\s\S]*?)```/g)) {
      if (!courseDemos.has(name.trim())) errors.push(`推理入门 ${lesson.id} 引用了未登记的教学演示：${name.trim()}`);
    }
    for (const [, id] of body.matchAll(/#\/(?:inference|topics\/inference)\/([\w-]+)/g)) {
      if (!courseIds.has(id)) errors.push(`推理入门 ${lesson.id} 链接了不存在的课程：${id}`);
    }
  } catch { errors.push(`推理入门 ${lesson.id} 缺少 Markdown 正文`); }
});
readdirSync(courseDirectory).filter(name => name.endsWith('.md')).forEach(name => {
  if (!courseIds.has(name.replace(/\.md$/, ''))) errors.push(`推理入门正文 ${name} 没有对应课程`);
});

if (errors.length) {
  console.error(`\n内容校验失败，共 ${errors.length} 项：`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}
console.log(`内容校验通过：${modules.length} 个领域，${topicIds.size} 个主题，${Object.keys(lessons).length} 节完整微课，${resources.length} 条资源，${labs.length} 个实验，${learningPaths.length} 份综合项目与 ${assessmentQuestionCount} 道结业题；${topicModules.length} 个专题模块，含 ${courseLessons.length} 节推理入门课程。`);
