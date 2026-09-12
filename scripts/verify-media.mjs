#!/usr/bin/env node
/**
 * 유튜브 영상 해석(resolve)과 생존 확인(verify)
 * ---------------------------------------------------------------------------
 * Jazzytory 는 **검증되지 않은 videoId 를 임베드하지 않는다.**
 * 그래서 videos.ts 는 videoId: null + 정밀 searchQuery 로 출발하고,
 * 이 스크립트가 두 단계를 거쳐 임베드로 승격한다.
 *
 *   1) resolve  검색어 → 후보 videoId (YouTube Data API v3, 키 필요)
 *   2) verify   videoId 생존 확인 (oEmbed, 키 불필요)
 *
 * 사용법
 *   npm run verify:media                       이미 채워진 ID만 생존 확인 (읽기 전용)
 *   npm run verify:media -- --write            확인 결과를 videos.ts 에 반영
 *   npm run verify:media -- --resolve          검색어로 후보 ID 찾기 (미리보기)
 *   npm run verify:media -- --resolve --write  찾아서 검증하고 반영
 *
 * --resolve 는 환경변수 YOUTUBE_API_KEY 가 필요하다.
 *   https://console.cloud.google.com → YouTube Data API v3 사용 설정 → API 키 발급
 *   무료 할당량 10,000 units/일, search.list 1회당 100 units → 약 100개까지 무료.
 *
 * *** 신뢰 규칙 ***
 * 검색 1등 결과를 무조건 받아들이지 않는다. 항목에 선언된 channel 과 실제 결과의
 * 채널명이 일치할 때만 채택한다. 일치하지 않으면 그 항목은 검색 폴백으로 남긴다 —
 * 엉뚱한 영상을 임베드하는 것이 링크 없는 것보다 나쁘기 때문이다.
 */
import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('../src/data/videos.ts', import.meta.url);
const WRITE = process.argv.includes('--write');
const RESOLVE = process.argv.includes('--resolve');
const API_KEY = process.env.YOUTUBE_API_KEY;

let src = await readFile(FILE, 'utf8');

/* ─────────────────  videos.ts 파싱  ───────────────── */

/** 각 VideoResource 블록에서 id / channel / searchQuery / videoId / verified 를 뽑는다 */
function parseEntries(text) {
  const entries = [];
  const re = /\{\s*\n\s*id:\s*'([^']+)'([\s\S]*?)\n\s*\},?\n/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const [full, id, body] = m;
    const field = (name) => new RegExp(`${name}:\\s*'((?:\\\\'|[^'])*)'`).exec(body)?.[1];
    const videoIdRaw = /videoId:\s*(null|'([A-Za-z0-9_-]{11})')/.exec(body);
    if (!/searchQuery:/.test(body)) continue;          // Channel 등 다른 타입은 건너뛴다
    entries.push({
      id,
      channel: field('channel'),
      searchQuery: field('searchQuery'),
      videoId: videoIdRaw?.[2] ?? null,
      verified: /verified:\s*true/.test(body),
      start: m.index,
      end: m.index + full.length,
    });
  }
  return entries;
}

const entries = parseEntries(src);
if (!entries.length) {
  console.error('videos.ts 에서 영상 항목을 찾지 못했습니다. 파서를 확인하세요.');
  process.exit(1);
}
console.log(`영상 항목 ${entries.length}개 (ID 있음 ${entries.filter((e) => e.videoId).length} · 검색 폴백 ${entries.filter((e) => !e.videoId).length})\n`);

/* ─────────────────  1단계: resolve  ───────────────── */

/** 채널명 비교 — 대소문자·공백·기호 차이를 무시한다 */
const norm = (s) => (s ?? '').toLowerCase().replace(/[^a-z0-9가-힣]/g, '');

async function searchYouTube(query) {
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', '5');
  url.searchParams.set('videoEmbeddable', 'true');
  url.searchParams.set('key', API_KEY);
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data.items ?? []).map((i) => ({
    videoId: i.id?.videoId,
    title: i.snippet?.title,
    channel: i.snippet?.channelTitle,
  })).filter((i) => i.videoId);
}

const resolved = [];
if (RESOLVE) {
  if (!API_KEY) {
    console.error('--resolve 에는 YOUTUBE_API_KEY 환경변수가 필요합니다.');
    console.error('  export YOUTUBE_API_KEY=... 후 다시 실행하세요.');
    console.error('  키 발급: https://console.cloud.google.com → YouTube Data API v3 → 사용자 인증 정보');
    process.exit(2);
  }
  const targets = entries.filter((e) => !e.videoId);
  console.log(`검색어로 후보를 찾는 중… (${targets.length}개, search.list ${targets.length * 100} units)\n`);

  for (const e of targets) {
    try {
      const results = await searchYouTube(e.searchQuery);
      // 선언된 채널과 일치하는 결과만 채택한다
      const match = results.find((r) => norm(r.channel) === norm(e.channel))
        ?? results.find((r) => norm(r.channel).includes(norm(e.channel)) || norm(e.channel).includes(norm(r.channel)));
      if (match) {
        resolved.push({ ...e, videoId: match.videoId, foundTitle: match.title, foundChannel: match.channel });
        console.log(`  ✓ ${e.id}\n      ${match.channel} — ${match.title}\n      ${match.videoId}`);
      } else {
        const top = results[0];
        console.log(`  – ${e.id}  채널 불일치로 보류 (선언: ${e.channel}${top ? ` / 1등 결과: ${top.channel}` : ' / 결과 없음'})`);
      }
    } catch (err) {
      console.log(`  ✗ ${e.id}  검색 실패: ${err.message}`);
      if (/HTTP 40[13]/.test(err.message)) {
        console.error('\nAPI 키가 거부되었습니다. 키가 유효한지, YouTube Data API v3 가 사용 설정되었는지 확인하세요.');
        process.exit(2);
      }
    }
    await new Promise((r) => setTimeout(r, 120));
  }
  console.log(`\n채택 ${resolved.length} / 보류 ${targets.length - resolved.length}\n`);
}

/* ─────────────────  2단계: verify (oEmbed)  ───────────────── */

async function checkAlive(id) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (res.status === 200) {
      const d = await res.json();
      return { ok: true, title: d.title, author: d.author_name };
    }
    return { ok: false, reason: `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, reason: err.name === 'TimeoutError' ? 'timeout' : 'network', network: true };
  }
}

const candidates = [
  ...resolved,
  ...entries.filter((e) => e.videoId && !resolved.some((r) => r.id === e.id)),
];

if (!candidates.length) {
  console.log('생존 확인할 videoId 가 없습니다.');
  console.log('모든 영상이 검색 폴백으로 렌더링됩니다 — 깨진 임베드는 없습니다.');
  console.log('\n임베드를 살리려면:');
  console.log('  YOUTUBE_API_KEY=... npm run verify:media -- --resolve --write');
  process.exit(0);
}

console.log(`생존 확인 중… (${candidates.length}개)`);
const results = [];
for (const c of candidates) {
  const r = await checkAlive(c.videoId);
  results.push({ ...c, ...r });
  await new Promise((r2) => setTimeout(r2, 120));
}

if (results.every((r) => r.network)) {
  console.log('\n유튜브에 접근할 수 없는 환경입니다. 아무것도 승격하지 않고 종료합니다.');
  console.log('(검증 실패가 아니라 네트워크 차단입니다 — verified 플래그는 그대로 둡니다.)');
  process.exit(0);
}

const alive = results.filter((r) => r.ok);
const dead = results.filter((r) => !r.ok);
console.log(`\n생존 ${alive.length} / 사망 ${dead.length}`);
for (const r of alive) console.log(`  ✓ ${r.id}  ${r.author} — ${r.title}`);
for (const r of dead) console.log(`  ✗ ${r.id}  ${r.videoId} (${r.reason})`);

if (!WRITE) {
  console.log('\n--write 를 붙이면 videos.ts 에 반영합니다.');
  process.exit(0);
}

/* ─────────────────  반영  ───────────────── */

// 뒤에서부터 치환해 앞쪽 인덱스가 밀리지 않게 한다
const byPos = [...results].sort((a, b) => b.start - a.start);
for (const r of byPos) {
  const block = src.slice(r.start, r.end);
  const next = block
    .replace(/videoId:\s*(?:null|'[A-Za-z0-9_-]{11}')/, `videoId: ${r.ok ? `'${r.videoId}'` : 'null'}`)
    .replace(/verified:\s*(?:true|false)/, `verified: ${r.ok}`);
  src = src.slice(0, r.start) + next + src.slice(r.end);
}
await writeFile(FILE, src, 'utf8');

console.log(`\nvideos.ts 갱신 완료 — 생존 ${alive.length}개를 임베드로 승격, 사망 ${dead.length}개를 검색 폴백으로 유지.`);
console.log('반드시 npm test 와 npm run smoke 를 다시 돌려 확인하세요.');
