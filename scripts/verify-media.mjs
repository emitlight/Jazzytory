#!/usr/bin/env node
/**
 * 유튜브 링크 생존 확인 (YouTube oEmbed)
 * ---------------------------------------------------------------------------
 * Jazzytory 는 **검증되지 않은 videoId 를 임베드하지 않는다.**
 * 이 스크립트는 videoId 가 채워진 항목만 확인해 `verified` 플래그를 갱신한다.
 *
 *   npm run verify:media          확인만 (변경 없음)
 *   npm run verify:media -- --write   결과를 videos.ts 에 반영
 *
 * 네트워크가 유튜브에 닿지 않는 환경(사내망·CI 샌드박스)에서는 아무것도 승격하지 않고
 * 종료 코드 0 으로 끝난다 — 검증 실패와 네트워크 차단을 구분하기 위해서다.
 */
import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('../src/data/videos.ts', import.meta.url);
const WRITE = process.argv.includes('--write');

const src = await readFile(FILE, 'utf8');

// videoId: '...' / null 과 바로 뒤따르는 verified 플래그를 짝지어 찾는다
const entryRe = /videoId:\s*(?:'([A-Za-z0-9_-]{11})'|null|"([A-Za-z0-9_-]{11})")/g;
const ids = [...src.matchAll(entryRe)].map((m) => m[1] ?? m[2]).filter(Boolean);
const unique = [...new Set(ids)];

if (unique.length === 0) {
  console.log('videoId 가 채워진 항목이 없습니다. 모든 영상이 검색 폴백으로 렌더링됩니다.');
  console.log('영상을 임베드하려면 videos.ts 의 videoId 를 채운 뒤 이 스크립트를 다시 실행하세요.');
  process.exit(0);
}

console.log(`${unique.length}개 videoId 확인 중…`);

async function check(id) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (res.status === 200) {
      const data = await res.json();
      return { id, ok: true, title: data.title, author: data.author_name };
    }
    return { id, ok: false, reason: `HTTP ${res.status}` };
  } catch (err) {
    return { id, ok: false, reason: err.name === 'TimeoutError' ? 'timeout' : 'network', network: true };
  }
}

const results = [];
for (const id of unique) {
  results.push(await check(id));
  await new Promise((r) => setTimeout(r, 120)); // 예의상 간격
}

const networkBlocked = results.every((r) => r.network);
if (networkBlocked) {
  console.log('\n유튜브에 접근할 수 없는 환경입니다. 아무것도 승격하지 않고 종료합니다.');
  console.log('(검증 실패가 아니라 네트워크 차단입니다 — verified 플래그는 그대로 둡니다.)');
  process.exit(0);
}

const alive = results.filter((r) => r.ok);
const dead = results.filter((r) => !r.ok);

console.log(`\n생존 ${alive.length} / 사망 ${dead.length}`);
for (const r of alive) console.log(`  ✓ ${r.id}  ${r.author} — ${r.title}`);
for (const r of dead) console.log(`  ✗ ${r.id}  (${r.reason})`);

if (!WRITE) {
  console.log('\n--write 를 붙이면 videos.ts 의 verified 플래그를 갱신합니다.');
  process.exit(dead.length ? 1 : 0);
}

// 각 항목 블록 안에서 videoId 와 같은 블록의 verified 를 갱신한다
let out = src;
for (const r of results) {
  const block = new RegExp(
    `(videoId:\\s*'${r.id}'[\\s\\S]{0,200}?verified:\\s*)(true|false)`,
    'g',
  );
  out = out.replace(block, `$1${r.ok}`);
}
// 죽은 영상은 videoId 를 null 로 되돌려 검색 폴백으로 보낸다
for (const r of dead) {
  out = out.replace(new RegExp(`videoId:\\s*'${r.id}'`, 'g'), 'videoId: null');
}

await writeFile(FILE, out, 'utf8');
console.log(`\nvideos.ts 갱신 완료 — 생존 ${alive.length}개를 임베드로 승격, 사망 ${dead.length}개를 검색 폴백으로 되돌림.`);
