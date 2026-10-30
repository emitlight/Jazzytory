/**
 * 대본의 각 줄을 한국어 음성으로 합성하고, 길이를 재서 타임라인을 만든다.
 *
 * 합성은 translate.googleapis.com 의 TTS 엔드포인트를 쓴다(이 샌드박스에서 닿는 유일한 한국어 TTS).
 * 한 줄씩 끊어 부르기 때문에 줄 단위 길이를 정확히 알 수 있고, 그대로 자막·챕터 타임스탬프가 된다.
 *
 *   node scripts/guide-video/tts.mjs            # 없는 것만 합성
 *   node scripts/guide-video/tts.mjs --force    # 전부 다시 합성
 *
 * 결과: <GUIDE_WORK>/audio/line-NNN.mp3 와 <GUIDE_WORK>/timeline.json
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { flatten } from './script.ko.mjs';

const WORK = process.env.GUIDE_WORK || '/tmp/guide';
const AUDIO = join(WORK, 'audio');
const FORCE = process.argv.includes('--force');

/** 줄 사이 쉼(초). 챕터가 바뀌는 줄 앞에서는 조금 더 쉰다. */
const GAP = 0.38;
const CHAPTER_GAP = 0.95;
/** 영상 맨 앞뒤 여백(초) */
const LEAD_IN = 1.2;
const TAIL = 2.2;

mkdirSync(AUDIO, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function synth(text, out) {
  // 엔드포인트는 200자 근처에서 잘린다. 대본은 그보다 짧게 쓰지만 방어적으로 확인한다.
  if ([...text].length > 190) throw new Error(`줄이 너무 길다(${[...text].length}자): ${text}`);
  const url =
    'https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=ko&q=' +
    encodeURIComponent(text);
  execFileSync('curl', [
    '-sS', '--fail', '--max-time', '40',
    '-A', 'Mozilla/5.0',
    '--retry', '3', '--retry-delay', '2', '--retry-all-errors',
    '-o', out, url,
  ]);
  if (!existsSync(out) || statSync(out).size < 500) throw new Error(`합성 실패(너무 작음): ${text}`);
}

/**
 * mp3 를 24kHz mono raw PCM 으로 풀어 두고, 샘플 수로 길이를 잰다.
 * mp3 를 그대로 이어붙이면 프레임 경계 패딩이 파일마다 최대 48ms 씩 쌓여
 * 6분짜리에서 3초가량 밀린다(자막이 음성보다 먼저 넘어간다).
 * 합성도 재생도 이 raw 를 기준으로 하면 어긋날 곳이 없다.
 */
const RATE = 24000;
function decodeRaw(mp3, raw) {
  execFileSync('ffmpeg', [
    '-y', '-v', 'error', '-i', mp3,
    '-f', 's16le', '-acodec', 'pcm_s16le', '-ar', String(RATE), '-ac', '1', raw,
  ]);
  const bytes = statSync(raw).size;
  if (bytes < 2 * RATE * 0.2) throw new Error(`디코드 결과가 너무 짧다: ${mp3}`);
  return bytes / 2 / RATE;
}
/** 초를 샘플 경계로 맞춘다 — 영상 길이와 오디오 길이가 같은 수에서 나오도록 */
const quantize = (sec) => Math.round(sec * RATE) / RATE;

const lines = flatten();
console.log(`대본 ${lines.length}줄 · 총 ${lines.reduce((a, l) => a + [...l.say].length, 0)}자`);

let t = quantize(LEAD_IN);
const timeline = [];
for (const line of lines) {
  const stem = `line-${String(line.idx).padStart(3, '0')}`;
  const file = join(AUDIO, `${stem}.mp3`);
  const raw = join(AUDIO, `${stem}.raw`);
  if (FORCE || !existsSync(file) || statSync(file).size < 500) {
    synth(line.say, file);
    await sleep(350); // 연속 호출로 막히지 않게
    process.stdout.write('.');
  } else {
    process.stdout.write('·');
  }
  if (FORCE || !existsSync(raw)) decodeRaw(file, raw);
  const dur = statSync(raw).size / 2 / RATE;
  const gap = quantize(line.chapterStart && line.idx > 0 ? CHAPTER_GAP : GAP);
  timeline.push({ ...line, file, raw, start: t, dur, gap, hold: dur + gap });
  t += dur + gap;
}
process.stdout.write('\n');

const total = t + quantize(TAIL);
const chapters = [];
for (const l of timeline) {
  if (l.chapterStart) chapters.push({ t: Math.max(0, Math.round((l.start - 0.4) * 10) / 10), title: l.chapter });
}

writeFileSync(
  join(WORK, 'timeline.json'),
  JSON.stringify(
    { totalSec: total, rate: RATE, leadIn: quantize(LEAD_IN), tail: quantize(TAIL), chapters, lines: timeline },
    null, 1,
  ),
);

const mm = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
console.log(`총 길이 ${mm(total)} (${total.toFixed(1)}초) · 챕터 ${chapters.length}개`);
for (const c of chapters) console.log(`  ${mm(c.t).padStart(5)}  ${c.title}`);
