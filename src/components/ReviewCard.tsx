import { REVIEW_STATUS_LABEL, type ReviewRecord } from '../data/types';
import { REVIEWER_BY_ID } from '../data';
import { RichText } from './Prose';

const RUBRIC_LABEL: Record<string, string> = {
  accuracy: '이론 정확성', terminology: '용어 표준성', sequencing: '난이도 계열성',
  playability: '연주 실현성', idiom: '스타일 진정성', integration: '청음·레퍼토리 연계',
  assessability: '평가 가능성', sourcing: '출처 신뢰성',
};

const SEV_CLASS: Record<string, string> = {
  blocker: 'badge-danger', major: 'badge-warn', minor: 'badge', suggestion: 'badge',
};

export default function ReviewCard({ review }: { review: ReviewRecord }) {
  const statusClass =
    review.status === 'faculty-approved' ? 'badge-ok'
    : review.status === 'revision-required' ? 'badge-danger'
    : review.status === 'internal-reviewed' ? 'badge-accent' : 'badge';

  const avg = review.rubric
    ? Object.values(review.rubric).reduce((a, b) => a + b, 0) / Object.values(review.rubric).length
    : null;

  return (
    <section className="card stack stack-12">
      <div className="row-between">
        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>검수 기록</h2>
        <span className={`badge ${statusClass}`}>{REVIEW_STATUS_LABEL[review.status]}</span>
      </div>

      <div className="row small dim" style={{ gap: 10 }}>
        {review.reviewers.map((id) => {
          const r = REVIEWER_BY_ID.get(id);
          return <span key={id} className="badge tiny">{r ? r.name : id}</span>;
        })}
        {review.reviewedAt && <span className="tiny muted">{review.reviewedAt}</span>}
        {avg !== null && <span className="tiny muted">평균 {avg.toFixed(1)}/5</span>}
      </div>

      {review.rubric && (
        <div className="grid grid-4" style={{ gap: 10 }}>
          {Object.entries(review.rubric).map(([k, v]) => (
            <div key={k} className="stack stack-4">
              <span className="tiny muted">{RUBRIC_LABEL[k] ?? k}</span>
              <div className="row" style={{ gap: 6 }}>
                <div className="bar" style={{ flex: 1 }}>
                  <span className={v >= 4 ? '' : ''} style={{ width: `${(v / 5) * 100}%`, background: v <= 3 ? 'var(--warn)' : 'var(--accent)' }} />
                </div>
                <span className="tiny mono">{v}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {review.comments && review.comments.length > 0 && (
        <div className="stack stack-8">
          <div className="eyebrow">검수 의견과 반영 내용</div>
          {review.comments.map((c, i) => {
            const r = REVIEWER_BY_ID.get(c.reviewerId);
            return (
              <div key={i} className="sunken stack stack-4">
                <div className="row">
                  <span className={`badge tiny ${SEV_CLASS[c.severity]}`}>{c.severity}</span>
                  <span className="tiny muted">{r?.name ?? c.reviewerId}</span>
                </div>
                <p className="small" style={{ margin: 0 }}><strong>지적:</strong> <RichText text={c.issue} /></p>
                <p className="small dim" style={{ margin: 0 }}><strong>반영:</strong> <RichText text={c.resolution} /></p>
              </div>
            );
          })}
        </div>
      )}

      <p className="tiny muted" style={{ margin: 0 }}>
        검수 패널은 교수법 계보를 대표하는 편집 심사 기준이며 실존 인물이 아닙니다.
      </p>
    </section>
  );
}
