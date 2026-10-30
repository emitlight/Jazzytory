/**
 * 슬라이드 PNG + 줄별 내레이션 mp3 → 1920×1080 H.264/AAC faststart mp4.
 * 규격은 기존 오리지널 강의 51편과 같게 맞춘다(jazzytory-media README).
 *
 *   node scripts/guide-video/compose.mjs
 *
 * 결과: <GUIDE_WORK>/out/jazzytory-guide.mp4 + poster.jpg
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const WORK = process.env.GUIDE_WORK || '/tmp/guide';
const SLIDES = join(WORK, 'slides');
const OUT = join(WORK, 'out');
const TMP = join(WORK, 'tmp');
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

const ff = (args) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
const t = JSON.parse(readFileSync(join(WORK, 'timeline.json'), 'utf8'));

// ── 오디오 트랙 ───────────────────────────────────────────────
// raw PCM 을 샘플 단위로 이어붙인다. mp3 를 이어붙이면 파일마다 프레임 패딩이
// 붙어 6분에 3초가량 밀리므로, 길이를 정확히 지배할 수 있는 PCM 에서 만든다.
const RATE = t.rate || 24000;
const samples = (sec) => Math.round(sec * RATE);
const silence = (sec) => Buffer.alloc(samples(sec) * 2); // s16le mono

const chunks = [silence(t.leadIn)];
t.lines.forEach((l, i) => {
  chunks.push(readFileSync(l.raw));
  chunks.push(silence(i < t.lines.length - 1 ? l.gap : l.gap + t.tail));
});
const pcm = Buffer.concat(chunks);
const rawTrack = join(TMP, 'narration.raw');
writeFileSync(rawTrack, pcm);
const audioSec = pcm.length / 2 / RATE;

// ── 비디오 트랙 ───────────────────────────────────────────────
// 첫 프레임은 리드인만큼, 마지막 프레임은 테일만큼 더 머문다.
const vLines = [];
t.lines.forEach((l, i) => {
  const png = join(SLIDES, `frame-${String(l.idx).padStart(3, '0')}.png`);
  let d = l.hold;
  if (i === 0) d += t.leadIn;
  if (i === t.lines.length - 1) d += t.tail;
  vLines.push(`file '${png}'`, `duration ${d.toFixed(3)}`);
});
// concat demuxer 규칙: 마지막 파일은 duration 없이 한 번 더 적는다
vLines.push(`file '${join(SLIDES, `frame-${String(t.lines.at(-1).idx).padStart(3, '0')}.png`)}'`);
const vListFile = join(TMP, 'video.txt');
writeFileSync(vListFile, vLines.join('\n'));

const mp4 = join(OUT, 'jazzytory-guide.mp4');
ff([
  '-f', 'concat', '-safe', '0', '-i', vListFile,
  '-f', 's16le', '-ar', String(RATE), '-ac', '1', '-i', rawTrack,
  '-map', '0:v:0', '-map', '1:a:0',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
  '-pix_fmt', 'yuv420p', '-r', '30',
  '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p',
  '-c:a', 'aac', '-b:a', '128k', '-ar', '44100', '-ac', '2',
  '-movflags', '+faststart',
  '-shortest',
  mp4,
]);

const probe = JSON.parse(execFileSync('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration,size:stream=codec_name,width,height,sample_rate,channels',
  '-of', 'json', mp4,
]).toString());
const dur = Number(probe.format.duration);
const mm = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

console.log(`✓ ${mp4}`);
console.log(`  ${mm(dur)} (${dur.toFixed(1)}초) · ${(statSync(mp4).size / 1e6).toFixed(1)} MB`);
for (const s of probe.streams) {
  console.log(`  ${s.codec_name} ${s.width ? `${s.width}×${s.height}` : `${s.sample_rate}Hz ${s.channels}ch`}`);
}
console.log(`  대본 ${mm(t.totalSec)} · 오디오 ${mm(audioSec)} · 오차 ${(dur - t.totalSec).toFixed(3)}초`);
if (Math.abs(audioSec - t.totalSec) > 0.05) {
  throw new Error(`오디오(${audioSec.toFixed(3)}초)가 타임라인(${t.totalSec.toFixed(3)}초)과 어긋난다`);
}
