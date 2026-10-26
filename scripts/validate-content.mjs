import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { learningPaths, modules, stackLayers } from '../src/content/curriculum.js';
import { labs } from '../src/content/labs.js';
import { labGuides } from '../src/content/lab-guides.js';

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

if (errors.length) {
  console.error(`\n内容校验失败，共 ${errors.length} 项：`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}
console.log(`内容校验通过：${modules.length} 个领域，${topicIds.size} 个主题，${resources.length} 条资源，${labs.length} 个实验及完整操作指南。`);
