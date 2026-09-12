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
 *   npm run verify:media                        이미 채워진 ID만 생존 확인 (읽기 전용)
 *   npm run verify:media -- --write             확인 결과를 videos.ts 에 반영
 *   npm run verify:media -- --resolve           검색해서 후보를 찾고 캐시에 저장 (API 소모)
 *   npm run verify:media -- --rejudge           캐시로 다시 판정 (API 소모 없음)
 *   npm run verify:media -- --rejudge --write   캐시로 판정하고 반영
 *
 * *** 검색과 판정을 분리한 이유 ***
 * search.list 는 1회 100 units, 일일 무료 할당량은 10,000 units 다.
 * 58개 항목이면 한 번 돌릴 때마다 5,800 units — 하루에 두 번이면 초과한다.
 * 그래서 --resolve 가 API 응답을 scripts/media-candidates.json 에 캐시하고,
 * 가드를 손볼 때는 --rejudge 로 캐시만 다시 판정한다. 할당량을 쓰지 않는다.
 *
 * --resolve 는 YouTube Data API 키가 필요하다. --key=... 인자 또는 환경변수 YOUTUBE_API_KEY.
 * 인자로 넘기면 npm 배너와 셸 히스토리에 키가 남는다. 유튜브 읽기 전용 키라 위험은 낮지만,
 * 신경 쓰인다면 환경변수를 쓰거나 `npm run --silent` 로 배너를 없애고 실행 후 히스토리를 지운다.
 *   https://console.cloud.google.com → YouTube Data API v3 사용 설정 → API 키 발급
 *   무료 할당량 10,000 units/일, search.list 1회당 100 units → 약 100개까지 무료.
 *
 * *** 신뢰 규칙 — 세 겹 ***
 * 검색 1등 결과를 무조건 받아들이지 않는다. 세 관문을 모두 통과해야 채택한다.
 *   1) 채널 일치 — 선언된 channel 과 결과 채널명이 같아야 한다
 *   2) 주제 일치 — 검색어의 고유 개념어가 영상 제목에 실제로 나타나야 한다
 *   3) 중복 배제 — 한 영상은 한 차시에만. 이미 쓰인 영상은 점수가 높은 쪽이 가져간다
 *
 * 채널만 보면 "스윙 8분음표" 차시에 같은 채널의 「Solar 즉흥 튜토리얼」이 붙고,
 * 같은 영상이 세 차시에 중복으로 들어간다. 실제로 1차 실행에서 그런 일이 일어났다.
 * 엉뚱한 영상을 임베드하는 것이 링크 없는 것보다 나쁘다.
 */
import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('../src/data/videos.ts', import.meta.url);
const WRITE = process.argv.includes('--write');
const RESOLVE = process.argv.includes('--resolve');
// 키는 --key=... 인자로도, 환경변수로도 받는다.
// 윈도우 CMD 는 `VAR=value cmd` 문법이 없어 환경변수만 지원하면 진입 장벽이 된다.
const REJUDGE = process.argv.includes('--rejudge');
const KEY_ARG = process.argv.find((a) => a.startsWith('--key='))?.slice('--key='.length);
const API_KEY = KEY_ARG || process.env.YOUTUBE_API_KEY;
const CACHE = new URL('./media-candidates.json', import.meta.url);

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

/** 어느 재즈 영상에나 나오는 말 — 주제 판정에서 제외한다 */
const STOPWORDS = new Set([
  'jazz', 'piano', 'pianist', 'tutorial', 'lesson', 'lessons', 'music', 'video',
  'the', 'and', 'for', 'with', 'your', 'you', 'how', 'what', 'why', 'this', 'that',
  'from', 'into', 'over', 'about', 'every', 'basic', 'basics', 'beginner', 'intro',
  'introduction', 'explained', 'guide', 'learn', 'learning', 'play', 'playing',
  'practice', 'exercise', 'exercises', 'part', 'masterclass', 'improv', 'improvisation',
]);

/** 검색어에서 이 항목을 다른 항목과 구별짓는 개념어만 뽑는다 */
function conceptTerms(query, channel) {
  const chWords = new Set(channel.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
  return [...new Set(
    query.toLowerCase()
      .split(/[^a-z0-9#♭'’-]+/)
      .map((t) => t.replace(/^[-']+|[-']+$/g, ''))
      .filter((t) => t.length >= 3 && !STOPWORDS.has(t) && !chWords.has(t)),
  )];
}

/**
 * 개념어의 희소성 — 58개 검색어 전체에서 몇 번 쓰였는가.
 * 'quartal' 은 한 항목에만 나오므로 그 한 번의 일치가 결정적이고,
 * 'modern' 'chords' 는 여러 항목에 나오므로 혼자서는 근거가 못 된다.
 */
function buildRarity(entries) {
  const df = new Map();
  for (const e of entries) {
    for (const t of new Set(conceptTerms(e.searchQuery, e.channel))) {
      df.set(t, (df.get(t) ?? 0) + 1);
    }
  }
  return df;
}

/** 통과 문턱. 희소어 한 개 또는 일반어 두 개 이상이어야 한다. */
const TOPIC_THRESHOLD = 2;

/**
 * 주제 일치 점수 — 검색어의 개념어가 제목에 몇 개나 나타나는가.
 * 채널이 같아도 주제가 다른 영상을 걸러내기 위한 관문이다.
 * 희소한 개념어의 일치는 2점, 흔한 개념어는 1점으로 센다.
 */
function topicMatch(query, channel, title, rarity) {
  const terms = conceptTerms(query, channel);
  const t = (title ?? '').toLowerCase();
  const hits = terms.filter((term) => t.includes(term));
  const score = hits.reduce((sum, term) => sum + ((rarity?.get(term) ?? 9) === 1 ? 2 : 1), 0);
  return { hits, terms, score };
}

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
const rarity = buildRarity(entries);

/** 캐시에서 검색 결과를 읽는다. 없으면 null. */
async function loadCache() {
  try {
    const raw = await readFile(CACHE, 'utf8');
    const data = JSON.parse(raw);
    console.log(`캐시 사용 — ${data.fetchedAt} 에 받은 검색 결과 ${Object.keys(data.results).length}건\n`);
    return data.results;
  } catch {
    return null;
  }
}

/**
 * 관문 1~3 을 적용해 채택 목록을 만든다.
 * 순수 함수라 API 를 쓰지 않는다 — 가드를 고칠 때마다 공짜로 다시 돌릴 수 있다.
 */
function judge(targets, searchResults) {
  const claimed = new Map();
  const rejected = [];
  const picked = [];

  for (const e of targets) {
    const results = searchResults[e.id];
    if (!results) { rejected.push({ id: e.id, why: '검색 결과 없음 (캐시 미수집)' }); continue; }

    // 관문 1 — 채널 일치
    const sameChannel = results.filter((r) =>
      norm(r.channel) === norm(e.channel)
      || norm(r.channel).includes(norm(e.channel))
      || norm(e.channel).includes(norm(r.channel)));
    if (!sameChannel.length) {
      const top = results[0];
      rejected.push({ id: e.id, why: `채널 불일치 (선언: ${e.channel}${top ? ` / 1등: ${top.channel}` : ''})` });
      continue;
    }

    // 관문 2 — 주제 일치. 희소 개념어 1개 또는 일반 개념어 2개 이상.
    const scored = sameChannel
      .map((r) => ({ ...r, ...topicMatch(e.searchQuery, e.channel, r.title, rarity) }))
      .sort((a, b) => b.score - a.score);
    const best = scored[0];
    if (!best || best.score < TOPIC_THRESHOLD) {
      const terms = conceptTerms(e.searchQuery, e.channel).slice(0, 4).join(', ');
      rejected.push({
        id: e.id,
        why: `주제 근거 약함 (점수 ${best?.score ?? 0}/${TOPIC_THRESHOLD}, 개념어 [${terms}]${best ? ` / 후보: ${best.title.slice(0, 45)}` : ''})`,
      });
      continue;
    }

    // 관문 3 — 중복 배제. 점수가 높은 쪽이 가져간다.
    const prior = claimed.get(best.videoId);
    if (prior) {
      if (best.score > prior.score) {
        rejected.push({ id: prior.id, why: `중복 — 같은 영상을 ${e.id} 가 더 잘 맞아 양보` });
        const i = picked.findIndex((x) => x.id === prior.id);
        if (i >= 0) picked.splice(i, 1);
      } else {
        rejected.push({ id: e.id, why: `중복 — 같은 영상이 이미 ${prior.id} 에 쓰임` });
        continue;
      }
    }

    claimed.set(best.videoId, { id: e.id, score: best.score });
    picked.push({ ...e, videoId: best.videoId, foundTitle: best.title, foundChannel: best.channel, score: best.score, hits: best.hits });
  }
  return { picked, rejected };
}

if (RESOLVE || REJUDGE) {
  const targets = entries.filter((e) => !e.videoId);
  let searchResults = await loadCache();

  if (REJUDGE && !searchResults) {
    console.error('--rejudge 에 쓸 캐시가 없습니다. 먼저 --resolve 로 한 번 검색해야 합니다.');
    process.exit(2);
  }

  if (RESOLVE && !searchResults) {
    if (!API_KEY) {
      console.error('--resolve 에는 YouTube Data API 키가 필요합니다.\n');
      console.error('가장 간단한 방법 — 키를 인자로 직접 넘기세요 (OS 무관):');
      console.error('  npm run verify:media -- --resolve --write --key=여기에_키\n');
      console.error('환경변수로 주려면:');
      console.error('  Windows CMD         set YOUTUBE_API_KEY=여기에_키');
      console.error('  Windows PowerShell  $env:YOUTUBE_API_KEY="여기에_키"');
      console.error('  macOS / Linux       export YOUTUBE_API_KEY=여기에_키\n');
      console.error('키 발급: https://console.cloud.google.com');
      console.error('  → 프로젝트 생성 → "YouTube Data API v3" 검색해 사용 설정');
      console.error('  → 사용자 인증 정보 → 사용자 인증 정보 만들기 → API 키');
      process.exit(2);
    }

    console.log(`검색 중… (${targets.length}개 · search.list ${targets.length * 100} units)`);
    console.log('결과는 캐시에 저장되므로 가드를 고쳐도 다시 검색하지 않습니다.\n');

    searchResults = {};
    let quotaHit = false;
    for (const e of targets) {
      try {
        searchResults[e.id] = await searchYouTube(e.searchQuery);
        process.stdout.write('.');
      } catch (err) {
        if (/HTTP 400/.test(err.message) && /API_KEY_INVALID|API key not valid/i.test(err.message)) {
          console.error('\n키가 유효하지 않습니다. 앞뒤 공백이나 따옴표가 섞이지 않았는지 확인하세요.');
          process.exit(2);
        }
        if (/HTTP 40[13]/.test(err.message)) {
          console.error('\nAPI 키가 거부되었습니다. 키가 유효한지, YouTube Data API v3 가 사용 설정되었는지,');
          console.error('키에 API 제한을 걸었다면 YouTube Data API v3 가 허용 목록에 있는지 확인하세요.');
          process.exit(2);
        }
        if (/HTTP 429|quota/i.test(err.message)) {
          quotaHit = true;
          console.log(`\n\n일일 할당량을 소진했습니다 (${Object.keys(searchResults).length}/${targets.length} 수집).`);
          console.log('여기까지 받은 결과는 캐시에 저장합니다 — 내일 이어서 받으면 됩니다.');
          break;
        }
        searchResults[e.id] = [];
      }
      await new Promise((r) => setTimeout(r, 120));
    }
    if (!quotaHit) console.log('\n');

    // 부분 수집이라도 캐시에 남긴다. 할당량을 두 번 태우지 않기 위해서다.
    await writeFile(CACHE, JSON.stringify({
      fetchedAt: new Date().toISOString(),
      note: '유튜브 검색 결과 캐시. 공개 메타데이터만 담으며 API 키는 포함하지 않는다.',
      results: searchResults,
    }, null, 2), 'utf8');
    console.log(`캐시 저장: scripts/media-candidates.json (${Object.keys(searchResults).length}건)\n`);
  }

  const { picked, rejected } = judge(targets, searchResults ?? {});
  for (const r of picked) {
    console.log(`  ✓ ${r.id}  [${r.hits.join(', ')}] 점수 ${r.score}`);
    console.log(`      ${r.foundChannel} — ${r.foundTitle}`);
    console.log(`      ${r.videoId}`);
  }
  if (rejected.length) {
    console.log('\n보류한 항목:');
    for (const r of rejected) console.log(`  – ${r.id}  ${r.why}`);
  }
  resolved.push(...picked);
  console.log(`\n채택 ${picked.length} / 보류 ${rejected.length}\n`);
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
