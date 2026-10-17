#!/usr/bin/env node
/**
 * 홈 화면 아이콘 생성 — public/icon.svg 를 크로미움으로 그려 PNG 로 굽는다.
 * 아이콘을 바꿀 때만 돌린다. 산출물(PNG)은 저장소에 커밋한다.
 *
 *   node scripts/make-icons.mjs
 */
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const PUB = resolve(import.meta.dirname, '../public');
const svg = await readFile(join(PUB, 'icon.svg'), 'utf8');

// iOS 는 투명 영역을 검게 채우고 모서리를 스스로 깎는다 → 사각 꽉 찬 배경으로 굽는다.
// maskable 은 안전 영역(중앙 80%) 안에 글자가 오도록 여백을 둔다.
const square = svg.replace(/rx="\d+"/, 'rx="0"');
const TARGETS = [
  { file: 'apple-touch-icon.png', size: 180, svg: square, pad: 0 },
  { file: 'icon-192.png', size: 192, svg, pad: 0 },
  { file: 'icon-512.png', size: 512, svg, pad: 0 },
  { file: 'icon-maskable-512.png', size: 512, svg: square, pad: 0.12 },
];

const browser = await chromium.launch();
for (const t of TARGETS) {
  const page = await browser.newPage({ viewport: { width: t.size, height: t.size } });
  const inner = Math.round(t.size * (1 - t.pad * 2));
  const body = t.pad
    ? `<div style="width:${t.size}px;height:${t.size}px;background:linear-gradient(135deg,#39d7f2,#a78bff);display:grid;place-items:center">
         <div style="width:${inner}px;height:${inner}px">${t.svg.replace('<rect', '<rect fill-opacity="0"')}</div></div>`
    : `<div style="width:${t.size}px;height:${t.size}px">${t.svg}</div>`;
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{width:100%;height:100%;display:block}</style>${body}`);
  await page.screenshot({ path: join(PUB, t.file), omitBackground: true });
  await page.close();
  console.log(`  ${t.file} ${t.size}px`);
}
await browser.close();
