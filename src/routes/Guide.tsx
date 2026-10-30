import { Link } from 'react-router-dom';
import LecturePlayer from '../components/LecturePlayer';
import { GUIDE } from '../data/guide';
import { formatTime } from '../data/lectures';

/**
 * 「Jazzytory 사용법」 — 사이트를 처음 여는 사람을 위한 가이드 영상 한 편.
 * 강의 51편과 같은 플레이어를 쓰므로 챕터 이동·이어보기·스크립트가 그대로 동작한다.
 */
export default function Guide() {
  return (
    <div className="stack stack-32">
      <header className="stack stack-8">
        <nav className="row tiny muted" aria-label="경로">
          <Link to="/">강의</Link><span>›</span>
          <span>사용법</span>
        </nav>
        <h1 style={{ margin: 0 }}>{GUIDE.title}</h1>
        <p className="tiny muted" style={{ margin: 0 }}>
          How to use Jazzytory · {formatTime(GUIDE.durationSec)}
        </p>
      </header>

      <LecturePlayer key={GUIDE.id} lecture={GUIDE} />

      <section className="card stack stack-12" aria-labelledby="guide-next">
        <h2 id="guide-next" style={{ margin: 0, fontSize: '1.05rem' }}>다 봤다면</h2>
        <p className="small dim" style={{ margin: 0 }}>
          L0 첫 강의부터 순서대로 보시면 됩니다. 레벨은 한 번 고르면 기억됩니다.
        </p>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Link className="btn" to="/course/L0/lesson/1">L0 1강 시작하기 →</Link>
          <Link className="btn btn-sm" to="/">강의 목록</Link>
          <Link className="btn btn-sm" to="/library/listening">필청 명반</Link>
        </div>
      </section>
    </div>
  );
}
