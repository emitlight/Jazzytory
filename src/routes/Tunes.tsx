import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TUNES, LEVELS } from '../data';
import { useApp } from '../state';
import type { LevelId, TuneStyle } from '../data/types';

const FORM_KO: Record<string, string> = {
  'AABA-32': 'AABA 32', 'ABAC-32': 'ABAC 32', 'blues-12': '블루스 12',
  'minor-blues-12': '마이너 블루스 12', 'rhythm-changes-32': '리듬 체인지',
  'ABA-16': 'ABA 16', 'modal': '모달', 'through-composed': '통절', 'AAB': 'AAB', 'other': '기타',
};

export default function Tunes() {
  const { state, toggleFavoriteTune } = useApp();
  const [level, setLevel] = useState<LevelId | 'all'>('all');
  const [style, setStyle] = useState<TuneStyle | 'all'>('all');
  const [q, setQ] = useState('');

  const styles = useMemo(() => [...new Set(TUNES.map((t) => t.style))], []);

  const filtered = useMemo(() => TUNES.filter((t) => {
    if (level !== 'all' && t.levelId !== level) return false;
    if (style !== 'all' && t.style !== style) return false;
    if (q && !(`${t.title} ${t.composer} ${t.key}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }).sort((a, b) => a.difficulty - b.difficulty || a.title.localeCompare(b.title)), [level, style, q]);

  return (
    <div className="stack stack-24">
      <header className="stack stack-12">
        <span className="eyebrow">Repertoire</span>
        <h1 style={{ margin: 0 }}>레퍼토리 {TUNES.length}곡</h1>
        <p className="lead" style={{ maxWidth: '58ch' }}>
          곡을 익히는 순서는 취향이 아니라 <strong>교육적 수익률</strong>로 정합니다.
          리듬 체인지 하나가 수십 곡을 열고, 블루스 하나가 잼 세션의 문을 엽니다.
        </p>
        <div className="note note-warn small">
          <strong>저작권 고지.</strong> 여기 수록된 것은 <strong>화성 진행(코드)뿐</strong>입니다.
          멜로디·가사·채보된 솔로는 포함하지 않으며, 리얼북 페이지를 재현하지 않습니다.
          멜로디는 정식 악보를 구해 익히세요.
        </div>
      </header>

      <div className="panel stack stack-12">
        <div className="field">
          <label htmlFor="q">곡 검색</label>
          <input id="q" type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="제목, 작곡가, 조성" />
        </div>
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
          <span className="eyebrow">스타일</span>
          <div className="chips">
            <button className="chip" aria-pressed={style === 'all'} onClick={() => setStyle('all')}>전체</button>
            {styles.map((s) => (
              <button key={s} className="chip" aria-pressed={style === s} onClick={() => setStyle(s)}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="muted">조건에 맞는 곡이 없습니다.</p>
      ) : (
        <div className="grid grid-3">
          {filtered.map((t) => {
            const fav = state.favoriteTunes.includes(t.id);
            return (
              <div key={t.id} className="card stack stack-8">
                <div className="row-between">
                  <span className="badge tiny">{t.levelId}</span>
                  <button className="btn btn-sm btn-ghost" aria-pressed={fav}
                    aria-label={fav ? '레퍼토리에서 제거' : '내 레퍼토리에 추가'}
                    onClick={() => toggleFavoriteTune(t.id)}>{fav ? '★' : '☆'}</button>
                </div>
                <Link to={`/tunes/${t.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <strong>{t.title}</strong>
                </Link>
                <span className="tiny muted">{t.composer}{t.year ? ` · ${t.year}` : ''}</span>
                <div className="row tiny muted" style={{ gap: 8 }}>
                  <span className="mono">{t.key}</span>
                  <span>· {FORM_KO[t.form] ?? t.form}</span>
                  <span>· {t.style}</span>
                  <span>· ♩{t.tempo[0]}–{t.tempo[1]}</span>
                </div>
                <div className="row" style={{ gap: 3 }} aria-label={`난이도 ${t.difficulty}/5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} style={{
                      width: 16, height: 4, borderRadius: 2,
                      background: n <= t.difficulty ? 'var(--accent)' : 'var(--surface-3)',
                    }} />
                  ))}
                </div>
                <p className="tiny dim" style={{ margin: 0 }}>{t.teaches.slice(0, 2).join(' · ')}</p>
                <Link className="btn btn-sm" to={`/tunes/${t.id}`}>코드 차트 열기</Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
