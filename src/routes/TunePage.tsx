import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TUNE_BY_ID, ALBUM_BY_ID, LEVEL_BY_ID } from '../data';
import { useApp } from '../state';
import LeadSheet from '../components/LeadSheet';
import Transport from '../components/Transport';
import ChordInspector from '../components/ChordInspector';
import ReviewCard from '../components/ReviewCard';
import { flattenChart } from '../lib/playalong';
import { summarizeCadences, analyzeProgression } from '../lib/analysis';
import { RichText } from '../components/Prose';

const KEY_SEMITONE: Record<string, number> = { C: 0, Db: 1, D: 2, Eb: 3, E: 4, F: 5, Gb: 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };
const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export default function TunePage() {
  const { tuneId } = useParams();
  const { state, update, toggleFavoriteTune } = useApp();
  const tune = tuneId ? TUNE_BY_ID.get(tuneId) : undefined;
  const [transpose, setTranspose] = useState(0);
  const [selected, setSelected] = useState<{ bar: number; chords: string[] } | null>(null);
  const [playingBar, setPlayingBar] = useState<number | null>(null);

  const bars = useMemo(() => (tune ? flattenChart(tune.sections, tune.meter[0]) : []), [tune]);
  const cadences = useMemo(() => {
    if (!tune) return [];
    const symbols = bars.flatMap((b) => b.chords);
    return summarizeCadences(analyzeProgression(symbols, tune.key));
  }, [tune, bars]);

  if (!tune) {
    return <div className="stack stack-16"><h1>없는 곡입니다</h1><Link className="btn" to="/library/tunes">레퍼토리로</Link></div>;
  }

  const level = LEVEL_BY_ID.get(tune.levelId);
  const fav = state.favoriteTunes.includes(tune.id);
  const rootKey = tune.key.replace(/-$/, '');
  const currentKeyIdx = (KEY_SEMITONE[rootKey] ?? 0) + transpose;
  const displayKey = KEYS[((currentKeyIdx % 12) + 12) % 12] + (tune.key.endsWith('-') ? '-' : '');

  return (
    <div className="stack stack-24">
      <header className="stack stack-12">
        <div className="row">
          <Link to={`/course/${tune.levelId}`} className="badge badge-accent" style={{ textDecoration: 'none' }}>
            {tune.levelId} {level?.title}
          </Link>
          <span className="tiny muted">난이도 {tune.difficulty}/5</span>
        </div>
        <div className="row-between">
          <h1 style={{ margin: 0 }}>{tune.title}</h1>
          <button className="btn btn-sm" aria-pressed={fav} onClick={() => toggleFavoriteTune(tune.id)}>
            {fav ? '★ 내 레퍼토리' : '☆ 내 레퍼토리에 추가'}
          </button>
        </div>
        <div className="row small muted" style={{ gap: 12 }}>
          <span>{tune.composer}{tune.year ? ` · ${tune.year}` : ''}</span>
          <span>· 원조 <span className="mono">{tune.key}</span></span>
          <span>· {tune.form}</span>
          <span>· {tune.style}</span>
          <span>· ♩{tune.tempo[0]}–{tune.tempo[1]}</span>
          <span>· {bars.length}마디</span>
        </div>
        {tune.publicDomainOrOriginal && (
          <span className="badge badge-ok">
            {tune.composer.includes('Jazzytory') ? 'Jazzytory 오리지널 연습곡' : '퍼블릭 도메인 · 자유 이용'}
          </span>
        )}
      </header>

      <section className="card stack stack-8">
        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>오늘 무엇부터 할 것인가</h2>
        <p className="small" style={{ margin: 0, whiteSpace: 'pre-line' }}><RichText text={tune.approach} /></p>
        <div className="chips" style={{ marginTop: 6 }}>
          {tune.teaches.map((t, i) => <span key={i} className="badge tiny"><RichText text={t} /></span>)}
        </div>
      </section>

      <div className="panel stack stack-12">
        <div className="row-between">
          <div className="stack stack-4">
            <span className="eyebrow">이조</span>
            <span className="small">현재 조: <strong className="mono">{displayKey}</strong></span>
          </div>
          <label className="switch">
            <input type="checkbox" checked={state.settings.showRomanNumerals}
              onChange={(e) => update((s) => ({ ...s, settings: { ...s.settings, showRomanNumerals: e.target.checked } }))} />
            로마숫자 기능 분석 표시
          </label>
        </div>
        <div className="chips">
          <button className="chip" aria-pressed={transpose === 0} onClick={() => setTranspose(0)}>원조</button>
          {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((t) => (
            <button key={t} className="chip mono" aria-pressed={transpose === t} onClick={() => setTranspose(t)}>
              {t > 0 ? `+${t}` : t}
            </button>
          ))}
        </div>
      </div>

      <Transport
        bars={bars}
        bpm={state.settings.bpm}
        onBpmChange={(b) => update((s) => ({ ...s, settings: { ...s.settings, bpm: b } }))}
        onBarChange={setPlayingBar}
        transpose={transpose}
        beatsPerBar={tune.meter[0]}
      />

      <section className="stack stack-12">
        <div className="row-between">
          <h2 style={{ margin: 0, fontSize: '1.05rem' }}>코드 차트</h2>
          <span className="tiny muted">마디를 클릭하면 분석이 열립니다</span>
        </div>
        <LeadSheet
          sections={tune.sections}
          keyOf={tune.key}
          transpose={transpose}
          showRomanNumerals={state.settings.showRomanNumerals}
          activeBar={selected?.bar ?? null}
          playingBar={playingBar}
          beatsPerBar={tune.meter[0]}
          onSelectBar={(bar, chords) => setSelected({ bar, chords })}
        />
      </section>

      {selected && selected.chords[0] && (
        <section className="card stack stack-12">
          <div className="row-between">
            <h2 style={{ margin: 0, fontSize: '1.05rem' }}>{selected.bar + 1}마디 분석</h2>
            <button className="btn btn-sm btn-ghost" onClick={() => setSelected(null)}>닫기</button>
          </div>
          {selected.chords.map((c, i) => (
            <ChordInspector key={i} symbol={c} keyOf={displayKey} nextSymbol={selected.chords[i + 1]} voicingStyle="rootless-a" />
          ))}
        </section>
      )}

      {cadences.length > 0 && (
        <section className="stack stack-8">
          <h2 style={{ margin: 0, fontSize: '1.05rem' }}>이 곡의 케이던스 지도</h2>
          <p className="small dim" style={{ margin: 0 }}>
            이 {cadences.length}개 덩어리만 외우면 곡의 절반은 외운 것입니다.
            코드를 낱개로 외우지 말고 문장 단위로 보세요.
          </p>
          <div className="table-scroll">
            <table className="data">
              <thead><tr><th>진행</th><th>도착</th><th>종류</th></tr></thead>
              <tbody>
                {cadences.map((c) => (
                  <tr key={c.group}>
                    <td className="mono">{c.chords.join(' → ')}</td>
                    <td className="mono">{c.target}</td>
                    <td className="small">{c.kind}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tune.hotspots && tune.hotspots.length > 0 && (
        <section className="stack stack-12">
          <h2 style={{ margin: 0, fontSize: '1.05rem' }}>손이 막히는 지점</h2>
          {tune.hotspots.map((h, i) => (
            <div key={i} className="card card-tight stack stack-4">
              <div className="row"><span className="badge badge-warn tiny">{h.at}</span></div>
              <p className="small" style={{ margin: 0 }}><strong>문제:</strong> <RichText text={h.issue} /></p>
              <p className="small dim" style={{ margin: 0 }}><strong>해법:</strong> <RichText text={h.solution} /></p>
            </div>
          ))}
        </section>
      )}

      {tune.keyRecordings.length > 0 && (
        <section className="stack stack-12">
          <h2 style={{ margin: 0, fontSize: '1.05rem' }}>필청 레코딩</h2>
          <div className="grid grid-3">
            {tune.keyRecordings.map((id) => {
              const a = ALBUM_BY_ID.get(id);
              if (!a) return null;
              return (
                <Link key={id} to="/library/listening" className="card card-link card-tight stack stack-4">
                  <strong className="small">{a.title}</strong>
                  <span className="tiny muted">{a.pianist} · {a.year}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <ReviewCard review={tune.review} />
    </div>
  );
}
