import { useState, useMemo } from 'react';
import { VIDEOS, CHANNELS, LEVELS, MODULE_BY_ID } from '../data';
import VideoCard from '../components/VideoCard';

export default function Videos() {
  const [q, setQ] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [lang, setLang] = useState<'all' | 'ko' | 'en'>('all');

  const verifiedCount = VIDEOS.filter((v) => v.verified && v.videoId).length;

  const filtered = useMemo(() => VIDEOS.filter((v) => {
    if (lang !== 'all' && v.lang !== lang) return false;
    if (levelFilter !== 'all') {
      const inLevel = v.relatedModules.some((m) => MODULE_BY_ID.get(m)?.levelId === levelFilter);
      if (!inLevel) return false;
    }
    if (q && !`${v.title} ${v.channel} ${v.takeaway} ${v.searchQuery}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, levelFilter, lang]);

  return (
    <div className="stack stack-24">
      <header className="stack stack-12">
        <span className="eyebrow">Video Curriculum</span>
        <h1 style={{ margin: 0 }}>영상 강의 {VIDEOS.length}편</h1>
        <p className="lead" style={{ maxWidth: '58ch' }}>
          이미 공개된 좋은 강의를 커리큘럼 위치에 맞게 배치했습니다.
          각 항목에는 "이 영상을 보고 나면 건반에서 무엇을 할 수 있는가"가 붙어 있습니다.
        </p>
        <div className="note note-warn small">
          <strong>임베드 정책.</strong> Jazzytory 는 <strong>생존을 확인하지 못한 영상 ID 를 임베드하지 않습니다.</strong>
          깨진 플레이어는 없는 것보다 나쁘기 때문입니다. 현재 {verifiedCount}편이 검증되었고,
          나머지는 <strong>채널명 + 정밀 검색어</strong> 딥링크로 제공됩니다.
          저장소에서 <code>npm run verify:media</code> 를 실행하면 유튜브 oEmbed 로 생존을 확인해
          자동으로 임베드로 승격합니다.
        </div>
      </header>

      <div className="panel stack stack-12">
        <div className="field">
          <label htmlFor="vq">검색</label>
          <input id="vq" type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="주제, 채널명" />
        </div>
        <div className="stack stack-8">
          <span className="eyebrow">레벨</span>
          <div className="chips">
            <button className="chip" aria-pressed={levelFilter === 'all'} onClick={() => setLevelFilter('all')}>전체</button>
            {LEVELS.map((l) => (
              <button key={l.id} className="chip" aria-pressed={levelFilter === l.id} onClick={() => setLevelFilter(l.id)}>{l.id}</button>
            ))}
          </div>
        </div>
        <div className="chips">
          <button className="chip" aria-pressed={lang === 'all'} onClick={() => setLang('all')}>전체 언어</button>
          <button className="chip" aria-pressed={lang === 'ko'} onClick={() => setLang('ko')}>한국어</button>
          <button className="chip" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>영어</button>
        </div>
      </div>

      <div className="grid grid-2">
        {filtered.map((v) => <VideoCard key={v.id} video={v} />)}
      </div>
      {filtered.length === 0 && <p className="muted">조건에 맞는 영상이 없습니다.</p>}

      <section className="stack stack-12">
        <h2>추천 채널 {CHANNELS.length}곳</h2>
        <div className="grid grid-3">
          {CHANNELS.map((c) => (
            <div key={c.id} className="card card-tight stack stack-4">
              <div className="row-between">
                <strong className="small">{c.name}</strong>
                <span className="badge tiny">{c.lang === 'ko' ? '한국어' : 'EN'}</span>
              </div>
              {c.handle && <span className="tiny muted mono">{c.handle}</span>}
              <p className="tiny dim" style={{ margin: 0 }}>{c.focus}</p>
              <span className="tiny muted">권장 수준: {c.level}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
