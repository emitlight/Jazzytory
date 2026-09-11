#!/usr/bin/env node
/**
 * 브라우저 스모크 테스트
 * ---------------------------------------------------------------------------
 * 빌드 산출물을 실제 크로미움으로 열어 전 라우트를 확인한다.
 *  - 각 화면이 렌더되는가 (h1 과 본문 길이)
 *  - 콘솔 에러가 있는가
 *  - 400px 폭에서 가로 스크롤이 생기는가
 *  - 모듈 → 건반 예제, 곡 → 리드시트 같은 핵심 인터랙션이 동작하는가
 *
 *   npm run build && npm run smoke
 *   npm run smoke -- --shots ./shots     스크린샷 저장
 *
 * 브라우저 바이너리를 직접 지정하려면 PLAYWRIGHT_EXECUTABLE 을 쓴다
 * (사전 설치된 크로미움이 있는 CI/컨테이너용).
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../dist');
const PORT = Number(process.env.SMOKE_PORT ?? 4321);
const shotsIdx = process.argv.indexOf('--shots');
const SHOTS = shotsIdx >= 0 ? resolve(process.argv[shotsIdx + 1]) : null;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };

const server = createServer(async (req, res) => {
  let p = decodeURIComponent((req.url ?? '/').split('?')[0]);
  if (p === '/') p = '/index.html';
  try {
    const buf = await readFile(join(ROOT, p));
    res.writeHead(200, { 'Content-Type': MIME[extname(p)] ?? 'application/octet-stream' });
    res.end(buf);
  } catch {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(await readFile(join(ROOT, 'index.html')));
  }
});
await new Promise((r) => server.listen(PORT, r));
if (SHOTS) await mkdir(SHOTS, { recursive: true });

const launch = {};
if (process.env.PLAYWRIGHT_EXECUTABLE) {
  launch.executablePath = process.env.PLAYWRIGHT_EXECUTABLE;
  launch.args = ['--no-sandbox'];
}
const browser = await chromium.launch(launch);

const errors = [];
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
page.on('console', (m) => { if (m.type() === 'error') errors.push(`[console] ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));

const ROUTES = [
  '/#/', '/#/curriculum', '/#/curriculum/L1', '/#/lab/voicing', '/#/lab/progression',
  '/#/lab/keyboard', '/#/lab/ear', '/#/lab/metronome', '/#/tunes', '/#/listening',
  '/#/videos', '/#/progress', '/#/faculty', '/#/glossary', '/#/placement',
];

let failures = 0;
const rows = [];
for (const route of ROUTES) {
  const before = errors.length;
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const h1 = (await page.locator('h1').first().textContent().catch(() => '')) ?? '';
  const chars = (await page.locator('#main').innerText().catch(() => '')).length;
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  const newErrors = errors.length - before;
  // 빈 화면(본문 200자 미만)도 실패로 본다 — 렌더는 됐는데 내용이 없는 경우를 잡는다
  const ok = newErrors === 0 && !overflow && chars > 150 && h1.trim().length > 0;
  if (!ok) failures++;
  rows.push(`${ok ? 'ok  ' : 'FAIL'} ${route.padEnd(22)} h1="${h1.trim().slice(0, 26)}" chars=${String(chars).padStart(6)}${overflow ? ' H-OVERFLOW' : ''}${newErrors ? ` errors=${newErrors}` : ''}`);
  if (SHOTS) await page.screenshot({ path: join(SHOTS, `${route.replace(/[^a-z0-9]+/gi, '_') || 'home'}.png`) });
}

// 핵심 인터랙션
await page.goto(`http://localhost:${PORT}/#/curriculum`, { waitUntil: 'networkidle' });
const modLink = page.locator('a[href*="#/module/"]').first();
let moduleOk = false;
if (await modLink.count()) {
  await modLink.click();
  await page.waitForTimeout(600);
  moduleOk = ((await page.locator('h1').first().textContent()) ?? '').trim().length > 0;
  const kb = page.locator('button', { hasText: '건반에서 보기' }).first();
  if (await kb.count()) {
    await kb.click();
    await page.waitForTimeout(500);
    moduleOk = moduleOk && (await page.locator('.keyboard').count()) > 0;
  }
}

await page.goto(`http://localhost:${PORT}/#/tunes`, { waitUntil: 'networkidle' });
const tuneLink = page.locator('a[href*="#/tunes/t-"]').first();
let bars = 0;
if (await tuneLink.count()) {
  await tuneLink.click();
  await page.waitForTimeout(600);
  bars = await page.locator('.ls-bar').count();
}

// 모바일 400px
const mp = await (await browser.newContext({ viewport: { width: 400, height: 820 } })).newPage();
const mobileOverflow = [];
for (const route of ['/#/', '/#/lab/voicing', '/#/tunes', '/#/curriculum', '/#/listening']) {
  await mp.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' });
  await mp.waitForTimeout(250);
  if (await mp.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) mobileOverflow.push(route);
}

console.log('\n=== 라우트 ===');
console.log(rows.join('\n'));
console.log('\n=== 인터랙션 ===');
console.log(`모듈 → 건반 예제: ${moduleOk ? 'ok' : 'FAIL'}`);
console.log(`곡 → 리드시트:    ${bars > 0 ? `ok (${bars}마디)` : 'FAIL'}`);
console.log(`모바일 400px 가로 스크롤: ${mobileOverflow.length ? mobileOverflow.join(', ') : '없음'}`);
console.log('\n=== 콘솔 에러 ===');
console.log(errors.length ? errors.slice(0, 15).join('\n') : '없음');

await browser.close();
server.close();

const failed = failures > 0 || !moduleOk || bars === 0 || mobileOverflow.length > 0 || errors.length > 0;
console.log(`\n${failed ? '실패' : '전부 통과'}`);
process.exit(failed ? 1 : 0);
