import type { ReactNode } from 'react';

/**
 * 콘텐츠 데이터의 제한적 마크다운 렌더러.
 *
 * 콘텐츠 집필 규약상 본문에는 `**굵게**`, `` `코드` ``, "- " 목록만 쓴다.
 * 이 두 컴포넌트를 거치지 않고 문자열을 그대로 뿌리면 화면에 별표가 노출된다 —
 * 실제로 그렇게 새던 자리가 많았다. 콘텐츠 문자열은 반드시 여기를 통과시킨다.
 */

/** 문단·목록까지 처리하는 블록 렌더러 */
export default function Prose({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);
  return (
    <div className="prose">
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        if (lines.every((l) => /^\s*-\s+/.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*-\s+/, ''))}</li>)}
            </ul>
          );
        }
        return <p key={i}>{inline(block)}</p>;
      })}
    </div>
  );
}

/**
 * 인라인 전용 렌더러. `<p>`, `<li>`, 칩 안 등 이미 블록이 정해진 자리에 쓴다.
 * 줄바꿈(\n)은 그대로 살린다 — 호출부에서 `white-space: pre-line` 을 함께 쓰면 된다.
 */
export function RichText({ text }: { text: string }) {
  return <>{inline(text)}</>;
}

function inline(s: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*\n]+\*\*|`[^`\n]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) out.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    else out.push(<code key={key++} className="chordsym">{tok.slice(1, -1)}</code>);
    last = m.index + tok.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}
