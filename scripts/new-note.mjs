import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('请提供标题，例如：npm run new:note -- "我的推理优化复盘"');
  process.exit(1);
}
const date = new Date().toISOString().slice(0, 10);
const asciiSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
const base = `${date}-${asciiSlug || 'note'}`;
const directory = join(root, 'src/content/notes');
mkdirSync(directory, { recursive: true });
let filename = `${base}.md`;
let index = 2;
while (existsSync(join(directory, filename))) filename = `${base}-${index++}.md`;
const content = `---\ntitle: "${title.replaceAll('"', '\\"')}"\ndate: "${date}"\nsummary: "用一句话说明这篇笔记解决了什么问题。"\ntags: ["AI Infra", "学习笔记"]\nkind: "我的笔记"\n---\n\n# ${title}\n\n## 背景与问题\n\n记录当时的目标、约束和环境。\n\n## 过程与数据\n\n写下实验条件、关键步骤、原始结果和失败路径。\n\n## 结论与边界\n\n区分事实、推断和尚不确定的部分。\n\n## 下一步\n\n列出一个可以立即执行的动作。\n`;
writeFileSync(join(directory, filename), content, 'utf8');
console.log(`已创建：src/content/notes/${filename}`);
console.log('编辑后运行 npm run dev 预览，或 npm run build 重新构建。');
