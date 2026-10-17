import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ALBUMS, LEVELS, MODULE_BY_ID, lessonPathOfModule } from '../data';
import { useApp } from '../state';
import type { Album, LevelId } from '../data/types';
import { RichText } from '../components/Prose';

/**
 * 필청 명반 목록 — 필터 + 앨범 카드 + 트랙별 청취 지시.
 * 자료실 「필청 명반」 탭과 첫 화면(간단 보기)이 같은 컴포넌트를 쓴다.
 * groupByLevel 이면 레벨 L0→L8 묶음으로 보여 준다(레벨 필터를 고르면 그 레벨만).
 */
export function AlbumShelf({ groupByLevel = false }: { groupByLevel?: boolean }) {
  const { state, toggleListened } = useApp();
  const [level, setLevel] = useState<LevelId | 'all'>('all');
  const [tag, setTag] = useState<string | 'all'>('all');
  const [onlyPriority, setOnlyPriority] = useState(false);
  // 38장의 청취 지시문을 한꺼번에 펼치면 3만 자가 넘는 벽이 된다.
  // 기본은 접어 두고 한 장씩 열게 한다.
  const [expanded, setExpanded] = useState<string | null>(null);

  const tags = useMemo(() => [...new Set(ALBUMS.flatMap((a) => a.tags))].sort(), []);
  const filtered = useMemo(() => ALBUMS.filter((a) => {
    if (level !== 'all' && a.levelId !== level) return false;
    if (tag !== 'all' && !a.tags.includes(tag)) return false;
    if (onlyPriority && a.priority !== 1) return false;
    return true;
  }).sort((a, b) => a.priority - b.priority || a.year - b.year), [level, tag, onlyPriority]);

  const groups = groupByLevel
    ? LEVELS.map((l) => ({ level: l, items: filtered.filter((a) => a.levelId === l.id) })).filter((g) => g.items.length > 0)
    : [{ level: null, items: filtered }];

  const renderAlbum = (a: Album) => {
    const done = state.listened.includes(a.id);
    const isOpen = expanded === a.id;
    return (
      <article key={a.id} className="card stack stack-12">
        <div className="row-between">
          <div className="stack stack-4">
            <div className="row">
              <span className="badge tiny">{a.levelId}</span>
              {a.priority === 1 && <span className="badge badge-accent tiny">최우선</span>}
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{a.title}</h3>
            <span className="small muted">
              {a.leader}{a.pianist !== a.leader ? ` · 피아노 ${a.pianist}` : ''} · {a.year}{a.label ? ` · ${a.label}` : ''}
            </span>
          </div>
          <button className="btn btn-sm" aria-pressed={done} onClick={() => toggleListened(a.id)}>
            {done ? '✓ 들었음' : '들었음으로 표시'}
          </button>
        </div>

        <p className="small dim" style={{ margin: 0 }}><RichText text={a.why} /></p>

        <div className="chips">
          {a.tags.map((t) => <span key={t} className="badge tiny">{t}</span>)}
        </div>

        <div className="stack stack-8">
          <button
            className="btn btn-sm"
            aria-expanded={isOpen}
            onClick={() => setExpanded(isOpen ? null : a.id)}
            style={{ alignSelf: 'flex-start' }}
          >
            {isOpen ? '청취 지시 접기' : `무엇을 들을 것인가 · ${a.trackNotes.length}곡`}
          </button>

          {isOpen && a.trackNotes.map((n, i) => (
            <div key={i} className="sunken stack stack-4">
              <div className="row">
                <strong className="small">{n.track}</strong>
                {n.at && <span className="badge tiny mono">{n.at}</span>}
                {n.moduleId && MODULE_BY_ID.get(n.moduleId) && (
                  <Link className="badge tiny" to={lessonPathOfModule(n.moduleId) ?? '/'} style={{ textDecoration: 'none' }}>
                    → {MODULE_BY_ID.get(n.moduleId)!.title}
                  </Link>
                )}
              </div>
              <p className="small" style={{ margin: 0 }}><RichText text={n.listenFor} /></p>
            </div>
          ))}

          {!isOpen && a.trackNotes[0] && (
            <p className="tiny muted" style={{ margin: 0 }}>
              예: <strong>{a.trackNotes[0].track}</strong> — <RichText text={a.trackNotes[0].listenFor.replace(/\*\*/g, '').slice(0, 70)} />…
            </p>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="stack stack-24">
      <div className="panel stack stack-12">
        <div className="stack stack-8">
          <span className="eyebrow">레벨</span>
          <div className="chips">
            <button className="chip" aria-pressed={level === 'all'} onClick={() => setLevel('all')}>전체</button>
            {LEVELS.map((l) => (
              <button key={l.id} className="chip" aria-pressed={level === l.id} onClick={() => setLevel(l.id)}>{l.id}</button>
            ))}
          </div>
        </div>
        <div className="stack stack-8">
          <span className="eyebrow">어법</span>
          <div className="chips">
            <button className="chip" aria-pressed={tag === 'all'} onClick={() => setTag('all')}>전체</button>
            {tags.map((t) => (
              <button key={t} className="chip" aria-pressed={tag === t} onClick={() => setTag(t)}>{t}</button>
            ))}
          </div>
        </div>
        <label className="switch">
          <input type="checkbox" checked={onlyPriority} onChange={(e) => setOnlyPriority(e.target.checked)} />
          최우선(priority 1)만 보기
        </label>
      </div>

      {groups.map(({ level: l, items }) => (
        <div key={l?.id ?? 'all'} className="stack stack-12">
          {l && (
            <div className="row" style={{ gap: 8 }}>
              <span className="level-dot" style={{ background: l.accentColor }} aria-hidden="true" />
              <span className="eyebrow">{l.id} {l.title}</span>
              <span className="tiny muted">{items.length}장</span>
            </div>
          )}
          <div className="stack stack-16">{items.map(renderAlbum)}</div>
        </div>
      ))}
      {filtered.length === 0 && <p className="muted small">조건에 맞는 앨범이 없습니다.</p>}

      <p className="tiny muted">
        Jazzytory 는 음원을 호스팅하거나 스트리밍 링크를 제공하지 않습니다.
        앨범은 정식 유통 경로에서 구하거나 구독 서비스에서 찾아 들으세요.
      </p>
    </div>
  );
}

export default function Listening() {
  const { state } = useApp();
  const heard = state.listened.length;

  return (
    <div className="stack stack-24">
      <header className="stack stack-12">
        <span className="eyebrow">Essential Listening</span>
        <h1 style={{ margin: 0 }}>필청 명반 {ALBUMS.length}장</h1>
        <p className="lead" style={{ maxWidth: '58ch' }}>
          목록은 쉽고 <strong>듣는 법</strong>이 어렵습니다. 그래서 이 페이지의 핵심은 앨범 이름이 아니라
          각 트랙에 붙은 <strong>청취 지시문</strong>입니다. "좋은 연주네"로 끝나지 않게 하는 것이 목적입니다.
        </p>
        <div className="row">
          <span className="badge badge-accent">들은 앨범 {heard} / {ALBUMS.length}</span>
        </div>
      </header>
      <h2 className="sr-only">앨범 목록</h2>
      <AlbumShelf />
    </div>
  );
}
