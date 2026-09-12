/**
 * Jazzytory — 필청 명반 라이브러리 (Listening Library)
 * ---------------------------------------------------------------------------
 * 편집 규칙
 *  - 음원을 호스팅하거나 링크하지 않는다. **앨범 메타데이터 + 청취 지시문**만 제공한다.
 *  - `trackNotes[].listenFor` 는 감상문이 아니라 **수행 가능한 청취 과제**다.
 *    "무엇을 세어라 / 무엇이 비어 있는지 확인하라 / 그 자리에서 따라 쳐라".
 *  - `year` 는 원반 발매 연도를 기준으로 하되, 녹음 시점이 크게 다르거나 편집 음반인
 *    경우 `why` 본문에 녹음 시점을 명시한다.
 *  - `label` 은 확신하는 경우에만 기재한다(선택 필드). 불확실하면 생략한다.
 *  - `review.rubric` 은 8항목 **5점 척도(1.0~5.0)** 다.
 *  - 검수 패널은 교수법 계보를 대표하는 **가상의 심사 기준**이며 실존 인물이 아니다.
 *  - `priority: 1` 은 레벨당 최대 3장.
 */

import type { Album } from './types';

export const ALBUMS: Album[] = [
  /* ═══════════════════════════ L0 — 진단과 준비 ═══════════════════════════ */
  {
    id: 'a-oscar-peterson-night-train',
    title: 'Night Train',
    leader: '오스카 피터슨 트리오 (The Oscar Peterson Trio)',
    pianist: '오스카 피터슨 (Oscar Peterson)',
    year: 1963,
    label: 'Verve',
    why: '재즈피아노를 처음 "공부"하는 사람이 가장 먼저 통과해야 할 관문은 이론이 아니라 소리의 표준이다. 이 앨범은 거의 전곡이 블루스이거나 단순한 스탠다드이고, 템포는 대부분 미디엄이며, 피터슨은 자신이 할 수 있는 것의 20%만 쓴다. 즉 **초보자가 실제로 따라 칠 수 있는 밀도**로 연주된 최고 수준의 트리오 녹음이다. 여기서 배워야 할 것은 화려한 런이 아니라, 한 음이 언제 들어오고 언제 빠지는가, 그리고 베이스·드럼과 피아노가 어떤 지분으로 공간을 나누는가다. 당신의 첫 목표는 이 앨범을 카피하는 것이 아니라, 이 앨범을 듣고 "아, 저 정도면 나도 지금 손을 올릴 수 있겠다"고 느끼는 것이다.',
    tags: ['스윙', '블루스', '트리오', '타임'],
    levelId: 'L0',
    priority: 1,
    trackNotes: [
      {
        track: 'C Jam Blues',
        at: '도입부 0초~30초',
        listenFor: '피터슨이 첫 30초 동안 쓰는 음이 사실상 **두 개뿐**임을 확인하라(C와 G). 음높이를 바꾸는 대신 리듬만 바꾼다. 지금 건반 앞에 앉아 C와 G 두 음만으로 12마디를 쳐보라 — 리듬을 매 마디 다르게. 재즈에서 "무엇을 칠까"보다 "언제 칠까"가 먼저라는 것을 손으로 확인하는 데 3분이면 충분하다.',
        moduleId: 'm-l1-05-blues-form',
      },
      {
        track: 'Night Train',
        at: '테마 첫 코러스',
        listenFor: '왼손이 소리를 낸 **횟수를 세라**. 한 코러스에 열 번을 넘지 않는다. 그리고 그 열 번이 무엇인지 들어보면 대부분 3음과 7음 두 개짜리 덩어리다. 초보자는 왼손으로 루트를 쿵쿵 짚고 싶어하지만, 이 녹음에는 베이시스트가 이미 루트를 치고 있다. 왼손에서 루트를 빼는 첫 실험을 이 트랙과 함께 하라.',
        moduleId: 'm-l1-02-shell-voicings',
      },
      {
        track: 'Hymn to Freedom',
        listenFor: '화성이 처음부터 끝까지 **다이어토닉**이다. 조를 찾고(첫 화음이 I다), 들리는 대로 로마숫자만 받아써 보라 — I, IV, I, V 수준으로 충분하다. 코드 이름을 못 받아써도 "지금 집에 있다/집을 떠났다/집으로 돌아온다" 세 가지만 구분되면 L1 화성 수업의 절반은 이미 귀에 들어온 것이다.',
        moduleId: 'm-l1-03-diatonic-harmony',
      },
    ],
    relatedModules: ['m-l0-01-placement', 'm-l1-02-shell-voicings', 'm-l1-05-blues-form', 'm-l1-06-swing-feel'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-pedagogy', 'rv-transcription'],
      reviewedAt: '2026-02-14',
      rubric: { accuracy: 4.8, terminology: 4.6, sequencing: 5.0, playability: 5.0, idiom: 4.7, integration: 4.9, assessability: 4.6, sourcing: 4.3 },
      comments: [
        {
          reviewerId: 'rv-pedagogy',
          issue: '첫 청취 과제가 "감상"으로 흐르면 L0 학습자가 아무것도 하지 않고 넘어간다.',
          resolution: '세 트랙 모두 세기·받아쓰기·즉시 재현 중 하나의 동작을 명시하도록 수정.',
          severity: 'major',
        },
      ],
    },
  },

  /* ═══════════════════════ L1 — 코드 심볼의 문해력 ═══════════════════════ */
  {
    id: 'a-atomic-basie',
    title: 'The Atomic Mr. Basie',
    leader: '카운트 베이시 오케스트라 (Count Basie Orchestra)',
    pianist: '카운트 베이시 (Count Basie)',
    year: 1958,
    label: 'Roulette',
    why: '빅밴드 앨범을 피아니스트 교재로 쓰는 이유는 단 하나, 베이시가 **가장 적게 치는 피아니스트**이기 때문이다. 17명이 만드는 굉음 속에서 베이시는 종종 한 손가락으로 두세 음을 던지고 사라진다. 그런데 그 두세 음이 없으면 밴드의 타임이 무너진다. 초보자는 "컴핑=계속 치는 것"이라고 오해하며, 그 오해가 L2 전체를 망친다. 여기서 배울 것은 여백이 소리보다 강할 수 있다는 원리, 그리고 그 여백을 유지하려면 오히려 더 정확한 타임이 필요하다는 사실이다. 편곡(닐 헤프티)의 셈여림 설계 또한 L7 어레인지먼트의 원형으로 쓸 수 있다.',
    tags: ['빅밴드', '스윙', '여백', '타임'],
    levelId: 'L1',
    priority: 1,
    trackNotes: [
      {
        track: 'The Kid from Red Bank',
        listenFor: '이 곡은 예외적으로 베이시가 많이 친다. 그래서 **비교군**으로 쓴다. 이 트랙을 먼저 듣고 바로 아래 "Li’l Darlin’"으로 넘어가라. 같은 사람이 같은 밴드에서 낸 소리의 밀도 차이를 체감하면, 밀도는 실력이 아니라 **선택**이라는 사실이 귀에 박힌다.',
        moduleId: 'm-l2-04-comping-rhythm',
      },
      {
        track: "Li'l Darlin'",
        at: '전곡',
        listenFor: '피아노가 등장하는 지점마다 손을 들어 표시하라(종이에 마디 수를 세도 좋다). 곡이 끝나면 그 횟수를 세라. 그다음 스스로에게 물어라 — 나는 리드시트 한 장을 반주할 때 저것보다 몇 배 많이 치는가. 이 곡의 템포는 극단적으로 느리다. 느린 곡에서 소리를 채우고 싶은 충동을 견디는 것이 컴핑 훈련의 시작이다.',
        moduleId: 'm-l2-04-comping-rhythm',
      },
      {
        track: 'Splanky',
        listenFor: '베이시의 필인(fill-in)은 거의 항상 **프레이즈와 프레이즈 사이의 빈칸**에서만 일어난다. 관악 섹션이 소리를 내는 동안 피아노가 겹치는 순간이 있는지 찾아보라. 거의 없다. 이것이 "컴핑은 대화의 순서를 지키는 일"이라는 말의 실제 소리다.',
        moduleId: 'm-l7-04-trio-comping',
      },
    ],
    relatedModules: ['m-l1-06-swing-feel', 'm-l2-04-comping-rhythm', 'm-l7-04-trio-comping', 'm-l7-06-arrangement'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-pedagogy', 'rv-barry-harris'],
      reviewedAt: '2026-02-20',
      rubric: { accuracy: 4.9, terminology: 4.5, sequencing: 4.4, playability: 4.8, idiom: 5.0, integration: 4.6, assessability: 4.7, sourcing: 4.2 },
    },
  },

  {
    id: 'a-red-garland-groovy',
    title: 'Groovy',
    leader: '레드 갈란드 트리오 (Red Garland Trio)',
    pianist: '레드 갈란드 (Red Garland)',
    year: 1957,
    label: 'Prestige',
    why: '레드 갈란드는 재즈피아노 역사에서 **가장 모방하기 쉬운 대가**다. 어휘가 좁고 반복적이며, 블록 코드 공식이 뚜렷하고, 템포가 무리하지 않는다. 바로 그 이유로 L1~L2 학습자의 첫 카피 대상으로 이상적이다. 갈란드의 오른손 블록 코드(4성부 클로즈 + 옥타브 더블링)는 한 번 손에 들어오면 그 주에 바로 스탠다드에 쓸 수 있고, 왼손은 3음·7음 중심의 얇은 셸에서 거의 벗어나지 않아 셸 보이싱 교재로 그대로 쓰인다. 화려한 것을 배우기 전에 **팔릴 만한 것**을 배우는 단계에서, 이 앨범은 교재이자 답안지다.',
    tags: ['블록 코드', '셸 보이싱', '블루스', '소울 밥'],
    levelId: 'L1',
    priority: 1,
    trackNotes: [
      {
        track: 'C Jam Blues',
        at: '테마 제시부',
        listenFor: '오른손 화음 덩어리의 **맨 위 음과 맨 아래 음이 같은 음이름**인지 확인하라(옥타브로 감싼 4성부 클로즈다). 확인했으면 그 자리에서 C7 하나만 가지고 같은 구조를 만들어보라: 오른손 새끼손가락에 멜로디 음, 엄지에 같은 음의 한 옥타브 아래, 그 사이를 화음 구성음으로 채운다. 이 한 가지 공식이 갈란드 사운드의 80%다.',
        moduleId: 'm-l2-01-rootless',
      },
      {
        track: 'Willow Weep for Me',
        listenFor: '왼손만 따라가며 **몇 개의 음을 동시에 누르는지** 세라. 대부분 두 개다. 갈란드의 왼손은 코드의 3음과 7음(때로 루트+7음)만 잡고, 나머지는 베이시스트에게 맡긴다. 당신이 왼손으로 4~5음을 뭉개서 저음이 탁해지는 문제의 해답이 여기 있다.',
        moduleId: 'm-l1-02-shell-voicings',
      },
      {
        track: 'Will You Still Be Mine?',
        listenFor: '갈란드의 오른손 싱글 라인이 **거의 8분음표로만** 이루어져 있음을 확인하라. 리듬적 변주가 적은 대신, 프레이즈의 시작점이 매번 박의 뒤(업비트)에 놓인다. 메트로놈을 2·4박에만 놓고 8분음표 스케일을 치되 프레이즈를 항상 "and"에서 시작하는 연습으로 옮겨라.',
        moduleId: 'm-l1-06-swing-feel',
      },
    ],
    relatedModules: ['m-l1-02-shell-voicings', 'm-l1-05-blues-form', 'm-l1-06-swing-feel', 'm-l2-01-rootless', 'm-l4-02-transcription'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-barry-harris', 'rv-transcription'],
      reviewedAt: '2026-03-02',
      rubric: { accuracy: 4.7, terminology: 4.6, sequencing: 4.9, playability: 5.0, idiom: 4.8, integration: 4.7, assessability: 4.8, sourcing: 4.1 },
      comments: [
        {
          reviewerId: 'rv-transcription',
          issue: '블록 코드를 "록트 핸즈"와 혼용하면 L2에서 용어 충돌이 생긴다.',
          resolution: '이 앨범 노트에서는 4성부 클로즈+옥타브 더블링이라는 구조만 기술하고 명칭 논쟁은 모듈 본문으로 이관.',
          severity: 'minor',
        },
      ],
    },
  },

  {
    id: 'a-somethin-else',
    title: "Somethin' Else",
    leader: '캐넌볼 애덜리 (Cannonball Adderley)',
    pianist: '행크 존스 (Hank Jones)',
    year: 1958,
    label: 'Blue Note',
    why: '이 앨범은 L1 학습자가 처음 배우는 스탠다드 "Autumn Leaves"의 **표준 참조 녹음**이다. 그런데 피아니스트에게 더 중요한 것은 행크 존스의 태도다. 마일스와 캐넌볼이라는 두 거물 뒤에서 존스는 절대 앞으로 나오지 않으면서도, 화성의 좌표를 한 번도 놓치지 않는다. 컴핑이 "반주 실력"이 아니라 **정보 제공**이라는 것 — 솔로이스트에게 지금 어디인지 알려주는 일 — 을 이보다 명료하게 보여주는 녹음은 드물다. 또한 마이너 ii-V-i 와 상대 장조 ii-V-I 이 번갈아 나오는 이 곡의 구조는 L1 화성 문해력 시험지 그 자체다.',
    tags: ['하드 밥', '컴핑', '마이너 ii-V-i', '스탠다드'],
    levelId: 'L1',
    priority: 1,
    trackNotes: [
      {
        track: 'Autumn Leaves',
        at: '도입 인트로(테마 진입 전)',
        listenFor: '테마가 시작되기 전 반복되는 짧은 인트로 패턴을 **그대로 외워서 칠 수 있을 때까지** 반복 재생하라. 두 마디짜리다. 이런 2마디 인트로 하나를 손에 넣으면, 당신은 앞으로 어떤 미디엄 스윙 곡이든 밴드 없이 혼자 시작할 수 있다.',
        moduleId: 'm-l2-05-turnarounds',
      },
      {
        track: 'Autumn Leaves',
        at: '캐넌볼 솔로 첫 코러스',
        listenFor: '행크 존스의 컴핑이 들어오는 지점에 표시하고, 그것이 솔로 프레이즈의 **중간인지 사이인지** 판정하라. 거의 전부 "사이"다. 솔로이스트가 숨을 쉬는 그 자리에만 화음이 놓인다. 당신의 컴핑이 시끄러운 이유는 음이 많아서가 아니라 타이밍이 겹치기 때문이다.',
        moduleId: 'm-l2-04-comping-rhythm',
      },
      {
        track: 'Autumn Leaves',
        listenFor: '이 곡은 단조 곡인데 시작이 장조처럼 들린다. 그 이유를 귀로만 판정해보라 — A섹션은 상대 장조의 ii-V-I 로 출발해 마이너 ii-V-i 로 착지한다. 한 곡 안에서 두 개의 케이던스 색을 번갈아 듣는 훈련으로 이보다 좋은 교재가 없다. 두 케이던스가 바뀌는 순간마다 손뼉을 쳐보라.',
        moduleId: 'm-l1-04-ii-v-i',
      },
      {
        track: "Somethin' Else",
        listenFor: '이 곡은 블루스다. 12마디를 세면서 들어라 — 세다가 놓치면 처음부터 다시. 헤드 없이 폼을 세는 이 단순한 훈련이 L2 "폼 안에서 길 잃지 않기"의 예비 동작이다.',
        moduleId: 'm-l1-05-blues-form',
      },
    ],
    relatedModules: ['m-l1-04-ii-v-i', 'm-l1-05-blues-form', 'm-l2-04-comping-rhythm', 'm-l2-05-turnarounds', 'm-l3-06-minor-harmony'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-pedagogy'],
      reviewedAt: '2026-03-08',
      rubric: { accuracy: 4.9, terminology: 4.8, sequencing: 4.9, playability: 4.7, idiom: 4.8, integration: 5.0, assessability: 4.7, sourcing: 4.4 },
    },
  },

  {
    id: 'a-moanin',
    title: "Moanin'",
    leader: '아트 블레이키와 재즈 메신저스 (Art Blakey & The Jazz Messengers)',
    pianist: '바비 티먼스 (Bobby Timmons)',
    year: 1959,
    label: 'Blue Note',
    why: '재즈피아노의 "펑키·가스펠" 계보를 한 곡으로 설명해야 한다면 이 앨범의 타이틀곡이다. 바비 티먼스의 어휘는 좁다 — 블루스 스케일, 4도 겹침, 그레이스 노트, 그리고 반복. 그러나 그 좁은 어휘가 왜 사람을 움직이는지를 이해하지 못하면, 학습자는 평생 "맞는 음을 치지만 아무 일도 일어나지 않는 연주"에 머문다. L1 단계에서 이 앨범이 필요한 이유는 화성이 쉽기 때문이 아니라, **반복이 어휘 부족을 가리는 것이 아니라 어휘를 완성한다**는 사실을 먼저 믿게 하기 위해서다.',
    tags: ['하드 밥', '가스펠', '블루스 어법', '반복'],
    levelId: 'L1',
    priority: 2,
    trackNotes: [
      {
        track: "Moanin'",
        at: '테마 콜 앤 리스폰스 구간',
        listenFor: '테마는 피아노의 한 마디짜리 질문과 밴드의 응답으로 이루어진다. 그 **질문 동기가 몇 번 반복되는지** 세라. 그리고 같은 동기가 반복될 때마다 무엇이 바뀌는지 적어라(대개 화성만 바뀌고 선율은 그대로다). 이것이 L4 모티프 전개의 가장 단순한 원형이다.',
        moduleId: 'm-l4-03-motivic-development',
      },
      {
        track: "Moanin'",
        at: '티먼스 솔로',
        listenFor: '솔로 전체에서 티먼스가 쓰는 **음 재료가 사실상 블루스 스케일 한 벌**임을 확인하라. 그럼에도 지루하지 않은 이유는 리듬이 매번 다르기 때문이다. 그 자리에서 F 블루스 스케일 하나만 쓰고 리듬만 바꿔 한 코러스를 만들어보라. 음을 늘리지 말고 리듬만 바꾸는 것이 과제다.',
        moduleId: 'm-l4-06-blues-language',
      },
      {
        track: 'Blues March',
        listenFor: '행진 리듬 위에서도 스윙이 유지되는 지점을 찾아라. 드럼은 2박 계열인데 피아노 컴핑은 여전히 뒤로 기댄다. 두 개의 리듬 층이 동시에 존재할 수 있다는 감각이 L4 리듬 변위의 기초다.',
        moduleId: 'm-l1-06-swing-feel',
      },
    ],
    relatedModules: ['m-l1-05-blues-form', 'm-l1-06-swing-feel', 'm-l4-03-motivic-development', 'm-l4-06-blues-language'],
    review: {
      status: 'faculty-pending',
      reviewers: ['rv-barry-harris'],
      reviewedAt: '2026-03-11',
      rubric: { accuracy: 4.6, terminology: 4.4, sequencing: 4.5, playability: 4.9, idiom: 5.0, integration: 4.5, assessability: 4.6, sourcing: 4.0 },
    },
  },

  {
    id: 'a-concert-by-the-sea',
    title: 'Concert by the Sea',
    leader: '에롤 가너 (Erroll Garner)',
    pianist: '에롤 가너 (Erroll Garner)',
    year: 1955,
    label: 'Columbia',
    why: '1955년 9월 캘리포니아 카멜에서의 실황. 에롤 가너는 악보를 읽지 않았고 어떤 학파에도 속하지 않았지만, 왼손으로 기타처럼 4박을 긁는 그의 "스트럼" 주법은 재즈피아노 타임 교육의 살아 있는 메트로놈이다. 이 앨범에서 배울 것은 어휘가 아니라 **시간축의 분리**다: 왼손은 기계처럼 정확한 4박을 유지하고, 오른손은 그 위에서 일부러 늦게 도착한다. 두 손이 서로 다른 시간 감각을 갖는다는 이 경험은, 초보자가 "박에 맞춰 치기"에서 "박을 가지고 놀기"로 넘어가는 유일한 다리다.',
    tags: ['스윙', '좌수 스트럼', '타임', '실황'],
    levelId: 'L1',
    priority: 2,
    trackNotes: [
      {
        track: 'I’ll Remember April',
        at: '테마 진입 이후 아무 30초',
        listenFor: '왼손만 들어라. **4박 전부를 균등하게** 친다. 이제 오른손만 들어라. 멜로디의 도착점이 거의 매번 박보다 살짝 늦다. 두 손을 동시에 듣지 말고 번갈아 듣는 이 훈련을 30초씩 세 번 반복하라. 이것이 "레이드백"의 정체다.',
        moduleId: 'm-l1-06-swing-feel',
      },
      {
        track: 'Autumn Leaves',
        at: '도입 인트로',
        listenFor: '가너의 인트로는 곡의 조성과 거의 관계없이 시작해 마지막 순간에 조로 착지한다. **언제 조가 확정되는지** 그 지점을 찍어보라. 루바토 인트로의 원리 — 모호함을 유지하다가 한 번에 해결한다 — 를 L7에서 배우기 전에 귀로 먼저 만나두는 것이다.',
        moduleId: 'm-l7-03-rubato-ballad',
      },
      {
        track: 'It’s All Right with Me',
        listenFor: '빠른 템포에서 왼손 스트럼이 무너지는지 확인하라. 무너지지 않는다. 그리고 오른손이 아무리 복잡해져도 왼손의 밀도는 변하지 않는다. 양손 독립의 정의를 이보다 잔인하게 보여주는 예가 없다. 당신의 왼손이 오른손을 따라 빨라진다면 그것은 독립이 아니다.',
        moduleId: 'm-l0-03-keyboard-geography',
      },
    ],
    relatedModules: ['m-l0-03-keyboard-geography', 'm-l1-06-swing-feel', 'm-l7-01-solo-piano', 'm-l7-03-rubato-ballad'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-keyboard-technique', 'rv-pedagogy'],
      reviewedAt: '2026-03-15',
      rubric: { accuracy: 4.5, terminology: 4.3, sequencing: 4.6, playability: 4.4, idiom: 4.8, integration: 4.5, assessability: 4.9, sourcing: 4.0 },
      comments: [
        {
          reviewerId: 'rv-keyboard-technique',
          issue: '가너식 좌수 스트럼을 장시간 연습하면 손목 회전 피로가 누적된다.',
          resolution: '청취 과제로만 제시하고 실연 드릴은 m-l1-06 모듈의 템포·시간 제한 규정을 따르도록 연결.',
          severity: 'major',
        },
      ],
    },
  },

  /* ═══════════════════════ L2 — 보이싱과 컴핑 ═══════════════════════ */
  {
    id: 'a-ahmad-jamal-pershing',
    title: 'At the Pershing: But Not for Me',
    leader: '아마드 자말 트리오 (Ahmad Jamal Trio)',
    pianist: '아마드 자말 (Ahmad Jamal)',
    year: 1958,
    label: 'Argo',
    why: '마일스 데이비스가 자기 리듬 섹션에게 "이 사람처럼 하라"고 지시한 대상이 아마드 자말이다. 이 실황 앨범은 재즈피아노에서 **여백·다이내믹·편곡**이 어떻게 하나의 무기가 되는지를 보여주는 표준 문헌이다. 자말은 화성을 복잡하게 만들지 않는다. 대신 같은 두 마디 뱀프를 반복하다가 예고 없이 멈추고, 멈춘 자리에서 베이스와 드럼이 곡을 끌고 가게 둔다. L2 학습자가 배워야 할 핵심 — 컴핑은 "연주하는 일"이 아니라 **밴드 전체의 음량과 밀도를 설계하는 일**이라는 것 — 이 45분 내내 증명된다. 트리오를 하나의 편곡 단위로 보는 시각이 여기서 시작된다.',
    tags: ['트리오', '여백', '다이내믹', '편곡'],
    levelId: 'L2',
    priority: 1,
    trackNotes: [
      {
        track: 'Poinciana',
        at: '전곡',
        listenFor: '드럼의 반복 패턴이 곡 전체에서 거의 변하지 않는다는 것을 먼저 확인하고, **피아노가 완전히 침묵하는 구간의 길이**를 재라(초 단위로). 네 마디 이상 비어 있는 곳이 여러 번 나온다. 그 침묵에서 음악이 죽는가? 오히려 커진다. 이번 주 당신의 컴핑 과제: 한 코러스에서 의도적으로 8마디를 통째로 비워보라.',
        moduleId: 'm-l2-04-comping-rhythm',
      },
      {
        track: 'But Not for Me',
        listenFor: '자말이 같은 두 마디 뱀프를 반복하는 구간을 찾고, 그 반복이 **몇 번째에서 깨지는지** 세라. 그리고 깨지는 순간 무엇으로 신호를 주는지 들어라 — 대개 음량이나 레지스터의 급변이다. 밴드에게 "여기서 바뀐다"고 알리는 이 기술이 L2 폼 내비게이션의 실전판이다.',
        moduleId: 'm-l2-06-form-navigation',
      },
      {
        track: 'Surrey with the Fringe on Top',
        listenFor: '피아노의 음역 이동을 추적하라. 자말은 같은 코드를 반복할 때 보이싱을 바꾸는 대신 **옥타브 위치를 바꾼다**. 같은 D-7 을 중음역에서 한 번, 고음역에서 한 번 — 그것만으로 완전히 다른 사건이 된다. 보이싱 어휘가 부족한 단계에서 즉시 쓸 수 있는 가장 저렴한 변화 수단이다.',
        moduleId: 'm-l0-03-keyboard-geography',
      },
    ],
    relatedModules: ['m-l2-04-comping-rhythm', 'm-l2-06-form-navigation', 'm-l7-04-trio-comping', 'm-l7-06-arrangement'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-pedagogy', 'rv-contemporary'],
      reviewedAt: '2026-02-27',
      rubric: { accuracy: 4.8, terminology: 4.5, sequencing: 4.8, playability: 4.9, idiom: 5.0, integration: 4.8, assessability: 5.0, sourcing: 4.2 },
    },
  },

  {
    id: 'a-cookin-miles',
    title: "Cookin' with the Miles Davis Quintet",
    leader: '마일스 데이비스 퀸텟 (The Miles Davis Quintet)',
    pianist: '레드 갈란드 (Red Garland)',
    year: 1957,
    label: 'Prestige',
    why: '1956년의 이른바 "마라톤 세션"에서 나온 네 장 중 한 장. 피아니스트에게 이 앨범이 필수인 이유는 레드 갈란드가 **한 곡 안에서 세 가지 역할을 번갈아 수행**하기 때문이다 — 마일스 뒤에서는 극도로 얇은 셸, 콜트레인 뒤에서는 밀도를 올린 화성 지지, 자기 솔로에서는 블록 코드. 같은 사람이 상대에 따라 반주를 바꾼다는 개념 자체가 L2 학습자에게는 새로운 정보다. 또한 이 앨범의 "My Funny Valentine" 은 발라드에서 피아노가 어디까지 물러설 수 있는지를 보여주는 한계 실험이다.',
    tags: ['하드 밥', '컴핑', '블록 코드', '발라드'],
    levelId: 'L2',
    priority: 1,
    trackNotes: [
      {
        track: 'My Funny Valentine',
        at: '마일스의 테마 제시부',
        listenFor: '갈란드가 **코드 하나를 언제 놓는지** 기다려보라. 마일스가 한 프레이즈를 끝내고 나서야 화음이 들어온다. 발라드에서 피아니스트가 저지르는 최악의 실수는 멜로디와 동시에 치는 것이다. 메트로놈 없이 이 트랙을 틀어놓고, 화음이 들어올 자리를 미리 손가락으로 예측해보라 — 절반도 못 맞힐 것이다.',
        moduleId: 'm-l2-04-comping-rhythm',
      },
      {
        track: 'Blues by Five',
        at: '갈란드 솔로',
        listenFor: '갈란드가 싱글 라인에서 블록 코드로 **전환하는 정확한 마디**를 찾아 표시하라. 대개 코러스의 경계다. 즉 텍스처 변화가 폼의 위치를 알려주는 신호로 쓰인다. 당신도 솔로에서 코러스가 바뀔 때 텍스처를 한 번 바꾸는 규칙을 만들어보라.',
        moduleId: 'm-l2-06-form-navigation',
      },
      {
        track: 'Airegin',
        listenFor: '빠른 템포에서 갈란드의 왼손이 **얼마나 적게 개입하는지** 세라. 테마 동안 왼손은 거의 쉰다. 초보자는 빠를수록 더 많이 치려 하지만, 실제 현장에서는 빠를수록 덜 친다. 템포와 밀도는 반비례한다는 규칙을 오늘 연습에 적용하라.',
        moduleId: 'm-l2-04-comping-rhythm',
      },
    ],
    relatedModules: ['m-l2-01-rootless', 'm-l2-04-comping-rhythm', 'm-l2-06-form-navigation', 'm-l1-02-shell-voicings'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-transcription', 'rv-chord-scale'],
      reviewedAt: '2026-03-04',
      rubric: { accuracy: 4.8, terminology: 4.7, sequencing: 4.8, playability: 4.6, idiom: 4.9, integration: 4.9, assessability: 4.6, sourcing: 4.3 },
    },
  },

  {
    id: 'a-waltz-for-debby',
    title: 'Waltz for Debby',
    leader: '빌 에반스 트리오 (Bill Evans Trio)',
    pianist: '빌 에반스 (Bill Evans)',
    year: 1962,
    label: 'Riverside',
    why: '1961년 6월 25일 빌리지 뱅가드 실황에서 추려낸 두 장 중 하나. 루트리스 보이싱이라는 개념을 문장으로 배우는 것과, 그것이 실제로 어떤 소리인지 아는 것은 완전히 다른 일이다. 이 앨범은 후자를 위한 교재다. 에반스의 왼손은 루트를 거의 치지 않고 3·5·7·9 를 좁은 간격으로 쌓아 중음역에 놓는다. 그 결과 스콧 라파로의 베이스가 루트를 자유롭게 떠날 수 있고, 그래서 트리오가 "반주-솔로" 구조에서 벗어난다. 즉 **루트리스 보이싱은 편의가 아니라 앙상블 구조를 바꾸는 결정**이다. L2에서 이 사실을 이해하고 넘어가는 학습자와 아닌 학습자는 L7에서 완전히 다른 연주자가 된다.',
    tags: ['루트리스 보이싱', '트리오', '인터플레이', '발라드'],
    levelId: 'L2',
    priority: 1,
    trackNotes: [
      {
        track: 'My Foolish Heart',
        at: '첫 8마디',
        listenFor: '왼손의 **최저음이 코드의 루트인 경우가 몇 번인지** 세라. 거의 없다. 대부분 3음 또는 7음이 바닥에 놓인다. 확인했으면 건반에서 D-7 을 루트 없이 F-A-C-E 로 쌓아보고, 같은 코드를 루트 포함(D-F-A-C)으로도 쳐보라. 저음의 탁함 차이를 귀로 비교하는 데 1분이면 충분하다.',
        moduleId: 'm-l2-01-rootless',
      },
      {
        track: 'Waltz for Debby',
        at: '첫 코러스(느린 3박 제시부)',
        listenFor: '왼손이 **언제 치지 않는지** 세어보라. 에반스는 오른손이 새 프레이즈를 시작하는 순간 왼손을 비운다. 당신의 컴핑이 시끄러운 이유가 여기 있다. 그리고 3박자 곡에서 왼손이 1박에만 오지 않는다는 점 — 2박이나 3박에서 들어오는 경우를 찾아 표시하라.',
        moduleId: 'm-l2-04-comping-rhythm',
      },
      {
        track: 'Detour Ahead',
        listenFor: '같은 코드가 두 마디 이상 지속되는 구간에서 에반스가 **보이싱의 최상성부를 어떻게 움직이는지** 추적하라. 코드는 그대로인데 맨 위 음이 한 음씩 내려오거나 올라간다. 이것이 가이드 톤 라인을 컴핑에 적용한 형태다. 한 코드를 잡고 최상성부만 반음/온음으로 움직이는 연습으로 바로 옮길 수 있다.',
        moduleId: 'm-l2-02-guide-tone-lines',
      },
      {
        track: 'Some Other Time',
        listenFor: '페달을 언제 밟고 언제 떼는지 귀로 판정하라. 화성이 바뀌는데도 잔향이 남아 두 화음이 겹치는 순간이 있는가? 거의 없다. 클래식 전향자가 가장 많이 지적받는 문제가 페달 과다이고, 그 교정 기준이 이 트랙이다.',
        moduleId: 'm-l7-03-rubato-ballad',
      },
    ],
    relatedModules: ['m-l2-01-rootless', 'm-l2-02-guide-tone-lines', 'm-l2-04-comping-rhythm', 'm-l7-03-rubato-ballad'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-keyboard-technique', 'rv-pedagogy'],
      reviewedAt: '2026-02-18',
      rubric: { accuracy: 4.9, terminology: 4.9, sequencing: 5.0, playability: 4.7, idiom: 4.9, integration: 5.0, assessability: 4.8, sourcing: 4.5 },
      comments: [
        {
          reviewerId: 'rv-chord-scale',
          issue: '"루트리스=루트를 절대 치지 않는다"로 오독될 여지가 있다.',
          resolution: '청취 과제를 "루트가 최저음인 경우의 횟수를 센다"로 바꿔, 빈도의 문제임을 학습자가 스스로 확인하게 함.',
          severity: 'major',
        },
      ],
    },
  },

  {
    id: 'a-kelly-blue',
    title: 'Kelly Blue',
    leader: '윈턴 켈리 (Wynton Kelly)',
    pianist: '윈턴 켈리 (Wynton Kelly)',
    year: 1959,
    label: 'Riverside',
    why: '동료 연주자들이 "가장 같이 연주하고 싶은 피아니스트"로 반복해서 지목한 사람이 윈턴 켈리다. 이유는 명확하다 — 켈리의 컴핑은 솔로이스트를 **밀어준다**. 화음이 박의 살짝 앞에 떨어지고, 리듬 꼴이 짧고, 같은 패턴을 절대 두 번 연속 쓰지 않는다. 보이싱 목록을 외우는 L2 학습자가 정작 밴드에서 환영받지 못하는 이유는 리듬 때문인데, 그 처방전이 이 앨범이다. 솔로에서도 켈리는 어려운 음을 고르지 않는다. 대신 프레이즈가 항상 **노래처럼 끝난다**.',
    tags: ['컴핑', '리듬', '소울 밥', '트리오'],
    levelId: 'L2',
    priority: 2,
    trackNotes: [
      {
        track: 'Kelly Blue',
        at: '관악 솔로 구간',
        listenFor: '켈리의 컴핑 화음이 박 **위에 정확히 떨어지는지, 아주 살짝 앞인지** 판정하라. 앞이다. 그리고 그 화음의 길이가 짧다(스타카토에 가깝다). 당신의 컴핑이 늘어지는 이유는 화음을 길게 눌러서다. 오늘은 모든 컴핑 화음을 8분음표 길이로만 쳐보라.',
        moduleId: 'm-l2-04-comping-rhythm',
      },
      {
        track: 'On Green Dolphin Street',
        listenFor: '이 곡은 같은 화음이 오래 지속되는 구간(페달 포인트)과 빠르게 움직이는 ii-V 구간이 교대한다. **두 구간에서 컴핑 밀도가 어떻게 달라지는지** 비교하라. 정체 구간에서는 리듬으로, 진행 구간에서는 성부 이동으로 흥미를 만든다.',
        moduleId: 'm-l2-06-form-navigation',
      },
      {
        track: 'Softly, as in a Morning Sunrise',
        listenFor: '켈리의 솔로 프레이즈 **끝음**만 따로 적어보라. 대부분 코드톤이고, 대부분 길게 유지된다. 초보자의 솔로가 어수선한 이유는 시작이 아니라 끝을 설계하지 않기 때문이다. 이번 주 즉흥 과제: 프레이즈의 마지막 음을 미리 정하고 시작하라.',
        moduleId: 'm-l3-05-forward-motion',
      },
    ],
    relatedModules: ['m-l2-04-comping-rhythm', 'm-l2-06-form-navigation', 'm-l3-05-forward-motion', 'm-l7-04-trio-comping'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-barry-harris', 'rv-transcription'],
      reviewedAt: '2026-03-19',
      rubric: { accuracy: 4.7, terminology: 4.5, sequencing: 4.7, playability: 4.8, idiom: 5.0, integration: 4.6, assessability: 4.7, sourcing: 4.1 },
    },
  },

  /* ═══════════════════════ L3 — 코드 스케일과 선율 ═══════════════════════ */
  {
    id: 'a-song-for-my-father',
    title: 'Song for My Father',
    leader: '호레이스 실버 퀸텟 (The Horace Silver Quintet)',
    pianist: '호레이스 실버 (Horace Silver)',
    year: 1965,
    label: 'Blue Note',
    why: '호레이스 실버는 작곡가로서도 피아니스트로서도 **불필요한 음을 쓰지 않는 사람**이다. 이 앨범의 곡들은 마이너 조성과 도리안 색채를 오가며, 화성은 느리게 움직이고, 리듬은 라틴과 스윙 사이에 있다. L3 학습자에게 필요한 것은 정확히 이 조건이다 — 화성이 천천히 바뀌어야 스케일 선택을 귀로 검증할 시간이 생긴다. 또한 실버의 솔로는 스케일 나열이 아니라 **짧은 동기의 변형**으로 이루어져 있어, 코드 스케일을 배운 학습자가 빠지는 "위아래로 달리기" 함정의 해독제가 된다.',
    tags: ['하드 밥', '마이너 화성', '모티프', '라틴'],
    levelId: 'L3',
    priority: 1,
    trackNotes: [
      {
        track: 'Song for My Father',
        at: '테마 제시부',
        listenFor: '베이스 라인이 반복되는 동안 **화성이 몇 번 바뀌는지** 세라. 아주 적다. 이 정적 상태 위에서 실버가 무엇으로 움직임을 만드는지 확인하라 — 리듬과 레지스터다. 화성이 느린 곡에서 지루해지는 학습자는 이 두 가지를 쓰지 않고 있다.',
        moduleId: 'm-l3-06-minor-harmony',
      },
      {
        track: 'Song for My Father',
        at: '실버의 솔로 첫 코러스',
        listenFor: '첫 4마디에 나오는 짧은 동기를 외워라(대개 3~5음이다). 그다음 그 동기가 **솔로 안에서 몇 번 다시 등장하는지** 세라. 음높이는 바뀌어도 리듬 윤곽은 유지된다. 이것이 "솔로에 이야기가 있다"는 말의 측정 가능한 정의다.',
        moduleId: 'm-l4-03-motivic-development',
      },
      {
        track: 'The Natives Are Restless Tonight',
        listenFor: '빠른 템포에서 실버의 라인이 **코드가 바뀌는 마디의 첫 박에 어떤 음으로 도착하는지** 들어라. 거의 항상 3음 또는 7음이다. 목표음을 미리 정하고 그리로 걸어가는 것 — 포워드 모션의 핵심이 여기 있다.',
        moduleId: 'm-l3-05-forward-motion',
      },
      {
        track: 'Que Pasa',
        listenFor: '한 화음이 오래 지속되는 이 곡에서 실버가 쓰는 음 재료를 특정하라. 코드톤 + 도리안 계열의 제한된 집합이다. 지속 화성 위에서 "어떤 음을 쓸 수 있는가"가 아니라 "어떤 음을 안 쓰는가"를 듣는 훈련이다.',
        moduleId: 'm-l3-01-chord-scales',
      },
    ],
    relatedModules: ['m-l3-01-chord-scales', 'm-l3-05-forward-motion', 'm-l3-06-minor-harmony', 'm-l4-03-motivic-development'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-barry-harris'],
      reviewedAt: '2026-03-22',
      rubric: { accuracy: 4.8, terminology: 4.7, sequencing: 4.9, playability: 4.8, idiom: 4.9, integration: 4.8, assessability: 4.7, sourcing: 4.4 },
    },
  },

  {
    id: 'a-clifford-brown-max-roach',
    title: 'Clifford Brown and Max Roach',
    leader: '클리포드 브라운 & 맥스 로치 (Clifford Brown & Max Roach)',
    pianist: '리치 파월 (Richie Powell)',
    year: 1955,
    label: 'EmArcy',
    why: '피아니스트가 관악기 솔로를 들어야 하는 이유는 단순하다 — 피아노는 열 손가락으로 아무 음이나 칠 수 있지만, 관악기는 한 번에 한 음씩 숨으로 밀어야 하므로 **선율의 논리가 노출된다**. 클리포드 브라운의 라인은 재즈 역사에서 가장 깨끗한 선율 논리의 표본이다: 목표음이 분명하고, 어프로치가 규칙적이며, 프레이즈가 숨 단위로 끝난다. L3에서 코드 스케일을 배운 학습자가 "스케일은 아는데 말이 안 된다"는 벽에 부딪힐 때, 이 앨범은 그 벽의 반대편을 들려준다. 리치 파월의 절제된 컴핑도 함께 관찰 대상이다.',
    tags: ['비밥', '선율 논리', '포워드 모션', '어프로치 노트'],
    levelId: 'L3',
    priority: 1,
    trackNotes: [
      {
        track: 'Joy Spring',
        at: '브라운 솔로 첫 코러스',
        listenFor: '프레이즈가 끝나는 자리마다 정지 버튼을 누르고 **그 프레이즈가 몇 박이었는지** 세라. 대개 2~4마디이고 반드시 숨 쉴 자리가 남는다. 초보자의 솔로는 32마디가 한 문장이다. 오늘 과제: 2마디 치고 2마디 쉬는 규칙으로 한 코러스를 만들어라.',
        moduleId: 'm-l3-05-forward-motion',
      },
      {
        track: 'Daahoud',
        listenFor: '코드가 바뀌기 **직전 8분음표 두 개**에 집중하라. 브라운은 목표음을 위·아래에서 감싸며 접근한다(엔클로저). 한 곳만 정확히 받아써서 12키로 옮기면 그것이 당신의 첫 어프로치 노트 어휘가 된다.',
        moduleId: 'm-l3-03-approach-notes',
      },
      {
        track: 'Parisian Thoroughfare',
        listenFor: '리치 파월의 컴핑이 관악 유니즌 구간에서 **완전히 사라지는지** 확인하라. 테마가 두꺼울 때 피아노는 물러난다. 그리고 솔로가 시작되는 순간 다시 등장한다. 밴드 안에서 피아노의 존재는 상수가 아니라 변수다.',
        moduleId: 'm-l2-04-comping-rhythm',
      },
      {
        track: 'Jordu',
        listenFor: '마이너 ii-V-i 가 반복되는 이 곡에서, 솔로이스트가 V 화음 위에서 쓰는 **반음계적 음들**을 하나만 특정하라(b9 또는 #9 가 자주 들린다). 마이너 도미넌트 위에서 어떤 긴장음이 관용적인지를 이론이 아니라 빈도로 배우는 방법이다.',
        moduleId: 'm-l3-06-minor-harmony',
      },
    ],
    relatedModules: ['m-l3-03-approach-notes', 'm-l3-05-forward-motion', 'm-l3-06-minor-harmony', 'm-l4-02-transcription'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-transcription', 'rv-barry-harris'],
      reviewedAt: '2026-03-26',
      rubric: { accuracy: 4.9, terminology: 4.6, sequencing: 4.8, playability: 4.4, idiom: 5.0, integration: 4.7, assessability: 4.8, sourcing: 4.3 },
    },
  },

  {
    id: 'a-getz-gilberto',
    title: 'Getz/Gilberto',
    leader: '스탄 게츠 & 주앙 지우베르투 (Stan Getz & João Gilberto)',
    pianist: '안토니우 카를루스 조빔 (Antônio Carlos Jobim)',
    year: 1964,
    label: 'Verve',
    why: '보사노바는 재즈피아니스트에게 두 가지를 가르친다. 첫째, **어보이드 노트와 텐션의 실전 감각** — 조빔의 화성은 장9도·장7도·#11 이 멜로디와 충돌하지 않도록 정교하게 배치되어 있어, 코드 스케일 이론을 귀로 검증할 수 있는 가장 투명한 교재다. 둘째, **반주에서 손을 빼는 법** — 이 앨범에서 조빔의 피아노는 기타가 이미 화성과 리듬을 다 하고 있을 때 자신이 무엇을 하지 않아야 하는지를 보여준다. 화성은 풍부한데 연주는 얇은 상태. L3 학습자가 도달해야 할 목표가 정확히 이것이다.',
    tags: ['보사노바', '텐션', '어보이드 노트', '절제'],
    levelId: 'L3',
    priority: 2,
    trackNotes: [
      {
        track: 'The Girl from Ipanema',
        at: '브릿지(B섹션)',
        listenFor: 'A섹션은 한 조성 안에서 움직이지만 브릿지는 **조가 갑자기 멀어진다**. 그 순간을 정확히 찍고, 새 조의 I 화음이 무엇인지 귀로 추정해보라. 조성이 멀리 이동하는 브릿지는 L5 모달 인터체인지의 예고편이다.',
        moduleId: 'm-l2-06-form-navigation',
      },
      {
        track: 'Corcovado',
        listenFor: '멜로디의 지속음이 화음 위에서 **몇 도에 해당하는지** 한 곳만 특정하라. 조빔은 멜로디를 9도·13도 같은 텐션에 자주 놓는다. 같은 음을 유지한 채 밑의 화음만 바꾸면 그 음의 역할이 바뀐다 — 이 원리를 건반에서 직접 실험하라: 오른손으로 D를 계속 누른 채 왼손을 C∆7 → Bb∆7 → G-7 로 바꿔보라.',
        moduleId: 'm-l2-03-tensions',
      },
      {
        track: 'Desafinado',
        listenFor: '기타의 리듬 패턴을 **두 마디 단위로** 외워라. 그 패턴이 2마디마다 정확히 반복되는지 확인하면, 보사노바 컴핑이 자유로운 즉흥이 아니라 고정된 리듬 셀의 반복임을 알게 된다. 피아노로 옮길 때도 즉흥하지 말고 셀을 지켜라.',
        moduleId: 'm-l2-04-comping-rhythm',
      },
    ],
    relatedModules: ['m-l2-03-tensions', 'm-l2-04-comping-rhythm', 'm-l2-06-form-navigation', 'm-l3-01-chord-scales'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-contemporary'],
      reviewedAt: '2026-04-02',
      rubric: { accuracy: 4.8, terminology: 4.8, sequencing: 4.6, playability: 4.9, idiom: 4.9, integration: 4.7, assessability: 4.5, sourcing: 4.4 },
    },
  },
  /* ═══════════════════════ L4 — 비밥 어휘와 채보 ═══════════════════════ */
  {
    id: 'a-the-amazing-bud-powell-1',
    title: 'The Amazing Bud Powell, Vol. 1',
    leader: '버드 파월 (Bud Powell)',
    pianist: '버드 파월 (Bud Powell)',
    year: 1951,
    label: 'Blue Note',
    why: '1949년과 1951년 세션을 담은 이 음반은 재즈피아노가 관악기의 어휘를 완전히 흡수한 순간의 기록이다. 버드 파월 이전의 피아노는 화성 악기였고, 이후의 피아노는 **한 손으로 노래하는 악기**가 되었다. 오른손은 색소폰처럼 길게 이어지는 8분음표 라인을 뽑고, 왼손은 그 라인을 방해하지 않기 위해 3음·7음 두 음으로 축소된다. 오늘날 당신이 배우는 셸 보이싱과 싱글 라인 즉흥의 분업 구조가 여기서 표준화되었다. L4 채보 과제의 1순위 대상이며, 동시에 왜 그 분업이 필요한지에 대한 답이다.',
    tags: ['비밥', '싱글 라인', '좌수 셸', '채보'],
    levelId: 'L4',
    priority: 1,
    trackNotes: [
      {
        track: 'Bouncing with Bud',
        at: '파월 솔로 첫 코러스',
        listenFor: '왼손이 **몇 개의 음을 동시에 누르는지** 세라. 두 개다. 그리고 그 두 음이 언제 들어오는지 보면 규칙적인 박이 아니라 불규칙한 지점이다. 오른손 라인을 방해하지 않는 최소 개입 — 이것이 비밥 피아노의 좌수 원칙이다. 오늘 연습: 왼손을 3음·7음 두 음으로 고정하고 오른손 8분음표 라인을 한 코러스 유지하라.',
        moduleId: 'm-l1-02-shell-voicings',
      },
      {
        track: 'Un Poco Loco',
        listenFor: '이 곡의 반복되는 리듬 패턴과 피아노 라인이 **몇 박 주기로 어긋나는지** 세라. 파월은 정박 위에 얹히지 않는 프레이즈를 의도적으로 만든다. 리듬 변위를 이론으로 배우기 전에 이 트랙에서 "불편하지만 정확한" 소리를 귀에 새겨두라.',
        moduleId: 'm-l4-05-rhythmic-displacement',
      },
      {
        track: 'Dance of the Infidels',
        listenFor: '라인이 코드 변화 지점에서 **끊기는지 이어지는지** 확인하라. 이어진다. 파월은 코드가 바뀌어도 8분음표를 멈추지 않고, 대신 반음 어프로치로 다음 코드톤에 미끄러져 들어간다. 한 마디만 골라 정확히 받아써라 — 그 한 마디가 12키로 옮길 당신의 첫 비밥 어휘다.',
        moduleId: 'm-l4-01-bebop-scales',
      },
      {
        track: '52nd Street Theme',
        listenFor: '극단적으로 빠른 템포에서 **아티큘레이션**만 들어라. 어떤 음이 강조되고 어떤 음이 흘러가는가. 대개 업비트에 액센트가 놓인다. 같은 음렬이라도 액센트 위치가 바뀌면 재즈가 되거나 연습곡이 된다.',
        moduleId: 'm-l4-04-articulation',
      },
    ],
    relatedModules: ['m-l4-01-bebop-scales', 'm-l4-02-transcription', 'm-l4-04-articulation', 'm-l4-05-rhythmic-displacement', 'm-l1-02-shell-voicings'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-barry-harris', 'rv-transcription', 'rv-keyboard-technique'],
      reviewedAt: '2026-04-06',
      rubric: { accuracy: 4.7, terminology: 4.7, sequencing: 4.8, playability: 4.2, idiom: 5.0, integration: 4.8, assessability: 4.6, sourcing: 4.2 },
      comments: [
        {
          reviewerId: 'rv-keyboard-technique',
          issue: '학습자가 원 템포로 따라 치려다 손목 긴장과 부정확한 타건을 습관화할 위험이 있다.',
          resolution: '채보 과제는 50~60% 속도에서 시작하도록 명시하고, 청취 과제 자체는 속도와 무관한 관찰로 구성.',
          severity: 'blocker',
        },
      ],
    },
  },

  {
    id: 'a-monks-dream',
    title: "Monk's Dream",
    leader: '셀로니어스 몽크 쿼텟 (The Thelonious Monk Quartet)',
    pianist: '셀로니어스 몽크 (Thelonious Monk)',
    year: 1963,
    label: 'Columbia',
    why: '몽크는 "적게 치는 법"의 극단이다. 그러나 그 절제는 능력 부족이 아니라 **작곡가의 선택**이다. 이 앨범에서 몽크는 찰리 라우스의 솔로 뒤에서 종종 몇 마디씩 완전히 침묵하고, 다시 등장할 때는 예상 밖의 자리에 예상 밖의 음정(단2도, 증4도)을 던진다. L4 학습자에게 몽크가 필요한 이유는 비밥 어휘를 수집하는 단계에서 **어휘를 배치하는 문제**가 따로 존재한다는 것을 알려주기 때문이다. 또한 몽크의 왼손에는 스트라이드가 살아 있어, L7 좌수 전통으로 가는 다리 역할도 한다.',
    tags: ['밥', '여백', '불협 음정', '작곡가 피아노'],
    levelId: 'L4',
    priority: 1,
    trackNotes: [
      {
        track: "Monk's Dream",
        at: '테너 솔로 구간',
        listenFor: '몽크가 **연속으로 몇 마디를 쉬는지** 최대치를 재라. 네 마디 이상 비는 지점이 있다. 그리고 침묵 후 첫 화음이 어디에 놓이는지 보라 — 마디 첫 박이 아니다. 침묵은 쉬는 것이 아니라 다음 진입을 위한 준비다.',
        moduleId: 'm-l2-04-comping-rhythm',
      },
      {
        track: 'Bright Mississippi',
        listenFor: '이 곡은 블루스 형식이다. 12마디를 세면서 몽크의 솔로를 들어라. 그가 **테마의 동기를 솔로 안에서 재사용하는 지점**을 표시하라. 몽크는 즉흥 중에도 작곡을 버리지 않는다. 이것이 "릭 나열"과 "모티프 전개"의 차이다.',
        moduleId: 'm-l4-03-motivic-development',
      },
      {
        track: 'Just a Gigolo',
        listenFor: '짧은 솔로 피아노 연주다. 왼손이 **저음 루트 → 중음역 화음**을 오가는 스트라이드 구조인지 확인하라. 그리고 그 구조가 언제 깨지는지도. 몽크의 스트라이드는 규칙적이지 않아서 오히려 규칙을 드러낸다.',
        moduleId: 'm-l7-02-stride',
      },
    ],
    relatedModules: ['m-l2-04-comping-rhythm', 'm-l4-03-motivic-development', 'm-l4-06-blues-language', 'm-l7-02-stride'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-barry-harris', 'rv-pedagogy'],
      reviewedAt: '2026-04-09',
      rubric: { accuracy: 4.8, terminology: 4.5, sequencing: 4.6, playability: 4.7, idiom: 5.0, integration: 4.6, assessability: 4.7, sourcing: 4.2 },
    },
  },

  {
    id: 'a-brilliant-corners',
    title: 'Brilliant Corners',
    leader: '셀로니어스 몽크 (Thelonious Monk)',
    pianist: '셀로니어스 몽크 (Thelonious Monk)',
    year: 1957,
    label: 'Riverside',
    why: '몽크의 작곡이 가장 극단적으로 드러난 음반. 타이틀곡은 같은 주제를 두 배 빠르기로 교대 반복하도록 설계되어 있어, 연주자에게 폼 감각과 템포 전환을 동시에 요구한다. L4 학습자가 이 앨범에서 얻어야 할 것은 "어려운 곡"의 경험이 아니라, **작곡이 즉흥의 조건을 규정한다**는 인식이다. 진행이 이상하면 릭이 통하지 않고, 릭이 통하지 않으면 귀로 쳐야 한다. 동시에 "Pannonica"와 "I Surrender, Dear"는 몽크의 발라드 감각과 솔로 피아노 어법을 담고 있어 L7로 가는 연결점이 된다.',
    tags: ['밥', '작곡', '폼', '불협'],
    levelId: 'L4',
    priority: 2,
    trackNotes: [
      {
        track: 'Brilliant Corners',
        at: '테마 반복 구간',
        listenFor: '같은 선율이 **두 가지 템포로 번갈아** 제시된다. 느린 제시와 빠른 제시의 경계를 정확히 찍어라. 그리고 빠른 구간이 느린 구간의 정확히 두 배인지 귀로 검증하라. 메트릭 모듈레이션을 배우기 전에 만나는 가장 직관적인 예다.',
        moduleId: 'm-l6-05-odd-meters',
      },
      {
        track: 'Pannonica',
        listenFor: '멜로디 음과 그 아래 화음이 만드는 **가장 거친 음정 하나**를 찾아 특정하라. 몽크는 단2도와 증4도를 피하지 않는다. 그 음을 빼고 쳐보면 곡이 평범해진다 — 직접 해보라. 불협은 실수가 아니라 정체성이다.',
        moduleId: 'm-l5-03-upper-structures',
      },
      {
        track: 'I Surrender, Dear',
        listenFor: '몽크 혼자 연주하는 트랙이다. 왼손이 **루트를 짚는 순간과 화음을 던지는 순간의 시간 간격**을 재라. 스트라이드의 기본 구조(저음-화음 교대)가 있지만 간격이 일정하지 않다. 루바토 솔로 피아노에서 시간을 늘리고 줄이는 실제 사례다.',
        moduleId: 'm-l7-01-solo-piano',
      },
    ],
    relatedModules: ['m-l4-03-motivic-development', 'm-l5-03-upper-structures', 'm-l6-05-odd-meters', 'm-l7-01-solo-piano'],
    review: {
      status: 'faculty-pending',
      reviewers: ['rv-barry-harris', 'rv-contemporary'],
      reviewedAt: '2026-04-12',
      rubric: { accuracy: 4.7, terminology: 4.4, sequencing: 4.2, playability: 4.0, idiom: 5.0, integration: 4.5, assessability: 4.3, sourcing: 4.1 },
      comments: [
        {
          reviewerId: 'rv-contemporary',
          issue: 'L4 배치가 난이도상 이르다는 지적.',
          resolution: '청취 과제를 "연주 모방"이 아니라 "구조 판정"으로 한정하고 priority 를 2로 낮춤.',
          severity: 'major',
        },
      ],
    },
  },

  /* ═══════════════════════ L5 — 리하모니제이션 ═══════════════════════ */
  {
    id: 'a-giant-steps',
    title: 'Giant Steps',
    leader: '존 콜트레인 (John Coltrane)',
    pianist: '토미 플래너건 (Tommy Flanagan) — "Naima" 는 윈턴 켈리',
    year: 1960,
    label: 'Atlantic',
    why: '콜트레인 체인지를 배우는 학습자가 반드시 확인해야 할 것은 이론이 아니라 **그 진행이 피아니스트에게 실제로 무엇을 요구하는가**다. 이 앨범의 타이틀곡에서 토미 플래너건은 준비 시간이 거의 없는 상태로 낯선 진행을 만났고, 그 결과 솔로에서 라인이 끊기는 순간이 들린다. 이것은 흠이 아니라 교재다 — 장3도 순환 위에서는 기존 어휘가 작동하지 않으며, 미리 만들어둔 세 개의 조 안에서 움직이는 패턴이 없으면 손이 멈춘다는 사실을 증명하는 실물 증거이기 때문이다. 동시에 "Naima"는 지속 저음 위 화성 이동의 교과서다.',
    tags: ['콜트레인 체인지', '장3도 순환', '페달 포인트', '어려운 진행'],
    levelId: 'L5',
    priority: 1,
    trackNotes: [
      {
        track: 'Giant Steps',
        at: '피아노 솔로 시작 직후',
        listenFor: '플래너건의 라인이 **끊기는 지점**을 찾아 표시하라. 비난하려는 것이 아니라, 그 지점이 곧 조가 갑자기 장3도 이동하는 자리임을 확인하기 위해서다. 조가 바뀌는 속도가 손의 반응 속도를 넘어서는 순간을 귀로 목격하는 것이 이 과제의 목적이다.',
        moduleId: 'm-l5-05-coltrane-changes',
      },
      {
        track: 'Giant Steps',
        at: '콜트레인 솔로',
        listenFor: '콜트레인이 각 I 화음에 도착할 때 쓰는 **음형이 반복되는지** 확인하라. 반복된다(1-2-3-5 계열의 짧은 셀). 세 개의 조를 순환하는 진행에서는 어휘를 늘리는 것이 아니라 **하나의 셀을 세 조로 이조하는 것**이 해법이다. 오늘 과제: 1-2-3-5 를 B·G·Eb 세 조에서만 완벽히 손에 넣어라.',
        moduleId: 'm-l3-04-digital-patterns',
      },
      {
        track: 'Naima',
        listenFor: '베이스가 **같은 음을 유지하는 동안** 위 화성이 몇 번 바뀌는지 세라. 페달 포인트 위 화성 이동이다. 건반에서 왼손 새끼손가락으로 Eb 을 계속 누른 채 오른손으로 화음을 바꿔보라 — 리하모니제이션의 가장 저렴하고 가장 효과적인 도구다.',
        moduleId: 'm-l5-06-reharm-ballad',
      },
      {
        track: 'Mr. P.C.',
        listenFor: '마이너 블루스다. 12마디를 세면서 피아노 컴핑이 **V 화음에서 어떤 텐션을 쓰는지** 하나만 특정하라. 마이너 블루스의 도미넌트 색채를 귀로 수집하는 훈련이다.',
        moduleId: 'm-l3-06-minor-harmony',
      },
    ],
    relatedModules: ['m-l5-05-coltrane-changes', 'm-l5-06-reharm-ballad', 'm-l3-04-digital-patterns', 'm-l3-06-minor-harmony'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-transcription'],
      reviewedAt: '2026-04-16',
      rubric: { accuracy: 4.9, terminology: 4.8, sequencing: 4.7, playability: 4.3, idiom: 4.9, integration: 4.9, assessability: 4.8, sourcing: 4.6 },
      comments: [
        {
          reviewerId: 'rv-transcription',
          issue: '피아니스트의 연주를 "실패 사례"로 소비하는 서술은 부적절하다.',
          resolution: '기술적 난이도의 증거로 기술하되 평가적 표현을 제거하고, 해법(셀 이조)을 같은 트랙 노트에 병기.',
          severity: 'major',
        },
      ],
    },
  },

  {
    id: 'a-tony-bennett-bill-evans',
    title: 'The Tony Bennett / Bill Evans Album',
    leader: '토니 베넷 & 빌 에반스 (Tony Bennett & Bill Evans)',
    pianist: '빌 에반스 (Bill Evans)',
    year: 1975,
    label: 'Fantasy',
    why: '보컬 반주는 재즈피아니스트가 실제로 가장 많이 하게 될 일인데, 정작 교육에서는 거의 다루지 않는다. 이 듀오 앨범은 그 공백을 메우는 표준 교재다. 베이스도 드럼도 없으므로 에반스는 **베이스 라인·화성·대선율·타임을 혼자 감당**해야 하고, 동시에 가수의 호흡과 가사의 문장 구조를 방해하면 안 된다. L5에서 이 앨범을 듣는 이유는 리하모니제이션의 목적을 다시 정의하기 위해서다 — 화성을 바꾸는 것은 유식함의 과시가 아니라, 같은 가사를 다른 감정으로 들리게 만드는 수단이다.',
    tags: ['보컬 반주', '듀오', '리하모니제이션', '루바토'],
    levelId: 'L5',
    priority: 1,
    trackNotes: [
      {
        track: 'Young and Foolish',
        listenFor: '가수가 **한 문장을 끝내고 숨을 쉬는 자리**마다 에반스가 무엇을 하는지 적어라. 거의 항상 그 자리에서만 움직인다(짧은 대선율, 화성 재배치). 가사 중간에 들어오는 경우가 몇 번인지 세어보면 열 손가락을 넘지 않을 것이다. 보컬 반주의 규칙 1조가 이것이다.',
        moduleId: 'm-l7-04-trio-comping',
      },
      {
        track: 'But Beautiful',
        listenFor: '같은 멜로디 음이 반복되는 구간에서 **밑의 화음이 바뀌는 지점**을 찾아라. 멜로디는 그대로인데 색이 변한다. 그 자리에서 원래 코드가 무엇이었을지 추정하고, 에반스가 무엇으로 바꿨는지 둘 다 건반에서 쳐보라. 리하모니제이션 학습의 가장 빠른 경로는 원본과 변형을 나란히 치는 것이다.',
        moduleId: 'm-l5-06-reharm-ballad',
      },
      {
        track: 'Some Other Time',
        listenFor: '왼손이 **베이스 역할을 하는 순간**과 **화성 역할을 하는 순간**을 구분해 표시하라. 베이시스트가 없는 듀오에서 피아노는 두 역할을 시간차로 나눠 맡는다. 동시에 다 하려다 손이 엉키는 학습자에게 필요한 것은 손가락이 아니라 이 분업 감각이다.',
        moduleId: 'm-l7-01-solo-piano',
      },
      {
        track: 'Waltz for Debby',
        listenFor: '에반스 자신의 곡을 가사와 함께 연주한다. 트리오 버전과 비교했을 때 **템포·밀도·즉흥의 양**이 어떻게 줄었는지 구체적으로 적어라. 같은 곡이라도 가수가 있으면 피아니스트의 지분은 줄어든다. 그 지분 조정이 프로의 일이다.',
        moduleId: 'm-l7-06-arrangement',
      },
    ],
    relatedModules: ['m-l5-06-reharm-ballad', 'm-l7-01-solo-piano', 'm-l7-04-trio-comping', 'm-l7-06-arrangement'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-pedagogy', 'rv-chord-scale'],
      reviewedAt: '2026-04-20',
      rubric: { accuracy: 4.7, terminology: 4.6, sequencing: 4.8, playability: 4.6, idiom: 4.9, integration: 4.9, assessability: 4.7, sourcing: 4.2 },
    },
  },

  {
    id: 'a-elis-e-tom',
    title: 'Elis & Tom',
    leader: '엘리스 레지나 & 안토니우 카를루스 조빔 (Elis Regina & Antônio Carlos Jobim)',
    pianist: '안토니우 카를루스 조빔 (Antônio Carlos Jobim)',
    year: 1974,
    label: 'Philips',
    why: '브라질 화성은 재즈 리하모니제이션 어휘의 거대한 저수지다. 조빔의 진행은 기능화성의 논리를 따르면서도 **반음계적 저음 하행**과 **모달 인터체인지**를 상습적으로 사용해, 같은 자리를 여러 번 다른 색으로 지나간다. 게다가 이 앨범에서는 엘리스 레지나라는 압도적인 가수가 있어, 화성이 아무리 정교해도 반주는 얇아야 한다는 원칙이 동시에 관철된다. L5 학습자에게 이 앨범은 "리하모니제이션을 배웠는데 어디에 쓰지?"라는 질문의 답이다.',
    tags: ['브라질', '반음계 하행', '모달 인터체인지', '보컬 반주'],
    levelId: 'L5',
    priority: 2,
    trackNotes: [
      {
        track: 'Águas de Março',
        listenFor: '저음이 **반음씩 계속 내려가는 구간**을 찾아 몇 마디 지속되는지 세라. 위 화성은 그 하행 저음을 지지하기 위해 계속 재해석된다. 건반에서 왼손으로 반음 하행 베이스를 만들고, 오른손으로 그 위에 맞는 화음을 얹는 연습으로 즉시 옮겨라 — 발라드 리하모니제이션의 핵심 기술이다.',
        moduleId: 'm-l5-06-reharm-ballad',
      },
      {
        track: 'Corcovado',
        listenFor: '장조 곡인데 어느 순간 **빌려온 마이너 색채**가 들어온다. 그 지점을 찍고, 그 화음이 어느 조에서 빌려온 것인지 추정하라. 모달 인터체인지를 이론으로 배우기 전에 소리로 표본을 모아두면 학습 속도가 달라진다.',
        moduleId: 'm-l5-02-modal-interchange',
      },
      {
        track: 'Triste',
        listenFor: '조빔의 컴핑 리듬 셀을 두 마디 단위로 외우고, 가수의 프레이즈와 **어긋나는 지점이 있는지** 확인하라. 없다. 브라질 반주의 리듬은 고정되어 있지만 그 고정된 셀이 가사의 리듬과 정확히 맞물리도록 배치된다.',
        moduleId: 'm-l2-04-comping-rhythm',
      },
    ],
    relatedModules: ['m-l5-02-modal-interchange', 'm-l5-06-reharm-ballad', 'm-l2-04-comping-rhythm', 'm-l2-03-tensions'],
    review: {
      status: 'faculty-pending',
      reviewers: ['rv-contemporary', 'rv-chord-scale'],
      reviewedAt: '2026-04-24',
      rubric: { accuracy: 4.6, terminology: 4.5, sequencing: 4.6, playability: 4.7, idiom: 5.0, integration: 4.6, assessability: 4.4, sourcing: 4.0 },
    },
  },

  /* ═══════════════════════ L6 — 모달·컨템포러리 ═══════════════════════ */
  {
    id: 'a-kind-of-blue',
    title: 'Kind of Blue',
    leader: '마일스 데이비스 (Miles Davis)',
    pianist: '빌 에반스 (Bill Evans) — "Freddie Freeloader" 는 윈턴 켈리',
    year: 1959,
    label: 'Columbia',
    why: '재즈피아니스트에게 이 앨범이 필수인 이유는 유명해서가 아니라, **화성이 느려지면 피아노가 무엇을 해야 하는가**라는 질문이 여기서 처음 공개적으로 제기되었기 때문이다. 코드가 마디마다 바뀔 때 피아니스트는 진행을 따라가는 것만으로 바쁘다. 그러나 한 스케일이 8마디, 16마디 지속되면 따라갈 것이 없어지고, 그때부터 보이싱의 **모양**과 컴핑의 **리듬**이 유일한 재료가 된다. 빌 에반스의 4도 겹침 보이싱, 윈턴 켈리의 블루스 감각, 그리고 두 사람의 완전히 다른 접근을 한 앨범 안에서 비교할 수 있다는 점에서 L6의 출발점이자 기준점이다.',
    tags: ['모달', '쿼탈 보이싱', '여백', '정적 화성'],
    levelId: 'L6',
    priority: 1,
    trackNotes: [
      {
        track: 'So What',
        at: '테마 제시부(피아노 응답 화음)',
        listenFor: '피아노가 응답하는 화음의 **음 사이 간격이 3도인지 4도인지** 귀로 판정하라. 4도다. 그 자리에서 건반에 D-G-C-F 를 쌓고 맨 위에 3도(A)를 얹어보라 — 이것이 이른바 So What 보이싱이다. 그다음 같은 모양을 반음 위로 밀어 Eb 위에서도 쳐보라. 모양 하나를 평행 이동하는 것이 모달 컴핑의 기본 동작이다.',
        moduleId: 'm-l6-02-quartal-voicings',
      },
      {
        track: 'So What',
        at: '솔로 구간 전체',
        listenFor: '화성이 **몇 마디마다 바뀌는지** 세라(16마디 단위다). 그리고 그 긴 구간 동안 피아노가 지루해지지 않기 위해 무엇을 바꾸는지 적어라 — 화음이 아니라 리듬과 음역이다. 오늘 과제: D 도리안 한 스케일만 쓰고 리듬만 바꿔 16마디를 컴핑하라.',
        moduleId: 'm-l6-01-modal-playing',
      },
      {
        track: 'Blue in Green',
        listenFor: '이 곡은 짧은 순환 구조인데 몇 마디짜리인지 귀로는 잘 세어지지 않는다. **한 바퀴가 몇 마디인지** 반복 재생하며 확정하라(10마디다). 폼이 8·12·16이 아닐 수도 있다는 것을 처음 경험하는 트랙이다.',
        moduleId: 'm-l2-06-form-navigation',
      },
      {
        track: 'Freddie Freeloader',
        listenFor: '이 트랙만 피아니스트가 다르다. 앞 트랙들과 **컴핑의 밀도·리듬 꼴이 어떻게 달라지는지** 두 문장으로 적어라. 같은 밴드, 같은 날, 같은 블루스인데 피아노가 바뀌면 음악의 무게중심이 이동한다. 피아니스트가 밴드에서 차지하는 비중을 체감하는 가장 확실한 실험이다.',
        moduleId: 'm-l1-05-blues-form',
      },
    ],
    relatedModules: ['m-l6-01-modal-playing', 'm-l6-02-quartal-voicings', 'm-l2-04-comping-rhythm', 'm-l2-06-form-navigation'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-contemporary', 'rv-pedagogy'],
      reviewedAt: '2026-02-10',
      rubric: { accuracy: 4.9, terminology: 4.9, sequencing: 4.8, playability: 4.8, idiom: 5.0, integration: 5.0, assessability: 4.8, sourcing: 4.7 },
      comments: [
        {
          reviewerId: 'rv-chord-scale',
          issue: '"So What 보이싱"을 순수 4도 화음으로 설명하면 최상성부의 3도 간격이 누락된다.',
          resolution: '청취 과제에 4도 3개 + 최상단 3도라는 실제 구조를 건반 동작으로 명시.',
          severity: 'major',
        },
      ],
    },
  },

  {
    id: 'a-maiden-voyage',
    title: 'Maiden Voyage',
    leader: '허비 행콕 (Herbie Hancock)',
    pianist: '허비 행콕 (Herbie Hancock)',
    year: 1965,
    label: 'Blue Note',
    why: '모달 어법을 배운 학습자가 다음으로 만나야 할 것은 **서스펜디드 화성**이다. 이 앨범의 타이틀곡은 4도 계열 서스 화음이 느리게 이동하며, 3음이 명확하지 않기 때문에 장·단조의 소속이 모호해진다. 그 모호함이 곧 이 음악의 색이다. 행콕의 보이싱은 얇고 개방적이며, 같은 화음을 반복할 때마다 미세하게 성부를 재배치한다. L6 학습자는 여기서 "무슨 스케일을 쓰지?"라는 질문에서 **"이 화음을 어떤 모양으로 잡을까?"**라는 질문으로 이동해야 한다.',
    tags: ['모달', '서스 화성', '컨템포러리 보이싱', '공간감'],
    levelId: 'L6',
    priority: 1,
    trackNotes: [
      {
        track: 'Maiden Voyage',
        at: '테마 전체',
        listenFor: '각 화음에서 **장3도가 들리는지** 판정하라. 들리지 않는다. 3음이 빠지고 4도(sus)가 그 자리를 차지한다. 건반에서 D 위에 G-C-F 를 쌓아보고, 다시 F# 을 넣어 장3도를 만들어 비교하라. 한 음이 빠졌을 뿐인데 곡의 정체성이 사라지는 것을 확인하는 것이 과제다.',
        moduleId: 'm-l6-06-contemporary-voicings',
      },
      {
        track: 'Dolphin Dance',
        listenFor: '이 곡은 모달처럼 들리지만 실제로는 조성이 계속 이동한다. **"집"으로 돌아왔다고 느껴지는 지점**을 표시하며 끝까지 들어라. 예상보다 훨씬 늦게 온다. 해결을 지연시키는 작곡 기법을 귀로 체감하는 훈련이다.',
        moduleId: 'm-l2-06-form-navigation',
      },
      {
        track: 'The Eye of the Hurricane',
        listenFor: '빠른 템포에서 행콕의 왼손 보이싱이 **몇 개의 음으로 구성되는지** 세라. 대개 3~4음이고 넓게 벌어져 있다. 빠른 곡에서 두꺼운 보이싱은 소리가 뭉갠다. 템포가 올라갈수록 음을 빼는 규칙을 여기서 확인하라.',
        moduleId: 'm-l6-06-contemporary-voicings',
      },
    ],
    relatedModules: ['m-l6-01-modal-playing', 'm-l6-06-contemporary-voicings', 'm-l6-02-quartal-voicings', 'm-l2-06-form-navigation'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-contemporary', 'rv-chord-scale'],
      reviewedAt: '2026-04-28',
      rubric: { accuracy: 4.9, terminology: 4.8, sequencing: 4.9, playability: 4.7, idiom: 5.0, integration: 4.8, assessability: 4.7, sourcing: 4.5 },
    },
  },

  {
    id: 'a-the-real-mccoy',
    title: 'The Real McCoy',
    leader: '맥코이 타이너 (McCoy Tyner)',
    pianist: '맥코이 타이너 (McCoy Tyner)',
    year: 1967,
    label: 'Blue Note',
    why: '빌 에반스가 모달 어법의 "여백" 쪽 극단이라면 맥코이 타이너는 **밀도** 쪽 극단이다. 왼손은 루트와 5도를 넓게 벌려 저음을 고정하고, 오른손은 4도로 쌓은 화음과 펜타토닉 라인을 쏟아붓는다. 같은 모달 상황에서 정반대의 해법이 존재한다는 것을 학습자가 직접 비교하는 순간, 모달 연주는 규칙이 아니라 선택의 문제가 된다. 또한 타이너의 좌수 5도 개방 보이싱은 트리오·쿼텟에서 베이스가 있어도 무너지지 않는 몇 안 되는 저음 구조라, L6 실전에서 즉시 쓸 수 있다.',
    tags: ['모달', '쿼탈', '펜타토닉', '밀도'],
    levelId: 'L6',
    priority: 1,
    trackNotes: [
      {
        track: 'Passion Dance',
        at: '피아노 솔로',
        listenFor: '오른손 라인에서 **반음이 몇 번 나오는지** 세어보라. 거의 없다. 타이너는 5음 음계(펜타토닉) 재료를 주로 쓴다. 그 자리에서 F 펜타토닉만으로 한 코러스를 연주해보라 — 음을 줄였는데 소리가 더 강해지는 경험을 해야 다음 단계로 간다.',
        moduleId: 'm-l6-03-pentatonic-superimposition',
      },
      {
        track: 'Passion Dance',
        at: '테마 반주',
        listenFor: '왼손의 **최저음과 그 위 음의 간격**을 판정하라. 5도다(때로 4도). 3도가 아니다. 건반에서 F-C 를 왼손으로 잡고 오른손으로 4도 겹침을 얹어보라. 저음이 5도로 열려 있으면 위에 무엇을 얹어도 탁해지지 않는다.',
        moduleId: 'm-l6-02-quartal-voicings',
      },
      {
        track: 'Search for Peace',
        listenFor: '느린 곡에서 타이너의 밀도가 **어떻게 달라지는지** 확인하라. 같은 어휘인데 양이 줄고 지속이 길어진다. 스타일은 어휘가 아니라 어휘를 분배하는 방식이라는 증거다.',
        moduleId: 'm-l6-01-modal-playing',
      },
      {
        track: 'Blues on the Corner',
        listenFor: '모달 어휘로 연주하는 블루스다. 12마디 형식은 그대로인데 **보이싱이 전통적 블루스와 어떻게 다른지** 두 문장으로 적어라. 오래된 형식에 새 어휘를 얹는 것이 L6 이후 당신이 평생 하게 될 작업이다.',
        moduleId: 'm-l4-06-blues-language',
      },
    ],
    relatedModules: ['m-l6-01-modal-playing', 'm-l6-02-quartal-voicings', 'm-l6-03-pentatonic-superimposition', 'm-l4-06-blues-language'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-contemporary', 'rv-keyboard-technique'],
      reviewedAt: '2026-05-02',
      rubric: { accuracy: 4.8, terminology: 4.8, sequencing: 4.7, playability: 4.5, idiom: 5.0, integration: 4.7, assessability: 4.6, sourcing: 4.3 },
      comments: [
        {
          reviewerId: 'rv-keyboard-technique',
          issue: '좌수 5도 개방 보이싱을 넓게 벌려 장시간 반복하면 손 크기가 작은 학습자에게 무리가 간다.',
          resolution: '옥타브 대체 운지(5도를 한 옥타브 좁혀 잡기) 안내를 관련 모듈에 연결하고, 청취 과제는 관찰 중심으로 유지.',
          severity: 'major',
        },
      ],
    },
  },

  {
    id: 'a-empyrean-isles',
    title: 'Empyrean Isles',
    leader: '허비 행콕 (Herbie Hancock)',
    pianist: '허비 행콕 (Herbie Hancock)',
    year: 1964,
    label: 'Blue Note',
    why: '"Cantaloupe Island"은 재즈 입문자가 가장 먼저 외우는 모달 뱀프이고, 동시에 가장 많이 잘못 연주되는 곡이다. 대부분의 학습자는 이 곡을 세 코드의 반복으로만 보고 지루하게 만든다. 행콕이 실제로 하는 일은 **같은 화음을 계속 다르게 놓는 것** — 리듬 꼴, 보이싱의 전위, 음역, 그리고 침묵이다. 또한 이 앨범의 피아노 트리오+코넷 편성은 화성 악기가 하나뿐이어서 피아노의 선택이 그대로 노출된다. L6 학습자가 자기 연주를 점검할 거울로 쓰기 좋다.',
    tags: ['모달', '펑키 뱀프', '컴핑 리듬', '포스트밥'],
    levelId: 'L6',
    priority: 2,
    trackNotes: [
      {
        track: 'Cantaloupe Island',
        at: '도입 뱀프 반복',
        listenFor: '같은 화음이 반복되는 동안 **리듬 꼴이 몇 번 바뀌는지** 세라. 그리고 완전히 똑같이 두 번 반복되는 경우가 있는지 찾아보라 — 거의 없다. 오늘 과제: 한 코드만 잡고 4마디를 리듬만 바꿔 8번 반복하되, 같은 리듬을 두 번 쓰지 마라.',
        moduleId: 'm-l6-01-modal-playing',
      },
      {
        track: 'One Finger Snap',
        listenFor: '빠른 템포에서 행콕의 컴핑이 **드럼과 어느 정도 일치하는지** 들어라. 종종 드럼의 액센트와 정확히 겹친다. 컴핑은 화성 정보만이 아니라 리듬 파트너십이기도 하다.',
        moduleId: 'm-l7-05-interplay',
      },
      {
        track: 'The Egg',
        listenFor: '형식이 모호한 긴 곡이다. **어디서 한 바퀴가 끝나는지** 스스로 판정하고, 그 근거를 적어라(대개 저음 패턴의 재시작이다). 폼이 명시되지 않은 음악에서 방향을 잃지 않는 감각은 훈련으로만 생긴다.',
        moduleId: 'm-l2-06-form-navigation',
      },
    ],
    relatedModules: ['m-l6-01-modal-playing', 'm-l2-04-comping-rhythm', 'm-l2-06-form-navigation', 'm-l7-05-interplay'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-contemporary', 'rv-pedagogy'],
      reviewedAt: '2026-05-06',
      rubric: { accuracy: 4.8, terminology: 4.6, sequencing: 4.7, playability: 4.9, idiom: 4.9, integration: 4.7, assessability: 4.8, sourcing: 4.2 },
    },
  },

  {
    id: 'a-now-hes-sings',
    title: 'Now He Sings, Now He Sobs',
    leader: '칙 코리아 (Chick Corea)',
    pianist: '칙 코리아 (Chick Corea)',
    year: 1968,
    label: 'Solid State',
    why: '피아노 트리오가 "피아노 + 반주"에서 **세 개의 대등한 목소리**로 완전히 이행한 지점을 보여주는 음반. 로이 헤인스의 드럼은 반주가 아니라 대화 상대이고, 코리아는 프레이즈를 끝내지 않은 채 드럼에게 넘기고 다시 받아온다. 동시에 코리아의 어휘에는 스페인·라틴 색채와 펜타토닉·인터발릭 재료가 이미 정리되어 있어, L6 컨템포러리 어휘의 원류로 기능한다. L7 인터플레이 모듈로 넘어가기 전 반드시 통과해야 할 관문이다.',
    tags: ['트리오', '인터플레이', '인터발릭', '포스트밥'],
    levelId: 'L6',
    priority: 2,
    trackNotes: [
      {
        track: 'Matrix',
        at: '피아노 솔로',
        listenFor: '코리아의 라인에서 **도약(3도 이상)이 순차진행보다 많은 구간**을 찾아라. 비밥 라인은 대부분 순차인데 코리아는 넓은 음정을 섞는다. 한 프레이즈만 골라 음정 이름으로 적어보면(예: 4도 상행-2도 하행-5도 상행) 인터발릭 어법의 구조가 드러난다.',
        moduleId: 'm-l6-04-intervallic',
      },
      {
        track: 'Windows',
        listenFor: '3박자 곡이다. 그런데 프레이즈가 3박 단위로 떨어지지 않는 지점이 있다. **프레이즈 시작점이 마디 첫 박이 아닌 경우를 세라.** 변박을 배우기 전에 3박 안에서 먼저 흔들려봐야 한다.',
        moduleId: 'm-l6-05-odd-meters',
      },
      {
        track: 'Now He Sings, Now He Sobs',
        listenFor: '피아노와 드럼이 **서로의 프레이즈를 이어받는 지점**을 표시하라. 누가 먼저 시작했는지 판정이 어려운 구간이 나온다. 그것이 인터플레이의 도착점이다. 당신의 트리오 연습에서 이 판정 불가 구간을 한 번이라도 만드는 것이 이번 학기 목표다.',
        moduleId: 'm-l7-05-interplay',
      },
    ],
    relatedModules: ['m-l6-04-intervallic', 'm-l6-05-odd-meters', 'm-l7-05-interplay', 'm-l6-03-pentatonic-superimposition'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-contemporary', 'rv-transcription'],
      reviewedAt: '2026-05-09',
      rubric: { accuracy: 4.7, terminology: 4.7, sequencing: 4.6, playability: 4.3, idiom: 4.9, integration: 4.8, assessability: 4.6, sourcing: 4.2 },
    },
  },

  {
    id: 'a-point-of-departure',
    title: 'Point of Departure',
    leader: '앤드류 힐 (Andrew Hill)',
    pianist: '앤드류 힐 (Andrew Hill)',
    year: 1964,
    label: 'Blue Note',
    why: '아방가르드를 "아무렇게나 치는 것"으로 오해하는 학습자에게 앤드류 힐은 가장 효과적인 반증이다. 힐의 음악은 조성이 흐릿하지만 구조는 엄격하다 — 동기가 있고, 형식이 있고, 앙상블 지시가 있다. 피아니스트에게 이 앨범이 필요한 이유는 **기능화성이 작동하지 않는 상황에서도 연주를 조직하는 방법**이 존재한다는 것을 증명하기 때문이다. 코드 심볼이 애매할 때 손이 멈추는 학습자는, 자신이 화성에 의존한 것이 아니라 화성 이름에 의존했음을 여기서 깨닫는다.',
    tags: ['아방가르드', '포스트밥', '모호한 조성', '구조'],
    levelId: 'L6',
    priority: 2,
    trackNotes: [
      {
        track: 'Refuge',
        listenFor: '조성이 흐릿한데도 **한 음이 중심처럼 반복되는지** 찾아보라. 있다. 기능화성 없이도 중심음은 만들어진다. 건반에서 한 음을 정하고, 그 음으로 계속 돌아오는 규칙만 지키며 3분간 자유롭게 즉흥해보라 — 조성 없이 조직하는 첫 실험이다.',
        moduleId: 'm-l6-01-modal-playing',
      },
      {
        track: 'New Monastery',
        listenFor: '테마의 동기가 **관악과 피아노 사이에서 어떻게 옮겨다니는지** 추적하라. 힐은 같은 재료를 악기를 바꿔가며 재배치한다. 아방가르드의 재료가 무작위가 아니라 편집된 것임을 확인하는 과제다.',
        moduleId: 'm-l4-03-motivic-development',
      },
      {
        track: 'Dedication',
        listenFor: '힐의 보이싱에서 **가장 자주 나오는 음정**을 하나만 특정하라(2도와 4도가 지배적이다). 3도 쌓기를 버리면 화음의 이름은 애매해지지만 색은 분명해진다. 오늘 과제: 왼손에 장2도를 포함한 3음 덩어리를 만들고 그것만으로 8마디를 컴핑하라.',
        moduleId: 'm-l6-06-contemporary-voicings',
      },
    ],
    relatedModules: ['m-l6-01-modal-playing', 'm-l6-04-intervallic', 'm-l6-06-contemporary-voicings', 'm-l4-03-motivic-development'],
    review: {
      status: 'faculty-pending',
      reviewers: ['rv-contemporary'],
      reviewedAt: '2026-05-13',
      rubric: { accuracy: 4.6, terminology: 4.4, sequencing: 4.3, playability: 4.2, idiom: 4.9, integration: 4.4, assessability: 4.3, sourcing: 4.0 },
      comments: [
        {
          reviewerId: 'rv-contemporary',
          issue: '아방가르드 항목이 청취 과제 없이 "열린 태도" 권고로 끝나면 학습 효과가 없다.',
          resolution: '중심음 찾기·동기 추적·음정 특정이라는 세 가지 판정 가능한 과제로 전면 교체.',
          severity: 'blocker',
        },
      ],
    },
  },

  {
    id: 'a-invisible-cinema',
    title: 'Invisible Cinema',
    leader: '아론 파크스 (Aaron Parks)',
    pianist: '아론 파크스 (Aaron Parks)',
    year: 2008,
    label: 'Blue Note',
    why: '2000년대 이후 재즈피아노 어법의 대표적 표본. 록·인디의 화성 감각(슬래시 화음, 지속 저음, 반복 모티프)과 재즈의 즉흥 구조가 결합되어 있고, 무엇보다 **보이싱이 얇고 넓다**. 파크스는 텐션을 층층이 쌓는 대신 3~4음을 넓은 간격으로 배치해 공간을 만든다. L6 학습자가 "요즘 소리"를 내고 싶을 때 실제로 필요한 것은 새 이론이 아니라 이 배치 감각이다. 또한 곡의 구조가 헤드-솔로-헤드에서 벗어나 섹션 단위로 전개되므로, L8 작곡 모듈의 선행 청취로도 기능한다.',
    tags: ['컨템포러리', '슬래시 화성', '넓은 보이싱', '작곡적 구조'],
    levelId: 'L6',
    priority: 2,
    trackNotes: [
      {
        track: 'Peaceful Warrior',
        listenFor: '왼손 최저음과 오른손 화음이 **서로 다른 조성을 가리키는 순간**을 찾아라. 저음은 한 음을 유지하는데 위 화음이 이동하는 슬래시 구조다. 건반에서 왼손 G 를 유지한 채 오른손으로 F 계열·Eb 계열 트라이어드를 번갈아 얹어보라. 이 한 가지로 당신의 소리는 즉시 2000년대로 이동한다.',
        moduleId: 'm-l6-06-contemporary-voicings',
      },
      {
        track: 'Nemesis',
        listenFor: '한 마디 안의 박 수를 세라. 4박이 아닌 구간이 있다. **몇 박인지 확정될 때까지** 반복 재생하라. 변박을 세는 능력은 이론이 아니라 반복 청취로만 생긴다.',
        moduleId: 'm-l6-05-odd-meters',
      },
      {
        track: 'Travelers',
        listenFor: '같은 화성 패턴이 곡 전체에서 반복되는 동안 **텍스처가 몇 단계로 커지는지** 세라. 파크스는 화성을 바꾸지 않고 밀도만으로 형식을 만든다. 솔로가 길어질 때 무엇을 늘려야 하는지에 대한 실물 답안이다.',
        moduleId: 'm-l7-06-arrangement',
      },
    ],
    relatedModules: ['m-l6-06-contemporary-voicings', 'm-l6-05-odd-meters', 'm-l7-06-arrangement', 'm-l8-02-composition'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-contemporary', 'rv-pedagogy'],
      reviewedAt: '2026-05-17',
      rubric: { accuracy: 4.7, terminology: 4.7, sequencing: 4.6, playability: 4.5, idiom: 4.9, integration: 4.6, assessability: 4.6, sourcing: 4.1 },
    },
  },

  {
    id: 'a-mockroot',
    title: 'Mockroot',
    leader: '티그란 하마시안 (Tigran Hamasyan)',
    pianist: '티그란 하마시안 (Tigran Hamasyan)',
    year: 2015,
    label: 'Nonesuch',
    why: '아르메니아 민속 선법과 리듬, 프로그레시브 록의 박자 구조, 그리고 재즈의 즉흥이 한 연주자 안에서 통합된 사례. 이 앨범이 L6 커리큘럼에 필요한 이유는 **변박을 "어려운 기술"이 아니라 자연스러운 모국어처럼 다루는 연주**를 들려주기 때문이다. 하마시안의 리듬은 세기 어렵지만 셀 수 있다. 그리고 세어보는 순간, 복잡해 보이던 것이 짧은 주기의 반복임이 드러난다. 재즈의 지역적 확장이 어떤 형태로 가능한지에 대한 동시대의 답이기도 하다.',
    tags: ['변박', '민속 선법', '컨템포러리', '리듬 셀'],
    levelId: 'L6',
    priority: 2,
    trackNotes: [
      {
        track: 'To Love',
        listenFor: '느린 곡이다. **한 주기가 몇 박인지** 손으로 두드리며 확정하라. 4박이나 3박이 아니다. 주기를 찾고 나면 그 위에서 멜로디가 어떻게 배치되는지가 들리기 시작한다. 주기를 못 찾으면 아무것도 들리지 않는다.',
        moduleId: 'm-l6-05-odd-meters',
      },
      {
        track: 'Kars 1',
        listenFor: '반복되는 리듬 패턴을 **박수로 따라 칠 수 있을 때까지** 반복하라. 대개 5 또는 7 계열의 짧은 셀이다. 셀을 손에 넣은 뒤, 그 셀 위에서 왼손 화음을 한 번만 놓아보라. 변박 연주의 시작은 화려한 라인이 아니라 셀의 체화다.',
        moduleId: 'm-l6-05-odd-meters',
      },
      {
        track: 'Song for Melan and Rafik',
        listenFor: '선율의 음계가 장·단조 어느 쪽도 아닌 순간을 찾아라. 반음 위치가 서양 7음계와 다르다. **그 음계를 건반에서 재구성**해보라(한 음씩 맞춰가며). 익숙하지 않은 음계를 귀로 복원하는 훈련은 청음 능력을 가장 빠르게 끌어올린다.',
        moduleId: 'm-l6-04-intervallic',
      },
    ],
    relatedModules: ['m-l6-05-odd-meters', 'm-l6-04-intervallic', 'm-l6-06-contemporary-voicings', 'm-l8-02-composition'],
    review: {
      status: 'faculty-pending',
      reviewers: ['rv-contemporary', 'rv-transcription'],
      reviewedAt: '2026-05-21',
      rubric: { accuracy: 4.6, terminology: 4.5, sequencing: 4.4, playability: 4.0, idiom: 4.8, integration: 4.5, assessability: 4.7, sourcing: 4.0 },
    },
  },

  {
    id: 'a-black-radio',
    title: 'Black Radio',
    leader: '로버트 글래스퍼 익스페리먼트 (Robert Glasper Experiment)',
    pianist: '로버트 글래스퍼 (Robert Glasper)',
    year: 2012,
    label: 'Blue Note',
    why: '재즈피아노가 힙합·네오소울의 리듬 언어와 결합한 지점을 대표하는 음반. 여기서 글래스퍼가 하는 일은 재즈 어휘를 버리는 것이 아니라 **재즈 보이싱을 다른 리듬 격자 위에 올려놓는 것**이다. 화음 자체는 여전히 확장 화성이고 성부 이동도 정교하다. 다만 그것이 스윙이 아니라 16분음표 기반의 그루브 위에 놓인다. L6 학습자가 얻어야 할 통찰은 명확하다 — 당신이 배운 보이싱은 스윙 전용 부품이 아니다. 또한 로데스·신시사이저의 음색 선택이 보이싱 설계에 어떻게 개입하는지도 관찰 대상이다.',
    tags: ['네오소울', '힙합 그루브', '컨템포러리 보이싱', '음색'],
    levelId: 'L6',
    priority: 2,
    trackNotes: [
      {
        track: 'Afro Blue',
        listenFor: '화음이 바뀌는 순간이 **박의 앞인지 뒤인지** 판정하라. 대부분 미세하게 늦다. 그리고 그 지연이 매번 비슷한 양이다. 그루브는 정확함이 아니라 일관된 어긋남이다. 메트로놈을 켜고 컴핑 화음을 아주 살짝 늦게 놓는 연습을 10분만 해보라.',
        moduleId: 'm-l2-04-comping-rhythm',
      },
      {
        track: 'Cherish the Day',
        listenFor: '보이싱의 **최상성부 움직임만** 따라가라. 화음이 바뀌어도 맨 위 음은 한 음으로 오래 머문다. 이 고정된 상단음이 노래를 방해하지 않는 이유다. 보컬이 있는 편성에서 보이싱을 설계하는 제1원칙이 여기 있다.',
        moduleId: 'm-l2-02-guide-tone-lines',
      },
      {
        track: 'Smells Like Teen Spirit',
        listenFor: '원곡의 단순한 진행이 **어떤 확장 화음으로 재해석되는지** 한 곳만 특정하라. 록의 3화음이 텐션을 얻으면 어떤 소리가 되는지를 보여주는 즉석 리하모니제이션 사례다. 당신이 아는 아무 대중가요 코드 진행에 같은 처리를 적용해보라.',
        moduleId: 'm-l6-06-contemporary-voicings',
      },
    ],
    relatedModules: ['m-l6-06-contemporary-voicings', 'm-l2-02-guide-tone-lines', 'm-l2-04-comping-rhythm', 'm-l8-01-personal-vocabulary'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-contemporary', 'rv-pedagogy'],
      reviewedAt: '2026-05-25',
      rubric: { accuracy: 4.7, terminology: 4.6, sequencing: 4.5, playability: 4.7, idiom: 4.9, integration: 4.6, assessability: 4.7, sourcing: 4.1 },
    },
  },

  /* ═══════════════════ L7 — 솔로 피아노와 트리오 ═══════════════════ */
  {
    id: 'a-sunday-at-the-village-vanguard',
    title: 'Sunday at the Village Vanguard',
    leader: '빌 에반스 트리오 (Bill Evans Trio)',
    pianist: '빌 에반스 (Bill Evans)',
    year: 1961,
    label: 'Riverside',
    why: '1961년 6월 25일 뱅가드 실황. 이 앨범은 재즈 트리오의 역할 분담이 해체된 순간의 공식 기록이다. 스콧 라파로의 베이스는 루트를 짚는 대신 대선율을 연주하고, 폴 모티안의 드럼은 박을 지키는 대신 색을 칠하며, 에반스는 그 둘이 만든 불안정한 지면 위에서 화성을 유지한다. L7 학습자가 여기서 배울 것은 인터플레이의 낭만이 아니라 **그 자유가 성립하기 위해 누군가는 무엇을 붙잡고 있어야 한다**는 냉정한 사실이다. 트리오에서 피아니스트의 진짜 책임은 화려함이 아니라 기준점의 관리다.',
    tags: ['트리오', '인터플레이', '실황', '루트리스'],
    levelId: 'L7',
    priority: 1,
    trackNotes: [
      {
        track: "Gloria's Step",
        at: '베이스 솔로 구간',
        listenFor: '라파로가 솔로하는 동안 에반스가 **무엇을 포기하고 무엇을 유지하는지** 적어라. 밀도는 포기하고 화성의 좌표는 유지한다. 베이스 솔로 때 피아노가 완전히 빠지는 것도, 계속 치는 것도 답이 아니다. 최소한의 좌표만 남기는 이 상태를 목표로 삼아라.',
        moduleId: 'm-l7-04-trio-comping',
      },
      {
        track: "My Man's Gone Now",
        listenFor: '피아노와 베이스가 **동시에 프레이즈를 시작하는 지점**이 있는지 찾아라. 거의 없다. 한쪽이 움직이면 다른 쪽이 멈춘다. 이 교대 규칙은 사전에 약속된 것이 아니라 실시간 듣기의 결과다. 트리오 연습에서 "동시에 시작하지 않기" 한 가지 규칙만 지켜도 사운드가 바뀐다.',
        moduleId: 'm-l7-05-interplay',
      },
      {
        track: 'Solar',
        listenFor: '빠른 템포에서 에반스의 왼손이 **한 코러스에 몇 번 등장하는지** 세라. 놀랄 만큼 적다. 그리고 등장할 때마다 위치가 다르다. 규칙적으로 박자를 채우는 컴핑은 여기 없다.',
        moduleId: 'm-l2-04-comping-rhythm',
      },
      {
        track: 'Jade Visions',
        listenFor: '3박자 곡이고 화성이 거의 움직이지 않는다. 그 안에서 **어떤 성부가 유일하게 움직이는지** 특정하라. 한 성부만 반음씩 이동해도 음악은 앞으로 간다. 정적 화성에서 움직임을 만드는 가장 경제적인 방법이다.',
        moduleId: 'm-l2-02-guide-tone-lines',
      },
    ],
    relatedModules: ['m-l7-04-trio-comping', 'm-l7-05-interplay', 'm-l2-02-guide-tone-lines', 'm-l2-04-comping-rhythm'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-pedagogy', 'rv-transcription', 'rv-chord-scale'],
      reviewedAt: '2026-02-18',
      rubric: { accuracy: 4.9, terminology: 4.8, sequencing: 4.9, playability: 4.6, idiom: 5.0, integration: 5.0, assessability: 4.8, sourcing: 4.5 },
    },
  },

  {
    id: 'a-bill-evans-alone',
    title: 'Alone',
    leader: '빌 에반스 (Bill Evans)',
    pianist: '빌 에반스 (Bill Evans)',
    year: 1968,
    label: 'Verve',
    why: '1968년 가을에 녹음된 솔로 피아노 음반. 트리오에서의 에반스가 "무엇을 하지 않는가"의 교재라면, 혼자 있는 에반스는 **세 개의 층을 동시에 유지하는 법**의 교재다: 저음의 시간축, 중음역의 화성, 상단의 선율. 특히 "Never Let Me Go"의 긴 연주는 한 곡을 십수 분 동안 붙들고 가면서 밀도와 템포를 조금씩 바꾸는 장기 설계의 실물이다. L7 학습자가 솔로 피아노에서 무너지는 이유는 기술이 아니라 시간 설계의 부재이고, 그 처방이 이 앨범이다.',
    tags: ['솔로 피아노', '루바토', '층 분리', '발라드'],
    levelId: 'L7',
    priority: 1,
    trackNotes: [
      {
        track: 'Never Let Me Go',
        at: '연주 전반부와 후반부 비교',
        listenFor: '같은 곡을 여러 바퀴 도는 동안 **템포가 실제로 변하는지** 판정하라. 변한다. 그리고 그 변화가 갑작스럽지 않다. 3분 지점과 10분 지점의 밀도를 각각 한 문장으로 적어 비교하면, 긴 솔로 연주의 설계도가 보인다.',
        moduleId: 'm-l7-01-solo-piano',
      },
      {
        track: "Here's That Rainy Day",
        listenFor: '왼손이 **베이스 라인을 연주하는 구간**과 **화음 덩어리를 놓는 구간**을 구분해 표시하라. 두 가지가 번갈아 나온다. 솔로 피아노에서 왼손은 한 가지 역할을 계속 하는 것이 아니라 역할을 교대한다. 오늘 과제: 한 곡의 A섹션은 워킹 베이스로, B섹션은 화음 덩어리로만 처리해보라.',
        moduleId: 'm-l7-01-solo-piano',
      },
      {
        track: 'On a Clear Day (You Can See Forever)',
        listenFor: '루바토로 시작해 인 템포로 넘어가는 지점을 정확히 찍어라. 그리고 **무엇이 그 전환을 알리는지** 적어라(대개 저음의 규칙적 반복이 시작된다). 인트로에서 본 연주로 넘어가는 신호를 설계하는 것이 L7 인트로 과제의 핵심이다.',
        moduleId: 'm-l7-03-rubato-ballad',
      },
    ],
    relatedModules: ['m-l7-01-solo-piano', 'm-l7-03-rubato-ballad', 'm-l5-06-reharm-ballad', 'm-l7-06-arrangement'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-keyboard-technique', 'rv-pedagogy'],
      reviewedAt: '2026-05-29',
      rubric: { accuracy: 4.7, terminology: 4.7, sequencing: 4.8, playability: 4.5, idiom: 4.9, integration: 4.7, assessability: 4.6, sourcing: 4.2 },
      comments: [
        {
          reviewerId: 'rv-pedagogy',
          issue: '발매 연도와 녹음 연도가 달라 학습자가 연표를 혼동할 수 있다.',
          resolution: 'year 는 녹음 시점(1968)으로 표기하고 본문에 녹음 시기를 명시.',
          severity: 'minor',
        },
      ],
    },
  },

  {
    id: 'a-the-koln-concert',
    title: 'The Köln Concert',
    leader: '키스 재럿 (Keith Jarrett)',
    pianist: '키스 재럿 (Keith Jarrett)',
    year: 1975,
    label: 'ECM',
    why: '완전 즉흥으로 연주된 솔로 피아노 실황. 재즈 스탠다드도, 코드 차트도 없이 한 시간 이상의 음악이 만들어지는 과정을 들을 수 있다는 점에서 L7·L8 학습자에게 이 앨범은 사실상 **즉흥 작곡의 중계방송**이다. 주목할 것은 재럿이 쓰는 재료가 놀랄 만큼 단순하다는 사실이다 — 2~4마디의 짧은 오스티나토, 다이어토닉한 화성, 페달 포인트. 복잡한 이론이 아니라 **반복과 축적**으로 형식을 만든다. 아무것도 정해지지 않은 상태에서 손을 움직이는 훈련의 최종 참고문헌이다.',
    tags: ['솔로 피아노', '완전 즉흥', '오스티나토', '실황'],
    levelId: 'L7',
    priority: 1,
    trackNotes: [
      {
        track: 'Part I',
        at: '연주 시작 후 첫 5분',
        listenFor: '재럿이 처음 제시하는 **동기가 몇 마디짜리인지** 확정하고, 그것이 5분 동안 몇 번 반복되는지 세라. 새 재료가 등장하는 속도가 당신의 예상보다 훨씬 느리다는 것을 확인하는 것이 이 과제의 전부다. 즉흥에서 초보자가 실패하는 이유는 재료 부족이 아니라 재료를 너무 빨리 버리기 때문이다.',
        moduleId: 'm-l8-01-personal-vocabulary',
      },
      {
        track: 'Part IIa',
        listenFor: '왼손 저음 패턴이 **같은 화음을 몇 마디 유지하는지** 세라. 종종 8마디 이상이다. 그 위에서 오른손이 무엇으로 변화를 만드는지 적어라 — 음역 이동과 밀도다. 페달 포인트 위 즉흥의 실제 운용법이다.',
        moduleId: 'm-l6-01-modal-playing',
      },
      {
        track: 'Part IIc',
        listenFor: '앞부분의 재료가 **여기서 다시 나타나는지** 확인하라. 나타난다. 한 시간짜리 즉흥이 기억되는 이유는 회귀 때문이다. 당신의 솔로 피아노 과제에 규칙 하나를 추가하라: 마지막 섹션에서 첫 섹션의 재료를 반드시 한 번 다시 쓴다.',
        moduleId: 'm-l7-06-arrangement',
      },
    ],
    relatedModules: ['m-l7-01-solo-piano', 'm-l7-06-arrangement', 'm-l8-01-personal-vocabulary', 'm-l6-01-modal-playing'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-pedagogy', 'rv-contemporary'],
      reviewedAt: '2026-06-02',
      rubric: { accuracy: 4.8, terminology: 4.5, sequencing: 4.7, playability: 4.4, idiom: 4.8, integration: 4.7, assessability: 4.8, sourcing: 4.1 },
    },
  },

  {
    id: 'a-thelonious-alone-in-sf',
    title: 'Thelonious Alone in San Francisco',
    leader: '셀로니어스 몽크 (Thelonious Monk)',
    pianist: '셀로니어스 몽크 (Thelonious Monk)',
    year: 1959,
    label: 'Riverside',
    why: '몽크의 솔로 피아노는 스트라이드 전통과 현대적 불협을 한 손으로 연결하는 희귀한 지점에 있다. 왼손은 할렘 스트라이드의 저음-화음 교대를 그대로 쓰지만, 그 위에 얹히는 화음은 단2도와 증4도를 포함한다. L7 학습자에게 이 앨범이 필수인 이유는 **오래된 좌수 기술이 현대적 어휘와 충돌하지 않는다**는 증거이기 때문이다. 또한 몽크의 템포 운용은 극도로 불규칙해 보이지만 실제로는 매우 정확해서, 루바토와 부정확함의 차이를 귀로 구분하는 훈련 자료가 된다.',
    tags: ['솔로 피아노', '스트라이드', '불협', '루바토'],
    levelId: 'L7',
    priority: 2,
    trackNotes: [
      {
        track: 'Blue Monk',
        listenFor: '왼손이 **저음 단음 → 중음역 화음**을 오가는 횟수를 한 코러스 동안 세라. 그리고 그 교대가 매번 같은 박에 오는지 확인하라. 오지 않는다. 스트라이드의 규칙을 지키면서 일부러 어긋나는 이 처리가 몽크의 시간 감각이다.',
        moduleId: 'm-l7-02-stride',
      },
      {
        track: 'Ruby, My Dear',
        listenFor: '멜로디 음과 그 아래 화음 사이에서 **가장 거친 충돌 하나**를 찾아 특정하고, 그 음을 빼고 쳐보라. 곡이 밋밋해진다. 몽크의 발라드에서 불협은 장식이 아니라 뼈대다.',
        moduleId: 'm-l5-03-upper-structures',
      },
      {
        track: 'Everything Happens to Me',
        listenFor: '템포가 흔들리는 것처럼 들리는 구간에서 **실제로 박이 사라지는지** 발로 박을 짚으며 검증하라. 사라지지 않는다. 루바토는 박을 버리는 것이 아니라 박을 늘이고 줄이는 것이다. 이 구분을 못 하면 당신의 발라드는 루바토가 아니라 불안정한 연주가 된다.',
        moduleId: 'm-l7-03-rubato-ballad',
      },
    ],
    relatedModules: ['m-l7-01-solo-piano', 'm-l7-02-stride', 'm-l7-03-rubato-ballad', 'm-l5-03-upper-structures'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-barry-harris', 'rv-keyboard-technique'],
      reviewedAt: '2026-06-05',
      rubric: { accuracy: 4.8, terminology: 4.6, sequencing: 4.7, playability: 4.5, idiom: 5.0, integration: 4.6, assessability: 4.8, sourcing: 4.2 },
    },
  },

  {
    id: 'a-tatum-piano-starts-here',
    title: 'Piano Starts Here',
    leader: '아트 테이텀 (Art Tatum)',
    pianist: '아트 테이텀 (Art Tatum)',
    year: 1968,
    label: 'Columbia',
    why: '1933년 스튜디오 솔로 녹음과 1949년 실황을 함께 담은 편집 음반. 아트 테이텀은 이후 등장한 거의 모든 재즈피아니스트의 기술적 상한선을 혼자서 정해버린 연주자다. 그러나 L7 학습자가 여기서 가져가야 할 것은 속주가 아니라 **구조**다: 테이텀의 왼손은 스트라이드의 규칙을 정확히 지키고, 오른손의 폭발적인 런은 항상 화성의 골격 위에서만 일어나며, 리하모니제이션은 즉흥적으로 보이지만 같은 곡을 여러 번 들으면 반복되는 공식이 드러난다. 화려함의 정체가 사실은 **완벽하게 정리된 문법**이라는 것을 확인하는 것이 이 앨범의 학습 목표다.',
    tags: ['스트라이드', '얼리 재즈', '솔로 피아노', '리하모니제이션'],
    levelId: 'L7',
    priority: 2,
    trackNotes: [
      {
        track: 'Tea for Two',
        listenFor: '오른손의 빠른 런은 잠시 잊고 **왼손만** 따라가라. 저음 단음(1·3박) → 중음역 화음(2·4박)의 교대가 거의 기계적으로 유지된다. 이 교대를 아주 느린 템포에서 한 코러스 따라 쳐보라. 스트라이드는 속도의 문제가 아니라 좌우 도약의 정확도 문제다.',
        moduleId: 'm-l7-02-stride',
      },
      {
        track: 'Tiger Rag',
        listenFor: '극단적으로 빠른 이 연주에서 **화성이 실제로는 매우 단순한지** 확인하라. 대부분 기본 3화음과 도미넌트다. 음의 개수와 화성의 복잡도는 별개라는 사실을 여기서 분리해 인식해야, 당신은 어려운 화성을 느리게 연주하는 쪽을 선택할 수 있게 된다.',
        moduleId: 'm-l1-03-diatonic-harmony',
      },
      {
        track: 'Yesterdays',
        listenFor: '테이텀이 원곡의 화성을 바꾸는 지점을 하나만 찾아 특정하라. 대개 반음 하행 경과화음이나 대리 도미넌트다. **원래 코드와 테이텀의 코드를 나란히 건반에서 쳐보라.** 리하모니제이션 학습은 목록 암기가 아니라 이 비교 작업의 반복이다.',
        moduleId: 'm-l5-04-passing-diminished',
      },
    ],
    relatedModules: ['m-l7-02-stride', 'm-l7-01-solo-piano', 'm-l5-04-passing-diminished', 'm-l1-03-diatonic-harmony'],
    review: {
      status: 'faculty-pending',
      reviewers: ['rv-barry-harris', 'rv-keyboard-technique'],
      reviewedAt: '2026-06-09',
      rubric: { accuracy: 4.5, terminology: 4.5, sequencing: 4.6, playability: 3.9, idiom: 5.0, integration: 4.5, assessability: 4.6, sourcing: 4.0 },
      comments: [
        {
          reviewerId: 'rv-keyboard-technique',
          issue: '원 템포 모방 시도가 부상 위험을 만든다.',
          resolution: '모든 청취 과제를 좌수 구조 관찰과 느린 템포 재현으로 한정.',
          severity: 'blocker',
        },
      ],
    },
  },

  {
    id: 'a-the-art-of-the-trio',
    title: 'The Art of the Trio, Volume One',
    leader: '브래드 멜다우 트리오 (Brad Mehldau Trio)',
    pianist: '브래드 멜다우 (Brad Mehldau)',
    year: 1997,
    label: 'Warner Bros.',
    why: '빌 에반스 이후의 피아노 트리오가 어디까지 갔는지를 보여주는 출발점. 멜다우는 클래식적 대위법 감각(왼손이 독립된 선율을 가진다), 팝·록 레퍼토리의 수용, 그리고 리듬의 상습적 변위를 결합한다. L7 학습자에게 특히 중요한 것은 **왼손의 지위 변화**다 — 에반스에게 왼손은 화성이었지만 멜다우에게 왼손은 종종 두 번째 목소리다. 이 차이를 귀로 구분할 수 있게 되면, 당신의 트리오 연습에서 왼손에게 줄 수 있는 선택지가 하나 더 생긴다.',
    tags: ['현대 트리오', '대위법', '리듬 변위', '팝 수용'],
    levelId: 'L7',
    priority: 2,
    trackNotes: [
      {
        track: 'Blame It on My Youth',
        listenFor: '왼손이 **화음 덩어리인지 선율인지** 구간별로 판정해 표시하라. 선율인 구간이 상당하다. 그 구간에서 왼손 라인만 따로 흥얼거려보라 — 노래가 된다. 화성 반주만 하는 왼손과 노래하는 왼손의 차이를 몸으로 아는 것이 이 과제의 목표다.',
        moduleId: 'm-l7-01-solo-piano',
      },
      {
        track: 'Blackbird',
        listenFor: '원곡의 박자 구조가 **유지되는지 바뀌는지** 판정하라. 프레이즈가 마디선을 넘어 걸치는 구간이 반복해서 나온다. 같은 멜로디를 한 박 밀어서 쳐보는 실험을 건반에서 직접 하라 — 리듬 변위의 가장 단순한 적용이다.',
        moduleId: 'm-l4-05-rhythmic-displacement',
      },
      {
        track: "I Didn't Know What Time It Was",
        listenFor: '멜다우의 솔로에서 **같은 동기가 다른 박 위치에 재배치되는 지점**을 찾아라. 음높이는 같은데 위치가 이동한다. 이것이 현대 트리오에서 긴장을 만드는 주요 수단이다. 드럼이 흔들리지 않는 동안 피아노만 어긋나는 구조를 확인하라.',
        moduleId: 'm-l4-05-rhythmic-displacement',
      },
    ],
    relatedModules: ['m-l7-01-solo-piano', 'm-l7-04-trio-comping', 'm-l7-05-interplay', 'm-l4-05-rhythmic-displacement'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-contemporary', 'rv-transcription'],
      reviewedAt: '2026-06-12',
      rubric: { accuracy: 4.7, terminology: 4.7, sequencing: 4.7, playability: 4.3, idiom: 4.9, integration: 4.7, assessability: 4.6, sourcing: 4.2 },
    },
  },

  {
    id: 'a-ellington-blanton-webster',
    title: 'The Blanton–Webster Band',
    leader: '듀크 엘링턴과 그의 오케스트라 (Duke Ellington and His Orchestra)',
    pianist: '듀크 엘링턴 (Duke Ellington)',
    year: 1940,
    label: 'RCA Bluebird',
    why: '1940~1942년 빅터 녹음을 모은 편집 음반으로, 재즈 편곡의 표준이 확립된 시기의 기록이다. 피아니스트가 이 음반을 들어야 하는 이유는 두 가지다. 첫째, 엘링턴은 **작곡가이자 편곡가로서 피아노를 연주한다** — 그의 피아노는 밴드의 빈틈에만 등장하고, 등장할 때마다 다음 섹션의 색을 미리 제시한다. 둘째, 관악 섹션의 화음 배치(보이싱)는 피아노 양손 보이싱의 원형이며, 특히 3관·4관 화음의 간격 처리는 L7 셀프 어레인지먼트의 직접적인 참고 자료가 된다. 지미 블랜턴의 베이스가 등장하면서 리듬 섹션의 역할 분담이 어떻게 재편되는지도 함께 관찰하라.',
    tags: ['빅밴드', '편곡', '얼리 재즈', '작곡가 피아노'],
    levelId: 'L7',
    priority: 3,
    trackNotes: [
      {
        track: 'Ko-Ko',
        listenFor: '피아노가 등장하는 순간을 모두 표시하라. 매우 짧고, 매번 섹션의 경계다. 엘링턴의 피아노는 반주가 아니라 **구두점**이다. 당신이 편곡을 쓸 때 피아노에게 줄 역할의 모델로 삼아라.',
        moduleId: 'm-l7-06-arrangement',
      },
      {
        track: 'Cotton Tail',
        listenFor: '이 곡은 리듬 체인지 계열 진행이다. AABA 32마디를 세면서 들어라. 그리고 브릿지에서 화성이 **어느 방향으로 움직이는지** 판정하라(도미넌트의 연쇄다). 리듬 체인지를 손에 넣기 전에 귀로 형식을 먼저 세는 훈련이다.',
        moduleId: 'm-l2-06-form-navigation',
      },
      {
        track: "Take the 'A' Train",
        listenFor: '관악 섹션 화음의 **맨 위 음만** 따라 불러보라. 그것이 멜로디다. 그다음 그 아래 화음이 몇 성부인지 추정하라. 피아노 양손으로 이 배치를 재현하려면 어느 음을 버려야 하는가 — 이 질문이 셀프 어레인지먼트의 출발점이다.',
        moduleId: 'm-l7-06-arrangement',
      },
      {
        track: 'In a Mellotone',
        listenFor: '미디엄 템포의 블루스 계열 곡이다. 리듬 섹션의 각 악기가 **4박 중 어디를 담당하는지** 분리해 들어라. 베이스는 4박 전부, 기타는 4박 전부, 드럼은 하이햇, 피아노는 거의 아무것도. 스윙 시대의 역할 분담표를 귀로 그려보는 과제다.',
        moduleId: 'm-l1-06-swing-feel',
      },
    ],
    relatedModules: ['m-l7-06-arrangement', 'm-l2-06-form-navigation', 'm-l1-06-swing-feel', 'm-l5-03-upper-structures'],
    review: {
      status: 'faculty-pending',
      reviewers: ['rv-pedagogy', 'rv-barry-harris'],
      reviewedAt: '2026-06-16',
      rubric: { accuracy: 4.5, terminology: 4.4, sequencing: 4.3, playability: 4.4, idiom: 5.0, integration: 4.4, assessability: 4.5, sourcing: 4.0 },
      comments: [
        {
          reviewerId: 'rv-pedagogy',
          issue: '편집 음반이므로 단일 발매 연도 표기가 오해를 부른다.',
          resolution: 'year 는 녹음 시작 연도(1940)로 두고 본문에 1940~1942년 녹음 모음임을 명시.',
          severity: 'minor',
        },
      ],
    },
  },

  /* ═══════════════════════ L8 — 자기 언어 ═══════════════════════ */
  {
    id: 'a-kenny-kirkland',
    title: 'Kenny Kirkland',
    leader: '케니 커클랜드 (Kenny Kirkland)',
    pianist: '케니 커클랜드 (Kenny Kirkland)',
    year: 1991,
    why: '케니 커클랜드는 포스트밥의 화성 어휘, 카리브·라틴 리듬, 그리고 맥코이 타이너 이후의 좌수 구조를 하나의 개인 문법으로 통합한 연주자다. 이 유일한 리더작이 L8에 배치되는 이유는 난이도 때문이 아니라, **"자기 언어"라는 추상적 목표의 구체적 표본**이기 때문이다. 여기서 관찰할 것은 특정 릭이 아니라 반복되는 습관들 — 선호하는 화음 간격, 프레이즈를 끝내는 방식, 리듬을 어긋뜨리는 고유한 각도다. 자기 어휘 목록을 만들라는 L8 과제 앞에서 학습자가 물어야 할 질문은 "무엇을 더 배울까"가 아니라 "내 연주에서 이미 반복되는 것은 무엇인가"이고, 그 질문의 모범 답안이 이 앨범이다.',
    tags: ['포스트밥', '개인 문법', '라틴 리듬', '컨템포러리'],
    levelId: 'L8',
    priority: 1,
    trackNotes: [
      {
        track: 'Mr. J.C.',
        listenFor: '커클랜드의 솔로에서 **반복해서 나타나는 습관 세 가지**를 찾아 적어라(예: 프레이즈 끝을 특정 음정으로 마무리한다, 특정 간격의 화음을 선호한다, 특정 리듬 꼴로 진입한다). 개별 릭을 채보하지 말고 습관을 목록화하는 것이 이 과제다. 같은 작업을 당신 자신의 녹음에 적용하는 것이 L8의 핵심 활동이다.',
        moduleId: 'm-l8-01-personal-vocabulary',
      },
      {
        track: 'Steepian Faith',
        listenFor: '왼손 보이싱의 **최저음과 그다음 음의 간격**을 판정하라. 좁은 3도가 아니라 넓은 4·5도가 지배적이다. 그리고 그 구조가 곡 전체에서 유지된다. 한 연주자의 사운드가 인식되는 이유는 특별한 화음이 아니라 **일관된 간격 선택** 때문이다.',
        moduleId: 'm-l6-02-quartal-voicings',
      },
    ],
    relatedModules: ['m-l8-01-personal-vocabulary', 'm-l8-04-self-critique', 'm-l6-02-quartal-voicings', 'm-l6-06-contemporary-voicings'],
    review: {
      status: 'faculty-pending',
      reviewers: ['rv-contemporary', 'rv-transcription'],
      reviewedAt: '2026-06-20',
      rubric: { accuracy: 4.4, terminology: 4.5, sequencing: 4.5, playability: 4.1, idiom: 4.9, integration: 4.6, assessability: 4.7, sourcing: 3.9 },
      comments: [
        {
          reviewerId: 'rv-transcription',
          issue: '레이블 정보가 판본에 따라 달라 확정하기 어렵다.',
          resolution: '확신할 수 없는 `label` 필드를 생략하고 연도만 표기.',
          severity: 'minor',
        },
      ],
    },
  },

  {
    id: 'a-hiromi-another-mind',
    title: 'Another Mind',
    leader: '우에하라 히로미 (上原ひろみ / Hiromi Uehara)',
    pianist: '우에하라 히로미 (Hiromi Uehara)',
    year: 2003,
    label: 'Telarc',
    why: '아시아 출신 연주자가 미국 재즈 교육 시스템을 통과한 뒤 자신의 데뷔작을 어떻게 설계했는지를 보여주는 사례. L8 학습자에게 이 앨범이 유용한 것은 완성도 때문만이 아니라, **데뷔작이라는 형식 자체**가 졸업 연주 프로그램 설계와 같은 문제를 풀고 있기 때문이다: 무엇을 넣고 무엇을 뺄 것인가, 자기 색을 어느 곡에서 증명할 것인가, 기교는 어디까지 보여줄 것인가. 연주 측면에서는 클래식 훈련에서 온 타건 정확도와 재즈의 그루브가 결합되는 지점을 관찰하기 좋으며, 이는 체르니에서 출발한 Jazzytory 학습자에게 특히 직접적인 참고가 된다.',
    tags: ['컨템포러리', '테크닉', '작곡', '데뷔작 설계'],
    levelId: 'L8',
    priority: 2,
    trackNotes: [
      {
        track: 'XYZ',
        listenFor: '빠른 유니즌 패시지에서 **양손이 같은 리듬을 치는지 어긋나는지** 판정하라. 그리고 그 정확도가 클래식적 훈련의 산물임을 인식하라. 당신이 가진 클래식 배경은 재즈에서 버려야 할 것이 아니라 이런 자리에서 쓰이는 자산이다.',
        moduleId: 'm-l0-03-keyboard-geography',
      },
      {
        track: 'Another Mind',
        listenFor: '곡의 섹션이 몇 개인지 세고, **각 섹션의 길이와 성격을 한 줄씩 적어라**. 헤드-솔로-헤드 구조가 아니다. 졸업 연주나 자작곡 프로그램을 설계할 때 필요한 것은 즉흥 능력이 아니라 이 설계도 작성 능력이다.',
        moduleId: 'm-l8-02-composition',
      },
    ],
    relatedModules: ['m-l8-02-composition', 'm-l8-06-recital', 'm-l0-03-keyboard-geography', 'm-l6-05-odd-meters'],
    review: {
      status: 'faculty-pending',
      reviewers: ['rv-keyboard-technique', 'rv-pedagogy'],
      reviewedAt: '2026-06-24',
      rubric: { accuracy: 4.5, terminology: 4.4, sequencing: 4.5, playability: 4.0, idiom: 4.6, integration: 4.5, assessability: 4.5, sourcing: 3.9 },
    },
  },

  {
    id: 'a-heavy-weather',
    title: 'Heavy Weather',
    leader: '웨더 리포트 (Weather Report)',
    pianist: '조 자비눌 (Joe Zawinul)',
    year: 1977,
    label: 'Columbia',
    why: '건반 주자가 **작곡가·편곡가·음색 설계자**로 확장된 사례. 조 자비눌은 이 앨범에서 어쿠스틱 피아노를 거의 쓰지 않고, 대신 신시사이저의 음색 선택 자체를 편곡의 일부로 삼는다. L8 학습자가 여기서 다룰 문제는 명확하다 — 당신이 앞으로 설 무대의 상당수는 어쿠스틱 그랜드가 아니라 전자 건반이다. 음색이 바뀌면 보이싱의 간격과 지속 시간도 바뀌어야 한다. 또한 "Birdland"는 빅밴드 사운드를 소편성으로 재현하는 편곡 문제의 모범 답안이며, 레이어를 쌓아 형식을 만드는 방식은 현대 재즈 작곡의 표준 기법이 되었다.',
    tags: ['퓨전', '신시사이저', '편곡', '음색 설계'],
    levelId: 'L8',
    priority: 2,
    trackNotes: [
      {
        track: 'Birdland',
        listenFor: '곡이 시작된 뒤 **새로운 층(레이어)이 추가되는 지점**을 모두 표시하라. 베이스 → 건반 → 멜로디 → 합주 순으로 쌓인다. 화성 전개가 아니라 레이어 누적으로 형식을 만드는 구조다. 당신의 자작곡에 이 방법을 그대로 적용할 수 있다.',
        moduleId: 'm-l8-02-composition',
      },
      {
        track: 'A Remark You Made',
        listenFor: '느린 곡에서 건반의 **음 지속 시간**을 재라. 매우 길다. 음색의 잔향이 길기 때문에 음을 적게 쓰고 오래 끈다. 같은 보이싱을 어쿠스틱 피아노에서 치면 소리가 먼저 사라진다 — 악기가 보이싱을 결정한다는 원칙을 확인하는 과제다.',
        moduleId: 'm-l6-06-contemporary-voicings',
      },
      {
        track: 'Havona',
        listenFor: '화성이 빠르게 이동하는 이 곡에서 건반이 **어느 정도로 개입하는지** 확인하라. 베이스가 매우 활발할 때 건반은 물러난다. 편성 안에서 누가 저음역을 쓸 것인지에 대한 합의가 존재하며, 이 합의는 리허설이 아니라 듣기로 성립한다.',
        moduleId: 'm-l8-05-gig-readiness',
      },
    ],
    relatedModules: ['m-l8-02-composition', 'm-l8-05-gig-readiness', 'm-l6-06-contemporary-voicings', 'm-l7-06-arrangement'],
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-contemporary', 'rv-pedagogy'],
      reviewedAt: '2026-06-28',
      rubric: { accuracy: 4.6, terminology: 4.5, sequencing: 4.5, playability: 4.4, idiom: 4.7, integration: 4.5, assessability: 4.6, sourcing: 4.0 },
    },
  },
];
