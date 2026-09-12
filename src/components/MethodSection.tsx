import { useState } from 'react';
import { Link } from 'react-router-dom';
import { methodsOfModule } from '../data';
import { useApp } from '../state';
import { RichText } from './Prose';

/** 모듈 페이지의 "이 모듈은 이렇게 연습한다" 섹션 */
export default function MethodSection({ moduleId }: { moduleId: string }) {
  const items = methodsOfModule(moduleId);
  const { logSession } = useApp();
  const [done, setDone] = useState<string | null>(null);

  if (!items.length) return null;

  return (
    <section className="stack stack-16">
      <div className="stack stack-4">
        <h2 style={{ margin: 0 }}>이 모듈은 이렇게 연습한다</h2>
        <p className="small dim" style={{ margin: 0, maxWidth: '58ch' }}>
          같은 내용을 <strong>어떻게</strong> 연습하느냐가 무엇을 연습하느냐보다 자주 결과를 가릅니다.
          아래는 실제 재즈 교육 현장에서 검증된 방법을 이 모듈의 내용에 맞춰 옮긴 것입니다.
        </p>
      </div>

      {items.map(({ method, application }) => (
        <article key={application.id} className="card stack stack-12">
          <div className="row-between">
            <div className="row">
              <span className="badge badge-accent">{method.teacher}</span>
              <strong className="small">{method.name}</strong>
            </div>
            <Link className="btn btn-sm btn-ghost" to="/library/pedagogy">교수법 전체 →</Link>
          </div>

          <p className="small dim" style={{ margin: 0 }}><RichText text={method.thesis} /></p>

          <div className="sunken stack stack-8">
            <div className="eyebrow">이 모듈에 적용하면</div>
            <p className="small" style={{ margin: 0 }}><RichText text={application.howToApply} /></p>
          </div>

          <div className="stack stack-8">
            <div className="row-between">
              <div className="eyebrow">연습 {application.drill.minutes}분</div>
              <span className="badge tiny">{application.drill.title}</span>
            </div>
            <p className="small" style={{ margin: 0, whiteSpace: 'pre-line' }}><RichText text={application.drill.instruction} /></p>
          </div>

          <div className="row-between">
            <p className="tiny muted" style={{ margin: 0, flex: 1, minWidth: 200 }}>
              일주일 뒤 달라지는 것 — <RichText text={application.expectedShift} />
            </p>
            <button
              className={`btn btn-sm ${done === application.id ? '' : 'btn-primary'}`}
              onClick={() => {
                logSession(application.drill.minutes, `${method.name} — ${application.drill.title}`);
                setDone(application.id);
              }}
            >
              {done === application.id ? '✓ 기록됨' : `${application.drill.minutes}분 연습 기록`}
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
