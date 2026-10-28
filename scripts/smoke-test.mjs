import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { once } from 'node:events';
import { stageAssessments } from '../src/content/stage-assessments.js';

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
  await page.screenshot({ path: join(artifacts, 'dashboard-desktop.png'), fullPage: true });
  console.log('✓ 首页、统计与 15 个知识领域');

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
  await page.getByRole('button', { name: '新建笔记' }).click();
  await page.locator('.editor-title').fill('UI 自动化验收笔记');
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
