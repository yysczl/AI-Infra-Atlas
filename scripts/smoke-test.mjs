import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { once } from 'node:events';
import { stageAssessments } from '../src/content/stage-assessments.js';
import { modules } from '../src/content/curriculum.js';
import { courseLessons } from '../src/features/inference-course/data.js';
import { videos } from '../src/content/videos.js';
import { topicModules } from '../src/features/topics/catalog.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const artifacts = join(root, 'artifacts');
mkdirSync(artifacts, { recursive: true });
const port = 4173;
const base = `http://127.0.0.1:${port}`;
const chromeCandidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);
const executablePath = chromeCandidates.find((path) => existsSync(path));
if (!executablePath) {
  console.error('未找到 Chrome。请通过 CHROME_PATH=/path/to/chrome npm run test:ui 指定浏览器。');
  process.exit(1);
}
const server = spawn(process.execPath, [join(root, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { cwd: root, stdio: 'pipe' });
let serverOutput = '';
server.stdout.on('data', (chunk) => { serverOutput += chunk; });
server.stderr.on('data', (chunk) => { serverOutput += chunk; });
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitForServer() {
  for (let index = 0; index < 80; index += 1) {
    if (server.exitCode !== null) throw new Error(`预览服务启动失败：${serverOutput}`);
    try { const response = await fetch(base); if (response.ok) return; } catch { /* Retry while Vite starts. */ }
    await delay(250);
  }
  throw new Error(`等待预览服务超时：${serverOutput}`);
}
function assert(condition, message) { if (!condition) throw new Error(message); }
let browser;
let failed = true;
try {
  await waitForServer();
  browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const page = await context.newPage();
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') runtimeErrors.push(message.text()); });
  const nav = (label) => page.locator('.main-nav button').filter({ hasText: label }).click();

  await page.goto(`${base}/#/dashboard`, { waitUntil: 'domcontentloaded' });
  await page.locator('.hero h1').waitFor();
  assert(await page.locator('.module-card').count() === 15, '首页知识领域数量不正确');
  assert(await page.locator('.recent-notes > button').count() === 3, '首页未加载内置笔记模板');
  await page.screenshot({ path: join(artifacts, 'dashboard-desktop.png'), fullPage: true });
  console.log('✓ 首页、统计与 15 个知识领域');

  const earlyProgress = Object.fromEntries(modules.filter((module) => ['foundations', 'systems', 'hardware'].includes(module.id)).flatMap((module) => module.topics.map((topic) => [topic.id, true])));
  await page.evaluate((progress) => localStorage.setItem('infra-atlas-progress-v1', JSON.stringify(progress)), earlyProgress);
  await page.reload({ waitUntil: 'domcontentloaded' });
  assert((await page.locator('.next-list button').first().innerText()).includes('Tensor 与自动微分'), '推荐课程应先进入训练框架，再进入算子');
  await page.locator('.sidebar-progress button').click();
  await page.locator('.topic-drawer').waitFor();
  assert((await page.locator('.topic-drawer h2').innerText()).includes('Tensor 与自动微分'), '继续学习没有打开下一节未完成课程');
  await page.getByRole('button', { name: '关闭主题详情' }).click();
  await page.evaluate(() => localStorage.removeItem('infra-atlas-progress-v1'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  console.log('✓ 推荐顺序与阶段目录一致，继续学习直接打开课程');

  await nav('新手起步');
  await page.locator('.start-hero h1').waitFor();
  assert(await page.locator('.foundation-grid > button').count() === 4, '新手先修课入口数量不正确');
  assert(await page.locator('.week-plan > button').count() === 7, '第一周学习计划不完整');
  await page.screenshot({ path: join(artifacts, 'start-desktop.png'), fullPage: true, animations: 'disabled' });
  await page.locator('.foundation-grid > button').first().click();
  await page.locator('.topic-drawer .lesson-markdown').waitFor();
  assert(await page.getByRole('tab').count() === 3, '主题微课缺少学习标签页');
  assert((await page.locator('.lesson-markdown').innerText()).includes('必须掌握的六组概念'), '第一课站内正文未显示');
  await page.screenshot({ path: join(artifacts, 'lesson-desktop.png'), fullPage: false, animations: 'disabled' });
  await page.getByRole('tab', { name: '做练习', exact: true }).click();
  assert(await page.locator('.practice-card').count() === 3, '微课练习、验证或误区不完整');
  await page.locator('.quiz-card summary').click();
  assert(await page.locator('.quiz-card details > div').isVisible(), '自测参考答案无法展开');
  await page.getByRole('tab', { name: /看资料/ }).click();
  assert(await page.locator('.lesson-resource-card').count() >= 3, '主题资料未按微课映射显示');
  assert((await page.locator('.lesson-resource-card').first().getAttribute('href')).includes('bilibili.com'), '第一课未优先推荐入门视频');
  await page.getByRole('button', { name: '关闭主题详情' }).click();
  console.log('✓ 新手页、七天计划、站内微课、练习自测与主题资料');

  await page.locator('.search-trigger').click();
  await page.locator('.search-palette input').fill('重试风暴');
  await page.locator('.search-results > button').first().waitFor();
  assert(await page.locator('.search-results > button').count() > 0, '全局搜索没有结果');
  assert((await page.locator('.search-results').innerText()).includes('站内微课'), '搜索未覆盖微课正文与自测');
  await page.keyboard.press('Escape');
  console.log('✓ 微课全文搜索与快捷键关闭');

  await nav('资源库');
  await page.locator('.resource-card').first().waitFor();
  assert(await page.locator('.resource-card').count() === 24, '资源库首批分页数量不正确');
  await page.locator('.library-search input').fill('vLLM');
  await delay(250);
  assert(await page.locator('.resource-card').count() > 0, '资源筛选没有结果');
  await page.locator('.resource-card-top button').first().click();
  assert(await page.evaluate(() => JSON.parse(localStorage.getItem('infra-atlas-bookmarks-v1') || '[]').length > 0), '收藏未保存');
  await page.locator('.reset-filter').click();
  await page.locator('.filter-row label').filter({ hasText: '资料语言' }).locator('select').selectOption('中文');
  await delay(250);
  assert(await page.locator('.resource-card').count() > 0, '中文资源筛选没有结果');
  const languageLabels = await page.locator('.resource-card-foot > span').allTextContents();
  assert(languageLabels.every((text) => text.includes('中文')), '语言筛选混入了非中文资料');
  console.log('✓ 资源分页、搜索、语言筛选与收藏持久化');

  await nav('学习路径');
  await page.locator('.topic-check').first().click();
  assert(await page.evaluate(() => JSON.parse(localStorage.getItem('infra-atlas-progress-v1') || '{}')['base-linux'] === true), '学习进度未写入');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('.topic-list article.is-done').first().waitFor();
  console.log('✓ 学习进度刷新后保留');

  assert(await page.locator('.path-assessment-open').count() === 7, '七个学习阶段缺少综合项目或结业测验入口');
  await page.locator('.path-assessment-open').first().click();
  await page.locator('.stage-assessment').waitFor();
  assert(await page.locator('.project-step').count() === 4, '阶段综合项目不是四步');
  assert(await page.locator('.project-rubric article').count() === 4, '阶段项目评分量规不完整');
  assert((await page.locator('.project-rubric footer').innerText()).includes('100'), '阶段项目量规总分不是 100');
  const [projectDownload] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: '下载项目记录模板' }).click()]);
  assert(projectDownload.suggestedFilename().endsWith('.md'), '综合项目记录模板未正确下载');
  await page.screenshot({ path: join(artifacts, 'stage-project-desktop.png'), fullPage: false, animations: 'disabled' });
  await page.locator('#p0-quiz-tab').click();
  const submitQuiz = page.getByRole('button', { name: '提交并查看成绩' });
  assert(await submitQuiz.isDisabled(), '题目未答完时不应允许提交');
  for (const [index, question] of stageAssessments.p0.quiz.entries()) {
    const choice = index === 0 ? (question.answer + 1) % 4 : question.answer;
    await page.locator(`input[name="${question.id}"][value="${choice}"]`).check();
  }
  assert(await submitQuiz.isEnabled(), '全部作答后仍无法提交');
  await submitQuiz.click();
  await page.locator('.quiz-result.is-passed').waitFor();
  assert((await page.locator('.quiz-result').innerText()).includes('80'), '四题正确应恰好得到 80 分');
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('infra-atlas-assessments-v1') || '{}').p0?.attempts === 1);
  const firstRecord = await page.evaluate(() => JSON.parse(localStorage.getItem('infra-atlas-assessments-v1')).p0);
  assert(firstRecord.bestScore === 80 && firstRecord.lastScore === 80 && firstRecord.passed === true, '80 分通过成绩未正确保存');
  assert(await page.locator('.quiz-explanation.is-wrong').count() === 1, '错题解析数量不正确');
  await page.screenshot({ path: join(artifacts, 'stage-quiz-desktop.png'), fullPage: false, animations: 'disabled' });
  await page.locator('.quiz-explanation.is-wrong button').click();
  await page.locator('.topic-drawer .lesson-markdown').waitFor();
  assert(await page.locator('.stage-assessment').count() === 0, '错题复习时阶段考核面板未关闭');
  assert((await page.locator('.topic-drawer h2').innerText()).includes('Python'), '错题没有打开对应知识点的微课');
  await page.getByRole('button', { name: '关闭主题详情' }).click();

  await page.locator('.path-assessment-open').first().click();
  await page.locator('#p0-quiz-tab').click();
  assert((await page.locator('.quiz-history').innerText()).includes('80'), '历史最高分未显示');
  for (const question of stageAssessments.p0.quiz) {
    await page.locator(`input[name="${question.id}"][value="${(question.answer + 1) % 4}"]`).check();
  }
  await page.getByRole('button', { name: '提交并查看成绩' }).click();
  await page.locator('.quiz-result.is-retry').waitFor();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('infra-atlas-assessments-v1') || '{}').p0?.attempts === 2);
  const secondRecord = await page.evaluate(() => JSON.parse(localStorage.getItem('infra-atlas-assessments-v1')).p0);
  assert(secondRecord.bestScore === 80 && secondRecord.lastScore === 0 && secondRecord.passed === true, '低分重考覆盖了最高分或通过状态');
  assert(secondRecord.completedAt === firstRecord.completedAt, '首次通过时间被重考覆盖');
  await page.getByRole('button', { name: '重新作答' }).click();
  assert(await page.locator('.quiz-result').count() === 0 && await page.locator('.quiz-form input:checked').count() === 0, '重新作答未清空本次答案与结果');
  assert(await page.getByRole('button', { name: '提交并查看成绩' }).isDisabled(), '重新作答后不应能直接提交');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('.path-assessment-open').first().waitFor();
  const passedPathText = await page.locator('.path-assessment-open').first().innerText();
  assert(passedPathText.includes('最高 80 分') && passedPathText.includes('已通过'), '刷新后未保留最高分与通过状态');
  await page.screenshot({ path: join(artifacts, 'curriculum-desktop.png'), fullPage: true, animations: 'disabled' });
  console.log('✓ 七阶段入口、项目模板、80 分通过、错题复习、重考与成绩持久化');

  await nav('动手实验');
  await page.locator('.lab-manual-head h2').filter({ hasText: '零 GPU 跑通第一个训练循环' }).waitFor();
  await page.locator('.lab-step').first().waitFor();
  assert(await page.locator('.lab-step').count() === 4, '实验操作步骤数量不正确');
  assert(await page.locator('.lab-prepare li').count() > 0, '实验缺少环境检查');
  assert(await page.locator('.step-expected').count() === 4, '实验缺少结果验证说明');
  const firstTrainingGuide = await page.locator('.lab-manual').innerText();
  assert(firstTrainingGuide.includes('LR=0.05') && firstTrainingGuide.includes('python -m pip freeze'), '零 GPU 实验缺少学习率基线或环境记录');
  await page.screenshot({ path: join(artifacts, 'lab-first-train-desktop.png'), fullPage: true, animations: 'disabled' });
  await page.locator('.lab-catalog > button').filter({ hasText: '建立 AI 机器性能基线' }).click();
  await page.locator('.lab-manual-head h2').filter({ hasText: '建立 AI 机器性能基线' }).waitFor();
  await page.locator('.lab-step-head').first().click();
  assert(await page.evaluate(() => (JSON.parse(localStorage.getItem('infra-atlas-labs-v1') || '{}')['lab-baseline'] || []).includes(0)), '实验步骤未保存');
  await page.locator('.code-block-head button').first().click();
  await page.getByRole('button', { name: '已复制' }).first().waitFor();
  const [reportDownload] = await Promise.all([page.waitForEvent('download'), page.locator('.deliverable > button').click()]);
  assert(reportDownload.suggestedFilename().endsWith('.md'), '实验记录模板未正确下载');
  await page.locator('.lab-catalog > button').filter({ hasText: '做一次可信的 LLM 推理压测' }).click();
  await page.locator('.lab-manual-head h2').filter({ hasText: '做一次可信的 LLM 推理压测' }).waitFor();
  assert(await page.locator('.code-block').count() >= 6, 'vLLM 实验缺少完整命令');
  await page.screenshot({ path: join(artifacts, 'lab-serving-desktop.png'), fullPage: true });
  await page.locator('.lab-catalog > button').filter({ hasText: 'FSDP2 分片与 Checkpoint 恢复' }).click();
  await page.locator('.lab-manual-head h2').filter({ hasText: 'FSDP2 分片与 Checkpoint 恢复' }).waitFor();
  const fsdpGuide = await page.locator('.lab-manual').innerText();
  assert(fsdpGuide.includes('acc295dc7b90714f1bf47f06004fc19a7fe235c4'), 'FSDP 实验未显示固定的官方版本');
  assert(!fsdpGuide.includes('fsdp2_trace'), 'FSDP 实验仍引用当前示例不会生成的 Trace 文件');
  await page.screenshot({ path: join(artifacts, 'lab-fsdp-desktop.png'), fullPage: true, animations: 'disabled' });
  console.log('✓ 完整实验步骤、命令复制、结果验证、模板下载与进度保存');

  await nav('我的笔记');
  assert(await page.locator('.note-list-scroll > button').count() === 4, '笔记页应加载四篇内置笔记');
  await page.locator('.note-list-scroll > button').filter({ hasText: '技术复盘模板' }).click();
  assert((await page.locator('.markdown-body').innerText()).includes('背景与约束'), '内置笔记正文未正确显示');
  await page.locator('.notes-list input').fill('没有匹配的测试关键词');
  assert(await page.locator('.note-reader .markdown-body').count() === 0, '无匹配结果时仍显示旧笔记');
  await page.locator('.notes-list input').fill('');
  await page.getByRole('button', { name: '新建笔记' }).click();
  await page.locator('.editor-fields textarea').fill('');
  assert(await page.locator('.note-editor').isVisible(), '清空正文后编辑器不应自动关闭');
  await page.locator('.editor-title').fill('UI 自动化验收笔记');
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('button', { name: '关闭笔记编辑器' }).click();
  assert(await page.locator('.note-editor').isVisible(), '取消放弃修改后编辑器应保留');
  assert(await page.locator('.editor-title').inputValue() === 'UI 自动化验收笔记', '关闭确认丢失了未保存标题');
  await page.locator('.editor-fields input').nth(1).fill('测试, 本地笔记');
  await page.locator('.editor-fields textarea').fill('# UI 自动化验收笔记\n\n这是浏览器测试创建的内容。\n\n- 支持列表\n- 支持 **Markdown**');
  await page.locator('.editor-foot .btn-primary').click();
  await page.locator('.markdown-body h1').filter({ hasText: 'UI 自动化验收笔记' }).waitFor();
  assert(await page.evaluate(() => JSON.parse(localStorage.getItem('infra-atlas-notes-v1') || '[]').some((note) => note.title === 'UI 自动化验收笔记')), '个人笔记未保存');
  const [markdownDownload] = await Promise.all([page.waitForEvent('download'), page.locator('.note-reader-toolbar > div:last-child button').first().click()]);
  assert(markdownDownload.suggestedFilename().endsWith('.md'), 'Markdown 导出文件名不正确');
  console.log('✓ 新建笔记、Markdown 渲染、保存与导出');

  await nav('设置与备份');
  assert(!(await page.locator('body').innerText()).includes('这不是成品站'), '设置页仍包含已移除的抽象文案');
  const [backupDownload] = await Promise.all([page.waitForEvent('download'), page.locator('.backup-panel .btn-primary').click()]);
  assert(backupDownload.suggestedFilename().endsWith('.json'), '备份导出文件名不正确');
  const backup = JSON.parse(readFileSync(await backupDownload.path(), 'utf8'));
  assert(backup.data.assessmentRecords?.p0?.bestScore === 80 && backup.data.assessmentRecords.p0.passed === true, '学习备份未包含结业测验成绩');
  await page.locator('.topbar-actions .icon-btn').click();
  assert(await page.evaluate(() => document.documentElement.dataset.theme === 'dark'), '暗色主题切换失败');
  await page.screenshot({ path: join(artifacts, 'settings-dark.png'), fullPage: true, animations: 'disabled' });
  console.log('✓ 用户设置、整站备份与明暗主题');

  await page.evaluate(() => localStorage.setItem('infra-atlas-theme-v1', JSON.stringify('light')));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  for (const route of ['dashboard', 'start', 'curriculum', 'map', 'resources', 'labs', 'notes', 'maintenance']) {
    await page.goto(`${base}/#/${route}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, 0));
    await delay(300);
    const dimensions = await page.evaluate(() => ({ width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    assert(dimensions.scrollWidth <= dimensions.width + 1, `${route} 手机端存在横向溢出：${dimensions.scrollWidth}/${dimensions.width}`);
    if (route === 'dashboard') await page.screenshot({ path: join(artifacts, 'dashboard-mobile.png'), fullPage: true, animations: 'disabled' });
    if (route === 'start') await page.screenshot({ path: join(artifacts, 'start-mobile.png'), fullPage: true, animations: 'disabled' });
    if (route === 'curriculum') await page.screenshot({ path: join(artifacts, 'curriculum-mobile.png'), fullPage: true, animations: 'disabled' });
    if (route === 'resources') await page.screenshot({ path: join(artifacts, 'resources-mobile.png'), fullPage: false, animations: 'disabled' });
    if (route === 'labs') {
      const layout = await page.evaluate(() => {
        const manual = document.querySelector('.lab-manual').getBoundingClientRect();
        const catalog = document.querySelector('.lab-catalog').getBoundingClientRect();
        return { manualWidth: manual.width, manualTop: manual.top, catalogBottom: catalog.bottom };
      });
      assert(layout.manualWidth > 300, `手机实验正文过窄：${Math.round(layout.manualWidth)}px`);
      assert(layout.catalogBottom <= layout.manualTop + 1, '手机实验目录应位于正文上方');
      await page.screenshot({ path: join(artifacts, 'labs-mobile.png'), fullPage: true, animations: 'disabled' });
    }
  }
  await page.goto(`${base}/#/curriculum`, { waitUntil: 'domcontentloaded' });
  await page.locator('.path-assessment-open').first().click();
  await page.locator('.stage-assessment').waitFor();
  let assessmentDimensions = await page.evaluate(() => ({ width: window.innerWidth, pageWidth: document.documentElement.scrollWidth, clientWidth: document.querySelector('.assessment-body').clientWidth, scrollWidth: document.querySelector('.assessment-body').scrollWidth }));
  assert(assessmentDimensions.pageWidth <= assessmentDimensions.width + 1 && assessmentDimensions.scrollWidth <= assessmentDimensions.clientWidth + 1, '手机综合项目存在横向溢出');
  await page.screenshot({ path: join(artifacts, 'stage-project-mobile.png'), fullPage: false, animations: 'disabled' });
  await page.locator('#p0-quiz-tab').click();
  assessmentDimensions = await page.evaluate(() => ({ width: window.innerWidth, pageWidth: document.documentElement.scrollWidth, clientWidth: document.querySelector('.assessment-body').clientWidth, scrollWidth: document.querySelector('.assessment-body').scrollWidth }));
  assert(assessmentDimensions.pageWidth <= assessmentDimensions.width + 1 && assessmentDimensions.scrollWidth <= assessmentDimensions.clientWidth + 1, '手机结业测验存在横向溢出');
  await page.screenshot({ path: join(artifacts, 'stage-quiz-mobile.png'), fullPage: false, animations: 'disabled' });
  await page.getByRole('button', { name: '关闭阶段考核' }).click();
  await page.goto(`${base}/#/start`, { waitUntil: 'domcontentloaded' });
  await page.locator('.foundation-grid > button').first().click();
  await page.locator('.topic-drawer .lesson-markdown').waitFor();
  const lessonDimensions = await page.evaluate(() => ({ width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  assert(lessonDimensions.scrollWidth <= lessonDimensions.width + 1, `手机微课存在横向溢出：${lessonDimensions.scrollWidth}/${lessonDimensions.width}`);
  await page.screenshot({ path: join(artifacts, 'lesson-mobile.png'), fullPage: false, animations: 'disabled' });
  await page.getByRole('tab', { name: '做练习', exact: true }).click();
  assert(await page.locator('.quiz-card').isVisible(), '手机端无法打开微课自测');
  await page.getByRole('button', { name: '关闭主题详情' }).click();
  await page.goto(`${base}/#/dashboard`, { waitUntil: 'domcontentloaded' });
  await page.locator('.mobile-menu').click();
  assert(await page.locator('.sidebar.is-open').isVisible(), '手机导航未打开');
  await page.locator('.nav-scrim').click({ position: { x: 380, y: 100 } });
  console.log('✓ 8 个页面、手机微课与移动导航');

  // Published topics are grouped under one area inside the same app.
  await page.setViewportSize({ width: 1700, height: 1000 });
  await page.goto(`${base}/#/dashboard`, { waitUntil: 'domcontentloaded' });
  await page.locator('.hero h1').waitFor();
  assert(await page.locator('.module-card').count() === 15, '新增专区替换了原首页领域卡片');
  await page.evaluate(() => {
    const progress = JSON.parse(localStorage.getItem('infra-atlas-progress-v1') || '{}');
    progress['inf-kv'] = true;
    localStorage.setItem('infra-atlas-progress-v1', JSON.stringify(progress));
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  const originalData = await page.evaluate(() => Object.fromEntries(['progress', 'bookmarks', 'notes', 'labs', 'assessments'].map(key => [key, localStorage.getItem(`infra-atlas-${key}-v1`)])));
  const enterInferenceModule = async () => {
    await nav('专题学习');
    await page.locator('.topics-catalog').waitFor();
    await page.locator('.topics-catalog a[href="#/topics/inference"]').click();
    await page.locator('.inference-overview .course-list li').first().waitFor();
  };
  await nav('专题学习');
  await page.locator('.topics-catalog h1').filter({ hasText: '专题学习' }).waitFor();
  assert(await page.locator('.topics-catalog .topic-module-card').count() === topicModules.length, '专题总览应只展示已发布模块');
  assert(await page.locator('.main-nav button').filter({ hasText: '推理入门' }).count() === 0, '侧栏仍将推理入门当作顶层入口');
  await page.screenshot({ path: join(artifacts, 'topics-catalog-desktop.png'), fullPage: true, animations: 'disabled' });
  await page.locator('.topics-catalog a[href="#/topics/inference"]').click();
  await page.locator('.inference-overview .course-list li').first().waitFor();
  await page.locator('.inference-overview .course-list li a').first().click();
  await page.locator('.lesson-header h1').filter({ hasText: 'token 与张量' }).waitFor();
  await page.locator('.inference-area .lesson-markdown').waitFor();
  await page.locator('.topic-module-area a[href="#/topics"]').first().click();
  await page.locator('.topics-catalog').waitFor();
  await page.goBack();
  await page.locator('.lesson-header h1').filter({ hasText: 'token 与张量' }).waitFor();
  await page.goBack();
  await page.locator('.inference-overview .course-list li').first().waitFor();
  await page.goBack();
  await page.locator('.topics-catalog').waitFor();
  await page.goForward();
  await page.locator('.inference-overview .course-list li').first().waitFor();
  console.log('✓ 专题学习总览、模块入口、课程与父级往返以及浏览器历史');

  assert(await page.locator('.inference-overview .course-list li').count() === 6, '推理专区应包含六节课');
  assert((await page.locator('.sidebar-progress p').innerText()).includes('/ 60'), '新增专区改变了原课程的进度分母');
  assert(await page.locator('.main-nav button').filter({ hasText: '新手起步' }).count() === 1, '原新手入口被替换');
  assert(await page.evaluate(() => !JSON.parse(localStorage.getItem('infra-atlas-inference-course-v1') || '{}').progress?.['inf-kv']), '原主题完成标记被自动套用到新课程');
  await page.screenshot({ path: join(artifacts, 'inference-overview-desktop.png'), fullPage: true, animations: 'disabled' });
  const openInference = async id => {
    await page.goto(`${base}/#/topics/inference/${id}`, { waitUntil: 'domcontentloaded' });
    await page.locator('.lesson-header h1').filter({ hasText: courseLessons.find(lesson => lesson.id === id).title }).waitFor();
    await page.locator('.inference-area .lesson-markdown').waitFor();
  };
  for (const lesson of courseLessons) {
    await openInference(lesson.id);
    assert(await page.locator('.reader-chapters li').count() === 6, `${lesson.id} 缺少专区课程目录`);
    assert(await page.locator('.inference-area .lesson-markdown h2').count() >= 4, `${lesson.id} 正文不完整`);
    assert(await page.locator('.exercise-answer[open]').count() === 0, '练习答案不应默认展开');
    await page.locator('.exercise-answer summary').click();
    assert(await page.locator('.exercise-answer p').isVisible(), '练习答案不能展开');
  }
  await openInference('model-tokens');
  await page.locator('.lesson-prerequisites button').first().click();
  await page.locator('.topic-drawer').waitFor();
  assert((await page.locator('.topic-drawer h2').innerText()).includes('Python'), '专区先修入口未使用原站微课');
  await page.getByRole('button', { name: '关闭主题详情' }).click();
  await openInference('inf-kv');
  assert((await page.locator('.demo-result').innerText()).includes('8.00'), 'KV 初始估算不正确');
  await page.getByLabel('每请求缓存位置数').selectOption('8192');
  await page.getByRole('button', { name: '标记为已完成', exact: true }).click();
  await delay(250);
  assert((await page.locator('.demo-result').innerText()).includes('16.00'), '标记完成或滚动重置了计算器');
  assert(await page.evaluate(() => JSON.parse(localStorage.getItem('infra-atlas-inference-course-v1')).progress['inf-kv'] === true), '专区完成标记未保存');
  assert(await page.evaluate(() => !JSON.parse(localStorage.getItem('infra-atlas-inference-course-v1')).progress['model-tokens']), '阅读被误记为完成');
  await page.locator('.reader-toc li a').nth(2).click();
  const inferenceSectionURL = page.url();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('.inference-area .lesson-markdown').waitFor();
  await delay(300);
  const inferenceAnchor = new URLSearchParams(new URL(page.url()).hash.split('?')[1]).get('section');
  assert(await page.locator(`[id="${inferenceAnchor}"]`).evaluate(el => el.getBoundingClientRect().top >= 55 && el.getBoundingClientRect().top < 230), '专区深链接刷新未恢复段落');
  await enterInferenceModule();
  await page.locator('.inference-overview .resume-reading a').click();
  await page.locator('.inference-area .lesson-markdown').waitFor();
  assert(page.url() === inferenceSectionURL, '专区继续阅读未返回原段落');
  await page.locator('.reader-completion a').filter({ hasText: '下一节' }).click();
  await page.locator('.batch-table').waitFor();
  await page.goBack();
  await page.locator('.inference-area .lesson-markdown').waitFor();
  assert(page.url() === inferenceSectionURL, '浏览器后退未恢复专区段落');
  await page.goForward();
  await page.locator('.batch-table').waitFor();
  assert(await page.locator('.batch-table thead th').count() === 8, '固定批次应显示七轮');
  await page.getByRole('button', { name: '连续批处理', exact: true }).click();
  assert(await page.locator('.batch-table thead th').count() === 6, '连续批处理应显示五轮');
  await openInference('inf-decode');
  await page.getByRole('button', { name: '下一步', exact: true }).click();
  assert((await page.locator('.demo-stepper').innerText()).includes('Decode 1'), '生成步骤未推进');
  await openInference('serve-bench');
  await page.getByLabel('TTFT 目标（ms）').selectOption('200');
  assert((await page.locator('.demo-result').innerText()).includes('0.8'), '压测示例 goodput 不正确');
  await page.locator('.lesson-labs a').click();
  await page.locator('.lab-manual-head h2').filter({ hasText: '做一次可信的 LLM 推理压测' }).waitFor();
  await page.locator('.course-return-link').click();
  await page.locator('.inference-area .lesson-markdown').waitFor();
  assert(page.url().includes('/topics/inference/serve-bench'), '实验返回未回到专区课程');
  await page.locator('.search-trigger').click();
  await page.locator('.search-palette input').fill('nearest-rank');
  await page.locator('.search-results > button').filter({ hasText: '推理入门' }).first().waitFor();
  await page.locator('.search-results > button').filter({ hasText: '读懂推理压测' }).click();
  await page.locator('.inference-area .lesson-markdown').waitFor();
  assert(page.url().includes('/topics/inference/serve-bench'), '新正文搜索未直达专区');
  await openInference('inf-kv');
  await page.screenshot({ path: join(artifacts, 'inference-reader-desktop.png'), fullPage: false, animations: 'disabled' });
  const afterCourseData = await page.evaluate(() => Object.fromEntries(['progress', 'bookmarks', 'notes', 'labs', 'assessments'].map(key => [key, localStorage.getItem(`infra-atlas-${key}-v1`)])));
  assert(JSON.stringify(afterCourseData) === JSON.stringify(originalData), '专区学习操作改写了原有进度、笔记或成绩');
  console.log('✓ 同站专区、六节正文与交互、原先修课、独立进度、继续阅读、深链接、历史和实验衔接');

  await nav('设置与备份');
  const [courseBackupDownload] = await Promise.all([page.waitForEvent('download'), page.locator('.backup-panel .btn-primary').click()]);
  const courseBackup = JSON.parse(readFileSync(await courseBackupDownload.path(), 'utf8'));
  assert(courseBackup.data.inferenceCourse?.progress?.['inf-kv'] === true && courseBackup.data.inferenceCourse.readingPosition?.topicId, '备份未包含专区进度和阅读位置');
  const uploadCourseBackup = payload => page.locator('input[type=file]').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(payload)) });
  const oldCourseBackup = structuredClone(courseBackup);
  delete oldCourseBackup.data.inferenceCourse;
  page.once('dialog', dialog => dialog.accept());
  await uploadCourseBackup(oldCourseBackup);
  await page.waitForFunction(() => Object.keys(JSON.parse(localStorage.getItem('infra-atlas-inference-course-v1')).progress).length === 0);
  assert(await page.evaluate(() => JSON.parse(localStorage.getItem('infra-atlas-progress-v1'))['inf-kv'] === true), '旧备份导入丢失原主题进度');
  page.once('dialog', dialog => dialog.accept());
  await uploadCourseBackup(courseBackup);
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('infra-atlas-inference-course-v1')).progress['inf-kv'] === true);
  const restoredCourseState = await page.evaluate(() => localStorage.getItem('infra-atlas-inference-course-v1'));
  assert(JSON.stringify(JSON.parse(restoredCourseState)) === JSON.stringify(courseBackup.data.inferenceCourse), '专区备份未完整恢复');
  await uploadCourseBackup({ ...courseBackup, data: { ...courseBackup.data, inferenceCourse: { progress: [], readingPosition: null } } });
  await page.getByRole('status').filter({ hasText: '无法读取' }).waitFor();
  assert(await page.evaluate(() => localStorage.getItem('infra-atlas-inference-course-v1')) === restoredCourseState, '无效专区备份覆盖了原状态');
  console.log('✓ 统一备份保留专区状态、兼容旧备份并拒绝无效专区数据');

  await page.goto(`${base}/#/inference`, { waitUntil: 'domcontentloaded' });
  await page.locator('.inference-overview .course-list li').first().waitFor();
  await page.goto(`${base}/#/inference/inf-kv`, { waitUntil: 'domcontentloaded' });
  await page.locator('.lesson-header h1').filter({ hasText: 'KV Cache 与显存' }).waitFor();
  await page.locator('.inference-area .lesson-markdown').waitFor();
  assert(await page.evaluate(() => JSON.parse(localStorage.getItem('infra-atlas-inference-course-v1')).progress['inf-kv'] === true), '兼容旧入口时丢失了原专区进度');
  const canonicalNext = page.locator('.reader-completion a').filter({ hasText: '下一节' });
  assert((await canonicalNext.getAttribute('href')).startsWith('#/topics/inference/'), '旧入口中的内部链接未使用统一专题地址');
  await canonicalNext.click();
  await page.locator('.batch-table').waitFor();
  assert(page.url().includes('/topics/inference/inf-batch'), '旧入口未接入同一专题路由');
  await page.goto(`${base}/#/topics/toString`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('link', { name: '返回专题学习', exact: true }).waitFor();
  await page.goto(`${base}/#/topics/inference/toString`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: '没有找到这节课', exact: true }).waitFor();
  await page.goto(`${base}/#/labs?courseLesson=toString&lab=lab-kv`, { waitUntil: 'domcontentloaded' });
  await page.locator('.lab-manual-head h2').waitFor();
  assert(await page.locator('.course-return-link').count() === 0, '无效课程参数生成了实验返回链接');
  console.log('✓ 旧推理地址共享进度与新路由，无效专题或课程可返回，实验忽略无效课程参数');

  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${base}/#/topics`, { waitUntil: 'domcontentloaded' });
    await page.locator('.topics-catalog').waitFor();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `专题总览在 ${width}px 横向溢出`);
    await page.locator('.topics-catalog a[href="#/topics/inference"]').click();
    await page.locator('.inference-overview .course-list li').first().waitFor();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `专区概览在 ${width}px 横向溢出`);
    for (const lesson of courseLessons) {
      await openInference(lesson.id);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${lesson.id} 在 ${width}px 横向溢出`);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await openInference('inf-kv');
  await page.locator('.reader-mobile-nav details').nth(1).locator('summary').click();
  await page.locator('.reader-mobile-nav details').nth(1).locator('a').nth(2).click();
  await delay(250);
  assert(await page.locator('.reader-mobile-nav details[open]').count() === 0, '手机本页目录跳转后未收起');
  assert(page.url().includes('section='), '手机本页目录未跳转段落');
  await page.screenshot({ path: join(artifacts, 'inference-reader-mobile.png'), fullPage: false, animations: 'disabled' });
  await page.locator('.mobile-menu').click();
  await page.locator('.main-nav button').filter({ hasText: '专题学习' }).click();
  await page.locator('.topics-catalog').waitFor();
  assert(await page.locator('.sidebar.is-open').count() === 0, '手机选择专区后导航未关闭');
  await page.screenshot({ path: join(artifacts, 'topics-catalog-mobile.png'), fullPage: true, animations: 'disabled' });
  await page.locator('.topics-catalog a[href="#/topics/inference"]').click();
  await page.locator('.inference-overview .course-list li').first().waitFor();
  await page.screenshot({ path: join(artifacts, 'inference-overview-mobile.png'), fullPage: true, animations: 'disabled' });
  console.log('✓ 手机专题总览、模块概览、六节阅读、折叠目录与同站导航');

  await page.setViewportSize({ width: 1440, height: 1000 });
  await nav('科普视频');
  await page.locator('.video-card').first().waitFor();
  await page.screenshot({ path: join(artifacts, 'videos-desktop.png'), fullPage: true, animations: 'disabled' });
  await page.locator('.video-card').first().click();
  await page.locator('.video-intro h1').waitFor();
  const firstVideo = videos[0];
  assert(await page.locator('.video-actions a').count() === firstVideo.videoLinks.length + (firstVideo.slides ? 1 : 0), '视频与课件按钮数量不符合配置');
  for (const link of firstVideo.videoLinks) {
    const button = page.getByRole('link', { name: `去${link.label}观看`, exact: true });
    assert(await button.getAttribute('href') === link.url, '观看按钮未绑定平台链接');
    assert(await button.getAttribute('target') === '_blank', '视频链接应在新标签页打开');
  }
  const slidesLink = page.getByRole('link', { name: '打开互动课件' });
  const [slidesPage] = await Promise.all([context.waitForEvent('page'), slidesLink.click()]);
  await slidesPage.waitForLoadState('load');
  await slidesPage.locator('#stage #title').filter({ hasText: /.+/ }).waitFor({ state: 'attached' });
  await slidesPage.locator('#controls').waitFor();
  await slidesPage.screenshot({ path: join(artifacts, 'video-slides-desktop.png'), fullPage: false, animations: 'disabled' });
  assert(await slidesPage.locator('#controls').count() === 1, '课件控制栏未加载');
  await slidesPage.close();
  const [materialDownload] = await Promise.all([page.waitForEvent('download'), page.getByRole('link', { name: '下载 Markdown' }).click()]);
  assert(materialDownload.suggestedFilename().endsWith('.md'), '配套资料下载失败');
  await page.getByRole('link', { name: '在线阅读', exact: true }).click();
  await page.locator('.video-markdown h1').waitFor();
  assert((await page.locator('.video-markdown').innerText()).includes('聊天消息'), '补充文章未加载');
  assert(await page.locator('.video-markdown .katex-display').count() === 4, '四个独立公式未渲染');
  assert(await page.locator('.video-markdown .katex:not(.katex-display .katex)').count() >= 7, '行内公式未渲染');
  assert(await page.locator('.video-markdown .katex-error').count() === 0, '公式解析失败');
  const attentionFormula = page.locator('.video-markdown .katex-display').first();
  await attentionFormula.scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(artifacts, 'video-math-desktop.png'), fullPage: false, animations: 'disabled' });
  await page.locator('.video-toc a').nth(1).click();
  assert(page.url().includes('section='), '文档目录未生成深链接');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('.video-markdown h1').waitFor();
  await page.waitForFunction(() => {
    const section = new URLSearchParams(location.hash.split('?')[1]).get('section');
    const rect = document.getElementById(`video-section-${section}`)?.getBoundingClientRect();
    return rect && rect.top >= 0 && rect.top < 200;
  });
  await page.screenshot({ path: join(artifacts, 'video-reader-desktop.png'), fullPage: false, animations: 'disabled' });
  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `视频文档在 ${width}px 横向溢出`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await attentionFormula.scrollIntoViewIfNeeded();
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), '手机公式造成页面横向溢出');
  await page.screenshot({ path: join(artifacts, 'video-reader-mobile.png'), fullPage: false, animations: 'disabled' });
  await page.getByRole('link', { name: '返回本期资料', exact: true }).click();
  await page.locator('.video-intro').waitFor();
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), '手机视频详情横向溢出');
  await page.screenshot({ path: join(artifacts, 'video-detail-mobile.png'), fullPage: true, animations: 'disabled' });
  await page.locator('.mobile-menu').click();
  await nav('科普视频');
  await page.locator('.video-card').waitFor();
  assert(await page.locator('.sidebar.is-open').count() === 0, '手机视频导航未关闭');
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), '手机视频列表横向溢出');
  await page.goto(`${base}/#/videos/unknown/resources/unknown`);
  await page.getByRole('heading', { name: '没有找到这份资料' }).waitFor();
  await page.goto(`${base}/#/videos/%zz`);
  await page.getByRole('heading', { name: '没有找到这份资料' }).waitFor();
  const documentPattern = '**/courses/**/resource/*.md';
  await page.route(documentPattern, route => route.fulfill({ status: 200, contentType: 'text/html', body: '<html>fallback</html>' }));
  await page.goto(`${base}/#/videos/ai-infra-overview-video/resources/overview`);
  await page.getByRole('heading', { name: '资料加载失败' }).waitFor();
  await page.unroute(documentPattern);
  await page.getByRole('button', { name: '重新加载' }).click();
  await page.locator('.video-markdown h1').waitFor();
  console.log('✓ 科普视频导航、独立课件、资料下载、文章目录深链接、手机布局、无效地址与加载重试');

  assert(runtimeErrors.length === 0, `浏览器运行错误：${runtimeErrors.join(' | ')}`);
  console.log('✓ 没有捕获到浏览器运行错误');
  failed = false;
  console.log(`\n全部 UI 验收通过。截图保存在 ${artifacts}`);
} catch (error) {
  console.error(`\nUI 验收失败：${error.message}`);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) {
    server.kill('SIGTERM');
    const exited = await Promise.race([once(server, 'exit').then(() => true), delay(3000).then(() => false)]);
    if (!exited && server.exitCode === null) server.kill('SIGKILL');
  }
  if (!failed) console.log('临时预览服务已停止。');
}
