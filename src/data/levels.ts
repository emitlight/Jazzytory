import type { Level } from './types';

/**
 * 9개 레벨 — 4년제 재즈피아노 연주 전공 학사 과정을 웹 커리큘럼으로 옮긴 척추.
 * 각 레벨의 exitCriteria 는 대학 실기시험(jury)에 준하는 통과 조건이다.
 * "이해한다"는 통과 기준이 아니다. 템포와 키가 붙은 연주 행동만이 기준이다.
 */
export const LEVELS: Level[] = [
  {
    id: 'L0', order: 0,
    title: '진단과 준비', titleEn: 'Orientation & Diagnosis',
    promise: '내 현재 위치와 앞으로 갈 길을 정확히 안다.',
    description:
      '체르니 100 정도의 손을 가진 사람이 재즈 건반 앞에 처음 앉는 단계다. ' +
      '아직 아무것도 배우지 않는다. 대신 무엇을 모르는지 정확히 재고, 연습 시간을 설계하고, ' +
      '재즈 피아니스트가 건반을 어떻게 다르게 보는지 지형을 익힌다.',
    weeks: 2, hoursPerWeek: 4,
    collegeEquivalent: '입학 오디션 · 배치고사 주간',
    berkleeAlignment: ['Placement / Proficiency Assessment', 'Piano Lab 오리엔테이션'],
    prerequisites: ['오선보를 느리게라도 읽을 수 있다', '장음계 몇 개를 양손으로 칠 수 있다'],
    exitCriteria: [
      '배치고사를 완료하고 배정 레벨을 확인했다',
      '주 4회 이상, 회당 30분 이상의 고정 연습 슬롯을 캘린더에 확보했다',
      '12키 4도권(Circle of Fourths)을 보지 않고 30초 안에 말할 수 있다',
    ],
    targetSkills: { harmony: 10, technique: 20, form: 5 },
    accentColor: '#8c8474',
  },
  {
    id: 'L1', order: 1,
    title: '코드 심볼의 문해력', titleEn: 'Chord Symbol Literacy',
    promise: '코드 심볼을 보고 3초 안에 소리를 낸다.',
    description:
      '리얼북에서 손이 멈추는 첫 번째 이유는 테크닉이 아니라 문해력이다. ' +
      'C-7 이 무슨 소리인지 머리로 계산하지 않고 손이 먼저 가야 한다. ' +
      '이 레벨은 세 음짜리 셸 보이싱만으로 12마디 블루스를 끝까지 연주하는 것으로 끝난다.',
    weeks: 8, hoursPerWeek: 5,
    collegeEquivalent: '1학년 1학기 — 화성 I · 피아노 랩 I',
    berkleeAlignment: ['Harmony 1 (다이어토닉 화성·코드 심볼)', 'Ear Training 1', 'Jazz Keyboard Harmony 도입부'],
    prerequisites: ['L0 수료'],
    exitCriteria: [
      '♩=80 에서 12키 전부 ii‑V‑I 을 셸 보이싱(1‑3‑7 / 1‑7‑3)으로 끊김 없이 연주한다',
      'F 블루스와 B♭ 블루스를 코러스 3개 이상 왼손 셸 + 오른손 단순 선율로 연주한다',
      '임의의 7화음 코드 심볼을 보고 3초 안에 구성음을 건반에서 짚는다',
      '스윙 8분음표로 4마디 프레이즈를 메트로놈 2·4박에 맞춰 연주한다',
    ],
    targetSkills: { harmony: 45, voicing: 40, rhythm: 35, form: 40, repertoire: 20, ear: 25, technique: 30, melody: 20 },
    accentColor: '#2f6f9f',
  },
  {
    id: 'L2', order: 2,
    title: '보이싱과 컴핑', titleEn: 'Voicings & Comping',
    promise: '왼손이 스스로 반주한다.',
    description:
      '셸을 넘어 4성부 루트리스 보이싱으로 간다. 여기서부터 "재즈 소리"가 난다. ' +
      '동시에 배우는 것은 **쉬는 법**이다. 쉬지 않는 컴핑은 자기 연주를 덮어버린다.',
    weeks: 10, hoursPerWeek: 6,
    collegeEquivalent: '1학년 2학기 — 화성 II · 피아노 랩 II',
    berkleeAlignment: ['Harmony 2', 'Ear Training 2', 'Jazz Keyboard Harmony (루트리스·가이드톤)'],
    prerequisites: ['L1 수료 — 특히 12키 셸 ii‑V‑I ♩=80'],
    exitCriteria: [
      '♩=100 에서 12키 ii‑V‑I 을 루트리스 A/B 를 교대하며 연주하고, 코드 간 성부 이동이 대부분 2도 이내다',
      '「Autumn Leaves」를 폼을 잃지 않고 코러스 3개 컴핑한다',
      '4마디 중 최소 1마디를 의도적으로 비우는 컴핑을 시연한다',
      '임의 진행에서 가이드 톤 라인(3‑7)을 즉석에서 연결한다',
    ],
    targetSkills: { harmony: 60, voicing: 70, rhythm: 55, form: 60, repertoire: 40, ear: 40, technique: 45, melody: 30 },
    accentColor: '#1f7a6a',
  },
  {
    id: 'L3', order: 3,
    title: '코드 스케일과 선율', titleEn: 'Chord Scales & Melodic Line',
    promise: '변화하는 화성 위를 걸어다닌다.',
    description:
      '손이 이미 아는 소리에 이름을 붙이는 단계다. 코드 스케일은 외우는 목록이 아니라 ' +
      '**기능에서 따라 나오는 결과**다. 모든 도미넌트에 믹솔리디안을 붙이는 순간 재즈가 아니게 된다.',
    weeks: 12, hoursPerWeek: 6,
    collegeEquivalent: '2학년 1학기 — 화성 III · 즉흥 I',
    berkleeAlignment: ['Harmony 3 (코드 스케일·모달 인터체인지)', 'Ear Training 3', 'Improvisation 1'],
    prerequisites: ['L2 수료 — 루트리스 12키 ♩=100'],
    exitCriteria: [
      '임의 스탠다드에서 각 코드의 코드 스케일을 근거와 함께 말하고, 그 스케일로 4분음표 라인을 연주한다',
      '♩=120 에서 ii‑V‑I 위에 어프로치 노트를 써서 3음·7음에 정확히 착지한다',
      '「All The Things You Are」를 폼을 잃지 않고 2코러스 솔로한다',
      '마이너 ii‑V‑i 에서 얼터드/HM5 를 구분해 사용한다',
    ],
    targetSkills: { harmony: 75, voicing: 75, melody: 60, rhythm: 65, ear: 55, repertoire: 55, technique: 55, form: 70 },
    accentColor: '#9a6b1f',
  },
  {
    id: 'L4', order: 4,
    title: '비밥 어휘와 채보', titleEn: 'Bebop Vocabulary & Transcription',
    promise: '남의 말을 외워서 내 문장에 쓴다.',
    description:
      '재즈는 구전 전통이다. 이론서가 아니라 레코드에서 언어를 배운다. ' +
      '이 레벨의 핵심 활동은 채보다 — 귀로 훔쳐서 12키로 옮기고, 자기 솔로에 집어넣는다.',
    weeks: 12, hoursPerWeek: 7,
    collegeEquivalent: '2학년 2학기 — 즉흥 II · 이어트레이닝 IV',
    berkleeAlignment: ['Ear Training 4', 'Improvisation 2', 'Jazz Piano Styles / Transcription'],
    prerequisites: ['L3 수료'],
    exitCriteria: [
      '8마디 이상의 솔로를 스스로 채보해 원곡 템포로 연주하고 4키 이상으로 옮긴다',
      '비밥 스케일을 써서 강박에 코드톤이 오도록 8분음표 라인을 ♩=140 에서 연주한다',
      '자기 어휘 노트에 최소 20개의 릭을 기능(ii‑V, 턴어라운드, 블루스)별로 정리했다',
      '하나의 모티프를 4마디에 걸쳐 전개(발전·전위·리듬변형)한다',
    ],
    targetSkills: { harmony: 80, voicing: 80, melody: 78, rhythm: 78, ear: 75, repertoire: 70, technique: 70, form: 78 },
    accentColor: '#8c3c1f',
  },
  {
    id: 'L5', order: 5,
    title: '리하모니제이션', titleEn: 'Reharmonization',
    promise: '같은 멜로디를 다르게 칠한다.',
    description:
      '주어진 코드를 연주하는 사람에서 코드를 고르는 사람으로 넘어간다. ' +
      '트라이톤 서브, 모달 인터체인지, 어퍼 스트럭처 — 모두 "무엇을 바꿔도 멜로디가 살아남는가"라는 ' +
      '하나의 질문에 대한 답이다.',
    weeks: 12, hoursPerWeek: 7,
    collegeEquivalent: '3학년 1학기 — 화성 IV · 편곡',
    berkleeAlignment: ['Harmony 4 (리하모니제이션·대리화성)', 'Arranging 1', 'Jazz Keyboard Harmony 심화'],
    prerequisites: ['L4 수료'],
    exitCriteria: [
      '스탠다드 한 곡의 A섹션을 서로 다른 3가지 리하모니제이션으로 연주하고 각각의 근거를 설명한다',
      '어퍼 스트럭처 트라이어드로 얼터드 도미넌트를 12키에서 즉시 만든다',
      '발라드 한 곡을 자기 리하모니제이션으로 편곡해 암보 연주한다',
      '콜트레인 체인지의 원리를 설명하고 「Giant Steps」 A섹션을 ♩=120 에서 연주한다',
    ],
    targetSkills: { harmony: 90, voicing: 88, melody: 82, rhythm: 80, ear: 80, repertoire: 78, technique: 78, form: 85 },
    accentColor: '#6b2f8c',
  },
  {
    id: 'L6', order: 6,
    title: '모달·컨템포러리', titleEn: 'Modal & Contemporary',
    promise: '2000년대 이후의 소리를 낸다.',
    description:
      '기능 화성의 중력이 약해지는 영역이다. 쿼탈 보이싱, 펜타토닉 중첩, 인터발릭 라인, 변박. ' +
      '여기서는 "어떤 스케일인가"보다 "어떤 질감인가"가 질문이 된다.',
    weeks: 12, hoursPerWeek: 7,
    collegeEquivalent: '3학년 2학기 — 현대 화성 · 컨템포러리 즉흥',
    berkleeAlignment: ['Contemporary Harmony', 'Modal Improvisation', 'Advanced Keyboard Voicings'],
    prerequisites: ['L5 수료'],
    exitCriteria: [
      '「So What」/「Impressions」에서 쿼탈 보이싱으로 코러스 전체를 컴핑하며 정체되지 않는 솔로를 한다',
      '하나의 정적 화성 위에서 3가지 이상의 펜타토닉을 중첩해 긴장을 만들고 해소한다',
      '5/4 또는 7/4 에서 폼을 잃지 않고 2코러스 연주한다',
      '슬래시 화성 표기를 읽고 즉시 보이싱한다',
    ],
    targetSkills: { harmony: 92, voicing: 92, melody: 88, rhythm: 88, ear: 85, repertoire: 82, technique: 85, form: 88 },
    accentColor: '#1f5e8c',
  },
  {
    id: 'L7', order: 7,
    title: '솔로 피아노와 트리오', titleEn: 'Solo Piano & Trio',
    promise: '혼자서도, 셋이서도 음악이 된다.',
    description:
      '반주자가 없을 때 베이스·화성·멜로디 세 층을 혼자 유지하는 법, ' +
      '그리고 베이스와 드럼이 있을 때 그들에게 자리를 내주는 법. 정반대의 두 기술을 함께 익힌다.',
    weeks: 14, hoursPerWeek: 8,
    collegeEquivalent: '4학년 1학기 — 앙상블 · 연주 실기',
    berkleeAlignment: ['Solo Piano Techniques', 'Jazz Ensemble', 'Performance Studies'],
    prerequisites: ['L6 수료'],
    exitCriteria: [
      '스탠다드 3곡을 솔로 피아노로 인트로–헤드–솔로–엔딩까지 완결해 연주한다',
      '발라드 한 곡을 루바토 인트로부터 인 템포 전환까지 자연스럽게 연결한다',
      '트리오 상황에서 솔로이스트 뒤 컴핑 시 왼손을 비우고 리듬으로 대화한다',
      '4마디 트레이딩에서 상대의 프레이즈를 받아 응답한다',
    ],
    targetSkills: { harmony: 92, voicing: 95, melody: 90, rhythm: 92, ear: 88, repertoire: 90, technique: 90, form: 92 },
    accentColor: '#8a5a00',
  },
  {
    id: 'L8', order: 8,
    title: '자기 언어', titleEn: 'Personal Voice',
    promise: '내 소리라고 부를 것이 생긴다.',
    description:
      '배운 것을 버리는 단계다. 남의 어휘를 충분히 쌓은 뒤에야 자기 문장이 나온다. ' +
      '작곡, 자기 편곡, 녹음과 자기 비평, 그리고 무대.',
    weeks: 16, hoursPerWeek: 8,
    collegeEquivalent: '4학년 2학기 — 졸업 연주',
    berkleeAlignment: ['Senior Recital', 'Jazz Composition', 'Professional Performance'],
    prerequisites: ['L7 수료'],
    exitCriteria: [
      '자작곡 또는 자기 편곡 2곡을 포함한 40분 프로그램을 구성해 연주한다',
      '자기 연주를 녹음해 듣고 3가지 이상의 구체적 개선점을 스스로 진단한다',
      '암보 레퍼토리 30곡 이상을 유지한다',
      '초견 상태의 리드시트를 받아 90초 안에 조성·폼·주요 케이던스를 파악하고 연주에 들어간다',
    ],
    targetSkills: { harmony: 95, voicing: 96, melody: 95, rhythm: 95, ear: 92, repertoire: 95, technique: 92, form: 95 },
    accentColor: '#a01b2e',
  },
];

export const LEVEL_BY_ID = Object.fromEntries(LEVELS.map((l) => [l.id, l])) as Record<string, Level>;
