import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { GLOSSARY, MODULE_BY_ID } from '../data';
import { RichText } from '../components/Prose';

export default function Glossary() {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => GLOSSARY.filter((g) =>
    !q || `${g.term} ${g.termEn} ${(g.aka ?? []).join(' ')} ${g.definition}`.toLowerCase().includes(q.toLowerCase()),
  ).sort((a, b) => a.term.localeCompare(b.term, 'ko')), [q]);

  return (
    <div className="stack stack-24">
      <header className="stack stack-12">
        <span className="eyebrow">Glossary</span>
        <h1 style={{ margin: 0 }}>용어집 {GLOSSARY.length}개</h1>
        <p className="lead" style={{ maxWidth: '56ch' }}>
          재즈 현장의 말은 교과서와 다릅니다. 여기 표기가 Jazzytory 전체의 표준입니다.
        </p>
      </header>

      <div className="field">
        <label htmlFor="gq">검색</label>
        <input id="gq" type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="한국어 또는 영어" />
      </div>

      <div className="stack stack-12">
        {filtered.map((g) => (
          <article key={g.id} className="card stack stack-8">
            <div className="row">
              <strong>{g.term}</strong>
              <span className="tiny muted">{g.termEn}</span>
              {g.aka?.map((a) => <span key={a} className="badge tiny">{a}</span>)}
            </div>
            <p className="small" style={{ margin: 0 }}><RichText text={g.definition} /></p>
            {g.example && <p className="small dim mono" style={{ margin: 0 }}>예: <RichText text={g.example} /></p>}
            {g.relatedModules.length > 0 && (
              <div className="chips">
                {g.relatedModules.slice(0, 3).map((m) => {
                  const mod = MODULE_BY_ID.get(m);
                  return mod ? <Link key={m} className="badge tiny" to={`/module/${m}`} style={{ textDecoration: 'none' }}>{mod.title}</Link> : null;
                })}
              </div>
            )}
          </article>
        ))}
      </div>
      {filtered.length === 0 && <p className="muted">검색 결과가 없습니다.</p>}
    </div>
  );
}
