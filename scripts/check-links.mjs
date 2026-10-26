import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const resources = JSON.parse(readFileSync(join(root, 'src/content/resources.json'), 'utf8'));
const queue = [...resources];
const results = [];
const concurrency = 8;

async function check(resource) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    let response = await fetch(resource.url, { method: 'HEAD', redirect: 'follow', signal: controller.signal, headers: { 'user-agent': 'Infra-Atlas-Link-Check/1.0' } });
    if ([400, 403, 405].includes(response.status)) {
      response = await fetch(resource.url, { method: 'GET', redirect: 'follow', signal: controller.signal, headers: { 'user-agent': 'Infra-Atlas-Link-Check/1.0' } });
    }
    return { resource, status: response.status, ok: response.ok, finalUrl: response.url };
  } catch (error) {
    return { resource, status: 0, ok: false, error: error.name === 'AbortError' ? '请求超时' : error.message };
  } finally { clearTimeout(timer); }
}
async function worker() {
  while (queue.length) {
    const resource = queue.shift();
    const result = await check(resource);
    results.push(result);
    const marker = result.ok ? 'OK' : result.status === 404 || result.status === 410 ? '失效' : '待确认';
    console.log(`[${marker}] ${result.status || '---'} ${resource.title}`);
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));
const broken = results.filter((item) => [404, 410].includes(item.status));
const review = results.filter((item) => !item.ok && !broken.includes(item));
console.log(`\n检查完成：${results.filter((item) => item.ok).length} 可访问，${broken.length} 明确失效，${review.length} 需人工确认。`);
if (review.length) console.log('“待确认”通常由站点反爬、限流或当前网络造成，不等同于链接失效。');
if (broken.length) process.exitCode = 1;
