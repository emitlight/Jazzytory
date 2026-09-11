import { FACULTY, MODULES, reviewSummary, CONTENT_STATS } from '../data';
import { REVIEW_STATUS_LABEL, type ReviewStatus } from '../data/types';
import { Link } from 'react-router-dom';

const RUBRIC_LABEL: Record<string, string> = {
  accuracy: '이론 정확성', terminology: '용어 표준성', sequencing: '난이도 계열성',
  playability: '연주 실현성', idiom: '스타일 진정성', integration: '청음·레퍼토리 연계',
  assessability: '평가 가능성', sourcing: '출처 신뢰성',
};

export default function Faculty() {
  const summary = reviewSummary();

  return (
    <div className="stack stack-32">
      <header className="stack stack-12">
        <span className="eyebrow">Editorial Review</span>
        <h1 style={{ margin: 0 }}>검수 정책과 기록</h1>
        <p className="lead" style={{ maxWidth: '60ch' }}>
          교육 콘텐츠에서 가장 위험한 것은 <strong>틀린 내용을 자신 있게 말하는 것</strong>입니다.
          그래서 Jazzytory 는 검수 과정 자체를 제품의 일부로 공개합니다.
        </p>
      </header>

      {/* ─── 정직성 고지 ─── */}
      <section className="note note-warn stack stack-8">
        <strong style={{ fontSize: '1rem' }}>먼저 분명히 해 둘 것</strong>
        <ul className="small" style={{ margin: 0 }}>
          <li>
            <strong>실존 대학 교수의 검수는 아직 받지 않았습니다.</strong> 어떤 실존 인물도 이 콘텐츠를
            승인하지 않았으며, Jazzytory 는 실존 인물의 이름·사진·서명을 검수자로 표기하지 않습니다.
          </li>
          <li>
            아래 검수 패널은 <strong>교수법 계보를 대표하는 가상의 심사 기준</strong>입니다.
            사람이 아니라 "이런 관점에서 보면 이 대목은 반려된다"는 <strong>기준의 인격화</strong>입니다.
          </li>
          <li>
            콘텐츠는 버클리 프레스를 비롯한 <strong>실존 공개 교재의 개념 체계에 정렬</strong>해 설계했고,
            모든 이론 서술에 출처를 답니다. 다만 그것이 해당 기관의 승인이나 인증을 뜻하지는 않습니다.
          </li>
          <li>
            외부 전문가 검수 슬롯은 <strong>비워 두었습니다</strong>. 실제 교수 검수가 붙는 순간
            해당 모듈의 배지가 <span className="badge badge-ok tiny">교수 검수 승인</span> 으로 승격되도록
            상태 머신이 이미 구현되어 있습니다.
          </li>
        </ul>
      </section>

      {/* ─── 통계 ─── */}
      <section className="card stack stack-16">
        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>검수 현황</h2>
        <div className="grid grid-4">
          {(Object.keys(REVIEW_STATUS_LABEL) as ReviewStatus[]).map((st) => (
            <div key={st} className="stack stack-4">
              <span className="eyebrow">{REVIEW_STATUS_LABEL[st]}</span>
              <strong style={{ fontSize: '1.2rem' }}>{summary.counts[st] ?? 0}</strong>
              <span className="tiny muted">모듈</span>
            </div>
          ))}
        </div>
        <div className="stack stack-8">
          <div className="eyebrow">8항목 루브릭 평균 (5점 만점, 모듈 {summary.reviewedCount}개)</div>
          {Object.entries(summary.averages).map(([k, v]) => (
            <div key={k} className="row" style={{ gap: 10 }}>
              <span className="small" style={{ width: 128, flexShrink: 0 }}>{RUBRIC_LABEL[k] ?? k}</span>
              <div className="bar" style={{ flex: 1 }}>
                <span style={{ width: `${(v / 5) * 100}%`, background: v < 4 ? 'var(--warn)' : 'var(--accent)' }} />
              </div>
              <span className="tiny mono muted" style={{ width: 34, textAlign: 'right' }}>{v.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 루브릭 설명 ─── */}
      <section className="stack stack-12">
        <h2>8항목 루브릭</h2>
        <p className="small dim" style={{ margin: 0, maxWidth: '58ch' }}>
          각 항목 1~5점. <strong>평균 4.0 미만이거나 이론 정확성 / 연주 실현성이 3점 이하면 반려</strong>됩니다.
        </p>
        <div className="table-scroll">
          <table className="data">
            <thead><tr><th>항목</th><th>무엇을 묻는가</th><th>반려 사례</th></tr></thead>
            <tbody>
              <tr><td>이론 정확성</td><td>이론적으로 틀린 서술이 없는가</td><td>°7의 7음을 b7로 표기</td></tr>
              <tr><td>용어 표준성</td><td>표기·용어가 통용 표준을 따르는가</td><td>보이싱을 "화음배치"로 번역</td></tr>
              <tr><td>난이도 계열성</td><td>선수학습 없이 등장하는 개념이 없는가</td><td>L1에서 어퍼 스트럭처 언급</td></tr>
              <tr><td>연주 실현성</td><td>이 난이도의 손으로 실제 가능한가</td><td>초급 모듈에 10도 확장 보이싱</td></tr>
              <tr><td>스타일 진정성</td><td>재즈 관용어법으로 자연스러운가</td><td>이론적으론 맞지만 아무도 안 치는 보이싱</td></tr>
              <tr><td>청음·레퍼토리 연계</td><td>드릴·곡·음반이 서로 연결되는가</td><td>추상 연습만 있고 곡이 없음</td></tr>
              <tr><td>평가 가능성</td><td>통과 기준이 관측 가능한가</td><td>"익숙해진다"가 통과 기준</td></tr>
              <tr><td>출처 신뢰성</td><td>주장에 출처가 붙어 있는가</td><td>근거 없는 단정</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── 검수 패널 ─── */}
      <section className="stack stack-16">
        <h2>검수 패널 {FACULTY.length}기준</h2>
        <div className="grid grid-2">
          {FACULTY.map((r) => (
            <article key={r.id} className="card stack stack-8">
              <div className="row-between">
                <strong>{r.name}</strong>
                <span className="badge tiny">가상 기준</span>
              </div>
              <span className="tiny muted">{r.affiliation}</span>
              <p className="small dim" style={{ margin: 0 }}>{r.bio}</p>
              <div className="eyebrow" style={{ marginTop: 4 }}>계보</div>
              <p className="tiny dim" style={{ margin: 0 }}>{r.lineage}</p>
              <div className="chips">
                {r.scope.map((s, i) => <span key={i} className="badge tiny">{s}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── 수정 요청 모듈 ─── */}
      {MODULES.some((m) => m.review.status === 'revision-required') && (
        <section className="stack stack-12">
          <h2>수정 요청된 모듈</h2>
          <div className="stack stack-8">
            {MODULES.filter((m) => m.review.status === 'revision-required').map((m) => (
              <Link key={m.id} to={`/module/${m.id}`} className="card card-link card-tight row-between">
                <strong className="small">{m.levelId} · {m.title}</strong>
                <span className="badge badge-danger tiny">수정 요청</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="panel stack stack-8">
        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>콘텐츠 규모</h2>
        <div className="grid grid-4">
          <div className="stack stack-4"><span className="eyebrow">모듈</span><strong>{CONTENT_STATS.modules}</strong></div>
          <div className="stack stack-4"><span className="eyebrow">개념</span><strong>{CONTENT_STATS.concepts}</strong></div>
          <div className="stack stack-4"><span className="eyebrow">드릴</span><strong>{CONTENT_STATS.drills}</strong></div>
          <div className="stack stack-4"><span className="eyebrow">검수 완료 모듈</span><strong>{CONTENT_STATS.reviewedModules}</strong></div>
        </div>
      </section>
    </div>
  );
}
