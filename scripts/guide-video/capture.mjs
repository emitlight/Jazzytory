/**
 * 사용법 가이드 영상용 실제 화면 캡처.
 * github.io 는 이 샌드박스에서 차단되므로 로컬 빌드(dist)를 띄워 캡처하고,
 * 미디어 호스트(emitlight.github.io/jazzytory-media-*) 요청만 로컬 스텁으로 가로챈다.
 */
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const EXE = process.env.PLAYWRIGHT_EXECUTABLE || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = process.env.GUIDE_OUT || '/tmp/guide/shots';
const STUB = process.env.GUIDE_STUB || '/tmp/guide';
const ORIGIN = 'http://127.0.0.1:4173';
mkdirSync(OUT, { recursive: true });

const poster = readFileSync(join(STUB, 'stub-poster.jpg'));
const movie = readFileSync(join(STUB, 'stub.mp4'));

const browser = await chromium.launch({ executablePath: EXE });
const ctx = await browser.newContext({
  viewport: { width: 1512, height: 945 },
  deviceScaleFactor: 2,
  locale: 'ko-KR',
  colorScheme: 'dark',
  reducedMotion: 'reduce',
});

// 차단된 미디어 호스트를 스텁으로 대체
await ctx.route('**/jazzytory-media-**', (route) => {
  const u = route.request().url();
  if (/\.jpg(\?|$)/.test(u)) return route.fulfill({ status: 200, contentType: 'image/jpeg', body: poster });
  if (/\.mp4(\?|$)/.test(u)) return route.fulfill({ status: 200, contentType: 'video/mp4', body: movie });
  return route.fulfill({ status: 404, body: '' });
});

const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

async function go(hash) {
  await page.goto(`${ORIGIN}/#${hash}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1100);
  await page.evaluate(() => window.scrollTo(0, 0));
}
async function shot(name, clip) {
  await page.screenshot({ path: join(OUT, `${name}.png`), ...(clip ? { clip } : {}) });
  console.log('✓', name);
}

// 1) 홈 — 강의 목록
await go('/');
await shot('01-home');

// 2) 레벨 칩에서 L0
const l0 = page.locator('button', { hasText: /^L0/ }).first();
if (await l0.count()) { await l0.click(); await page.waitForTimeout(700); }
await shot('02-home-l0');

// 3) 강의 플레이어
await go('/course/L0/lesson/1');
await shot('03-lesson-top');

// 4) 챕터 목록이 보이는 지점
const ch = page.locator('text=챕터').first();
if (await ch.count()) { await ch.scrollIntoViewIfNeeded(); await page.waitForTimeout(500); }
await shot('04-lesson-chapters');

// 5) 이 강의의 필청 명반 / 추천 영상
for (const t of ['이 강의의 필청 명반', '필청', '추천 영상']) {
  const el = page.locator(`text=${t}`).first();
  if (await el.count()) { await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(500); break; }
}
await shot('05-lesson-albums');

// 6) 필청 명반 전체
await go('/library/listening');
await shot('06-listening');

// 7) 연습 랩
await go('/lab');
await shot('07-lab');

// 8) 내 진도
await go('/progress');
await shot('08-progress');

console.log('ERRORS:', errors.slice(0, 8));
await browser.close();
