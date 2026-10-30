/**
 * 만들어진 가이드 영상을 앱에 싣는다.
 *   - public/guide/jazzytory-guide.mp4, poster.jpg  (Vite 가 dist 로 그대로 복사)
 *   - src/data/guide.json                            (챕터·자막 메타데이터)
 *
 *   node scripts/guide-video/publish.mjs
 *
 * 오리지널 강의 51편은 별도 미디어 저장소(jazzytory-media-*)에 있지만,
 * 가이드는 한 편뿐이고 이 세션에서 그 저장소로 push 할 수 없어 앱 저장소에 함께 둔다.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const WORK = process.env.GUIDE_WORK || '/tmp/guide';
const PUB = join(ROOT, 'public', 'guide');
mkdirSync(PUB, { recursive: true });

const mp4Src = join(WORK, 'out', 'jazzytory-guide.mp4');
const posterSrc = join(WORK, 'poster.jpg');
copyFileSync(mp4Src, join(PUB, 'jazzytory-guide.mp4'));
copyFileSync(posterSrc, join(PUB, 'poster.jpg'));

const durationSec = Number.parseFloat(
  execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4Src])
    .toString().trim(),
);

const t = JSON.parse(readFileSync(join(WORK, 'timeline.json'), 'utf8'));

const guide = {
  id: 'lec-guide-howto',
  // 어느 차시에도 속하지 않는다 — 강의 51편(LECTURES)과 섞이지 않게 비워 둔다.
  moduleId: '',
  title: 'Jazzytory 사용법',
  summary: '처음 열어서 첫 강의 한 편을 끝낼 때까지. 메뉴 네 개, 강의 보는 법, 필청 명반 듣는 법, 진도 기록까지 6분에 훑는다.',
  // base 경로(/Jazzytory/)는 guide.ts 에서 붙인다
  src: 'guide/jazzytory-guide.mp4',
  poster: 'guide/poster.jpg',
  durationSec,
  chapters: t.chapters,
  transcript: t.lines.map((l) => ({ t: Math.round(l.start * 10) / 10, text: l.text })),
  publishedAt: new Date().toISOString().slice(0, 10),
  version: 1,
};

writeFileSync(join(ROOT, 'src', 'data', 'guide.json'), `${JSON.stringify(guide, null, 1)}\n`);

const mb = (p) => (statSync(p).size / 1e6).toFixed(1);
console.log(`✓ public/guide/jazzytory-guide.mp4  ${mb(join(PUB, 'jazzytory-guide.mp4'))} MB`);
console.log(`✓ public/guide/poster.jpg           ${mb(join(PUB, 'poster.jpg'))} MB`);
console.log(`✓ src/data/guide.json               챕터 ${guide.chapters.length} · 자막 ${guide.transcript.length}줄 · ${durationSec.toFixed(1)}초`);
