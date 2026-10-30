/**
 * 타임라인의 각 줄을 1920×1080 슬라이드 PNG 로 렌더한다.
 * 크로미움으로 그리기 때문에 본문 폰트(Noto Sans CJK KR)와 둥근 모서리·그림자가 그대로 나온다.
 *
 *   node scripts/guide-video/slides.mjs
 *
 * 결과: <GUIDE_WORK>/slides/frame-NNN.png + poster.jpg
 */
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const WORK = process.env.GUIDE_WORK || '/tmp/guide';
const SHOTS = join(WORK, 'shots');
const OUT = join(WORK, 'slides');
const EXE = process.env.PLAYWRIGHT_EXECUTABLE || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
mkdirSync(OUT, { recursive: true });

const timeline = JSON.parse(readFileSync(join(WORK, 'timeline.json'), 'utf8'));
const shotCache = new Map();
function shotDataUrl(name) {
  if (!shotCache.has(name)) {
    const b = readFileSync(join(SHOTS, `${name}.png`));
    shotCache.set(name, `data:image/png;base64,${b.toString('base64')}`);
  }
  return shotCache.get(name);
}

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px;overflow:hidden}
body{
  font-family:'Noto Sans CJK KR','Noto Sans KR',sans-serif;
  background:
    radial-gradient(1200px 700px at 18% -10%, #16304a 0%, transparent 60%),
    radial-gradient(900px 600px at 95% 110%, #2a1f4d 0%, transparent 55%),
    #080a0e;
  color:#e9eef7; -webkit-font-smoothing:antialiased;
}
.head{position:absolute;top:0;left:0;right:0;height:92px;display:flex;align-items:center;
  justify-content:space-between;padding:0 64px;}
.brand{display:flex;align-items:center;gap:14px;font-weight:800;font-size:25px;letter-spacing:-.2px}
.logo{width:40px;height:40px;border-radius:11px;display:grid;place-items:center;font-size:23px;font-weight:900;
  background:linear-gradient(145deg,#6fd4e8,#7f8cf5);color:#06121a}
.brand .sub{font-weight:600;color:#8fa0b8;font-size:21px;margin-left:4px}
.chapter{display:flex;align-items:center;gap:14px;font-size:23px;font-weight:700;color:#cfe6ff}
.chapter .dot{width:9px;height:9px;border-radius:50%;background:#58d7f0;box-shadow:0 0 14px #58d7f0}
.chapter .n{font-size:19px;color:#7b8ba3;font-weight:600;font-variant-numeric:tabular-nums}

.stage{position:absolute;top:118px;left:0;right:0;height:812px;display:grid;place-items:center}
.frame{position:relative;border-radius:16px;overflow:hidden;
  box-shadow:0 34px 90px rgba(0,0,0,.62), 0 0 0 1px rgba(150,180,220,.16);}
.frame img{display:block;width:100%;height:100%;object-fit:cover}
.focus{position:absolute;border:3px solid #5fe0f5;border-radius:10px;
  box-shadow:0 0 0 6px rgba(95,224,245,.17), 0 0 34px rgba(95,224,245,.5);
  background:rgba(95,224,245,.08)}
.scrim{position:absolute;inset:0;background:rgba(6,9,14,.55)}
.scrim.off{display:none}

.cap{position:absolute;left:0;right:0;bottom:0;height:150px;display:grid;place-items:center;padding:0 150px}
.cap p{font-size:35px;line-height:1.42;font-weight:600;text-align:center;color:#f2f6fc;
  text-shadow:0 2px 18px rgba(0,0,0,.65);max-width:1580px}
.cap b,.cap strong{color:#7fe3f7}

/* 타이틀 카드 */
.title{position:absolute;inset:0;display:grid;place-items:center;text-align:center}
.title h1{font-size:104px;line-height:1.12;font-weight:900;letter-spacing:-2.5px}
.title h1 em{font-style:normal;background:linear-gradient(100deg,#7fe3f7,#9aa6ff 60%,#c9a6ff);
  -webkit-background-clip:text;background-clip:text;color:transparent}
.title .lead{margin-top:26px;font-size:31px;color:#9fb2c9;font-weight:600}
.title .url{margin-top:40px;display:inline-block;padding:15px 30px;border-radius:13px;
  font-size:26px;font-weight:700;color:#cfe9ff;background:rgba(120,170,220,.11);
  border:1px solid rgba(150,190,230,.26)}
`;

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
/** 「…」 와 ✓ ▶ → 로 묶인 UI 문구를 강조색으로 */
const rich = (s) =>
  esc(s)
    .replace(/(「[^」]+」)/g, '<b>$1</b>')
    .replace(/(✓ [^\s,.]+|▶ [^\s,.]+)/g, '<b>$1</b>');

// 스크린샷 비율(캡처 뷰포트 1512×945 = 1.6)
const SHOT_W = 1312;
const SHOT_H = Math.round(SHOT_W / 1.6); // 820

function slideHtml(line, nth, total) {
  if (line.idx === 0) {
    return `<!doctype html><meta charset="utf-8"><style>${CSS}</style>
    <div class="title">
      <div>
        <h1>Jazzytory <em>사용법</em></h1>
        <p class="lead">처음 열어서 첫 강의 한 편을 끝낼 때까지</p>
        <div class="url">emitlight.github.io/Jazzytory</div>
      </div>
    </div>`;
  }
  const f = line.focus;
  const box = f
    ? `<div class="focus" style="left:${(f.x * 100).toFixed(2)}%;top:${(f.y * 100).toFixed(2)}%;width:${(f.w * 100).toFixed(2)}%;height:${(f.h * 100).toFixed(2)}%"></div>`
    : '';
  return `<!doctype html><meta charset="utf-8"><style>${CSS}</style>
  <div class="head">
    <div class="brand"><span class="logo">J</span>Jazzytory<span class="sub">사용법</span></div>
    <div class="chapter"><span class="dot"></span>${esc(line.chapter)}<span class="n">${nth}/${total}</span></div>
  </div>
  <div class="stage">
    <div class="frame" style="width:${SHOT_W}px;height:${SHOT_H}px">
      <img src="${shotDataUrl(line.shot)}" alt="">
      <div class="scrim ${f ? '' : 'off'}"></div>
      ${box}
    </div>
  </div>
  <div class="cap"><p>${rich(line.text)}</p></div>`;
}

const browser = await chromium.launch({ executablePath: EXE });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });

const chapters = [...new Set(timeline.lines.map((l) => l.chapter))];
for (const line of timeline.lines) {
  const nth = chapters.indexOf(line.chapter) + 1;
  await page.setContent(slideHtml(line, nth, chapters.length), { waitUntil: 'load' });
  await page.screenshot({ path: join(OUT, `frame-${String(line.idx).padStart(3, '0')}.png`) });
  process.stdout.write('.');
}
process.stdout.write('\n');

// 포스터 = 타이틀 카드
await page.setContent(slideHtml(timeline.lines[0], 1, chapters.length), { waitUntil: 'load' });
await page.screenshot({ path: join(WORK, 'poster.jpg'), type: 'jpeg', quality: 92 });

await browser.close();
console.log(`슬라이드 ${timeline.lines.length}장 + 포스터 완료`);
