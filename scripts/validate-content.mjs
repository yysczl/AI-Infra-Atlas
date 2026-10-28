import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { learningPaths, modules, stackLayers } from '../src/content/curriculum.js';
import { lessons } from '../src/content/lessons.js';
import { labs } from '../src/content/labs.js';
import { labGuides } from '../src/content/lab-guides.js';
import { stageAssessments, QUIZ_PASS_SCORE } from '../src/content/stage-assessments.js';

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

if (errors.length) {
  console.error(`\n内容校验失败，共 ${errors.length} 项：`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}
console.log(`内容校验通过：${modules.length} 个领域，${topicIds.size} 个主题，${Object.keys(lessons).length} 节完整微课，${resources.length} 条资源，${labs.length} 个实验，${learningPaths.length} 份综合项目与 ${assessmentQuestionCount} 道结业题。`);
