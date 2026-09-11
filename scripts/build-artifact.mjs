#!/usr/bin/env node
/**
 * Artifact 호스팅용 번들 생성
 * ---------------------------------------------------------------------------
 * Artifact 는 페이지를 `<!doctype html><head>…</head><body>` 스켈레톤으로 감싸므로
 * html/head/body 태그 없이 본문만 써야 한다. CSS 는 인라인으로 넣어
 * 외부 스타일시트 제약을 피하고, JS 는 같은 출처 상대 경로로 불러온다.
 *
 *   JAZZYTORY_BASE=./ npm run build && node scripts/build-artifact.mjs
 */
import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const OUT = join(ROOT, 'artifact-dist');

const html = await readFile(join(DIST, 'index.html'), 'utf8');

const cssHref = /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/.exec(html)?.[1]
  ?? /<link[^>]+href="([^"]+\.css)"/.exec(html)?.[1];
const jsSrc = /<script[^>]+type="module"[^>]+src="([^"]+)"/.exec(html)?.[1];
if (!cssHref || !jsSrc) {
  console.error('dist/index.html 에서 css/js 경로를 찾지 못했습니다.');
  process.exit(1);
}

const clean = (p) => p.replace(/^\.?\//, '');
const css = await readFile(join(DIST, clean(cssHref)), 'utf8');

const page = `<title>Jazzytory</title>
<meta name="description" content="재즈피아노 연주 전공 커리큘럼을 그대로 옮긴 웹 학습 서비스. 9레벨 51모듈, 교수법 18가지, 인터랙티브 건반과 반주.">
<style>
/* Artifact 스켈레톤의 기본 여백·폰트를 무력화한다 */
html, body { margin: 0; padding: 0; font: inherit; }
${css}
</style>
<div id="root"></div>
<script type="module" src="${clean(jsSrc)}"></script>
`;

await rm(OUT, { recursive: true, force: true });
await mkdir(join(OUT, 'assets'), { recursive: true });
await cp(join(DIST, 'assets'), join(OUT, 'assets'), { recursive: true });
// 인라인했으므로 CSS 파일은 뺀다
await rm(join(OUT, clean(cssHref)), { force: true });
await writeFile(join(OUT, 'index.html'), page, 'utf8');

console.log(`artifact-dist 생성 완료`);
console.log(`  페이지: ${(page.length / 1024).toFixed(0)} KB (CSS 인라인)`);
console.log(`  진입 스크립트: ${clean(jsSrc)}`);
