/**
 * Jazzytory — 레퍼토리 데이터 (코드 진행 = 화성 골격 전용)
 * ---------------------------------------------------------------------------
 * 저작권 규칙 (docs/00-MASTER-PROMPT.md §7 — 하드 제약)
 *  - 멜로디·음표 데이터·가사·채보된 솔로를 **일절 포함하지 않는다.**
 *    모든 항목의 `melodyIncluded` 는 언제나 `false`.
 *  - 수록 대상은 **코드 진행(화성 골격)** 뿐이다. 코드 진행은 교육 현장에서
 *    구전·판서로 통용되는 화성 요약이며, 리얼북 스캔/PDF/페이지 번호를
 *    참조하거나 재현하지 않는다.
 *  - 음원을 호스팅하지 않는다. 청음은 `keyRecordings`(앨범 메타데이터) 로만 연결한다.
 *  - `t-jz-*` 는 Jazzytory 편집부 오리지널 연습곡이며
 *    `publicDomainOrOriginal: true`, `composer: 'Jazzytory 편집부'` 로 표기한다.
 *
 * 표기 표준 (docs/_MANIFEST.md)
 *  마이너7 `C-7` / 메이저7 `C∆7` / 도미넌트 `C7` / 하프디미니시 `Cø7` /
 *  디미니시 `C°7` / 얼터드 `C7alt` / 서스 `C7sus4` / 식스나인 `C6/9` /
 *  마이너메이저 `C-∆7` / 슬래시 `C/E` / 플랫은 `b`, 샵은 `#`
 *
 * 마디 표기
 *  `{ chords: ['D-7','G7'] }` = 한 마디 안에 두 코드(2박씩)
 *  `{ chords: [] }`           = 앞 마디 코드 연장(%)
 *
 * 화성 정확도 정책
 *  판본 차이가 큰 곡은 **잼 세션에서 가장 널리 통용되는 교육용 단순화 버전**을
 *  싣고, 그 사실을 각 곡의 `approach` 에 명시한다. 불확실한 화성을 그럴듯하게
 *  지어내지 않는다.
 */

import type { Tune } from './types';

export const TUNES: Tune[] = [
  /* ═══════════════════════════════════════════════════════════════════════
     L1 — 첫 폼, 첫 즉흥
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: 't-blues-f',
    title: 'F 블루스 (12마디 재즈 블루스)',
    composer: 'Traditional',
    key: 'F',
    meter: [4, 4],
    form: 'blues-12',
    style: 'blues',
    tempo: [80, 160],
    difficulty: 1,
    levelId: 'L1',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['F7'] }, { chords: ['Bb7'] }, { chords: ['F7'] }, { chords: ['C-7', 'F7'] },      // 1-4
          { chords: ['Bb7'] }, { chords: ['B°7'] }, { chords: ['F7'] }, { chords: ['D7'] },            // 5-8
          { chords: ['G-7'] }, { chords: ['C7'] }, { chords: ['F7', 'D7'] }, { chords: ['G-7', 'C7'] }, // 9-12
        ],
      },
    ],
    teaches: [
      '12마디 블루스 폼을 마디 수를 세지 않고 귀와 손으로 기억하기',
      'I7 · IV7 · V7 셸 보이싱(1-3-7 / 1-7-3)을 한 조에서 자동화하기',
      '9-10마디 G-7 C7 (ii-V) 과 11-12마디 턴어라운드로 "돌아오는 길" 익히기',
      '블루스 스케일과 믹솔리디안을 섞어 첫 코러스를 스스로 만들기',
    ],
    approach:
      '오늘 할 일은 네 단계다. ① 코드 이름을 외우기 전에 왼손 셸 보이싱 세 개만 잡는다 — F7(F-A-Eb), Bb7(Bb-D-Ab), C7(C-E-Bb). ' +
      '② ♩=80 메트로놈에 맞춰 왼손만으로 12마디를 다섯 바퀴 돈다. 이때 오른손은 무릎 위에 둔다. 폼이 몸에 붙기 전에 오른손을 쓰면 반드시 마디를 잃는다. ' +
      '③ 폼이 안정되면 오른손은 F 블루스 스케일(F-Ab-Bb-B-C-Eb) 여섯 음만으로 한 코러스를 만든다. 음을 많이 치지 말고 마디마다 두세 음, 그리고 쉰다. ' +
      '④ 마지막으로 9-10마디만 따로 떼어 G-7 → C7 을 20회 반복한다. 이 두 마디가 재즈 전체의 문장 구조(ii-V)이며, 여기서 손이 멈추면 다른 곡에서도 멈춘다. ' +
      '4마디의 C-7 F7, 6마디의 B°7 은 처음에는 빼고 F7 / Bb7 으로 단순화해도 좋다. 폼을 먼저, 색깔은 나중에.',
    hotspots: [
      {
        at: '4마디 (C-7 F7)',
        issue: '한 마디에 코드가 두 개 들어가면서 왼손이 늦고, 5마디 Bb7 진입이 밀린다.',
        solution: '4마디만 ♩=60 으로 떼어내 2박씩 C-7 → F7 을 치고 5마디 Bb7 까지 세 코드를 한 덩어리로 묶어 20회 반복한다. 두 코드의 공통음(Eb)을 손가락으로 유지하면 이동량이 줄어든다.',
      },
      {
        at: '6마디 (B°7)',
        issue: 'Bb7 다음 B°7 로 반음 올라가는 자리에서 손 모양이 무너진다.',
        solution: 'B°7 을 "Bb7 의 3음·7음을 반음 올린 것"으로 이해한다. Bb7 셸(Bb-D-Ab)에서 D→D, Ab→A 로만 움직이면 B°7 의 소리가 난다. 이동이 아니라 변형으로 배우면 손이 안 흔들린다.',
      },
      {
        at: '11-12마디 (턴어라운드)',
        issue: '마지막 두 마디에서 다음 코러스 첫 마디로 넘어가지 못하고 끊긴다.',
        solution: '11-12마디와 다음 1마디, 총 3마디를 하나의 루프로 만들어 연습한다. F7 → D7 → G-7 → C7 → F7 을 왼손 셸로만 40회. 턴어라운드는 "끝"이 아니라 "다음 코러스의 도입부"다.',
      },
    ],
    keyRecordings: ['a-oscar-peterson-night-train', 'a-red-garland-groovy'],
    melodyIncluded: false,
    publicDomainOrOriginal: true,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-pedagogy'],
      reviewedAt: '2026-02-04',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 5, playability: 5,
        idiom: 5, integration: 4, assessability: 5, sourcing: 4,
      },
      comments: [
        {
          reviewerId: 'rv-pedagogy',
          issue: '입문 첫 곡인데 6마디 B°7 과 4마디 C-7 F7 이 동시에 등장해 인지 부하가 높다.',
          resolution: 'approach 마지막 문장에 "두 자리를 빼고 F7 / Bb7 으로 단순화해도 좋다"는 명시적 감산 경로를 추가하고, 두 자리를 각각 hotspot 으로 분리했다.',
          severity: 'major',
        },
      ],
    },
  },

  {
    id: 't-blues-bb',
    title: 'Bb 블루스 (12마디 재즈 블루스)',
    composer: 'Traditional',
    key: 'Bb',
    meter: [4, 4],
    form: 'blues-12',
    style: 'blues',
    tempo: [100, 200],
    difficulty: 2,
    levelId: 'L1',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['Bb7'] }, { chords: ['Eb7'] }, { chords: ['Bb7'] }, { chords: ['F-7', 'Bb7'] },   // 1-4
          { chords: ['Eb7'] }, { chords: ['E°7'] }, { chords: ['Bb7'] }, { chords: ['G7'] },           // 5-8
          { chords: ['C-7'] }, { chords: ['F7'] }, { chords: ['Bb7', 'G7'] }, { chords: ['C-7', 'F7'] }, // 9-12
        ],
      },
    ],
    teaches: [
      '같은 블루스 폼을 다른 조로 즉시 옮기는 이조(transposition) 능력',
      '관악기 잼 세션 실전 조성(Bb) 에서의 셸·루트리스 보이싱 위치 감각',
      '8마디 G7(VI7) 을 경유하는 정규 턴백 — 9마디 C-7 으로 이어지는 문장',
      '블루스 스케일에만 의존하지 않고 각 도미넌트의 3음·7음을 조준하는 습관',
    ],
    approach:
      '① F 블루스를 이미 돌릴 수 있다면, 오늘은 "같은 이야기를 다른 조로 다시 말하기"다. 코드를 새로 외우지 말고 F 블루스의 각 자리(I7, IV7, ii-V, 턴어라운드)가 Bb 에서 어디인지만 매핑한다. ' +
      '② 왼손 셸 Bb7(Bb-D-Ab), Eb7(Eb-G-Db), F7(F-A-Eb) 세 개를 ♩=100 으로 12마디 다섯 바퀴. ' +
      '③ 오른손은 처음부터 스케일을 달리지 말고, 각 마디 첫 박에 그 코드의 3음 또는 7음 **한 음만** 놓는다. 이 가이드 톤 라인이 나중에 모든 솔로의 뼈대가 된다. ' +
      '④ 8마디 G7 은 처음엔 Bb7 으로 단순화해도 좋지만, 이 자리를 G7 으로 칠 수 있어야 9마디 C-7 이 "도착"으로 들린다. ' +
      'Bb 블루스는 잼 세션에서 가장 많이 호출되는 폼이다. 템포를 ♩=180 까지 올려 끊김 없이 세 코러스를 도는 것이 이 곡의 통과 기준이다.',
    hotspots: [
      {
        at: '8마디 (G7)',
        issue: 'Bb 조의 다이어토닉이 아닌 G7 이 갑자기 나와 손이 멈추고 9마디를 놓친다.',
        solution: 'G7 을 "9마디 C-7 을 데려오는 도미넌트"로 듣는다. 8-9마디만 떼어 G7 → C-7 을 30회. G7 의 3음 B 가 C-7 의 근음 C 로 반음 올라가는 성부 진행을 귀로 확인한다.',
      },
      {
        at: '6마디 (E°7)',
        issue: 'Eb7 → E°7 의 반음 상행에서 왼손이 위치를 잃는다.',
        solution: 'Eb7 셸(Eb-G-Db)에서 G→G, Db→D 로만 바꾼다. 두 음만 움직이는 변형으로 접근하면 도약이 사라진다.',
      },
    ],
    keyRecordings: ['a-kind-of-blue', 'a-thelonious-alone-in-sf'],
    melodyIncluded: false,
    publicDomainOrOriginal: true,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-barry-harris'],
      reviewedAt: '2026-02-04',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 5, playability: 5,
        idiom: 5, integration: 5, assessability: 5, sourcing: 4,
      },
    },
  },


  {
    id: 't-autumn-leaves',
    title: 'Autumn Leaves (Les feuilles mortes)',
    composer: 'Joseph Kosma',
    year: 1945,
    key: 'G-',
    meter: [4, 4],
    form: 'other',
    style: 'swing',
    tempo: [120, 190],
    difficulty: 2,
    levelId: 'L1',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['C-7'] }, { chords: ['F7'] }, { chords: ['Bb∆7'] }, { chords: ['Eb∆7'] }, // 1-4
          { chords: ['Aø7'] }, { chords: ['D7b9'] }, { chords: ['G-7'] }, { chords: [] },       // 5-8
        ],
      },
      {
        label: 'A2',
        bars: [
          { chords: ['C-7'] }, { chords: ['F7'] }, { chords: ['Bb∆7'] }, { chords: ['Eb∆7'] }, // 9-12
          { chords: ['Aø7'] }, { chords: ['D7b9'] }, { chords: ['G-7'] }, { chords: [] },       // 13-16
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['Aø7'] }, { chords: ['D7b9'] }, { chords: ['G-7'] }, { chords: [] },       // 17-20
          { chords: ['C-7'] }, { chords: ['F7'] }, { chords: ['Bb∆7'] }, { chords: [] },        // 21-24
        ],
      },
      {
        label: 'C',
        bars: [
          { chords: ['Aø7'] }, { chords: ['D7b9'] }, { chords: ['G-7', 'C-7'] }, { chords: ['Bb∆7', 'Eb∆7'] }, // 25-28
          { chords: ['Aø7'] }, { chords: ['D7b9'] }, { chords: ['G-7'] }, { chords: [] },       // 29-32
        ],
      },
    ],
    teaches: [
      '한 곡 안에서 relative major(Bb)의 ii-V-I 과 relative minor(G-)의 iiø-V7b9-i 를 나란히 경험하기',
      '하프디미니시(Aø7) 와 b9 도미넌트(D7b9) 의 손 모양 — 마이너 케이던스의 표준 재료',
      '근음이 4도씩 순환하는 진행 위에서 가이드 톤이 거의 움직이지 않는다는 사실을 귀로 확인하기',
      '32마디 A-A-B-C 폼을 8마디 네 덩어리로 세는 폼 감각',
    ],
    approach:
      '① 오늘 이 곡은 "두 문장"으로 요약된다. 문장 1 = C-7 F7 Bb∆7 (Bb 장조의 ii-V-I), 문장 2 = Aø7 D7b9 G-7 (G 단조의 iiø-V-i). 이 둘만 각각 20회씩 왼손 셸로 친다. ' +
      '② 두 문장을 익혔으면 A섹션 8마디는 그냥 "문장 1 + 문장 2" 다. ♩=120 으로 A 를 10회 돈다. ' +
      '③ B·C 섹션은 같은 재료를 순서만 바꾼 것이다. 새로 외울 것이 없다는 사실을 눈으로 확인하고 32마디를 한 바퀴 돈다. ' +
      '④ 오른손은 오늘 각 코드의 3음-7음 두 음만 롱톤으로 잡는다. Aø7→D7b9 에서 7음 G 가 3음 F# 으로 반음 내려가는 그 소리가 이 곡의 정체성이다. ' +
      '주의: 여기 실린 것은 G단조/Bb장조로 가장 널리 가르쳐지는 **교육용 표준 버전**이다. 판본에 따라 A2 마지막 마디를 G7 으로, 마지막 8마디를 다르게 쓰는 차트가 있다. ' +
      '또한 이 곡은 E단조(또는 다른 조)로도 자주 호출되므로, 폼이 익으면 반드시 다른 조로 옮겨 본다.',
    hotspots: [
      {
        at: '5-6마디 (Aø7 D7b9)',
        issue: 'Bb∆7 Eb∆7 의 밝은 소리에서 갑자기 마이너 케이던스로 바뀌는 자리에서 손이 멈춘다.',
        solution: 'Aø7 을 "C-7 의 근음을 반음 내린 것"(C-7 = C Eb G Bb → Aø7 = A C Eb G)으로 잡는다. 이미 1마디에서 친 손 모양의 변형이므로 새 코드가 아니다. D7b9 은 왼손 셸 D-F#-C 에 오른손 Eb 하나만 얹으면 된다.',
      },
      {
        at: 'C섹션 27-28마디 (G-7 C-7 / Bb∆7 Eb∆7)',
        issue: '한 마디 두 코드로 압축되면서 A섹션과 같은 속도로 치다가 박이 밀린다.',
        solution: '27-28마디만 ♩=70 으로 떼어 2박씩 네 코드를 친다. 이 두 마디는 "A섹션 4마디를 절반으로 압축한 것"이라고 이름 붙여 두면 기억이 붙는다.',
      },
    ],
    keyRecordings: ['a-somethin-else'],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-transcription', 'rv-pedagogy'],
      reviewedAt: '2026-02-11',
      rubric: {
        accuracy: 4, terminology: 5, sequencing: 5, playability: 5,
        idiom: 5, integration: 5, assessability: 5, sourcing: 4,
      },
      comments: [
        {
          reviewerId: 'rv-transcription',
          issue: '마지막 8마디(C섹션)는 판본 편차가 커서 단일 정답처럼 제시하면 학습자가 잼 세션에서 혼란을 겪는다.',
          resolution: 'approach 에 "교육용 표준 버전"임을 명시하고 판본 차이가 존재하는 지점을 구체적으로 적었다.',
          severity: 'major',
        },
      ],
    },
  },

  {
    id: 't-jz-first-steps',
    title: 'First Steps (Jazzytory 연습곡 1)',
    composer: 'Jazzytory 편집부',
    year: 2026,
    key: 'C',
    meter: [4, 4],
    form: 'other',
    style: 'swing',
    tempo: [70, 120],
    difficulty: 1,
    levelId: 'L1',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['D-7'] }, { chords: ['G7'] }, { chords: ['C∆7'] }, { chords: [] },   // 1-4
          { chords: ['D-7'] }, { chords: ['G7'] }, { chords: ['C∆7'] }, { chords: [] },   // 5-8
          { chords: ['D-7', 'G7'] }, { chords: ['C∆7'] }, { chords: ['D-7', 'G7'] }, { chords: ['C∆7'] }, // 9-12
        ],
      },
    ],
    teaches: [
      'C 장조 ii-V-I 단 하나를, 두 마디 버전과 한 마디 버전 두 속도로 치기',
      '셸 보이싱 A(1-3-7) 와 B(1-7-3) 를 같은 진행에서 교대로 적용하기',
      '"코드 이름을 읽고 3초 안에 소리 내기" — 코드 심볼 문해력의 첫 관문',
    ],
    approach:
      'Jazzytory 오리지널 연습곡이다. 스탠다드를 만나기 전에 **한 문장만** 완전히 소유하는 것이 목적이다. ' +
      '① 왼손 D-7(D-F-C) → G7(G-B-F) → C∆7(C-E-B) 셸 A 형으로 1-8마디를 ♩=70 에 20회. 손가락은 5-2-1 로 고정한다. ' +
      '② 같은 자리를 셸 B 형(1-7-3: D-C-F / G-F-B / C-B-E)으로 바꿔 20회. 두 형태의 소리 차이(위쪽 음이 3음이냐 7음이냐)를 귀로 구분한다. ' +
      '③ 9-12마디는 같은 문장을 한 마디에 압축한 것이다. 두 마디 버전이 자동화되기 전에는 넘어가지 않는다. ' +
      '④ 오른손은 마디마다 한 음 — 각 코드의 3음(F, B, E)만 — 을 온음표로 놓는다. F→B→E 가 반음·온음으로 이어지는 것을 확인하면 가이드 톤 라인의 원리를 스스로 발견하게 된다. ' +
      '통과 기준: ♩=100 에서 12마디를 손을 보지 않고 세 바퀴.',
    hotspots: [
      {
        at: '9-12마디 (1마디 압축 ii-V)',
        issue: '두 마디 ii-V 에 익숙해진 손이 2박짜리 압축 ii-V 에서 반박씩 밀린다.',
        solution: '메트로놈을 2박에만 울리게(반박자 클릭) 설정하고 9-12마디만 돈다. 코드가 바뀌는 순간이 클릭과 정확히 일치하는지 확인한다.',
      },
    ],
    keyRecordings: [],
    melodyIncluded: false,
    publicDomainOrOriginal: true,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-pedagogy', 'rv-keyboard-technique'],
      reviewedAt: '2026-01-21',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 5, playability: 5,
        idiom: 4, integration: 4, assessability: 5, sourcing: 5,
      },
    },
  },

  {
    id: 't-jz-shell-game',
    title: 'Shell Game (Jazzytory 연습곡 2)',
    composer: 'Jazzytory 편집부',
    year: 2026,
    key: 'C',
    meter: [4, 4],
    form: 'other',
    style: 'swing',
    tempo: [70, 140],
    difficulty: 1,
    levelId: 'L1',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['D-7'] }, { chords: ['G7'] }, { chords: ['C∆7'] }, { chords: [] },   // 1-4   (C)
          { chords: ['G-7'] }, { chords: ['C7'] }, { chords: ['F∆7'] }, { chords: [] },   // 5-8   (F)
          { chords: ['C-7'] }, { chords: ['F7'] }, { chords: ['Bb∆7'] }, { chords: [] },  // 9-12  (Bb)
          { chords: ['F-7'] }, { chords: ['Bb7'] }, { chords: ['Eb∆7'] }, { chords: [] }, // 13-16 (Eb)
        ],
      },
    ],
    teaches: [
      '네 개의 조(C-F-Bb-Eb)를 4도 순환으로 통과하며 ii-V-I 을 이조하기',
      '앞 조의 I 화음이 다음 조의 ii 로 이어지는 "연결 마디"에서 손을 준비하는 법',
      '셸 보이싱을 한 옥타브 안에서 유지해 왼손이 건반 위를 떠돌지 않게 하기',
      '12키 원칙의 첫 단계 — 한 키에서 되는 것은 아직 배운 것이 아님을 체험하기',
    ],
    approach:
      'Jazzytory 오리지널이다. `t-jz-first-steps` 의 한 문장을 **네 조로 굴리는** 것이 전부다. ' +
      '① 먼저 각 4마디 블록을 따로 연습한다. 블록 하나당 ♩=80 으로 10회. 네 블록을 다 익힌 뒤에야 이어 붙인다. ' +
      '② 연결의 비밀은 4·8·12마디에 있다. C∆7 의 다음은 G-7 이다 — 손은 아래로 5도만 내려가면 된다. 이 "다음 조의 ii 를 미리 본다"는 습관이 12키 순환의 핵심이다. ' +
      '③ 왼손 셸은 가운데 C 아래 한 옥타브 안에서만 움직인다. 근음이 너무 낮아지면 옥타브를 올려 위치를 리셋한다(이것이 실전 컴핑의 규칙이다). ' +
      '④ 16마디를 돌 수 있게 되면 다음 네 조(Ab-Db-Gb-B)로 같은 패턴을 스스로 써 본다. 이 곡의 진짜 목적은 악보를 보지 않고 12키를 도는 것이다. ' +
      '통과 기준: ♩=120 에서 16마디 무정지 3회, 그리고 어느 마디에서 멈춰도 그 자리의 조 이름을 즉답할 수 있을 것.',
    hotspots: [
      {
        at: '4→5마디, 8→9마디, 12→13마디 (조 전환)',
        issue: '조가 바뀌는 순간 손이 멈추고 한 박 늦는다. 머리로 다음 코드를 "계산"하기 때문이다.',
        solution: '전환 지점 두 마디씩(4-5, 8-9, 12-13)만 떼어 각각 30회 반복한다. 계산이 아니라 손 모양의 기억이 될 때까지. 공통음(예: C∆7 의 G 가 G-7 의 근음)을 표시해 두면 이동이 짧아진다.',
      },
      {
        at: '13-16마디 (Eb 조)',
        issue: '검은 건반이 늘면서 셸 운지가 무너진다.',
        solution: 'F-7(F-Ab-Eb), Bb7(Bb-D-Ab), Eb∆7(Eb-G-D) 만 따로 ♩=60 으로 40회. 검은 건반이 낀 셸은 손가락 5-2-1 대신 5-3-1 이 편할 수 있으니 자기 손에 맞는 번호를 정해 고정한다.',
      },
    ],
    keyRecordings: [],
    melodyIncluded: false,
    publicDomainOrOriginal: true,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-pedagogy', 'rv-keyboard-technique', 'rv-chord-scale'],
      reviewedAt: '2026-01-21',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 5, playability: 5,
        idiom: 4, integration: 4, assessability: 5, sourcing: 5,
      },
      comments: [
        {
          reviewerId: 'rv-keyboard-technique',
          issue: '4도 순환을 계속 내려가면 왼손이 건반 저역으로 떨어져 소리가 탁해지고 손목이 굳는다.',
          resolution: 'approach ③ 에 "한 옥타브 안에서 움직이고 필요하면 옥타브를 올려 리셋한다"는 실전 규칙을 명시했다.',
          severity: 'major',
        },
      ],
    },
  },

  /* ═══════════════════════════════════════════════════════════════════════
     L2 — 보이싱과 컴핑이 붙는 스탠다드
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: 't-minor-blues-c',
    title: 'C 마이너 블루스 (12마디)',
    composer: 'Traditional',
    key: 'C-',
    meter: [4, 4],
    form: 'minor-blues-12',
    style: 'blues',
    tempo: [120, 240],
    difficulty: 2,
    levelId: 'L2',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['C-7'] }, { chords: [] }, { chords: [] }, { chords: [] },              // 1-4
          { chords: ['F-7'] }, { chords: [] }, { chords: ['C-7'] }, { chords: [] },         // 5-8
          { chords: ['Dø7'] }, { chords: ['G7alt'] }, { chords: ['C-7'] }, { chords: ['Dø7', 'G7alt'] }, // 9-12
        ],
      },
    ],
    teaches: [
      '마이너 블루스의 iiø-V7alt-i 케이던스 — 메이저 블루스와 다른 착지 감각',
      '한 코드가 네 마디 지속될 때 왼손이 리듬으로 시간을 만드는 법(정적 화성 컴핑)',
      'C 도리안·C 에올리안·C 하모닉마이너를 상황에 따라 갈아 끼우기',
      'G7alt 의 얼터드 텐션(b9 #9 #11 b13)을 실제 손 모양으로 잡기',
    ],
    approach:
      '① 코드는 네 개뿐이다(C-7, F-7, Dø7, G7alt). 먼저 이 네 개의 왼손 셸을 각각 20회씩 잡는다. G7alt 는 오늘 셸(G-B-F)만으로 충분하다. ' +
      '② 어려운 것은 화성이 아니라 **1-4마디**다. 같은 C-7 이 네 마디 이어지는 동안 무엇을 할지 정해야 한다. 오늘의 규칙: 마디 2·4박에만 왼손을 짧게 찍고, 나머지는 침묵. 침묵이 시간을 만든다. ' +
      '③ 오른손은 C 블루스 스케일(C-Eb-F-Gb-G-Bb) 여섯 음만 사용한다. 9-10마디에서만 G7alt 의 Ab(=b13) 을 한 번 건드려 색을 바꾼다. ' +
      '④ 12마디 Dø7 G7alt 턴어라운드와 다음 코러스 1마디를 3마디 루프로 40회 반복한다. ' +
      '9마디는 판본에 따라 Ab7(bVI7) 로도 친다. 두 버전을 모두 들어보고 오늘은 Dø7 로 통일한다.',
    hotspots: [
      {
        at: '1-4마디 (C-7 4마디 지속)',
        issue: '코드가 바뀌지 않는 구간에서 연주가 멈춘 것처럼 들리고, 마디 수를 잃는다.',
        solution: '왼손으로 "찰스턴 리듬"(1박 앤드 + 2박 반) 한 패턴만 정해 네 마디 내내 반복한다. 화성이 정지해 있을 때 시간을 만드는 것은 리듬이다. 발로 1·3박을 밟으며 마디를 센다.',
      },
      {
        at: '9-10마디 (Dø7 → G7alt)',
        issue: 'G7alt 앞에서 오른손이 무슨 음을 칠지 몰라 멈춘다.',
        solution: 'G7alt 위에서는 Ab 멜로딕 마이너(= G 얼터드 스케일)를 쓴다. 그러나 오늘은 스케일을 달리지 말고 "Ab-Bb-Db-Eb" 네 음만 골라 두 박에 두 음씩 놓는다. 재료를 줄이면 손이 움직인다.',
      },
    ],
    keyRecordings: ['a-giant-steps'],
    melodyIncluded: false,
    publicDomainOrOriginal: true,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-barry-harris'],
      reviewedAt: '2026-02-18',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 4, playability: 5,
        idiom: 5, integration: 5, assessability: 4, sourcing: 4,
      },
      comments: [
        {
          reviewerId: 'rv-barry-harris',
          issue: '9마디를 Dø7 하나로 고정하면 bVI7(Ab7) 을 쓰는 다수 판본과 어긋난다.',
          resolution: 'approach 마지막에 Ab7 판본을 병기하고, 학습 단계에서는 Dø7 로 통일하도록 지시했다.',
          severity: 'minor',
        },
      ],
    },
  },

  {
    id: 't-all-of-me',
    title: 'All of Me',
    composer: 'Gerald Marks & Seymour Simons',
    year: 1931,
    key: 'C',
    meter: [4, 4],
    form: 'ABAC-32',
    style: 'swing',
    tempo: [120, 200],
    difficulty: 2,
    levelId: 'L2',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['C∆7'] }, { chords: [] }, { chords: ['E7'] }, { chords: [] },   // 1-4
          { chords: ['A7'] }, { chords: [] }, { chords: ['D-7'] }, { chords: [] },   // 5-8
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['E7'] }, { chords: [] }, { chords: ['A-7'] }, { chords: [] },   // 9-12
          { chords: ['D7'] }, { chords: [] }, { chords: ['D-7'] }, { chords: ['G7'] }, // 13-16
        ],
      },
      {
        label: 'A2',
        bars: [
          { chords: ['C∆7'] }, { chords: [] }, { chords: ['E7'] }, { chords: [] },   // 17-20
          { chords: ['A7'] }, { chords: [] }, { chords: ['D-7'] }, { chords: [] },   // 21-24
        ],
      },
      {
        label: 'C',
        bars: [
          { chords: ['F∆7'] }, { chords: ['F-7', 'Bb7'] }, { chords: ['C∆7'] }, { chords: ['E-7', 'A7'] }, // 25-28
          { chords: ['D-7'] }, { chords: ['G7'] }, { chords: ['C6/9'] }, { chords: ['D-7', 'G7'] },        // 29-32
        ],
      },
    ],
    teaches: [
      '세컨더리 도미넌트 연쇄(E7 → A7 → D7 → G7)가 어떻게 조 밖 소리를 만들며 집으로 오는지',
      'IV∆7 → iv-7 bVII7 (F∆7 → F-7 Bb7) 백도어 케이던스의 첫 경험',
      '두 마디에 한 코드인 여유로운 화성 리듬 위에서 컴핑 리듬을 설계하기',
      'ABAC 32마디 폼에서 A 와 A2 가 같고 B 와 C 가 다르다는 구조 인식',
    ],
    approach:
      '① 이 곡의 1-8마디는 코드가 두 마디에 하나뿐이다. 입문자에게 이보다 좋은 컴핑 교재는 없다. 먼저 왼손 셸로 C∆7 → E7 → A7 → D-7 만 ♩=120 에 20회. ' +
      '② 그다음이 진짜 과제다. 같은 코드가 두 마디 이어지는 동안 **언제 칠 것인지**를 정한다. 오늘의 규칙: 첫 마디 2박 뒤, 둘째 마디 4박 앞 — 두 번만 친다. 나머지는 비운다. ' +
      '③ E7·A7·D7 은 모두 "조 밖 소리"인 세컨더리 도미넌트다. 각각의 3음(G#, C#, F#)을 오른손으로 한 음씩만 짚어 보면 왜 색이 바뀌는지 즉시 들린다. ' +
      '④ 마지막 8마디(C섹션)만 따로 30회. 25-26마디 F∆7 → F-7 Bb7 은 재즈에서 가장 자주 쓰이는 "뒷문으로 들어가는" 케이던스이고, 이 소리를 알면 수십 곡이 쉬워진다. ' +
      '32마디 D-7 G7 은 다음 코러스의 시작이다. 끝내지 말고 굴려라.',
    hotspots: [
      {
        at: 'C섹션 25-26마디 (F∆7 → F-7 Bb7)',
        issue: '장3도(A)가 단3도(Ab)로 바뀌는 순간 손이 반음을 놓치고 화음이 흐려진다.',
        solution: 'F∆7(F-A-E) → F-7(F-Ab-Eb) 두 코드만 번갈아 30회. 움직이는 음은 A→Ab, E→Eb 두 개뿐임을 눈으로 확인한다. Bb7 은 F-7 에서 근음만 Bb 로 옮기면 된다.',
      },
      {
        at: '13-16마디 (D7 → D-7 G7)',
        issue: 'D7 에서 D-7 으로 같은 근음의 성격이 바뀌는 자리를 흘려 듣고 그냥 D-7 으로 쳐 버린다.',
        solution: 'D7 의 3음 F# 과 D-7 의 3음 F 를 오른손으로 번갈아 눌러 반음 차이를 귀에 새긴다. D7 은 G7 을 부르는 도미넌트, D-7 은 C 로 돌아가는 ii 다 — 기능이 다르다.',
      },
    ],
    keyRecordings: [],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-pedagogy'],
      reviewedAt: '2026-02-18',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 5, playability: 5,
        idiom: 5, integration: 4, assessability: 5, sourcing: 4,
      },
    },
  },


  {
    id: 't-summertime',
    title: 'Summertime',
    composer: 'George Gershwin',
    year: 1935,
    key: 'A-',
    meter: [4, 4],
    form: 'other',
    style: 'swing',
    tempo: [80, 150],
    difficulty: 2,
    levelId: 'L2',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['A-7'] }, { chords: [] }, { chords: ['E7b9'] }, { chords: [] },              // 1-4
          { chords: ['A-7'] }, { chords: [] }, { chords: ['Bø7', 'E7b9'] }, { chords: ['A-7'] },  // 5-8
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['D-7'] }, { chords: [] }, { chords: ['A-7'] }, { chords: [] },                        // 9-12
          { chords: ['Bø7', 'E7b9'] }, { chords: ['A-7'] }, { chords: ['Bø7', 'E7b9'] }, { chords: ['A-7'] }, // 13-16
        ],
      },
    ],
    teaches: [
      '16마디 짧은 폼 — 코러스를 여러 번 돌며 전개를 설계하는 연습에 최적',
      '마이너 조성의 iiø-V7b9-i 를 한 곡 안에서 네 번 반복해 자동화하기',
      '정적인 i 화음 구간에서 왼손 루트리스 보이싱으로 색을 바꾸는 법',
      'A 하모닉 마이너(E7b9 위) 와 A 도리안/에올리안(A-7 위) 의 교체 타이밍',
    ],
    approach:
      '① 이 곡의 재료는 사실상 두 코드(A-7, E7b9)뿐이다. 먼저 왼손으로 A-7(A-C-G) ↔ E7b9(E-G#-D + F 한 음)를 번갈아 30회. ' +
      '② 폼은 8마디씩 두 덩어리다. 9마디에서 D-7(iv) 로 한 번 열리는 것이 유일한 사건이며, 여기서 색이 바뀌는 것을 반드시 귀로 잡아야 한다. ' +
      '③ 오른손은 A 블루스/마이너 펜타토닉(A-C-D-E-G) 다섯 음만으로 한 코러스, 그다음 코러스에서 E7b9 위에서만 F 와 G# 을 추가한다. 두 음을 추가했을 뿐인데 곡이 "재즈처럼" 들리는 순간을 경험하는 것이 오늘의 목표다. ' +
      '④ 16마디밖에 되지 않으므로 **연속 4코러스**를 목표로 한다. 코러스마다 음역(1코러스 낮게, 2코러스 중간, 3코러스 높게, 4코러스 다시 낮게)만 바꿔도 전개가 생긴다. ' +
      '여기 실린 것은 A단조로 가장 널리 쓰이는 **교육용 단순화 버전**이다. 실제 연주에서는 D-7 구간을 늘리거나 i 화음을 A-6 로 치는 판본이 흔하다.',
    hotspots: [
      {
        at: '7마디 / 13·15마디 (Bø7 E7b9 — 한 마디 두 코드)',
        issue: '앞의 두 마디짜리 화성 리듬에 익숙해진 상태에서 갑자기 2박씩 바뀌어 박이 밀린다.',
        solution: '해당 마디와 다음 마디(A-7)를 2마디 루프로 30회. Bø7(B-D-A) → E7b9(E-G#-D) 에서 D 가 공통음으로 남는 것을 확인하면 손 이동이 최소화된다.',
      },
      {
        at: '1-2마디, 5-6마디 (A-7 지속)',
        issue: '코드가 두 마디씩 멈춰 있어 연주가 정지한 것처럼 들린다.',
        solution: '왼손 A-7 을 한 번 치고 버티지 말고, 2박·4박 앤드에 짧게 두 번 찍는다. 정적 화성에서 시간을 만드는 것은 화성이 아니라 리듬이다.',
      },
    ],
    keyRecordings: [],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'faculty-pending',
      reviewers: ['rv-chord-scale', 'rv-transcription'],
      reviewedAt: '2026-03-03',
      rubric: {
        accuracy: 4, terminology: 5, sequencing: 5, playability: 5,
        idiom: 4, integration: 4, assessability: 4, sourcing: 4,
      },
      comments: [
        {
          reviewerId: 'rv-transcription',
          issue: '이 곡은 판본·연주자별 화성 편차가 매우 커서 단일 차트를 정답처럼 제시하면 안 된다.',
          resolution: 'approach 마지막 문단에 "교육용 단순화 버전"임과 대표적 변형(D-7 구간 확장, A-6 사용)을 명시했다.',
          severity: 'major',
        },
      ],
    },
  },

  {
    id: 't-fly-me-to-the-moon',
    title: 'Fly Me to the Moon',
    composer: 'Bart Howard',
    year: 1954,
    key: 'C',
    meter: [4, 4],
    form: 'other',
    style: 'swing',
    tempo: [110, 170],
    difficulty: 1,
    levelId: 'L2',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['A-7'] }, { chords: ['D-7'] }, { chords: ['G7'] }, { chords: ['C∆7'] },  // 1-4
          { chords: ['F∆7'] }, { chords: ['Bø7'] }, { chords: ['E7'] }, { chords: ['A-7', 'A7'] }, // 5-8
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['D-7'] }, { chords: ['G7'] }, { chords: ['C∆7'] }, { chords: [] },        // 9-12
          { chords: ['F∆7'] }, { chords: ['Bø7'] }, { chords: ['E7'] }, { chords: ['A-7'] },   // 13-16
        ],
      },
      {
        label: 'A2',
        bars: [
          { chords: ['A-7'] }, { chords: ['D-7'] }, { chords: ['G7'] }, { chords: ['C∆7'] },   // 17-20
          { chords: ['F∆7'] }, { chords: ['Bø7'] }, { chords: ['E7'] }, { chords: ['A-7', 'A7'] }, // 21-24
        ],
      },
      {
        label: 'C',
        bars: [
          { chords: ['D-7'] }, { chords: ['G7'] }, { chords: ['C∆7'] }, { chords: ['A-7'] },   // 25-28
          { chords: ['D-7'] }, { chords: ['G7'] }, { chords: ['C∆7'] }, { chords: ['Bø7', 'E7'] }, // 29-32
        ],
      },
    ],
    teaches: [
      '4도 순환(circle of fourths) 진행을 한 마디 한 코드 속도로 손에 새기기',
      '다이어토닉 7화음 여섯 개(A-7 D-7 G7 C∆7 F∆7 Bø7)를 한 조에서 모두 만나기',
      '마이너 ii-V-i (Bø7 E7 A-7) 와 메이저 ii-V-I 의 차이를 같은 곡 안에서 비교하기',
      '32마디 폼을 A-B-A-C 네 덩어리로 나눠 기억하는 폼 내비게이션',
    ],
    approach:
      '① 이 곡은 "한 마디에 한 코드씩 4도씩 내려간다"는 규칙 하나로 거의 전부가 설명된다. 먼저 코드 이름을 소리 내어 읽으며 A-7 → D-7 → G7 → C∆7 이 4도 순환임을 눈으로 확인한다. ' +
      '② 왼손 셸(1-3-7)로 1-8마디만 ♩=100 에 30회 돌린다. 근음이 A→D→G→C→F→B→E→A 로 계속 4도 위(=5도 아래)로 움직이므로 왼손은 사실상 한 방향으로만 걷는다. ' +
      '③ 오른손은 오늘 멜로디를 치지 않는다(본 서비스는 멜로디를 제공하지 않는다). 대신 각 코드의 3음·7음 두 음만 오른손으로 눌러 가이드 톤 라인을 만든다. 라인이 거의 움직이지 않는 것을 귀로 확인하는 것이 오늘의 성과다. ' +
      '④ 8마디의 A7 은 "다음 D-7 을 데려오는 도미넌트"다. 이 한 자리가 곡을 계속 굴러가게 만든다. ' +
      '입문자에게 이 곡의 가치는 난이도가 아니라 **성공 경험**이다. 오늘 안에 32마디를 끊김 없이 한 바퀴 도는 것을 목표로 한다.',
    hotspots: [
      {
        at: '6-8마디 (Bø7 E7 A-7)',
        issue: '하프디미니시 Bø7 의 손 모양이 낯설어 E7 진입이 늦는다.',
        solution: 'Bø7 을 "D-7 의 근음을 반음 내린 코드"(D-7 = D F A C → Bø7 = B D F A)로 외운다. 이미 아는 D-7 에서 한 음만 추가/이동하는 방식이 기억에 훨씬 오래 남는다.',
      },
      {
        at: 'C섹션 28마디 (A-7)',
        issue: 'C∆7 로 해결된 뒤 다시 A-7 으로 되돌아가는 자리에서 폼을 잃고 A 섹션으로 착각한다.',
        solution: '25-32마디만 따로 루프한다. 이 마지막 8마디는 "4도 순환을 한 번 더 반복하고 Bø7 E7 으로 문을 닫는" 구조임을 소리로 익힌다.',
      },
    ],
    keyRecordings: [],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-pedagogy'],
      reviewedAt: '2026-02-11',
      rubric: {
        accuracy: 4, terminology: 5, sequencing: 5, playability: 5,
        idiom: 4, integration: 4, assessability: 5, sourcing: 4,
      },
      comments: [
        {
          reviewerId: 'rv-chord-scale',
          issue: '판본에 따라 12마디를 C7(V of F) 로, 16마디를 E7sus4 E7 로 쓰는 차트가 흔한데 여기엔 없다.',
          resolution: '입문 첫 32마디 곡이므로 변형을 배제한 최소 골격만 싣고, 변형은 L5 리하모니제이션 모듈에서 다루기로 했다.',
          severity: 'minor',
        },
      ],
    },
  },

  {
    id: 't-there-will-never-be-another-you',
    title: 'There Will Never Be Another You',
    composer: 'Harry Warren',
    year: 1942,
    key: 'Eb',
    meter: [4, 4],
    form: 'ABAC-32',
    style: 'swing',
    tempo: [160, 240],
    difficulty: 3,
    levelId: 'L2',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['Eb∆7'] }, { chords: [] }, { chords: ['Dø7'] }, { chords: ['G7b9'] },  // 1-4
          { chords: ['C-7'] }, { chords: [] }, { chords: ['Bb-7'] }, { chords: ['Eb7'] },   // 5-8
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['Ab∆7'] }, { chords: [] }, { chords: ['Db7'] }, { chords: [] },        // 9-12
          { chords: ['Eb∆7'] }, { chords: ['C-7'] }, { chords: ['F-7'] }, { chords: ['Bb7'] }, // 13-16
        ],
      },
      {
        label: 'A2',
        bars: [
          { chords: ['Eb∆7'] }, { chords: [] }, { chords: ['Dø7'] }, { chords: ['G7b9'] },  // 17-20
          { chords: ['C-7'] }, { chords: [] }, { chords: ['Bb-7'] }, { chords: ['Eb7'] },   // 21-24
        ],
      },
      {
        label: 'C',
        bars: [
          { chords: ['Ab∆7'] }, { chords: ['Db7'] }, { chords: ['Eb∆7'] }, { chords: ['C-7'] },   // 25-28
          { chords: ['F-7'] }, { chords: ['Bb7'] }, { chords: ['Eb∆7'] }, { chords: ['F-7', 'Bb7'] }, // 29-32
        ],
      },
    ],
    teaches: [
      'IV 로 가는 문(Bb-7 Eb7)과 bVII7 백도어(Db7 → Eb∆7)를 한 곡에서 비교하기',
      '빠른 미디엄 업 템포에서도 무너지지 않는 왼손 루트리스 A/B 전환',
      'iiiø-VI7b9(Dø7 G7b9) 가 마이너처럼 들리지만 결국 C-7 으로 가는 기능 읽기',
      '잼 세션 필수곡 — Eb 조(관악기 친화 조)에서의 위치 감각',
    ],
    approach:
      '① 이 곡은 "빠르게 치는 법"이 아니라 "느리게 정확히 아는 법"부터다. ♩=100 으로 시작한다. ' +
      '② A섹션의 골격은 Eb∆7 → (Dø7 G7b9) → C-7 → (Bb-7 Eb7) 이다. 괄호 안 두 쌍은 각각 "C-7 으로 가는 문"과 "Ab∆7 로 가는 문"이다. 문 두 개만 따로 각각 30회. ' +
      '③ 9-12마디 Ab∆7 → Db7 은 이 곡의 얼굴이다. Db7 은 Eb 조 밖 소리(bVII7)이며 13마디 Eb∆7 로 뒷문을 통해 들어간다. Ab∆7 → Db7 → Eb∆7 세 코드만 40회 반복하면 이 소리가 몸에 남는다. ' +
      '④ 폼이 익으면 왼손을 루트리스 A형(3-5-7-9)으로 바꾼다. 미디엄 업 템포에서 셸만으로는 소리가 얇다. ' +
      '통과 기준: ♩=200 에서 32마디 두 바퀴를 왼손 루트리스로 컴핑하며 오른손은 각 코드의 3음·7음만 조준.',
    hotspots: [
      {
        at: 'A섹션 3-5마디 (Dø7 G7b9 → C-7)',
        issue: 'Eb 장조에서 갑자기 마이너 케이던스가 나와 스케일 선택이 얼어붙는다.',
        solution: 'Dø7 G7b9 C-7 을 "C 마이너의 ii-V-i"로 이름 붙인다. 재료는 C 하모닉 마이너 하나면 충분하다. 세 코드만 ♩=80 으로 30회 돈 뒤 원곡 템포로 올린다.',
      },
      {
        at: 'C섹션 25-27마디 (Ab∆7 Db7 → Eb∆7, 한 마디씩 압축)',
        issue: 'B섹션에서 두 마디씩 쓰던 같은 진행이 마지막 8마디에서는 한 마디씩으로 압축되어 손이 늦는다.',
        solution: 'B섹션(9-13마디)과 C섹션(25-27마디)을 나란히 놓고 "같은 문장, 두 배 속도"임을 인지시킨다. 압축 구간만 메트로놈 ♩=120 에 30회.',
      },
    ],
    keyRecordings: [],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-barry-harris'],
      reviewedAt: '2026-03-03',
      rubric: {
        accuracy: 4, terminology: 5, sequencing: 5, playability: 4,
        idiom: 5, integration: 4, assessability: 5, sourcing: 4,
      },
    },
  },

  /* ═══════════════════════════════════════════════════════════════════════
     L3 — 코드 스케일과 선율
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: 't-take-the-a-train',
    title: 'Take the "A" Train',
    composer: 'Billy Strayhorn',
    year: 1939,
    key: 'C',
    meter: [4, 4],
    form: 'AABA-32',
    style: 'swing',
    tempo: [150, 220],
    difficulty: 2,
    levelId: 'L3',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['C∆7'] }, { chords: [] }, { chords: ['D7#11'] }, { chords: [] },   // 1-4
          { chords: ['D-7'] }, { chords: ['G7'] }, { chords: ['C∆7'] }, { chords: ['D-7', 'G7'] }, // 5-8
        ],
      },
      {
        label: 'A2',
        bars: [
          { chords: ['C∆7'] }, { chords: [] }, { chords: ['D7#11'] }, { chords: [] },   // 9-12
          { chords: ['D-7'] }, { chords: ['G7'] }, { chords: ['C∆7'] }, { chords: [] }, // 13-16
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['F∆7'] }, { chords: [] }, { chords: [] }, { chords: [] },          // 17-20
          { chords: ['D-7'] }, { chords: ['G7'] }, { chords: ['D-7'] }, { chords: ['G7'] }, // 21-24
        ],
      },
      {
        label: 'A3',
        bars: [
          { chords: ['C∆7'] }, { chords: [] }, { chords: ['D7#11'] }, { chords: [] },   // 25-28
          { chords: ['D-7'] }, { chords: ['G7'] }, { chords: ['C∆7'] }, { chords: [] }, // 29-32
        ],
      },
    ],
    teaches: [
      'II7#11 (리디안 도미넌트) — 한 코드가 곡 전체의 인상을 결정하는 사례',
      'AABA 폼에서 브릿지가 IV 로 열렸다가 ii-V 로 되돌아오는 표준 설계',
      '리디안 ♭7 스케일(D-E-F#-G#-A-B-C)을 실제 곡 안에서 사용하기',
      '엘링턴 오케스트라식 컴핑 — 적게 치고 크게 스윙하기',
    ],
    approach:
      '① 오늘의 주인공은 3마디의 D7#11 딱 하나다. 먼저 D7(D-F#-C) 셸을 잡고 오른손으로 G# 한 음을 더한다. 이 한 음이 이 곡의 정체성이다. ' +
      '② A섹션은 사실상 C∆7 2마디 + D7#11 2마디 + D-7 G7 2마디 + C∆7 2마디다. ♩=140 으로 A 를 10회. ' +
      '③ 브릿지(17-24)는 F∆7 이 네 마디 통째로 지속된다. 여기서 학습자 대부분이 마디를 잃는다. 왼손으로 네 마디 동안 리듬 패턴 하나를 끝까지 유지하며 발로 마디를 센다. ' +
      '④ 오른손 즉흥은 D7#11 위에서만 D 리디안 ♭7(D-E-F#-G#-A-B-C) 을 쓰고, 나머지는 C 장조 음만 쓴다. "한 코드에서만 스케일을 갈아 끼운다"는 경험이 L3 의 핵심이다. ' +
      '통과 기준: ♩=180 에서 32마디 두 바퀴, 3마디 D7#11 위에서 반드시 G# 을 한 번 이상 들리게 할 것.',
    hotspots: [
      {
        at: 'B섹션 17-20마디 (F∆7 4마디 지속)',
        issue: '코드가 바뀌지 않는 네 마디에서 지금이 몇 마디째인지 잃는다.',
        solution: '브릿지 네 마디를 "2+2"로 쪼개 왼손 리듬을 두 마디마다 살짝 바꾼다(첫 2마디는 2·4박, 다음 2마디는 앤드박). 리듬에 구획이 생기면 마디 감각이 살아난다.',
      },
      {
        at: 'A섹션 3-5마디 (D7#11 → D-7)',
        issue: '같은 근음 D 위에서 도미넌트가 마이너로 바뀌는데 손이 그대로 남아 소리가 뭉갠다.',
        solution: 'D7#11(F#·C·G#) → D-7(F·C) 로 3음이 F#→F 로 반음 내려가는 것만 30회 반복한다. 이 반음 하나가 "밖에서 안으로 들어오는" 소리다.',
      },
    ],
    keyRecordings: ['a-ellington-blanton-webster'],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-transcription', 'rv-pedagogy'],
      reviewedAt: '2026-03-10',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 5, playability: 5,
        idiom: 5, integration: 5, assessability: 5, sourcing: 4,
      },
    },
  },

  {
    id: 't-satin-doll',
    title: 'Satin Doll',
    composer: 'Duke Ellington & Billy Strayhorn',
    year: 1953,
    key: 'C',
    meter: [4, 4],
    form: 'AABA-32',
    style: 'swing',
    tempo: [110, 160],
    difficulty: 2,
    levelId: 'L3',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['D-7', 'G7'] }, { chords: ['D-7', 'G7'] }, { chords: ['E-7', 'A7'] }, { chords: ['E-7', 'A7'] }, // 1-4
          { chords: ['A-7', 'D7'] }, { chords: ['Ab-7', 'Db7'] }, { chords: ['C∆7'] }, { chords: ['D-7', 'G7'] },     // 5-8
        ],
      },
      {
        label: 'A2',
        bars: [
          { chords: ['D-7', 'G7'] }, { chords: ['D-7', 'G7'] }, { chords: ['E-7', 'A7'] }, { chords: ['E-7', 'A7'] }, // 9-12
          { chords: ['A-7', 'D7'] }, { chords: ['Ab-7', 'Db7'] }, { chords: ['C∆7'] }, { chords: [] },                // 13-16
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['G-7', 'C7'] }, { chords: ['G-7', 'C7'] }, { chords: ['F∆7'] }, { chords: [] },   // 17-20
          { chords: ['A-7', 'D7'] }, { chords: ['A-7', 'D7'] }, { chords: ['D-7'] }, { chords: ['G7'] }, // 21-24
        ],
      },
      {
        label: 'A3',
        bars: [
          { chords: ['D-7', 'G7'] }, { chords: ['D-7', 'G7'] }, { chords: ['E-7', 'A7'] }, { chords: ['E-7', 'A7'] }, // 25-28
          { chords: ['A-7', 'D7'] }, { chords: ['Ab-7', 'Db7'] }, { chords: ['C∆7'] }, { chords: [] },                // 29-32
        ],
      },
    ],
    teaches: [
      '한 마디 두 코드(2박 ii-V) 를 끊기지 않게 잇는 왼손 이동 경제',
      '반음 아래에서 미끄러져 들어오는 트라이톤 서브(Ab-7 Db7 → C∆7)의 첫 실물',
      'AABA 32마디에서 브릿지(B)가 IV 로 열리는 전형적 설계 읽기',
      '엘링턴 어법의 컴핑 — 코드를 "치는" 것이 아니라 리듬으로 "말하는" 감각',
    ],
    approach:
      '① 이 곡은 사실상 "2박짜리 ii-V 의 행진"이다. 먼저 D-7 G7 / E-7 A7 두 쌍만 왼손 셸로 각각 30회. 한 마디 안에 두 코드가 들어가므로 손은 2박마다 움직인다. ' +
      '② A섹션을 ♩=100 으로 10회 돈다. 절대 서두르지 말 것. 6마디 Ab-7 Db7 은 "C∆7 로 반음 미끄러져 들어가는 문"이므로 여기서 밀리면 7마디 착지가 무너진다. ' +
      '③ 브릿지(17-24마디)는 F 장조로 열린다. G-7 C7 → F∆7 은 이미 아는 ii-V-I 이다. 새 코드가 아니라 "다른 조의 같은 문장"이다. ' +
      '④ 마지막으로 컴핑 리듬을 정한다. 한 마디에 두 코드가 있다고 두 번 다 강하게 치면 음악이 뻣뻣해진다. 첫 코드는 앤드박에 짧게, 둘째 코드는 3박에 눌러 — 이 한 패턴만 32마디 내내 유지한다. ' +
      '통과 기준: ♩=140 에서 32마디를 왼손 컴핑만으로 두 바퀴, 마디를 잃지 않고.',
    hotspots: [
      {
        at: 'A섹션 6마디 (Ab-7 Db7)',
        issue: '검은 건반 셸이 연속으로 나와 손 모양이 무너지고 7마디 C∆7 진입이 늦는다.',
        solution: 'Ab-7(Ab-Cb-Gb) → Db7(Db-F-Cb) → C∆7(C-E-B) 세 코드만 ♩=60 으로 40회. Db7 의 7음 Cb 가 C∆7 의 7음 B 로 반음 내려가는 것(사실 같은 음 이름)을 확인하면 손이 거의 움직이지 않아도 된다는 걸 알게 된다.',
      },
      {
        at: 'B섹션 21-24마디 (A-7 D7 ×2 → D-7 G7)',
        issue: '같은 재료가 반복되면서 지금이 브릿지 몇 마디째인지 잃는다.',
        solution: '브릿지를 "F 로 2마디 열고(17-20), A-7 D7 로 2마디 밀고(21-22), D-7 G7 으로 문 닫기(23-24)" 세 덩어리로 이름 붙여 외운다. 덩어리에 이름이 붙으면 폼을 잃지 않는다.',
      },
    ],
    keyRecordings: [],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-keyboard-technique'],
      reviewedAt: '2026-02-25',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 5, playability: 4,
        idiom: 5, integration: 4, assessability: 5, sourcing: 4,
      },
      comments: [
        {
          reviewerId: 'rv-keyboard-technique',
          issue: '6마디 Ab-7 Db7 은 L2 학습자의 손에 검은 건반 밀집도가 높아 손목 회전이 과해진다.',
          resolution: 'hotspot 에 ♩=60 분리 연습과 공통음 유지 전략을 명시하고, 운지를 바꾸지 말고 위치를 낮게 유지하도록 안내했다.',
          severity: 'minor',
        },
      ],
    },
  },

  {
    id: 't-blue-bossa',
    title: 'Blue Bossa',
    composer: 'Kenny Dorham',
    year: 1963,
    key: 'C-',
    meter: [4, 4],
    form: 'other',
    style: 'bossa',
    tempo: [140, 190],
    difficulty: 2,
    levelId: 'L3',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['C-7'] }, { chords: [] }, { chords: ['F-7'] }, { chords: [] },      // 1-4
          { chords: ['Dø7'] }, { chords: ['G7b9'] }, { chords: ['C-7'] }, { chords: [] }, // 5-8
          { chords: ['Eb-7'] }, { chords: ['Ab7'] }, { chords: ['Db∆7'] }, { chords: [] }, // 9-12
          { chords: ['Dø7'] }, { chords: ['G7b9'] }, { chords: ['C-7'] }, { chords: ['Dø7', 'G7b9'] }, // 13-16
        ],
      },
    ],
    teaches: [
      '마이너 ii-V-i (Dø7 G7b9 C-7) 와 메이저 ii-V-I (Eb-7 Ab7 Db∆7) 을 한 곡에서 직접 비교',
      '반음 위 조성(Db 장조)으로의 순간 전조와 복귀 — 가장 짧고 명확한 전조 훈련',
      '보사노바 컴핑 — 왼손 근음/오른손 코드의 분업과 2마디 패턴',
      '16마디 짧은 폼에서 코러스 간 전개를 설계하는 능력',
    ],
    approach:
      '① 이 곡은 "이틀이면 된다"는 평판대로 재료가 적다. 먼저 두 개의 ii-V 만 따로 익힌다. 마이너 문 = Dø7 G7b9 C-7, 메이저 문 = Eb-7 Ab7 Db∆7. 각각 30회. ' +
      '② 9마디의 전조는 앞의 C-7 에서 Eb-7 으로 3도 위로 올라가는 것이다. 8-9마디만 떼어 20회 반복해 "문이 열리는" 소리를 몸에 새긴다. ' +
      '③ 보사 리듬은 오늘 딱 하나만 쓴다 — 왼손은 1박과 3박 앤드에 근음, 오른손은 코드를 2마디 패턴으로 반복. 스윙 8분음표가 아니라 **곧은(straight) 8분음표**임을 반드시 지킨다. ' +
      '④ 오른손 즉흥은 1-8마디에서 C 도리안(C-D-Eb-F-G-A-Bb) 하나로 버티고, 9-12마디만 Db 장조 음으로 갈아탄다. 스케일을 두 개만 쓰는 것이 오늘의 규칙이다. ' +
      '청음: 이 앨범 목록에서 보사 필의 기준은 《Getz/Gilberto》다(이 앨범에 이 곡이 수록된 것은 아니며, 리듬 감각의 표본으로 듣는다).',
    hotspots: [
      {
        at: '8-9마디 (C-7 → Eb-7 전조 진입)',
        issue: 'C 단조에서 Db 장조로 넘어가는 순간 손과 귀가 분리되어 9마디를 놓친다.',
        solution: 'C-7 → Eb-7 두 코드만 번갈아 40회. 두 코드의 공통음(Eb, Bb→Bb 없음: C-7 = C Eb G Bb, Eb-7 = Eb Gb Bb Db)에서 Eb 와 Bb 가 그대로 남는 것을 확인하면 전조가 도약이 아니라 미끄러짐으로 느껴진다.',
      },
      {
        at: '12-13마디 (Db∆7 → Dø7)',
        issue: 'Db 장조에서 다시 C 단조로 돌아오는 문에서 반음 상행이 어색해 박이 밀린다.',
        solution: 'Db∆7 → Dø7 → G7b9 → C-7 네 코드를 ♩=80 으로 30회. Db∆7 의 근음이 반음 올라가 Dø7 이 되는 것이 복귀의 신호임을 손으로 기억한다.',
      },
    ],
    keyRecordings: ['a-getz-gilberto'],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-pedagogy'],
      reviewedAt: '2026-03-10',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 5, playability: 5,
        idiom: 4, integration: 4, assessability: 5, sourcing: 4,
      },
      comments: [
        {
          reviewerId: 'rv-pedagogy',
          issue: 'keyRecordings 의 앨범이 이 곡을 수록하지 않아 학습자가 오해할 수 있다.',
          resolution: 'approach 마지막 줄에 "이 앨범에 이 곡이 수록된 것은 아니며 리듬 감각의 표본"이라고 명시했다.',
          severity: 'minor',
        },
      ],
    },
  },

  {
    id: 't-so-what',
    title: 'So What',
    composer: 'Miles Davis',
    year: 1959,
    key: 'D-',
    meter: [4, 4],
    form: 'AABA-32',
    style: 'modal',
    tempo: [130, 180],
    difficulty: 2,
    levelId: 'L3',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['D-7'] }, { chords: [] }, { chords: [] }, { chords: [] },  // 1-4
          { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] },       // 5-8
        ],
      },
      {
        label: 'A2',
        bars: [
          { chords: ['D-7'] }, { chords: [] }, { chords: [] }, { chords: [] },  // 9-12
          { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] },       // 13-16
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['Eb-7'] }, { chords: [] }, { chords: [] }, { chords: [] }, // 17-20
          { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] },       // 21-24
        ],
      },
      {
        label: 'A3',
        bars: [
          { chords: ['D-7'] }, { chords: [] }, { chords: [] }, { chords: [] },  // 25-28
          { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] },       // 29-32
        ],
      },
    ],
    teaches: [
      '모달 연주 — 화성이 움직이지 않을 때 음악을 만드는 것은 선율과 리듬이라는 원리',
      '쿼탈(4도 쌓기) 보이싱, 이른바 "So What 보이싱"의 손 모양과 이동',
      'D 도리안 / Eb 도리안 — 반음 위로 통째로 옮기는 이조 감각',
      '코드가 두 개뿐인 32마디에서 폼을 잃지 않는 카운팅 능력',
    ],
    approach:
      '① 오늘의 과제는 코드가 아니라 **보이싱**이다. So What 보이싱은 아래에서 4도-4도-4도-장3도로 쌓는다. D 도리안에서는 E-A-D-G-B 다섯 음을 양손으로 잡는다(왼손 E-A, 오른손 D-G-B). 이 한 덩어리를 30회. ' +
      '② 브릿지는 같은 모양을 반음 위로 통째로 올린 것이다(F-Bb-Eb-Ab-C). 모양이 같으므로 새로 배울 것이 없다. A↔B 전환만 20회. ' +
      '③ 폼 카운팅이 진짜 함정이다. 8마디 × 4 = 32마디를 코드 변화 없이 세야 한다. 발로 1·3박을 밟고, 8마디마다 소리 내어 "하나, 둘, 셋, 넷" 섹션 번호를 세며 두 바퀴 돈다. ' +
      '④ 오른손 즉흥은 D 도리안 일곱 음뿐이다. 대신 규칙을 건다 — 한 프레이즈는 반드시 2마디 이내, 그다음 2마디는 쉰다. 모달에서 여백은 선택이 아니라 문법이다. ' +
      '통과 기준: ♩=160 에서 So What 보이싱으로 32마디 두 바퀴를 컴핑, 브릿지 진입/복귀에서 지연 없음.',
    hotspots: [
      {
        at: 'B섹션 진입 (16→17마디)',
        issue: '16마디 동안 D-7 만 치다가 반음 위로 올라가는 순간을 놓쳐 브릿지를 한 마디 늦게 시작한다.',
        solution: '15-17마디만 3마디 루프로 30회. 16마디 4박에 손을 미리 반음 위로 "준비"하는 동작까지 포함해 연습한다. 준비 동작을 연습에 포함하지 않으면 실전에서 늦는다.',
      },
      {
        at: 'A3 (25-32마디)',
        issue: '브릿지에서 돌아온 뒤 마지막 8마디를 12마디로 늘려 치는(폼 오버런) 오류가 잦다.',
        solution: '메트로놈을 2마디에 한 번만 울리게 설정하고 A3 만 반복한다. 클릭이 네 번 울리면 8마디다. 외부 기준으로 마디를 세는 훈련이 폼 감각을 만든다.',
      },
    ],
    keyRecordings: ['a-kind-of-blue'],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-contemporary', 'rv-transcription', 'rv-pedagogy'],
      reviewedAt: '2026-03-17',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 5, playability: 5,
        idiom: 5, integration: 5, assessability: 5, sourcing: 5,
      },
    },
  },

  {
    id: 't-solar',
    title: 'Solar',
    composer: 'Miles Davis',
    year: 1954,
    key: 'C-',
    meter: [4, 4],
    form: 'other',
    style: 'swing',
    tempo: [160, 240],
    difficulty: 3,
    levelId: 'L3',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['C-∆7'] }, { chords: [] }, { chords: ['G-7'] }, { chords: ['C7'] },      // 1-4
          { chords: ['F∆7'] }, { chords: [] }, { chords: ['F-7'] }, { chords: ['Bb7'] },      // 5-8
          { chords: ['Eb∆7'] }, { chords: ['Eb-7', 'Ab7'] }, { chords: ['Db∆7'] }, { chords: ['Dø7', 'G7alt'] }, // 9-12
        ],
      },
    ],
    teaches: [
      '12마디 안에서 세 조(F → Eb → Db)를 내려가며 통과하는 하행 전조 모형',
      '마이너 메이저7(C-∆7) 코드의 손 모양과 멜로딕 마이너 스케일',
      '연속 ii-V-I 연쇄를 한 마디 단위로 압축해 치는 능력',
      '짧은 폼·빠른 템포에서의 코러스 전개 — 잼 세션 실전 필수곡',
    ],
    approach:
      '① 이 곡은 블루스처럼 12마디지만 블루스가 아니다. 구조는 "C 단조에서 출발해 F → Eb → Db 로 계단을 내려간 뒤 ii-V 로 되돌아오는 것"이다. 이 문장을 먼저 외운다. ' +
      '② 세 개의 ii-V-I 을 따로 연습한다. G-7 C7 F∆7 (3-5마디) / F-7 Bb7 Eb∆7 (7-9마디) / Eb-7 Ab7 Db∆7 (10-11마디). 각각 30회. 세 개가 모두 **한 마디씩 압축**되어 있다는 점이 이 곡의 난이도다. ' +
      '③ 1마디 C-∆7 은 C 멜로딕 마이너(C-D-Eb-F-G-A-B)로 친다. 왼손 셸은 C-Eb-B 세 음. 처음엔 C-7 로 단순화해도 되지만, B 음이 들어가야 이 곡 특유의 긴장이 생긴다. ' +
      '④ 12마디 Dø7 G7alt 는 다음 코러스 C-∆7 을 데려오는 문이다. 11-12-1마디 3마디를 루프로 40회 돌아 "끝나지 않고 굴러가는" 감각을 만든다. ' +
      '통과 기준: ♩=200 에서 3코러스 무정지, 각 조의 착지 코드(F∆7, Eb∆7, Db∆7) 첫 박에 3음 또는 7음을 조준할 것.',
    hotspots: [
      {
        at: '9-11마디 (Eb∆7 → Eb-7 Ab7 → Db∆7)',
        issue: '방금 착지한 Eb∆7 이 바로 Eb-7 으로 성격이 바뀌며 반음 아래 조로 끌려 내려가는 자리에서 손이 멈춘다.',
        solution: 'Eb∆7 → Eb-7 두 코드만 30회. 움직이는 음은 G→Gb, D→Db 둘뿐이다. 메이저가 마이너로 "변형"되는 것이지 새 코드로 "이동"하는 것이 아니다.',
      },
      {
        at: '12마디 (Dø7 G7alt — 한 마디에 두 코드)',
        issue: '앞 마디까지 한 마디 한 코드였는데 마지막 마디만 2박씩 바뀌어 다음 코러스 진입이 밀린다.',
        solution: '12마디와 다음 1마디만 2마디 루프로 40회. G7alt 는 오늘 셸 G-B-F 에 오른손 Ab 하나만 얹는다.',
      },
    ],
    keyRecordings: ['a-sunday-at-the-village-vanguard'],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-barry-harris', 'rv-transcription'],
      reviewedAt: '2026-03-17',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 4, playability: 4,
        idiom: 5, integration: 5, assessability: 5, sourcing: 4,
      },
    },
  },

  {
    id: 't-misty',
    title: 'Misty',
    composer: 'Erroll Garner',
    year: 1954,
    key: 'Eb',
    meter: [4, 4],
    form: 'AABA-32',
    style: 'ballad',
    tempo: [56, 80],
    difficulty: 3,
    levelId: 'L3',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['Eb∆7'] }, { chords: ['Bb-7', 'Eb7'] }, { chords: ['Ab∆7'] }, { chords: ['Ab-7', 'Db7'] }, // 1-4
          { chords: ['Eb∆7', 'C-7'] }, { chords: ['F-7', 'Bb7'] }, { chords: ['G-7', 'C7'] }, { chords: ['F-7', 'Bb7'] }, // 5-8
        ],
      },
      {
        label: 'A2',
        bars: [
          { chords: ['Eb∆7'] }, { chords: ['Bb-7', 'Eb7'] }, { chords: ['Ab∆7'] }, { chords: ['Ab-7', 'Db7'] }, // 9-12
          { chords: ['Eb∆7', 'C-7'] }, { chords: ['F-7', 'Bb7'] }, { chords: ['G-7', 'C7'] }, { chords: ['F-7', 'Bb7'] }, // 13-16
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['Bb-7'] }, { chords: ['Eb7'] }, { chords: ['Ab∆7'] }, { chords: [] },       // 17-20
          { chords: ['Aø7'] }, { chords: ['D7b9'] }, { chords: ['G-7', 'C7'] }, { chords: ['F-7', 'Bb7'] }, // 21-24
        ],
      },
      {
        label: 'A3',
        bars: [
          { chords: ['Eb∆7'] }, { chords: ['Bb-7', 'Eb7'] }, { chords: ['Ab∆7'] }, { chords: ['Ab-7', 'Db7'] }, // 25-28
          { chords: ['Eb∆7', 'C-7'] }, { chords: ['F-7', 'Bb7'] }, { chords: ['Eb∆7'] }, { chords: ['F-7', 'Bb7'] }, // 29-32
        ],
      },
    ],
    teaches: [
      '발라드 템포에서 한 마디 두 코드를 부드럽게 연결하는 성부 진행(voice leading)',
      'V7/IV (Eb7) 로 IV 를 여는 문과 iv-7 bVII7 (Ab-7 Db7) 로 되돌아오는 문',
      '루트리스 A/B 보이싱을 교대로 써서 손을 좁은 음역에 묶어두는 기술',
      '느린 템포에서 텐션(9·13)을 얹어 색을 칠하는 발라드 어법',
    ],
    approach:
      '① 발라드는 느려서 쉬운 게 아니라 느려서 모든 것이 들리기 때문에 어렵다. 오늘은 템포를 ♩=56 으로 고정하고 **한 마디씩만** 나간다. ' +
      '② 1-4마디가 이 곡의 뼈대다. Eb∆7 → (Bb-7 Eb7) → Ab∆7 → (Ab-7 Db7) → Eb∆7. 즉 "I 에서 IV 로 갔다가 뒷문으로 돌아온다". 이 네 마디만 40회. ' +
      '③ 왼손은 루트리스 A형(3-5-7-9)으로 통일한다. Eb∆7 = G-Bb-D-F, Bb-7 = Db-F-Ab-C, Eb7 = G-Bb-Db-F. 세 보이싱이 거의 같은 음역에서 손가락 한두 개만 움직이는 것을 확인하라 — 이것이 발라드 컴핑의 전부다. ' +
      '④ 브릿지(17-24)는 Ab 장조로 열렸다가 Aø7 D7b9 으로 G 단조를 스치고 돌아온다. 21-22마디만 따로 20회. ' +
      '⑤ 오른손은 멜로디를 치지 않는다. 각 코드의 9음 또는 13음을 하나씩 골라 온음표로 놓아 색만 칠한다. ' +
      '청음: 《Bill Evans — Alone》을 이 곡의 녹음으로서가 아니라 **솔로 발라드의 시간 운용 표본**으로 듣는다.',
    hotspots: [
      {
        at: 'A섹션 5마디 (Eb∆7 C-7 — 2박 전환)',
        issue: '앞 네 마디의 넉넉한 화성 리듬이 5마디부터 2박씩으로 빨라지며 왼손이 늦는다.',
        solution: '5-8마디만 떼어 ♩=48 로 30회. 5-8마디는 Eb∆7 C-7 F-7 Bb7 G-7 C7 F-7 Bb7 = "I-vi-ii-V 를 두 번 도는 턴어라운드"임을 이름 붙여 외운다.',
      },
      {
        at: 'B섹션 21-22마디 (Aø7 D7b9)',
        issue: 'Ab 장조의 밝은 자리에서 갑자기 G 단조 케이던스가 나와 스케일 선택이 막힌다.',
        solution: 'Aø7 D7b9 G-7 세 코드를 "G 하모닉 마이너 하나로 해결"한다고 정한다. 재료가 하나면 손이 멈추지 않는다. 세 코드만 ♩=60 으로 30회.',
      },
    ],
    keyRecordings: ['a-bill-evans-alone'],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-keyboard-technique'],
      reviewedAt: '2026-03-24',
      rubric: {
        accuracy: 4, terminology: 5, sequencing: 5, playability: 4,
        idiom: 5, integration: 4, assessability: 4, sourcing: 4,
      },
      comments: [
        {
          reviewerId: 'rv-chord-scale',
          issue: '판본에 따라 A섹션 5마디를 Eb∆7 단독으로, 7마디를 G-7 C7 대신 Gø7 C7alt 로 쓰는 차트가 있다.',
          resolution: '학습 단계에서는 가장 널리 통용되는 형태로 통일하고, 대체 화성은 L5 리하모니제이션 모듈에서 다루기로 했다.',
          severity: 'minor',
        },
      ],
    },
  },

  /* ═══════════════════════════════════════════════════════════════════════
     L4 — 비밥 어휘
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: 't-rhythm-changes-bb',
    title: '리듬 체인지 (Bb)',
    composer: 'Traditional (George Gershwin 「I Got Rhythm」 화성 골격)',
    year: 1930,
    key: 'Bb',
    meter: [4, 4],
    form: 'rhythm-changes-32',
    style: 'bebop',
    tempo: [180, 280],
    difficulty: 4,
    levelId: 'L4',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['Bb∆7', 'G-7'] }, { chords: ['C-7', 'F7'] }, { chords: ['D-7', 'G7'] }, { chords: ['C-7', 'F7'] }, // 1-4
          { chords: ['Bb∆7', 'Bb7'] }, { chords: ['Eb∆7', 'E°7'] }, { chords: ['Bb/F', 'G7'] }, { chords: ['C-7', 'F7'] }, // 5-8
        ],
      },
      {
        label: 'A2',
        bars: [
          { chords: ['Bb∆7', 'G-7'] }, { chords: ['C-7', 'F7'] }, { chords: ['D-7', 'G7'] }, { chords: ['C-7', 'F7'] }, // 9-12
          { chords: ['Bb∆7', 'Bb7'] }, { chords: ['Eb∆7', 'E°7'] }, { chords: ['Bb∆7', 'F7'] }, { chords: ['Bb∆7'] },   // 13-16
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['D7'] }, { chords: [] }, { chords: ['G7'] }, { chords: [] }, // 17-20
          { chords: ['C7'] }, { chords: [] }, { chords: ['F7'] }, { chords: [] }, // 21-24
        ],
      },
      {
        label: 'A3',
        bars: [
          { chords: ['Bb∆7', 'G-7'] }, { chords: ['C-7', 'F7'] }, { chords: ['D-7', 'G7'] }, { chords: ['C-7', 'F7'] }, // 25-28
          { chords: ['Bb∆7', 'Bb7'] }, { chords: ['Eb∆7', 'E°7'] }, { chords: ['Bb/F', 'G7'] }, { chords: ['C-7', 'F7'] }, // 29-32
        ],
      },
    ],
    teaches: [
      'I-vi-ii-V 턴어라운드를 2박 단위로 자동 연주 — 재즈에서 가장 높은 교육적 수익률',
      '브릿지의 도미넌트 사이클(D7-G7-C7-F7)을 2마디씩 걸으며 조 밖에서 안으로 돌아오기',
      '빠른 템포에서 왼손을 얇게(3음·7음 두 음) 유지해 오른손에 공간을 주는 분업',
      '수십 곡의 컨트라팩트가 공유하는 뼈대 — 한 폼을 익히면 레퍼토리가 통째로 열림',
    ],
    approach:
      '① 이 폼은 재즈에서 투자 대비 수익이 가장 큰 32마디다. 그러나 오늘 ♩=240 으로 치려 하면 반드시 실패한다. **♩=100 에서 시작한다.** ' +
      '② A섹션 1-4마디는 I-vi-ii-V 를 두 번 도는 것뿐이다(Bb∆7 G-7 / C-7 F7 / D-7 G7 / C-7 F7). 3마디의 D-7 G7 은 iii-VI 자리의 변형이다. 이 네 마디만 왼손 가이드 톤(3음·7음 두 음)으로 50회. ' +
      '③ 5-6마디는 IV 로 나갔다 돌아오는 자리다(Bb7 → Eb∆7 → E°7 → Bb/F). E°7 은 Eb∆7 에서 두 음만 반음 올린 변형으로 잡는다. ' +
      '④ 브릿지(17-24)는 코드가 두 마디씩 네 개뿐이다. 대신 모두 도미넌트라 스케일이 매 두 마디 바뀐다. 오늘은 각 코드의 3음-7음만 온음표로 놓고 넘어간다. ' +
      '⑤ 왼손은 절대 네 음 이상 잡지 않는다. 빠른 템포에서 두꺼운 보이싱은 반드시 늦는다. ' +
      '청음: 버드 파월의 좌우수 분업(왼손은 3음·7음 두 음, 오른손은 8분음표 라인)을 이 폼의 표준 모델로 삼는다.',
    hotspots: [
      {
        at: 'A섹션 5-6마디 (Bb7 → Eb∆7 → E°7)',
        issue: 'IV 로 나가는 순간 왼손이 도약하고, E°7 에서 손 모양이 무너져 7마디 Bb/F 를 놓친다.',
        solution: '5-7마디 세 마디만 ♩=80 으로 40회. Eb∆7(G-D) → E°7(G-Db) → Bb/F(D-A 또는 F-D) 로 가이드 톤 두 음만 추적하면 손 이동이 한 음 단위로 줄어든다.',
      },
      {
        at: 'B섹션 (17-24마디 도미넌트 사이클)',
        issue: '브릿지에서 조성 감각이 끊기고, 8마디를 세지 못해 A3 진입이 늦는다.',
        solution: '브릿지만 따로 루프한다. D7→G7→C7→F7 은 4도 순환이므로 왼손 가이드 톤은 "F#-C → F-B → E-Bb → Eb-A" 로 반음씩 안으로 조여 든다. 이 반음 하강을 귀로 따라가면 마디를 잃지 않는다.',
      },
      {
        at: '24→25마디 (브릿지 → A3)',
        issue: 'F7 에서 Bb∆7 로 돌아오는 순간 리듬이 흐트러지고 한 박 늦는다.',
        solution: '23-25마디 3마디를 루프로 40회. 브릿지 마지막 마디 4박에 이미 Bb∆7 의 손 모양을 준비하는 동작까지 연습에 포함한다.',
      },
    ],
    keyRecordings: ['a-the-amazing-bud-powell-1'],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-barry-harris', 'rv-chord-scale', 'rv-keyboard-technique'],
      reviewedAt: '2026-04-07',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 5, playability: 4,
        idiom: 5, integration: 5, assessability: 5, sourcing: 4,
      },
      comments: [
        {
          reviewerId: 'rv-barry-harris',
          issue: 'A섹션 3마디를 D-7 G7 으로만 제시하면 원형(iii-VI7 또는 Bb∆7/D - G7)을 쓰는 판본과 어긋나고, 비밥 어휘 학습 시 혼동이 생긴다.',
          resolution: '가장 널리 통용되는 D-7 G7 로 통일하되, teaches 항목에 "iii-VI 자리의 변형"임을 명시하고 approach ② 에서 설명했다.',
          severity: 'major',
        },
      ],
    },
  },

  {
    id: 't-all-the-things-you-are',
    title: 'All the Things You Are',
    composer: 'Jerome Kern',
    year: 1939,
    key: 'Ab',
    meter: [4, 4],
    form: 'other',
    style: 'swing',
    tempo: [140, 210],
    difficulty: 4,
    levelId: 'L4',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['F-7'] }, { chords: ['Bb-7'] }, { chords: ['Eb7'] }, { chords: ['Ab∆7'] }, // 1-4
          { chords: ['Db∆7'] }, { chords: ['G7'] }, { chords: ['C∆7'] }, { chords: [] },        // 5-8
        ],
      },
      {
        label: 'A2',
        bars: [
          { chords: ['C-7'] }, { chords: ['F-7'] }, { chords: ['Bb7'] }, { chords: ['Eb∆7'] },  // 9-12
          { chords: ['Ab∆7'] }, { chords: ['D7'] }, { chords: ['G∆7'] }, { chords: [] },        // 13-16
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['A-7'] }, { chords: ['D7'] }, { chords: ['G∆7'] }, { chords: [] },         // 17-20
          { chords: ['F#-7'] }, { chords: ['B7'] }, { chords: ['E∆7'] }, { chords: ['C7'] },    // 21-24
        ],
      },
      {
        label: 'A3',
        bars: [
          { chords: ['F-7'] }, { chords: ['Bb-7'] }, { chords: ['Eb7'] }, { chords: ['Ab∆7'] }, // 25-28
          { chords: ['Db∆7'] }, { chords: ['Db-7'] }, { chords: ['C-7'] }, { chords: ['Bø7', 'E7'] }, // 29-32
          { chords: ['Ab∆7'] }, { chords: ['Bb-7', 'Eb7'] }, { chords: ['Ab∆7'] }, { chords: ['Gø7', 'C7'] }, // 33-36
        ],
      },
    ],
    teaches: [
      '4도 순환 ii-V-I 이 조를 바꾸며 연쇄되는 구조 — 이조 능력의 최종 시험대',
      '마지막 A 가 12마디로 확장되는 36마디 변형 폼 읽기',
      '한 마디 한 코드 속도에서 가이드 톤 라인을 끊김 없이 잇는 성부 진행',
      '잼 세션 필수곡 — "이 곡이 되면 웬만한 스탠다드가 열린다"',
    ],
    approach:
      '① 이 곡은 32마디가 아니라 **36마디**다(마지막 A 가 12마디). 먼저 8+8+8+12 를 소리 내어 세어 폼 지도를 그린다. ' +
      '② 화성의 정체는 단순하다. "ii-V-I 을 4도씩 순환하며 조를 바꾼다". A섹션 = F-7 Bb-7 Eb7 Ab∆7 → Db∆7 → (G7 C∆7). A2 = 같은 것을 장3도 위 Eb 조로. ' +
      '③ 오늘은 A섹션 8마디만 목표로 한다. 왼손 가이드 톤(3음·7음)으로 ♩=100 에 50회. 6-7마디 G7 → C∆7 은 Ab 조 밖으로 나가는 유일한 문이며, 여기서 대부분 손이 멈춘다. ' +
      '④ 브릿지(17-24)는 G 장조에서 E 장조로 반음계적으로 올라간다(A-7 D7 G∆7 → F#-7 B7 E∆7). 두 개의 ii-V-I 을 각각 30회씩 익힌 뒤 붙인다. 24마디 C7 이 다시 F-7 으로 데려오는 문이다. ' +
      '⑤ 마지막 A3 의 29-32마디(Db∆7 → Db-7 → C-7 → Bø7 E7)는 이 곡에서 가장 아름답고 가장 어려운 네 마디다. 오늘은 여기까지 가지 말고 내일로 남긴다. ' +
      '통과 기준: 36마디를 ♩=160 에서 왼손 가이드 톤만으로 무정지 2회, 각 조의 I 화음에 도착할 때마다 조 이름을 즉답할 것.',
    hotspots: [
      {
        at: 'A섹션 5-7마디 (Db∆7 → G7 → C∆7)',
        issue: 'Ab 조의 IV 인 Db∆7 에서 갑자기 C 장조로 튀어나가는 자리에서 손과 귀가 모두 멈춘다.',
        solution: 'Db∆7 → G7 → C∆7 세 코드만 ♩=70 으로 40회. Db∆7 의 근음 Db 가 G7 의 #11(=Db) 로 그대로 남고, 3음 F 가 C∆7 의 3음 E 로 반음 내려간다. 공통음을 붙잡으면 도약이 사라진다.',
      },
      {
        at: 'B섹션 20-21마디 (G∆7 → F#-7)',
        issue: '반음 아래로 미끄러지는 전조에서 조성 감각이 끊긴다.',
        solution: 'G∆7 → F#-7 두 코드만 30회. "장7화음의 근음이 반음 내려가 새 조의 ii 가 된다"는 규칙 하나로 외운다. 이 이동은 이 곡뿐 아니라 수많은 곡에서 반복된다.',
      },
      {
        at: 'A3 29-32마디 (Db∆7 Db-7 C-7 Bø7 E7)',
        issue: '반음씩 내려오는 하행 라인에 32마디의 2박 전환까지 겹쳐 폼과 손이 동시에 무너진다.',
        solution: '이 네 마디만 ♩=60 으로 50회. 근음 Db-Db-C-B 가 반음씩 내려오는 것을 왼손으로만 먼저 확인한 뒤 화음을 얹는다. Bø7 E7 은 "Ab 로 돌아가는 문"이 아니라 33마디 Ab∆7 을 부르는 대리 케이던스임을 알고 치면 소리가 납득된다.',
      },
    ],
    keyRecordings: [],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-barry-harris', 'rv-pedagogy'],
      reviewedAt: '2026-04-07',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 4, playability: 4,
        idiom: 5, integration: 4, assessability: 5, sourcing: 4,
      },
      comments: [
        {
          reviewerId: 'rv-pedagogy',
          issue: '36마디 전체를 한 번에 제시하면 L4 학습자의 인지 부하를 초과한다.',
          resolution: 'approach 를 "오늘은 A섹션 8마디만" 으로 명시적으로 제한하고, 가장 어려운 29-32마디는 다음 날로 미루도록 지시했다.',
          severity: 'major',
        },
      ],
    },
  },

  {
    id: 't-how-high-the-moon',
    title: 'How High the Moon',
    composer: 'Morgan Lewis',
    year: 1940,
    key: 'G',
    meter: [4, 4],
    form: 'ABAC-32',
    style: 'bebop',
    tempo: [180, 280],
    difficulty: 3,
    levelId: 'L4',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['G∆7'] }, { chords: [] }, { chords: ['G-7'] }, { chords: ['C7'] },    // 1-4
          { chords: ['F∆7'] }, { chords: [] }, { chords: ['F-7'] }, { chords: ['Bb7'] },   // 5-8
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['Eb∆7'] }, { chords: ['Aø7', 'D7b9'] }, { chords: ['G∆7'] }, { chords: [] }, // 9-12
          { chords: ['A-7'] }, { chords: ['D7'] }, { chords: ['G∆7'] }, { chords: ['A-7', 'D7'] }, // 13-16
        ],
      },
      {
        label: 'A2',
        bars: [
          { chords: ['G∆7'] }, { chords: [] }, { chords: ['G-7'] }, { chords: ['C7'] },    // 17-20
          { chords: ['F∆7'] }, { chords: [] }, { chords: ['F-7'] }, { chords: ['Bb7'] },   // 21-24
        ],
      },
      {
        label: 'C',
        bars: [
          { chords: ['Eb∆7'] }, { chords: ['Aø7', 'D7b9'] }, { chords: ['G∆7'] }, { chords: ['E-7'] }, // 25-28
          { chords: ['A-7'] }, { chords: ['D7'] }, { chords: ['G∆7'] }, { chords: ['A-7', 'D7'] },     // 29-32
        ],
      },
    ],
    teaches: [
      '장3도씩 내려가는 조 이동(G → F → Eb)을 ii-V-I 연쇄로 통과하기',
      '빠른 템포에서의 비밥 어휘 — 8분음표 라인을 강박에 정렬시키는 훈련',
      '같은 폼 위에 새 선율을 얹는 컨트라팩트 개념(이 폼은 비밥 대표곡들의 뼈대다)',
      'IV-iv 이동(F∆7 → F-7 Bb7)과 bVI∆7(Eb∆7) 착지의 소리 구분',
    ],
    approach:
      '① 구조부터 본다. 이 곡은 "G 장조 → F 장조 → Eb 장조로 장2도씩 내려갔다가 G 로 돌아오는" 16마디를 두 번 도는 곡이다. 이 문장을 먼저 외우면 32마디가 8마디처럼 느껴진다. ' +
      '② 세 개의 ii-V 를 따로 익힌다. G-7 C7 → F∆7 / F-7 Bb7 → Eb∆7 / Aø7 D7b9 → G∆7. 각각 40회. 앞의 둘은 메이저, 마지막 하나는 마이너 케이던스 모양이라는 점이 이 곡의 핵심 대비다. ' +
      '③ 템포는 ♩=120 에서 시작해 하루에 10 씩만 올린다. 이 곡은 비밥 표준 템포(♩=240 이상)로 연주되지만, 정확한 손 모양 없이 속도를 올리면 나쁜 습관만 자동화된다. ' +
      '④ 오른손은 오늘 8분음표를 치지 않는다. 각 코드의 3음에서 다음 코드의 7음으로 이어지는 두 음 라인만 4분음표로 연결한다. 비밥 라인은 이 뼈대 위에 장식이 붙은 것이다. ' +
      '⑤ 이 폼 위에 새 선율을 얹은 비밥 컨트라팩트가 다수 존재한다(대표적으로 파커/가레스피 계열). 버드 파월의 연주에서 이 폼 위의 라인 운용을 들어 보라. ' +
      '통과 기준: ♩=200 에서 32마디 두 바퀴, 9마디 Eb∆7 과 25마디 Eb∆7 에 정확히 도착.',
    hotspots: [
      {
        at: '8-9마디 (Bb7 → Eb∆7)',
        issue: 'G 장조로 시작한 곡이 세 마디 만에 Eb 장조까지 내려와 조성 감각이 끊긴다.',
        solution: '5-9마디만 ♩=100 으로 40회. F∆7 → F-7 → Bb7 → Eb∆7 은 "IV 를 마이너로 바꿔 한 계단 더 내려가는" 표준 동작이다. 이름을 붙여 두면 다른 곡에서도 바로 알아본다.',
      },
      {
        at: '10마디 (Aø7 D7b9 — 한 마디 두 코드)',
        issue: 'Eb∆7 에서 한 마디 만에 G 장조로 복귀해야 하는데 손이 준비되지 않아 11마디를 놓친다.',
        solution: '9-11마디 세 마디만 루프로 50회. Eb∆7 의 3음 G 가 Aø7 의 7음 G 로 그대로 남는다. 공통음 하나를 붙잡으면 복귀가 도약이 아니라 회전이 된다.',
      },
    ],
    keyRecordings: ['a-the-amazing-bud-powell-1'],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-barry-harris', 'rv-transcription'],
      reviewedAt: '2026-04-14',
      rubric: {
        accuracy: 4, terminology: 5, sequencing: 5, playability: 4,
        idiom: 5, integration: 5, assessability: 5, sourcing: 4,
      },
      comments: [
        {
          reviewerId: 'rv-transcription',
          issue: '10마디를 Aø7 D7b9 로 쓰는 판본과 A-7 D7 로 쓰는 판본이 공존한다.',
          resolution: '마이너 케이던스 형태(Aø7 D7b9)를 기본으로 싣고, approach ② 에서 세 케이던스의 성격 대비를 학습 목표로 삼도록 했다.',
          severity: 'minor',
        },
      ],
    },
  },

  {
    id: 't-alone-together',
    title: 'Alone Together',
    composer: 'Arthur Schwartz',
    year: 1932,
    key: 'D-',
    meter: [4, 4],
    form: 'other',
    style: 'swing',
    tempo: [120, 190],
    difficulty: 4,
    levelId: 'L4',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['D-∆7'] }, { chords: ['Eø7', 'A7b9'] }, { chords: ['D-∆7'] }, { chords: ['Eø7', 'A7b9'] }, // 1-4
          { chords: ['D-∆7'] }, { chords: ['Aø7', 'D7b9'] }, { chords: ['G-7'] }, { chords: [] },                // 5-8
          { chords: ['Bb-7', 'Eb7'] }, { chords: ['A-7', 'D7'] }, { chords: ['G-7'] }, { chords: [] },           // 9-12
          { chords: ['Eø7'] }, { chords: ['A7b9'] },                                                             // 13-14
        ],
      },
      {
        label: 'A2',
        bars: [
          { chords: ['D-∆7'] }, { chords: ['Eø7', 'A7b9'] }, { chords: ['D-∆7'] }, { chords: ['Eø7', 'A7b9'] }, // 15-18
          { chords: ['D-∆7'] }, { chords: ['Aø7', 'D7b9'] }, { chords: ['G-7'] }, { chords: [] },                // 19-22
          { chords: ['Bb-7', 'Eb7'] }, { chords: ['A-7', 'D7'] }, { chords: ['G-7'] }, { chords: [] },           // 23-26
          { chords: ['D-∆7'] }, { chords: ['A-7', 'D7'] },                                                       // 27-28
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['A-7', 'D7'] }, { chords: ['G-7', 'C7'] }, { chords: ['F∆7'] }, { chords: [] },  // 29-32
          { chords: ['G-7'] }, { chords: ['C7'] }, { chords: ['F∆7'] }, { chords: ['Eø7', 'A7b9'] },  // 33-36
        ],
      },
      {
        label: 'A3',
        bars: [
          { chords: ['D-∆7'] }, { chords: ['Eø7', 'A7b9'] }, { chords: ['D-∆7'] }, { chords: ['Eø7', 'A7b9'] }, // 37-40
          { chords: ['D-∆7'] }, { chords: ['Aø7', 'D7b9'] }, { chords: ['G-7'] }, { chords: ['Eø7', 'A7b9'] },  // 41-44
        ],
      },
    ],
    teaches: [
      '44마디 불규칙 폼(14+14+8+8) — 마디 수를 세지 않으면 반드시 길을 잃는 구조',
      '마이너 메이저7(D-∆7) 토닉과 iiø-V7b9 케이던스의 반복 강화',
      'iv-7 bVII7(Bb-7 Eb7) 백도어와 병행 장조(F)로 열리는 브릿지의 대비',
      '같은 케이던스가 반복될 때 보이싱과 리듬으로 변화를 만드는 컴핑 설계',
    ],
    approach:
      '① 가장 먼저 폼을 그린다. A(14) + A2(14) + B(8) + A3(8) = 44마디. 재즈 스탠다드에서 흔치 않은 구조이므로 종이에 마디 번호를 적어 두고 시작한다. ' +
      '② 재료는 거의 하나다 — Eø7 A7b9 D-∆7 (D 단조의 iiø-V-i). 이 세 코드만 왼손 루트리스로 50회. 곡의 절반이 이 문장이다. ' +
      '③ A섹션의 사건은 두 곳뿐이다. 6마디 Aø7 D7b9 (G-7 으로 가는 문)과 9마디 Bb-7 Eb7 (백도어). 각각 30회씩 떼어 연습한다. ' +
      '④ 브릿지(29-36)는 F 장조로 열린다. G-7 C7 F∆7 이라는 이미 아는 문장이므로 새로 배울 것이 없다. ' +
      '⑤ D-∆7 은 실전에서 D-6 로도 친다(둘 다 D 멜로딕 마이너 계열). 오늘은 D-∆7(D-F-A-C#)로 통일한다. ' +
      '**중요**: 이 곡은 판본 편차가 특히 큰 스탠다드이며, 여기 실린 것은 잼 세션에서 널리 통용되는 **교육용 단순화 버전**이다. 특히 브릿지는 차트마다 다르므로, 무대에 올리기 전 신뢰할 수 있는 리드시트로 브릿지를 반드시 대조하라.',
    hotspots: [
      {
        at: 'A섹션 9-10마디 (Bb-7 Eb7 → A-7 D7)',
        issue: '백도어(Bb-7 Eb7)에서 다시 G-7 으로 가는 ii-V(A-7 D7)로 이어지는 두 마디에 코드가 네 개 들어가며 손이 늦는다.',
        solution: '9-11마디만 ♩=70 으로 40회. 근음 Bb→Eb→A→D→G 가 모두 4도 상행(=5도 하행)임을 확인하면 왼손은 한 방향으로만 걷는다.',
      },
      {
        at: 'A섹션 14마디 → A2 진입',
        issue: '14마디짜리 A 가 낯설어 12마디나 16마디에서 A2 를 시작한다.',
        solution: 'A섹션만 반복 루프로 10회 돌며 매번 소리 내어 마디를 센다. "1-2-3-4 / 5-6-7-8 / 9-10-11-12 / 13-14" 로 4+4+4+2 로 쪼개 세는 것이 가장 안정적이다.',
      },
      {
        at: 'B섹션 36마디 → A3 진입',
        issue: 'F 장조에서 D 단조로 복귀할 때 Eø7 A7b9 을 흘려 치고 A3 첫 마디를 놓친다.',
        solution: '36-37마디만 2마디 루프로 40회. F∆7 의 3음 A 가 Eø7 의 4음이자 A7b9 의 근음으로 이어지는 통로를 귀로 확인한다.',
      },
    ],
    keyRecordings: [],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'faculty-pending',
      reviewers: ['rv-chord-scale', 'rv-transcription', 'rv-pedagogy'],
      reviewedAt: '2026-04-14',
      rubric: {
        accuracy: 3, terminology: 5, sequencing: 4, playability: 4,
        idiom: 4, integration: 4, assessability: 4, sourcing: 3,
      },
      comments: [
        {
          reviewerId: 'rv-transcription',
          issue: '브릿지 화성은 판본별 차이가 커서 단일 정답으로 제시할 수 없다. 정확성 점수를 보류한다.',
          resolution: 'approach 에 굵은 경고문을 추가해 "교육용 단순화 버전"임과 무대 전 리드시트 대조를 명시했고, 검수 상태를 faculty-pending 으로 두어 외부 검수 슬롯을 비워 두었다.',
          severity: 'blocker',
        },
      ],
    },
  },

  /* ═══════════════════════════════════════════════════════════════════════
     L5 — 리하모니제이션과 발라드
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: 't-stella',
    title: 'Stella by Starlight',
    composer: 'Victor Young',
    year: 1944,
    key: 'Bb',
    meter: [4, 4],
    form: 'through-composed',
    style: 'swing',
    tempo: [100, 170],
    difficulty: 4,
    levelId: 'L5',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['Eø7'] }, { chords: ['A7b9'] }, { chords: ['C-7'] }, { chords: ['F7'] },   // 1-4
          { chords: ['F-7'] }, { chords: ['Bb7'] }, { chords: ['Eb∆7'] }, { chords: ['Ab7'] },  // 5-8
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['Bb∆7'] }, { chords: ['Eø7', 'A7b9'] }, { chords: ['D-7'] }, { chords: ['Bbø7', 'Eb7'] }, // 9-12
          { chords: ['F∆7'] }, { chords: ['Eø7', 'A7b9'] }, { chords: ['Aø7'] }, { chords: ['D7b9'] },          // 13-16
        ],
      },
      {
        label: 'C',
        bars: [
          { chords: ['G7'] }, { chords: [] }, { chords: ['C-7'] }, { chords: [] },   // 17-20
          { chords: ['Ab7'] }, { chords: [] }, { chords: ['Bb∆7'] }, { chords: [] }, // 21-24
        ],
      },
      {
        label: 'D',
        bars: [
          { chords: ['Eø7'] }, { chords: ['A7b9'] }, { chords: ['Dø7'] }, { chords: ['G7b9'] },  // 25-28
          { chords: ['Cø7'] }, { chords: ['F7b9'] }, { chords: ['Bb∆7'] }, { chords: [] },       // 29-32
        ],
      },
    ],
    teaches: [
      '해결되지 않는 ii-V(Eø7 A7b9) — 케이던스가 목적지에 도달하지 않을 때의 소리',
      '하행 하프디미니시 ii-V 연쇄(Eø7 A7b9 / Dø7 G7b9 / Cø7 F7b9) — 손이 가장 자주 막히는 구간',
      '조성이 계속 미끄러지는 곡에서 가이드 톤 라인으로 길을 잃지 않는 법',
      '리하모니제이션 재료로서의 곡 — 같은 뼈대 위에 다른 색을 칠하는 L5 실습 대상',
    ],
    approach:
      '① 이 곡이 어려운 이유는 코드가 많아서가 아니라 **케이던스가 약속을 지키지 않기** 때문이다. 1-2마디 Eø7 A7b9 은 D 단조로 가야 할 것 같지만 3마디에서 C-7 으로 간다. 이 배신감을 먼저 귀로 확인한다. ' +
      '② 오늘은 마지막 8마디(25-32)만 한다. Eø7 A7b9 / Dø7 G7b9 / Cø7 F7b9 / Bb∆7 — 하프디미니시 ii-V 가 온음씩 내려오는 구간이다. 왼손 루트리스로 ♩=70 에 50회. 세 쌍의 손 모양이 똑같이 평행 이동한다는 것을 발견하면 이 여덟 마디가 갑자기 쉬워진다. ' +
      '③ 그다음 1-8마디. Eø7 A7b9 → C-7 F7 → F-7 Bb7 → Eb∆7 → Ab7. "해결되지 않는 ii-V 하나 + 정상 ii-V 두 개 + bVII7" 로 이름 붙인다. ' +
      '④ 17-24마디는 코드가 두 마디씩 네 개뿐이라 오히려 쉬는 구간이다. 여기서 왼손 보이싱을 두껍게 바꿔 대비를 만든다. ' +
      '⑤ 폼이 되면 L5 과제로 넘어간다 — 22마디 Ab7 을 D7alt 로, 17마디 G7 을 Dø7 G7alt 로 바꿔 보며 리하모니제이션을 실험한다. ' +
      '주의: 이 곡은 판본별 세부 차이가 있는 대표적 스탠다드다. 여기 실린 것은 가장 널리 통용되는 Bb 조 교육용 표준 차트다.',
    hotspots: [
      {
        at: 'D섹션 25-30마디 (하행 하프디미니시 ii-V 연쇄)',
        issue: 'ø7 코드가 세 번 연속 나오며 손 모양이 헷갈리고, 매 두 마디 조가 내려가 귀가 따라가지 못한다.',
        solution: '세 쌍을 평행 이동으로 본다. Eø7 A7b9 의 왼손 루트리스(G-Bb-D → G-Bb-C#)를 온음 아래로 그대로 옮기면 Dø7 G7b9, 한 번 더 옮기면 Cø7 F7b9 이다. 모양 하나를 두 번 내리는 것이 전부다. ♩=60 에서 50회.',
      },
      {
        at: '1-3마디 (Eø7 A7b9 → C-7)',
        issue: '마이너 케이던스가 메이저 ii 로 해결되는 것을 예상하지 못해 3마디에서 스케일 선택이 얼어붙는다.',
        solution: 'A7b9 위에서는 A 얼터드(또는 Bb 멜로딕 마이너)를, C-7 에서는 C 도리안을 쓴다. 두 스케일의 공통음(C, Eb, G)을 먼저 찾아 그 세 음으로만 세 마디를 연주해 본다.',
      },
      {
        at: '11-13마디 (D-7 → Bbø7 Eb7 → F∆7)',
        issue: 'Bbø7 Eb7 이라는 낯선 ii-V 가 F 장조로 데려가는 자리에서 손이 멈춘다.',
        solution: 'Bbø7 Eb7 F∆7 세 코드만 40회. Bbø7 을 "Db∆7 의 근음을 반음 내린 것"이 아니라 "F 단조의 iv 계열 소리"로 듣는다. 목적지 F∆7 의 3음 A 를 미리 귀에 심어 두면 진입이 쉬워진다.',
      },
    ],
    keyRecordings: [],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-contemporary', 'rv-transcription'],
      reviewedAt: '2026-04-21',
      rubric: {
        accuracy: 4, terminology: 5, sequencing: 4, playability: 4,
        idiom: 5, integration: 4, assessability: 4, sourcing: 4,
      },
      comments: [
        {
          reviewerId: 'rv-contemporary',
          issue: '17-24마디를 G7 / C-7 / Ab7 / Bb∆7 로 두 마디씩 단순 제시하면 실제 연주에서 쓰이는 내부 ii-V 분할이 사라진다.',
          resolution: '기본 차트는 단순형으로 유지하고, approach ⑤ 에 리하모니제이션 실습 과제로 내부 분할을 직접 실험하도록 배치했다.',
          severity: 'suggestion',
        },
      ],
    },
  },

  {
    id: 't-body-and-soul',
    title: 'Body and Soul',
    composer: 'Johnny Green',
    year: 1930,
    key: 'Db',
    meter: [4, 4],
    form: 'AABA-32',
    style: 'ballad',
    tempo: [52, 72],
    difficulty: 5,
    levelId: 'L5',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['Eb-7', 'Ab7'] }, { chords: ['Db∆7', 'Bb-7'] }, { chords: ['Eb-7', 'Ab7'] }, { chords: ['Db∆7', 'Db7'] }, // 1-4
          { chords: ['Gb∆7', 'F-7'] }, { chords: ['Gb-7', 'B7'] }, { chords: ['F-7', 'Bb7'] }, { chords: ['Eb-7', 'Ab7'] },    // 5-8
        ],
      },
      {
        label: 'A2',
        bars: [
          { chords: ['Eb-7', 'Ab7'] }, { chords: ['Db∆7', 'Bb-7'] }, { chords: ['Eb-7', 'Ab7'] }, { chords: ['Db∆7', 'Db7'] }, // 9-12
          { chords: ['Gb∆7', 'F-7'] }, { chords: ['Gb-7', 'B7'] }, { chords: ['Db∆7'] }, { chords: [] },                       // 13-16
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['D∆7'] }, { chords: ['E-7', 'A7'] }, { chords: ['D∆7'] }, { chords: [] },      // 17-20
          { chords: ['C#-7', 'F#7'] }, { chords: ['B∆7'] }, { chords: ['B-7', 'E7'] }, { chords: ['Eb-7', 'Ab7'] }, // 21-24
        ],
      },
      {
        label: 'A3',
        bars: [
          { chords: ['Eb-7', 'Ab7'] }, { chords: ['Db∆7', 'Bb-7'] }, { chords: ['Eb-7', 'Ab7'] }, { chords: ['Db∆7', 'Db7'] }, // 25-28
          { chords: ['Gb∆7', 'F-7'] }, { chords: ['Gb-7', 'B7'] }, { chords: ['Db∆7'] }, { chords: ['Eb-7', 'Ab7'] },          // 29-32
        ],
      },
    ],
    teaches: [
      '재즈 발라드의 최고 난도 표준곡 — 밀집된 화성 리듬에서의 성부 진행',
      '브릿지의 반음 위 전조(Db → D → B → 복귀)라는 20세기 대중가요 최고의 설계',
      '5개의 ♭ 조성(Db)에서 루트리스·드롭2 보이싱을 정확히 잡는 손 위치 훈련',
      '한 마디 두 코드가 32마디 내내 이어질 때의 컴핑 체력과 리듬 배분',
    ],
    approach:
      '① 먼저 알아야 할 것 — 이 곡은 L5 이전에 손대면 좌절만 남는다. 조표 5개, 한 마디 두 코드, 브릿지 전조까지 모든 난관이 한 곡에 있다. ' +
      '② 오늘은 **1-4마디만** 한다. Eb-7 Ab7 → Db∆7 Bb-7 → Eb-7 Ab7 → Db∆7 Db7. 즉 "ii-V-I-vi 를 두 번 도는 것"이다. 왼손 루트리스 A/B 교대로 ♩=52 에 50회. ' +
      '③ 4마디 끝의 Db7 은 5마디 Gb∆7(IV)를 여는 문이다. Db∆7 → Db7 은 7음 C 가 Cb 로 반음 내려가는 것뿐이다. 이 한 음이 조를 바꾼다. ' +
      '④ 브릿지는 따로 며칠을 준다. Db 에서 반음 위 D 장조로 올라갔다가(17마디) C#-7 F#7 B∆7 로 미끄러지고 B-7 E7 → Eb-7 Ab7 으로 집에 온다. 17마디 진입만 30회 따로 연습한다. ' +
      '⑤ 오른손은 멜로디를 치지 않는다. 각 코드의 9음·13음 중 하나만 골라 반음/온음으로 이어지는 상성부 라인을 직접 설계한다. 이것이 발라드 편곡의 시작이다. ' +
      '**주의**: 이 곡은 화성 판본이 가장 다양한 스탠다드 중 하나다. 여기 실린 것은 가장 널리 통용되는 Db 조 **교육용 표준 차트**이며, 특히 A섹션 5-8마디와 브릿지 후반은 차트마다 다르다. 무대 전 반드시 대조하라. ' +
      '청음: 《Bill Evans — Alone》을 이 곡의 녹음으로서가 아니라 솔로 발라드의 루바토·페달 운용 표본으로 듣는다.',
    hotspots: [
      {
        at: 'A섹션 5-6마디 (Gb∆7 F-7 / Gb-7 B7)',
        issue: 'IV 로 나간 뒤 Gb 가 마이너로 바뀌며 백도어(B7=Cb7)로 돌아오는 구간에서 손 모양과 귀가 동시에 무너진다.',
        solution: 'Gb∆7 → Gb-7 → B7 → Db∆7 네 코드만 ♩=48 로 50회. Gb∆7(Bb-F) → Gb-7(Bbb=A-Fb=E) 처럼 가이드 톤 두 음만 추적한다. B7 은 Db∆7 로 가는 뒷문이다.',
      },
      {
        at: 'B섹션 16→17마디 (Db∆7 → D∆7)',
        issue: '반음 위 전조를 예상하지 못해 브릿지 첫 마디에서 손이 완전히 멈춘다.',
        solution: '16-17마디만 2마디 루프로 50회. "모든 것을 반음 위로 그대로 올린다"는 한 문장으로 외운다. Db∆7 의 손 모양을 통째로 반음 올리면 D∆7 이다 — 새 코드가 아니다.',
      },
      {
        at: 'B섹션 23-24마디 (B-7 E7 → Eb-7 Ab7)',
        issue: 'B 장조에서 Db 로 돌아오는 길이 멀게 느껴져 A3 첫 마디를 놓친다.',
        solution: 'E7 → Eb-7 은 반음 하행이다. 23-25마디 세 마디를 루프로 40회. E7 의 7음 D 가 Eb-7 의 9음 F 로 가는 대신 Db(=E7 의 b7 을 반음 내린 음)로 미끄러지는 라인을 오른손으로 직접 만들어 본다.',
      },
    ],
    keyRecordings: ['a-bill-evans-alone'],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'faculty-pending',
      reviewers: ['rv-chord-scale', 'rv-contemporary', 'rv-keyboard-technique'],
      reviewedAt: '2026-04-28',
      rubric: {
        accuracy: 3, terminology: 5, sequencing: 4, playability: 3,
        idiom: 4, integration: 4, assessability: 4, sourcing: 3,
      },
      comments: [
        {
          reviewerId: 'rv-chord-scale',
          issue: 'A섹션 5-8마디와 브릿지 후반은 연주자별 편차가 매우 커서 단일 차트를 정답으로 제시하면 안 된다.',
          resolution: 'approach 에 굵은 주의 문단을 넣어 교육용 표준 차트임을 명시하고, 검수 상태를 faculty-pending 으로 유지해 외부 검수 슬롯을 비워 두었다.',
          severity: 'blocker',
        },
      ],
    },
  },

  {
    id: 't-blue-in-green',
    title: 'Blue in Green',
    composer: 'Miles Davis (공동 작곡 기여 논쟁: Bill Evans)',
    year: 1959,
    key: 'D-',
    meter: [4, 4],
    form: 'other',
    style: 'ballad',
    tempo: [50, 70],
    difficulty: 4,
    levelId: 'L5',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['G-7'] }, { chords: ['A7alt'] }, { chords: ['D-7'] }, { chords: ['Db7#11'] }, // 1-4
          { chords: ['C-7'] }, { chords: ['F7'] }, { chords: ['Bb∆7'] }, { chords: ['A7alt'] },    // 5-8
          { chords: ['D-7'] }, { chords: [] },                                                      // 9-10
        ],
      },
    ],
    teaches: [
      '10마디라는 비대칭 폼 — 8마디 관성을 깨고 실제로 마디를 세는 훈련',
      '트라이톤 서브(Db7#11 = A7 의 대리)를 곡의 중심 사건으로 경험하기',
      '발라드에서 배속(double-time feel)을 코러스마다 바꾸며 전개를 만드는 기법',
      '얼터드 도미넌트(A7alt) 위의 보이싱과 스케일 선택',
    ],
    approach:
      '① 이 곡의 첫 과제는 화성이 아니라 **10마디를 세는 것**이다. 아무 코드도 치지 말고 메트로놈에 맞춰 10마디를 다섯 바퀴 세어라. 8마디에서 멈추려는 몸의 관성이 사라질 때까지. ' +
      '② 화성의 중심 사건은 3-4마디다. D-7 다음의 Db7#11 은 "G7 의 트라이톤 서브"이자 "반음 아래로 미끄러지는 문"이다. 3-5마디(D-7 → Db7#11 → C-7)만 40회 — 근음이 D-Db-C 로 반음씩 내려온다. ' +
      '③ 왼손은 루트리스 B형(7-9-3-5)으로 통일한다. 발라드에서는 근음을 베이스에 맡기고 왼손을 가운데 음역에 두는 것이 이 곡의 표준 소리다. ' +
      '④ A7alt 는 2마디와 8마디에 두 번 나온다. Bb 멜로딕 마이너(=A 얼터드)를 재료로 삼되, 오늘은 스케일을 달리지 말고 Bb-C-Eb-F 네 음만 골라 쓴다. ' +
      '⑤ 전개 설계: 1코러스는 온음표만, 2코러스는 4분음표, 3코러스는 8분음표(배속 느낌), 4코러스에 다시 온음표로 돌아온다. 화성이 아니라 밀도로 이야기를 만드는 법을 배우는 것이 이 곡의 진짜 과제다.',
    hotspots: [
      {
        at: '3-4마디 (D-7 → Db7#11)',
        issue: '반음 아래 도미넌트가 갑자기 나와 오른손 스케일 선택이 얼어붙는다.',
        solution: 'Db7#11 위에서는 Ab 멜로딕 마이너(= Db 리디안 ♭7)를 쓴다. 그러나 첫날은 Db7 의 3음 F 와 #11 음 G 두 음만 잡는다. 이 두 음이 "미끄러지는 소리"의 정체다.',
      },
      {
        at: '9-10마디 → 다음 코러스 1마디',
        issue: '10마디 폼의 마지막에서 다음 코러스로 넘어가는 타이밍을 놓쳐 폼이 어긋난다.',
        solution: '9-10마디와 다음 1마디, 총 3마디를 루프로 50회. D-7 → G-7 은 4도 상행이므로 왼손은 그대로 있거나 조금만 움직이면 된다는 것을 확인한다.',
      },
    ],
    keyRecordings: ['a-kind-of-blue'],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-contemporary', 'rv-transcription', 'rv-chord-scale'],
      reviewedAt: '2026-04-28',
      rubric: {
        accuracy: 4, terminology: 5, sequencing: 4, playability: 4,
        idiom: 5, integration: 5, assessability: 4, sourcing: 4,
      },
      comments: [
        {
          reviewerId: 'rv-transcription',
          issue: '이 곡은 코러스마다 박의 밀도가 달라지는 것이 본질인데, 코드 차트만으로는 그 사실이 전달되지 않는다.',
          resolution: 'approach ⑤ 에 코러스별 밀도 설계(온음표 → 4분음표 → 8분음표 → 복귀)를 구체적 절차로 추가했다.',
          severity: 'major',
        },
      ],
    },
  },

  {
    id: 't-giant-steps',
    title: 'Giant Steps',
    composer: 'John Coltrane',
    year: 1959,
    key: 'B',
    meter: [4, 4],
    form: 'other',
    style: 'bebop',
    tempo: [200, 290],
    difficulty: 5,
    levelId: 'L5',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['B∆7', 'D7'] }, { chords: ['G∆7', 'Bb7'] }, { chords: ['Eb∆7'] }, { chords: ['A-7', 'D7'] }, // 1-4
          { chords: ['G∆7', 'Bb7'] }, { chords: ['Eb∆7', 'F#7'] }, { chords: ['B∆7'] }, { chords: ['F-7', 'Bb7'] }, // 5-8
          { chords: ['Eb∆7'] }, { chords: ['A-7', 'D7'] }, { chords: ['G∆7'] }, { chords: ['C#-7', 'F#7'] },        // 9-12
          { chords: ['B∆7'] }, { chords: ['F-7', 'Bb7'] }, { chords: ['Eb∆7'] }, { chords: ['C#-7', 'F#7'] },       // 13-16
        ],
      },
    ],
    teaches: [
      '장3도 순환(B - G - Eb)으로 조성을 3등분하는 콜트레인 체인지의 원형',
      '2박마다 조가 바뀌는 극한 상황에서의 왼손 가이드 톤 경제',
      '세 개의 토닉에 착지하는 3음·5음·근음 조준 연습 — 즉흥의 최소 단위',
      '"아직 못 치는 곡"을 느린 템포에서 정확히 소유하는 연습 설계 능력',
    ],
    approach:
      '① 이 곡은 L5 의 시험이자 평생의 과제다. 오늘의 목표는 연주가 아니라 **구조 이해와 느린 소유**다. ' +
      '② 먼저 세 개의 토닉만 본다 — B, G, Eb. 장3도씩 떨어져 옥타브를 3등분한다. 이 세 음(B-G-Eb)을 왼손으로 30회 쳐서 귀에 심는다. ' +
      '③ 다음은 세 개의 ii-V. A-7 D7 → G∆7 / C#-7 F#7 → B∆7 / F-7 Bb7 → Eb∆7. 각각 ♩=60 에서 50회. 이 세 쌍이 곡의 전부다. ' +
      '④ 1-2마디만 떼어 ♩=60 으로 100회. B∆7 D7 G∆7 Bb7 Eb∆7 — 2박마다 조가 바뀐다. 왼손은 3음·7음 두 음만 잡는다. 세 음 이상 잡으면 이 템포에서 반드시 늦는다. ' +
      '⑤ 오른손은 즉흥하지 않는다. 각 ∆7 코드에 도착할 때 **근음-2음-3음-5음** 네 음 패턴 하나만 놓는다. 콜트레인 본인이 이 패턴을 쓴 것으로 널리 분석된다. 패턴 하나로 16마디를 통과하는 것이 오늘의 성공 기준이다. ' +
      '⑥ 템포는 하루 ♩+5 이상 올리지 않는다. ♩=120 에서 16마디를 실수 없이 세 바퀴 돌 수 있을 때까지 그 이상 올리지 않는다. ' +
      '통과 기준(L5): ♩=140 에서 왼손 가이드 톤 + 오른손 4음 패턴으로 2코러스 무정지.',
    hotspots: [
      {
        at: '1-2마디 (B∆7 D7 / G∆7 Bb7)',
        issue: '2박마다 조가 바뀌어 왼손이 코드를 "찾는" 동안 박이 무너진다.',
        solution: '왼손을 3음·7음 두 음으로 고정하고 이동 거리를 측정한다. B∆7(D#-A#) → D7(F#-C) → G∆7(B-F#) → Bb7(D-Ab) → Eb∆7(G-D). 각 이동이 2도 이내임을 확인하면 손이 도약할 이유가 없다. ♩=50 에서 100회.',
      },
      {
        at: '6마디 (Eb∆7 F#7)',
        issue: 'Eb 에 착지하자마자 F#7 으로 튀어 B 로 가는 자리에서 방향 감각을 잃는다.',
        solution: '6-7마디만 루프. "Eb∆7 의 근음에서 장3도 위가 G, 또 장3도 위가 B" 라는 지도를 소리 내어 말하며 친다. Giant Steps 는 길을 외우는 곡이 아니라 지도를 아는 곡이다.',
      },
      {
        at: '16마디 → 다음 코러스 1마디 (C#-7 F#7 → B∆7)',
        issue: '마지막 마디의 ii-V 가 코러스 경계를 넘어가며 진입이 늦는다.',
        solution: '15-16마디와 다음 1마디를 3마디 루프로 50회. 코러스가 끝나는 것이 아니라 문장이 계속된다는 감각을 만든다.',
      },
    ],
    keyRecordings: ['a-giant-steps'],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-barry-harris', 'rv-transcription'],
      reviewedAt: '2026-05-05',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 4, playability: 3,
        idiom: 5, integration: 5, assessability: 5, sourcing: 5,
      },
      comments: [
        {
          reviewerId: 'rv-keyboard-technique',
          issue: '학습자가 이 곡에서 템포를 무리하게 올리다 손목 긴장과 잘못된 운지를 자동화하는 사례가 많다.',
          resolution: 'approach ⑥ 에 "하루 ♩+5 이상 금지"와 "♩=120 3회 무실수 전까지 상승 금지"라는 명시적 속도 게이트를 넣었다.',
          severity: 'major',
        },
      ],
    },
  },

  {
    id: 't-jz-tritone-lab',
    title: 'Tritone Lab (Jazzytory 연습곡 3)',
    composer: 'Jazzytory 편집부',
    year: 2026,
    key: 'C',
    meter: [4, 4],
    form: 'other',
    style: 'swing',
    tempo: [90, 160],
    difficulty: 3,
    levelId: 'L5',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['D-7', 'G7'] }, { chords: ['C∆7'] }, { chords: ['C-7', 'F7'] }, { chords: ['Bb∆7'] },   // 1-4
          { chords: ['Bb-7', 'Eb7'] }, { chords: ['Ab∆7'] }, { chords: ['D-7', 'G7'] }, { chords: ['C∆7'] }, // 5-8
        ],
      },
      {
        label: 'A2',
        bars: [
          { chords: ['D-7', 'Db7#11'] }, { chords: ['C∆7'] }, { chords: ['C-7', 'B7#11'] }, { chords: ['Bb∆7'] },   // 9-12
          { chords: ['Bb-7', 'A7#11'] }, { chords: ['Ab∆7'] }, { chords: ['D-7', 'Db7#11'] }, { chords: ['C∆7'] },  // 13-16
        ],
      },
    ],
    teaches: [
      '같은 8마디를 원형(V7)과 트라이톤 서브(subV7)로 나란히 쳐서 차이를 몸으로 확인하기',
      'subV7 이 왜 성립하는가 — 두 코드가 3음·7음을 공유한다는 사실을 손으로 발견하기',
      '베이스 라인이 도약(V-I)에서 반음 하행(subV-I)으로 바뀔 때의 소리 변화',
      '리디안 ♭7 스케일을 subV7 의 기본 재료로 사용하기',
    ],
    approach:
      'Jazzytory 오리지널 실험실이다. **같은 진행을 두 번 친다** — 앞 8마디는 원형, 뒤 8마디는 모든 V7 을 트라이톤 서브로 바꾼 것이다. ' +
      '① 먼저 A섹션(1-8마디)만 왼손 셸로 ♩=90 에 20회. 세 개의 ii-V-I 이 온음씩 내려가는 구조(C → Bb → Ab → C)다. ' +
      '② 다음이 핵심이다. G7 의 셸(G-B-F)과 Db7 의 셸(Db-F-Cb=B)을 나란히 잡아 보라. **3음과 7음이 서로 뒤바뀐 같은 두 음**이다. 이 발견이 트라이톤 서브의 전부다. 두 코드를 번갈아 30회. ' +
      '③ A2(9-16마디)를 친다. 왼손 위쪽 두 음은 A섹션과 거의 같고 근음만 반음 위에서 내려온다(Db→C, B→Bb, A→Ab). 베이스가 반음으로 걷는 이 소리를 귀에 새긴다. ' +
      '④ 오른손은 subV7 위에서 리디안 ♭7 을 쓴다. Db7#11 = Ab 멜로딕 마이너. 오늘은 스케일 전체가 아니라 #11 음(G) 한 음만 반드시 들리게 친다. ' +
      '⑤ 마지막으로 A 와 A2 를 이어서 16마디를 돈다. 같은 자리에서 소리가 어떻게 달라지는지 녹음해 들어 보라 — 이 비교가 이 연습곡의 목적이다. ' +
      '응용: 익숙해지면 자기가 아는 스탠다드(예: `t-all-of-me`, `t-autumn-leaves`)의 V7 하나를 골라 subV7 로 바꿔 본다.',
    hotspots: [
      {
        at: 'A2 9마디 (D-7 → Db7#11)',
        issue: 'ii 화음에서 반음 아래 도미넌트로 가는 이동이 손에 낯설어 2박째가 늦는다.',
        solution: 'D-7(D-F-C) → Db7#11(Db-F-Cb) 두 코드만 40회. 위쪽 두 음 중 F 는 공통음이고 C 는 반음 내려갈 뿐이다. 근음만 반음 내려가는 이동이라고 이름 붙인다.',
      },
      {
        at: 'A2 13마디 (Bb-7 → A7#11)',
        issue: '검은 건반 ii 화음에서 흰 건반 subV 로 가면서 손 모양이 무너진다.',
        solution: 'Bb-7(Bb-Db-Ab) → A7#11(A-C#-G) 을 ♩=60 으로 40회. 여기서는 공통음이 없으므로 "위쪽 두 음이 반음씩 좁혀진다"는 감각으로 접근한다.',
      },
    ],
    keyRecordings: [],
    melodyIncluded: false,
    publicDomainOrOriginal: true,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-chord-scale', 'rv-contemporary', 'rv-pedagogy'],
      reviewedAt: '2026-05-05',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 5, playability: 5,
        idiom: 5, integration: 4, assessability: 5, sourcing: 5,
      },
    },
  },

  /* ═══════════════════════════════════════════════════════════════════════
     L6 — 모달·컨템포러리
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: 't-impressions',
    title: 'Impressions',
    composer: 'John Coltrane',
    year: 1963,
    key: 'D-',
    meter: [4, 4],
    form: 'AABA-32',
    style: 'modal',
    tempo: [220, 300],
    difficulty: 3,
    levelId: 'L6',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['D-7'] }, { chords: [] }, { chords: [] }, { chords: [] },  // 1-4
          { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] },       // 5-8
        ],
      },
      {
        label: 'A2',
        bars: [
          { chords: ['D-7'] }, { chords: [] }, { chords: [] }, { chords: [] },  // 9-12
          { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] },       // 13-16
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['Eb-7'] }, { chords: [] }, { chords: [] }, { chords: [] }, // 17-20
          { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] },       // 21-24
        ],
      },
      {
        label: 'A3',
        bars: [
          { chords: ['D-7'] }, { chords: [] }, { chords: [] }, { chords: [] },  // 25-28
          { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] },       // 29-32
        ],
      },
    ],
    teaches: [
      '`t-so-what` 과 동일한 폼을 두 배 빠른 템포로 — 같은 재료, 다른 신체 조건',
      '쿼탈 보이싱을 빠른 템포에서 양손으로 굴리는 맥코이 타이너 계열 컴핑',
      '펜타토닉 중첩 — D 도리안 위에 E-7 펜타토닉, G 펜타토닉을 겹쳐 색을 확장하기',
      '정적 화성에서 긴장을 만드는 유일한 수단인 리듬 밀도와 음역 설계',
    ],
    approach:
      '① 폼은 `t-so-what` 과 같다(D-7 8×2 / Eb-7 8 / D-7 8). 그러나 템포가 두 배이므로 완전히 다른 곡이다. 오늘은 화성을 배우는 날이 아니라 **속도에서 살아남는 법**을 배우는 날이다. ' +
      '② 왼손 쿼탈 보이싱을 두 음으로 줄인다. D-A(4도) 또는 E-A. 네 음 보이싱을 ♩=260 에서 유지하는 것은 불가능하므로, 두 음으로 줄이고 리듬에 집중한다. ' +
      '③ 오른손은 D 마이너 펜타토닉(D-F-G-A-C) 다섯 음만으로 8마디를 채운다. 그다음 E 마이너 펜타토닉(E-G-A-B-D)을 겹친다. 두 펜타토닉을 교대하는 것만으로 D 도리안 전체가 커버되면서 색이 계속 바뀐다. ' +
      '④ 브릿지 반음 상행(D-7 → Eb-7)은 모든 재료를 반음 올리는 것뿐이다. 손 모양은 그대로다. 16-17마디 전환만 50회. ' +
      '⑤ 속도 게이트: ♩=180 에서 32마디 무실수 3회를 통과하기 전에는 템포를 올리지 않는다. ' +
      '청음: 맥코이 타이너의 쿼탈 컴핑과 왼손 5도 페달을 이 어법의 표준 모델로 듣는다.',
    hotspots: [
      {
        at: '16→17마디 / 24→25마디 (반음 전환)',
        issue: '빠른 템포에서 반음 이동 타이밍을 놓쳐 한 마디를 통째로 잘못된 조성으로 친다.',
        solution: '전환 전후 2마디씩만 루프한다. 전환 한 마디 전(16마디 4박)에 손을 이미 올려 두는 "예비 동작"을 반드시 연습에 포함한다.',
      },
      {
        at: 'A섹션 전체 (8마디 정적 화성)',
        issue: '빠른 템포에서 8분음표를 계속 달리다 4마디쯤에서 아이디어와 체력이 모두 떨어진다.',
        solution: '8마디를 "2마디 프레이즈 + 2마디 침묵"으로 강제 분할해 연습한다. 침묵 구간에 다음 프레이즈의 시작 음을 미리 정하는 습관이 지구력의 정체다.',
      },
    ],
    keyRecordings: ['a-the-real-mccoy'],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-contemporary', 'rv-transcription'],
      reviewedAt: '2026-05-12',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 5, playability: 4,
        idiom: 5, integration: 4, assessability: 5, sourcing: 4,
      },
      comments: [
        {
          reviewerId: 'rv-contemporary',
          issue: 'keyRecordings 의 앨범은 이 곡을 수록하지 않는다. 어법 표본임을 밝혀야 한다.',
          resolution: 'approach 마지막 줄에 "맥코이 타이너의 쿼탈 컴핑을 어법의 표준 모델로 듣는다"로 목적을 명시했다.',
          severity: 'minor',
        },
      ],
    },
  },

  {
    id: 't-maiden-voyage',
    title: 'Maiden Voyage',
    composer: 'Herbie Hancock',
    year: 1965,
    key: 'D',
    meter: [4, 4],
    form: 'AABA-32',
    style: 'modal',
    tempo: [120, 150],
    difficulty: 3,
    levelId: 'L6',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['D7sus4'] }, { chords: [] }, { chords: [] }, { chords: [] },  // 1-4
          { chords: ['F7sus4'] }, { chords: [] }, { chords: [] }, { chords: [] },  // 5-8
        ],
      },
      {
        label: 'A2',
        bars: [
          { chords: ['D7sus4'] }, { chords: [] }, { chords: [] }, { chords: [] },  // 9-12
          { chords: ['F7sus4'] }, { chords: [] }, { chords: [] }, { chords: [] },  // 13-16
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['Eb7sus4'] }, { chords: [] }, { chords: [] }, { chords: [] }, // 17-20
          { chords: ['Db7sus4'] }, { chords: [] }, { chords: [] }, { chords: [] }, // 21-24
        ],
      },
      {
        label: 'A3',
        bars: [
          { chords: ['D7sus4'] }, { chords: [] }, { chords: [] }, { chords: [] },  // 25-28
          { chords: ['F7sus4'] }, { chords: [] }, { chords: [] }, { chords: [] },  // 29-32
        ],
      },
    ],
    teaches: [
      'sus4 도미넌트 — 해결되지 않는 도미넌트가 하나의 "색"으로 존재하는 현대적 화성',
      '슬래시 표기(A-7/D, C-7/F)로 sus 코드를 잡는 실전 보이싱 기법',
      '기능 화성이 없는 곡에서 조성이 아니라 음색으로 방향을 만드는 법',
      '허비 핸콕 계열 컴핑 — 넓은 간격, 적은 음, 긴 여운',
    ],
    approach:
      '① 이 곡의 네 코드는 전부 sus4 도미넌트다. 실전에서는 슬래시로 잡는 것이 훨씬 쉽다. D7sus4 = **A-7/D**, F7sus4 = **C-7/F**, Eb7sus4 = **Bb-7/Eb**, Db7sus4 = **Ab-7/Db**. ' +
      '즉 "왼손 근음 + 오른손 그 음의 5도 위 마이너7 코드". 이 공식 하나로 네 코드를 모두 잡는다. 공식만 20회 확인. ' +
      '② A섹션은 네 마디씩 두 코드뿐이다. ♩=130 으로 A 를 10회 돌며 왼손 근음을 온음표로, 오른손 마이너7 을 2·4박에 놓는다. ' +
      '③ 이 곡에는 해결이 없다. 3음이 4음으로 대체되어 도미넌트의 긴장이 제거되었기 때문이다. D7sus4 에서 오른손 C# 을 한 번 눌러 보라 — 갑자기 평범한 D7 이 된다. 넣지 않는 것이 이 곡의 소리다. ' +
      '④ 오른손 즉흥은 각 코드의 상위 마이너7 코드톤에서 시작한다. D7sus4 위에서는 A-7 의 음(A-C-E-G), F7sus4 위에서는 C-7 의 음(C-Eb-G-Bb). 코드톤만으로 32마디를 채우는 것이 첫 목표다. ' +
      '⑤ 여백을 규칙으로 만든다 — 네 마디마다 최소 한 마디는 완전히 비운다. 이 곡은 채워서 망치는 곡이다. ' +
      '조성 표기: 기능적 토닉이 없는 곡이므로 `key` 는 첫 sus 코드의 근음(D)을 기준으로 적었다.',
    hotspots: [
      {
        at: 'A섹션 4→5마디 (D7sus4 → F7sus4)',
        issue: '단3도 위로 통째로 이동하는데 손 모양을 새로 찾느라 5마디 첫 박을 놓친다.',
        solution: '두 코드는 **같은 모양의 평행 이동**이다. A-7/D 의 오른손 모양을 그대로 단3도 위로 올리면 C-7/F 다. 이 평행 이동만 40회.',
      },
      {
        at: 'B섹션 (17-24마디, Eb7sus4 → Db7sus4)',
        issue: '브릿지에서 두 코드가 반음/온음으로 내려가며 조성 감각이 사라져 마디를 잃는다.',
        solution: '브릿지 근음 Eb → Db 는 온음 하행이다. 왼손 근음만으로 브릿지 8마디를 네 번 돌며 마디를 센 뒤 오른손을 붙인다. 화성이 아니라 근음의 지도로 길을 찾는다.',
      },
    ],
    keyRecordings: ['a-maiden-voyage'],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-contemporary', 'rv-chord-scale', 'rv-pedagogy'],
      reviewedAt: '2026-05-12',
      rubric: {
        accuracy: 4, terminology: 5, sequencing: 5, playability: 5,
        idiom: 5, integration: 5, assessability: 5, sourcing: 4,
      },
      comments: [
        {
          reviewerId: 'rv-chord-scale',
          issue: 'sus4 도미넌트를 `D7sus4` 로만 표기하면 실제 연주에서 쓰이는 슬래시 보이싱(A-7/D)과의 연결이 끊긴다.',
          resolution: 'approach ① 에 네 코드의 슬래시 대응표와 "근음 + 5도 위 마이너7" 공식을 명시했다.',
          severity: 'major',
        },
      ],
    },
  },

  {
    id: 't-footprints',
    title: 'Footprints',
    composer: 'Wayne Shorter',
    year: 1966,
    key: 'C-',
    meter: [6, 4],
    form: 'minor-blues-12',
    style: 'waltz',
    tempo: [140, 200],
    difficulty: 3,
    levelId: 'L6',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['C-7'] }, { chords: [] }, { chords: [] }, { chords: [] },       // 1-4
          { chords: ['F-7'] }, { chords: [] }, { chords: ['C-7'] }, { chords: [] },  // 5-8
          { chords: ['Dø7'] }, { chords: ['G7alt'] }, { chords: ['C-7'] }, { chords: [] }, // 9-12
        ],
      },
    ],
    teaches: [
      '6/4(3/4 두 마디로 느끼는) 박자 위의 마이너 블루스 — 변박 감각의 입구',
      '3박 계열에서 스윙하기 — 4박의 관성을 버리고 1박을 크게 느끼는 법',
      '정적 마이너 화성 위에서 도리안과 블루스 스케일을 섞는 모달 블루스 어법',
      '메트릭 모듈레이션의 첫 경험 — 같은 마디를 2 로도 3 으로도 세어 보기',
    ],
    approach:
      '① 먼저 박자다. 이 곡은 한 마디가 6박(6/4)이며, 보통 "3박 두 덩어리"로 느낀다. 아무것도 치지 말고 발로 1-2-3 / 1-2-3 을 세며 12마디를 세 바퀴 센다. 이것이 오늘 가장 중요한 연습이다. ' +
      '② 화성은 `t-minor-blues-c` 와 같다(C-7 4 / F-7 2 / C-7 2 / Dø7 G7alt / C-7 2). 이미 아는 폼이므로 오늘 배울 것은 화성이 아니라 **시간**이다. ' +
      '③ 왼손은 마디당 두 번만 친다 — 1박과 4박. 6박을 다 채우면 3박 느낌이 사라진다. ' +
      '④ 오른손은 C 도리안(C-D-Eb-F-G-A-Bb)으로 시작해, 9-10마디에서만 얼터드 색(Ab, Db)을 건드린다. ' +
      '⑤ 익숙해지면 같은 12마디를 4박으로 다시 세어 본다(6박 마디 = 4/4 한 마디 반). 같은 소리를 다른 격자로 듣는 경험이 L6 변박 모듈의 준비 운동이다. ' +
      '판본 참고: 9마디를 Ab7#11 로, 10마디를 G7#9 로 쓰는 연주가 흔하다. 두 버전을 모두 시도해 보라.',
    hotspots: [
      {
        at: '1-4마디 (C-7 4마디, 6/4)',
        issue: '4박 관성 때문에 6박 마디를 4박으로 세고 5마디 F-7 이 두 박 일찍 나온다.',
        solution: '메트로놈을 마디당 한 번(1박)만 울리게 설정하고 1-4마디를 20회 돈다. 클릭 사이를 6박으로 채우는 감각이 생기면 폼이 무너지지 않는다.',
      },
      {
        at: '9-10마디 (Dø7 → G7alt)',
        issue: '6박 안에 케이던스를 배치하는 감각이 없어 코드 전환이 매번 다른 자리에서 일어난다.',
        solution: '9-11마디만 떼어 "Dø7 은 6박 내내, G7alt 도 6박 내내, C-7 에서 착지" 로 규칙을 고정해 30회. 먼저 자리를 고정한 뒤에 변화를 준다.',
      },
    ],
    keyRecordings: [],
    melodyIncluded: false,
    publicDomainOrOriginal: false,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-contemporary', 'rv-transcription', 'rv-pedagogy'],
      reviewedAt: '2026-05-19',
      rubric: {
        accuracy: 4, terminology: 4, sequencing: 5, playability: 5,
        idiom: 5, integration: 4, assessability: 4, sourcing: 4,
      },
      comments: [
        {
          reviewerId: 'rv-transcription',
          issue: '9-10마디는 연주마다 Dø7 G7alt / Ab7#11 G7#9 등으로 달라지는데 하나만 제시하면 오해를 부른다.',
          resolution: 'approach 마지막 줄에 대표적 대체 화성을 병기하고 두 버전을 모두 시도하도록 지시했다.',
          severity: 'minor',
        },
      ],
    },
  },

  {
    id: 't-jz-modal-study',
    title: 'Modal Study (Jazzytory 연습곡 4)',
    composer: 'Jazzytory 편집부',
    year: 2026,
    key: 'D-',
    meter: [4, 4],
    form: 'modal',
    style: 'modal',
    tempo: [100, 160],
    difficulty: 3,
    levelId: 'L6',
    sections: [
      {
        label: 'A',
        bars: [
          { chords: ['D-7'] }, { chords: [] }, { chords: [] }, { chords: [] }, // 1-4   D 도리안
          { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] },      // 5-8
        ],
      },
      {
        label: 'B',
        bars: [
          { chords: ['Eb∆7#11'] }, { chords: [] }, { chords: [] }, { chords: [] }, // 9-12  Eb 리디안
          { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] },          // 13-16
        ],
      },
    ],
    teaches: [
      '두 개의 정적 모달 센터(D 도리안 / Eb 리디안)를 8마디씩 왕복하며 모드의 색을 구분하기',
      '도리안의 6음(B)과 리디안의 #11음(A)을 "그 모드를 그 모드답게 만드는 한 음"으로 조준하기',
      '쿼탈 보이싱을 두 모드에 각각 적용해 손 모양이 어떻게 달라지는지 확인하기',
      '화성이 정지한 구간에서 리듬·음역·밀도로 전개를 만드는 설계',
    ],
    approach:
      'Jazzytory 오리지널이다. 화성이 두 개뿐이므로 **모드의 색 자체**에 온전히 집중할 수 있다. ' +
      '① 먼저 두 스케일을 각각 한 옥타브씩 친다. D 도리안 = D-E-F-G-A-B-C (특징음 B, 6음). Eb 리디안 = Eb-F-G-A-Bb-C-D (특징음 A, #11음). ' +
      '② 특징음만 찾는 연습을 한다. A섹션 8마디 동안 **B 음만** 다섯 번, 위치와 리듬을 바꿔 친다. B섹션 8마디 동안 **A 음만** 다섯 번. 이 한 음이 들리면 모드가 들린다. ' +
      '③ 쿼탈 보이싱을 적용한다. A섹션은 E-A-D-G(4도 3개), B섹션은 A-D-G-C 를 Eb 위에 얹는다(왼손 Eb 페달). 두 손 모양의 거리를 비교한다. ' +
      '④ 전환 지점(8→9마디, 16→1마디)만 각각 40회 루프. 정적 화성 곡은 전환에서만 실수가 난다. ' +
      '⑤ 마지막으로 16마디를 네 코러스 돈다. 규칙: 1코러스는 한 옥타브 안에서만, 2코러스는 두 옥타브, 3코러스는 리듬만 바꾸고 음역은 고정, 4코러스는 8마디 중 4마디를 침묵. 화성이 없을 때 전개를 만드는 것은 이런 제약이다. ' +
      '연결: `t-so-what`(D 도리안 / Eb 도리안)과 나란히 놓고 "반음 위가 도리안일 때"와 "리디안일 때"의 차이를 비교해 보라.',
    hotspots: [
      {
        at: '8→9마디 (D-7 → Eb∆7#11)',
        issue: '반음 위로 올라가면서 모드 성격까지 바뀌어(마이너 → 메이저) 손과 귀가 동시에 흔들린다.',
        solution: '두 코드의 공통음을 먼저 찾는다. D 도리안과 Eb 리디안은 A, C, D/Eb 근처에서 겹친다. 특히 A 음은 D 도리안의 5음이자 Eb 리디안의 #11음이다. 이 한 음을 붙잡고 넘어가면 전환이 도약이 아니라 재해석이 된다. 8-9마디만 40회.',
      },
      {
        at: 'B섹션 (9-16마디 Eb∆7#11 지속)',
        issue: '리디안 위에서 Ab(4음)을 무심코 쳐서 순식간에 평범한 Eb 장조가 되어 버린다.',
        solution: 'B섹션 동안 Ab 을 금지음으로 정하고 연주한다. 리디안은 "4음을 반음 올린 장음계"가 아니라 "4음을 치지 않는 것"에서 시작된다.',
      },
    ],
    keyRecordings: [],
    melodyIncluded: false,
    publicDomainOrOriginal: true,
    review: {
      status: 'internal-reviewed',
      reviewers: ['rv-contemporary', 'rv-pedagogy', 'rv-chord-scale'],
      reviewedAt: '2026-05-19',
      rubric: {
        accuracy: 5, terminology: 5, sequencing: 5, playability: 5,
        idiom: 4, integration: 5, assessability: 5, sourcing: 5,
      },
    },
  },
];
