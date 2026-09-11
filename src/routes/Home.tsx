import { Link } from 'react-router-dom';
import { LEVELS, CONTENT_STATS, MODULES, ALL_DRILLS, TEACHING_METHODS } from '../data';
import { useApp } from '../state';
import { dueDrills, practiceStreak } from '../lib/mastery';
import { practiceDates, totalPracticeMinutes } from '../lib/storage';
import HeroDemo from '../components/HeroDemo';

export default function Home() {
  const { state } = useApp();
  const placed = state.placedLevel;
  const streak = practiceStreak(practiceDates(state));
  const minutes = totalPracticeMinutes(state);
  const due = dueDrills(state.drills);
  const started = Object.keys(state.drills).length > 0 || state.completedModules.length > 0;

  const currentLevel = placed ? LEVELS.find((l) => l.id === placed) : null;
  const nextModule = MODULES.find(
    (m) => !state.completedModules.includes(m.id) && (!placed || m.levelId >= placed),
  );

  return (
    <div className="stack stack-32">

      {/* ───────────────  히어로  ─────────────── */}
      <section className="hero stack stack-16">
        <span className="eyebrow">재즈피아노 연주 전공 커리큘럼</span>
        <h1 className="display" style={{ maxWidth: '15ch' }}>
          리얼북 한 장으로<br />즉흥 연주까지.
        </h1>
        <p className="lead" style={{ maxWidth: '50ch' }}>
          체르니 100 정도의 손은 있는데 <span className="chordsym">C-7</span> 앞에서 멈추는 사람을 위한
          9레벨 커리큘럼. 이론을 늘리는 게 아니라 <strong>음표 없는 악보 앞에서 손이
          움직이기까지의 시간</strong>을 줄이는 것이 목표입니다.
        </p>
        <div className="btn-row">
          {placed ? (
            <Link className="btn btn-primary btn-lg" to={nextModule ? `/module/${nextModule.id}` : '/curriculum'}>
              이어서 학습하기
            </Link>
          ) : (
            <Link className="btn btn-primary btn-lg" to="/placement">배치고사로 시작하기</Link>
          )}
          <Link className="btn btn-lg" to="/curriculum">커리큘럼 보기</Link>
        </div>
      </section>

      {/* ───────────────  즉시 증명  ─────────────── */}
      <section className="stack stack-12">
        <div className="row-between">
          <h2 style={{ margin: 0 }}>설명보다 먼저, 소리부터</h2>
          <span className="tiny muted">클릭 한 번이면 소리가 납니다</span>
        </div>
        <HeroDemo />
      </section>

      {/* ───────────────  내 상태  ─────────────── */}
      {started && (
        <section className="card stack stack-12">
          <div className="row-between">
            <h2 style={{ margin: 0 }}>지금 여기</h2>
            <Link className="btn btn-sm" to="/progress">전체 진도</Link>
          </div>
          <div className="grid grid-4">
            <Stat label="배정 레벨" value={currentLevel ? `${currentLevel.id} · ${currentLevel.title}` : '미배정'} />
            <Stat label="연습 스트릭" value={`${streak}일`} sub={`누적 ${Math.round(minutes / 60)}시간`} />
            <Stat label="오늘 복습할 드릴" value={`${due.length}개`} />
            <Stat label="완료 모듈" value={`${state.completedModules.length} / ${MODULES.length}`} />
          </div>
          {due.length > 0 && (
            <div className="note">
              <strong>오늘 복습 대기 {due.length}개.</strong> 간격 반복은 "아는 것"이 아니라 "치는 것"에 겁니다.
              날짜가 다른 세션에서 재현되어야 숙련으로 칩니다. <Link to="/progress">복습 시작</Link>
            </div>
          )}
        </section>
      )}

      {/* ───────────────  원칙  ─────────────── */}
      <section className="stack stack-16">
        <div className="stack stack-4">
          <h2 style={{ margin: 0 }}>왜 대부분의 재즈 교재에서 막히는가</h2>
          <p className="dim small" style={{ margin: 0, maxWidth: '52ch' }}>
            내용이 부족해서가 아니라 순서와 방식이 손에 맞지 않아서입니다. 여섯 가지를 다르게 했습니다.
          </p>
        </div>
        <div className="grid grid-3">
          <Principle n="01" title="손 먼저, 이론은 뒤따라온다"
            body="모든 개념은 건반에서 실행 → 귀로 확인 → 이름 붙이기 순서입니다. 읽기만 하고 칠 것이 없는 페이지는 만들지 않았습니다." />
          <Principle n="02" title="가이드 톤이 먼저다"
            body="스케일 나열이 아니라 3음·7음의 성부 진행부터 시작합니다. 이것이 보이싱과 즉흥 모두의 뼈대입니다." />
          <Principle n="03" title="12키가 기본값"
            body="한 키에서만 되는 것은 배운 것이 아닙니다. 모든 드릴은 12키 순환을 전제로 설계했고, 랩이 키를 랜덤으로 던집니다." />
          <Principle n="04" title="곡 안에서 배운다"
            body="모든 개념 모듈은 실제 스탠다드와 묶여 있습니다. 추상 연습만으로 끝나는 모듈은 없습니다." />
          <Principle n="05" title="통과 기준에 템포가 붙는다"
            body={'"이해했다"는 기준이 아닙니다. "♩=100에서 12키 ii-V-I을 끊김 없이"가 기준입니다.'} />
          <Principle n="06" title="모든 주장에 출처가 있다"
            body="이론 서술마다 실존 공개 교재의 출처를 답니다. 근거 없는 단정은 배포하지 않습니다." />
        </div>
      </section>

      {/* ───────────────  교수법  ─────────────── */}
      {TEACHING_METHODS.length > 0 && (
        <section className="card stack stack-12">
          <div className="row-between">
            <div className="stack stack-4">
              <span className="eyebrow">Teaching Methods</span>
              <h2 style={{ margin: 0 }}>무엇을 배우느냐만큼 어떻게 연습하느냐</h2>
            </div>
            <Link className="btn btn-sm" to="/pedagogy">교수법 {TEACHING_METHODS.length}가지</Link>
          </div>
          <p className="dim small" style={{ margin: 0, maxWidth: '56ch' }}>
            배리 해리스는 화성을 움직임으로 가르쳤고, 트리스타노는 손보다 목소리를 먼저 시켰고,
            갤퍼는 프레이즈가 어디서 <em>끝나는지</em>를 바꿨습니다. 실제 재즈 교육 현장의 방법을
            각 모듈에 {CONTENT_STATS.methodApplications}건으로 이식했습니다.
          </p>
          <div className="chips">
            {TEACHING_METHODS.slice(0, 6).map((m) => (
              <Link key={m.id} className="chip" to="/pedagogy">{m.teacher} · {m.name}</Link>
            ))}
          </div>
        </section>
      )}

      {/* ───────────────  레벨  ─────────────── */}
      <section className="stack stack-16">
        <div className="row-between">
          <h2 style={{ margin: 0 }}>9개 레벨</h2>
          <Link className="btn btn-sm" to="/curriculum">커리큘럼 전체</Link>
        </div>
        <div className="grid grid-3">
          {LEVELS.map((l) => {
            const mods = MODULES.filter((m) => m.levelId === l.id);
            const done = mods.filter((m) => state.completedModules.includes(m.id)).length;
            return (
              <Link key={l.id} to={`/curriculum/${l.id}`} className="card card-link stack stack-8">
                <div className="level-strip" style={{ background: l.accentColor }} />
                <div className="row-between">
                  <span className="badge">{l.id}</span>
                  <span className="tiny muted">{l.weeks}주</span>
                </div>
                <strong>{l.title}</strong>
                <p className="small dim" style={{ margin: 0 }}>{l.promise}</p>
                <div className="bar" aria-label={`${done}/${mods.length} 모듈 완료`}>
                  <span style={{ width: `${mods.length ? (done / mods.length) * 100 : 0}%` }} />
                </div>
                <span className="tiny muted">{done}/{mods.length} 모듈 · {l.collegeEquivalent}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ───────────────  규모  ─────────────── */}
      <section className="panel stack stack-12">
        <div className="grid grid-4">
          <Stat label="모듈" value={`${CONTENT_STATS.modules}개`} sub={`개념 ${CONTENT_STATS.concepts}개`} />
          <Stat label="연습 드릴" value={`${ALL_DRILLS.length}개`} sub="대부분 12키 순환" />
          <Stat label="레퍼토리" value={`${CONTENT_STATS.tunes}곡`} sub="코드 진행만 수록" />
          <Stat label="필청 명반" value={`${CONTENT_STATS.albums}장`} sub="트랙 단위 청취 지시" />
        </div>
        <p className="tiny muted" style={{ margin: 0 }}>
          총 {CONTENT_STATS.totalWeeks}주 · 권장 누적 연습 약 {CONTENT_STATS.totalHours.toLocaleString()}시간 —
          4년제 연주 전공 학부 과정에 대응하도록 설계했습니다.
        </p>
      </section>

      {/* ───────────────  정직성  ─────────────── */}
      <section className="note note-warn">
        <strong>먼저 밝혀 둘 것.</strong> Jazzytory 의 콘텐츠는 버클리 프레스를 비롯한 실존 공개 교재의
        개념 체계에 정렬해 설계했고, 8항목 루브릭 기반의 편집 검수를 거쳤습니다. 다만
        <strong> 실제 대학 교수의 검수는 아직 받지 않았습니다.</strong> 검수 패널은 교수법 계보를
        대표하는 가상의 심사 기준이며 실존 인물이 아닙니다. 교수법 페이지에 인용된 교육자들 역시
        공개 출판물의 저자일 뿐 이 서비스를 승인하지 않았습니다.
        {' '}<Link to="/faculty">검수 정책과 루브릭 보기</Link>
      </section>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="stack stack-4">
      <span className="eyebrow">{label}</span>
      <strong className="stat-value">{value}</strong>
      {sub && <span className="tiny muted">{sub}</span>}
    </div>
  );
}

function Principle({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="card stack stack-8">
      <span className="principle-num mono">{n}</span>
      <strong>{title}</strong>
      <p className="small dim" style={{ margin: 0 }}>{body}</p>
    </div>
  );
}
