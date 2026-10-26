import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { once } from 'node:events';

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
  assert(await page.locator('.module-card').count() === 14, '首页知识领域数量不正确');
  await page.screenshot({ path: join(artifacts, 'dashboard-desktop.png'), fullPage: true });
  console.log('✓ 首页、统计与 14 个知识领域');

  await page.locator('.search-trigger').click();
  await page.locator('.search-palette input').fill('KV Cache');
  await page.locator('.search-results > button').first().waitFor();
  assert(await page.locator('.search-results > button').count() > 0, '全局搜索没有结果');
  await page.keyboard.press('Escape');
  console.log('✓ 全局搜索与快捷键关闭');

  await nav('资源库');
  await page.locator('.resource-card').first().waitFor();
  assert(await page.locator('.resource-card').count() === 24, '资源库首批分页数量不正确');
  await page.locator('.library-search input').fill('vLLM');
  await delay(250);
  assert(await page.locator('.resource-card').count() > 0, '资源筛选没有结果');
  await page.locator('.resource-card-top button').first().click();
  assert(await page.evaluate(() => JSON.parse(localStorage.getItem('infra-atlas-bookmarks-v1') || '[]').length > 0), '收藏未保存');
  console.log('✓ 资源分页、搜索筛选与收藏持久化');

  await nav('学习路径');
  await page.locator('.topic-check').first().click();
  assert(await page.evaluate(() => JSON.parse(localStorage.getItem('infra-atlas-progress-v1') || '{}')['sys-os'] === true), '学习进度未写入');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('.topic-list article.is-done').first().waitFor();
  console.log('✓ 学习进度刷新后保留');

  await nav('实战实验室');
  await page.locator('.lab-steps > button').first().click();
  assert(await page.evaluate(() => (JSON.parse(localStorage.getItem('infra-atlas-labs-v1') || '{}')['lab-baseline'] || []).includes(0)), '实验步骤未保存');
  console.log('✓ 实验清单与进度保存');

  await nav('个人笔记');
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

  await nav('更新与备份');
  const [backupDownload] = await Promise.all([page.waitForEvent('download'), page.locator('.backup-panel .btn-primary').click()]);
  assert(backupDownload.suggestedFilename().endsWith('.json'), '备份导出文件名不正确');
  await page.locator('.topbar-actions .icon-btn').click();
  assert(await page.evaluate(() => document.documentElement.dataset.theme === 'dark'), '暗色主题切换失败');
  console.log('✓ 整站备份与明暗主题');

  await page.evaluate(() => localStorage.setItem('infra-atlas-theme-v1', JSON.stringify('light')));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  for (const route of ['dashboard', 'curriculum', 'map', 'resources', 'labs', 'notes', 'maintenance']) {
    await page.goto(`${base}/#/${route}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, 0));
    await delay(300);
    const dimensions = await page.evaluate(() => ({ width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    assert(dimensions.scrollWidth <= dimensions.width + 1, `${route} 手机端存在横向溢出：${dimensions.scrollWidth}/${dimensions.width}`);
    if (route === 'dashboard') await page.screenshot({ path: join(artifacts, 'dashboard-mobile.png'), fullPage: true, animations: 'disabled' });
    if (route === 'resources') await page.screenshot({ path: join(artifacts, 'resources-mobile.png'), fullPage: false, animations: 'disabled' });
  }
  await page.goto(`${base}/#/dashboard`, { waitUntil: 'domcontentloaded' });
  await page.locator('.mobile-menu').click();
  assert(await page.locator('.sidebar.is-open').isVisible(), '手机导航未打开');
  await page.locator('.nav-scrim').click({ position: { x: 380, y: 100 } });
  console.log('✓ 7 个页面的手机端布局与移动导航');

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
