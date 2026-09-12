/**
 * Jazzytory — 청음 훈련 문제 은행 (F7)
 * ---------------------------------------------------------------------------
 * `bank` 는 사람이 읽는 설명이 아니라 **오디오 엔진이 그대로 발음할 수 있는 문자열**이다.
 *
 *  - interval          : 음정 이름. `P`(완전) `M`(장) `m`(단) `A`(증) `d`(감) + 도수,
 *                        그리고 트라이톤은 `TT`. 예) 'P5' 'M3' 'm7' 'TT' 'M9'
 *  - chord-quality     : 단일 코드 심볼 하나. 예) 'C∆7' 'C-7' 'C7' 'Cø7' 'C°7' 'C-∆7' 'C7alt'
 *  - progression /
 *    guide-tone /
 *    bass-motion       : 파이프(|)로 마디를 나눈 진행. 예) 'D-7|G7|C∆7'
 *
 * 코드 표기는 docs/_MANIFEST.md 표기 표준을 따른다.
 * 하프디미니시는 매니페스트 표준인 `ø7` 로 적는다. 현장에서 통용되는 `-7b5` 는
 * 코드 파서가 받아들이는 동의 표기이지만, 데이터에는 표준형만 저장한다.
 *
 * 출제는 bank 에서 무작위로 뽑아 임의의 키로 이조해 들려주는 것을 전제로 한다.
 * 따라서 bank 의 루트는 대표값일 뿐 고정된 조성이 아니다.
 * 레벨은 L1 부터 L8 까지 고르게 배분했고, 다섯 kind 를 모두 사용한다.
 */

import type { EarDrillSpec } from './types';

export const EAR_DRILLS: EarDrillSpec[] = [
  /* ── L1 : 귀의 기준점 만들기 ── */
  {
    id: 'ed-int-perfect',
    title: '완전음정 구별 — 4도·5도·옥타브',
    kind: 'interval',
    levelId: 'L1',
    description:
      '두 음을 동시에, 이어서 한 번 더 차례로 들려준다. 얼마나 먼가가 아니라 **속이 비었는가 꽉 찼는가**를 듣는다. 완전5도는 속이 빈 종소리, 완전4도는 위가 눌린 소리, 옥타브는 같은 음이 두 겹으로 들린다. 음정마다 기준 노래를 하나씩 정해 두면 흔들리지 않는다.',
    bank: ['P4', 'P5', 'P8'],
    relatedModules: ['m-l0-03-keyboard-geography', 'm-l1-01-chord-symbols'],
  },
  {
    id: 'ed-int-thirds-sevenths',
    title: '가이드 톤 음정 — 3도와 7도의 장·단',
    kind: 'interval',
    levelId: 'L1',
    description:
      '3도와 7도만 장·단 네 가지로 섞어 출제한다. 3도는 아래 음에서 위 음까지 **속으로 노래**해 도-미면 장3도, 도-미♭이면 단3도로 판정한다. 7도는 옥타브에서 얼마나 모자란지로 듣는다 — 장7도는 아슬아슬하게 못 미치고, 단7도는 한 칸 더 벌어져 있다. 이 네 가지가 코드 퀄리티 판별의 전부다.',
    bank: ['m3', 'M3', 'm7', 'M7'],
    relatedModules: ['m-l1-01-chord-symbols', 'm-l2-02-guide-tone-lines'],
  },
  {
    id: 'ed-chord-four-qualities',
    title: '7화음 네 퀄리티 — ∆7 / -7 / 7 / ø7',
    kind: 'chord-quality',
    levelId: 'L1',
    description:
      '루트를 먼저 들려주고 화음을 통째로 울린다. 판별 순서를 고정한다: **① 3음이 밝은가 어두운가 → ② 7음이 장7도인가 단7도인가 → ③ 5음이 온전한가 내려갔는가.** 이 세 질문을 순서대로 물으면 네 퀄리티가 남김없이 갈린다. 귀가 아니라 질문의 순서를 훈련하는 드릴이다.',
    bank: ['C∆7', 'C-7', 'C7', 'Cø7'],
    relatedModules: ['m-l1-01-chord-symbols', 'm-l1-02-shell-voicings'],
  },
  {
    id: 'ed-prog-major-ii-v-i',
    title: '메이저 ii-V-I 알아듣기',
    kind: 'progression',
    levelId: 'L1',
    description:
      '세 마디 진행을 들려준다. 첫 코드가 어둡고(마이너7), 둘째가 긴장되며(도미넌트), 셋째에서 풀린다(메이저7)는 **긴장 곡선**을 듣는다. 코드 이름을 맞히는 것이 목적이 아니라, 곡이 흘러갈 때 "지금 해결됐다"를 느끼는 것이 목적이다. 답한 뒤에는 그 진행을 셸 보이싱으로 직접 쳐서 확인한다.',
    bank: [
      'D-7|G7|C∆7',
      'E-7|A7|D∆7',
      'G-7|C7|F∆7',
      'C-7|F7|Bb∆7',
      'F-7|Bb7|Eb∆7',
      'A-7|D7|G∆7',
    ],
    relatedModules: ['m-l1-04-ii-v-i', 'm-l1-03-diatonic-harmony'],
  },
  {
    id: 'ed-bass-root-motion',
    title: '베이스 움직임 — 4도 상행인가 2도 진행인가',
    kind: 'bass-motion',
    levelId: 'L1',
    description:
      '화음 없이 루트 음만 차례로 들려준다. 루트가 **4도 위(=5도 아래)로 움직이는지**, **온음으로 올라가는지**, **반음으로 내려가는지** 세 가지만 구별한다. 재즈 진행의 대부분은 4도 루트 움직임이므로, 이것이 들리면 다음 코드를 예측할 수 있게 된다.',
    bank: ['D-7|G7|C∆7', 'C∆7|D-7|E-7', 'C∆7|B7|Bb∆7', 'C∆7|A-7|D-7|G7'],
    relatedModules: ['m-l1-03-diatonic-harmony', 'm-l1-04-ii-v-i'],
  },

  /* ── L2 : 보이싱을 듣는 귀 ── */
  {
    id: 'ed-chord-six-qualities',
    title: '7화음 여섯 퀄리티 — °7 과 -∆7 추가',
    kind: 'chord-quality',
    levelId: 'L2',
    description:
      '앞선 네 퀄리티에 감7화음과 마이너메이저7 을 더한다. `C°7` 은 **어느 음을 최저음에 두어도 똑같이 들리는 대칭적 긴장**이고, `C-∆7` 은 어두운 3음 위에 밝은 7음이 얹혀 **불안하게 아름다운** 색을 낸다. 이 둘은 나머지와 헷갈리지 않으므로 먼저 걸러 낸 뒤 나머지 넷을 판별한다.',
    bank: ['C∆7', 'C-7', 'C7', 'Cø7', 'C°7', 'C-∆7'],
    relatedModules: ['m-l2-03-tensions', 'm-l3-06-minor-harmony'],
  },
  {
    id: 'ed-gt-ii-v-i-line',
    title: '가이드 톤 라인 따라 부르기 — ii-V-I',
    kind: 'guide-tone',
    levelId: 'L2',
    description:
      '진행을 들려준 뒤 **7음만 이어서 노래**한다(`D-7`의 C → `G7`의 B → `C∆7`의 B). 다음 차례에는 3음만 이어서 노래한다(F → B → E). 코드를 통째로 외우지 말고 두 개의 선으로 기억하는 습관을 만드는 드릴이다. 부를 수 있으면 칠 수 있다.',
    bank: ['D-7|G7|C∆7', 'G-7|C7|F∆7', 'C-7|F7|Bb∆7', 'A-7|D7|G∆7'],
    relatedModules: ['m-l2-02-guide-tone-lines', 'm-l1-04-ii-v-i'],
  },
  {
    id: 'ed-prog-turnaround',
    title: '턴어라운드 네 가지 구별',
    kind: 'progression',
    levelId: 'L2',
    description:
      '네 마디 턴어라운드를 들려준다. **둘째 마디가 관건**이다 — 어두우면 `A-7`(다이어토닉 vi), 조성 밖으로 튀며 밝게 긴장하면 `A7`(세컨더리 도미넌트), 불안정하게 미끄러지면 `Eb°7`(경과 디미니시), 마지막 마디에서 베이스가 반음으로 내려오면 트라이톤 서브다.',
    bank: [
      'C∆7|A-7|D-7|G7',
      'C∆7|A7|D-7|G7',
      'C∆7|Eb°7|D-7|G7',
      'C∆7|A7|D-7|Db7',
    ],
    relatedModules: ['m-l2-05-turnarounds', 'm-l1-03-diatonic-harmony'],
  },

  /* ── L3 : 텐션과 마이너 ── */
  {
    id: 'ed-int-tensions',
    title: '텐션 음정 — 9·11·13과 그 변화형',
    kind: 'interval',
    levelId: 'L3',
    description:
      '루트를 낮게 울린 뒤 한 옥타브 위의 음을 들려준다. **옥타브 위에서 몇 칸 더 갔는가**로 센다: 한 칸이면 b9, 두 칸이면 9, 세 칸이면 #9. 11·13 도 같은 방식이다. 이 감각이 생기면 보이싱에서 무엇이 울리고 있는지 이름을 붙일 수 있고, 채보에서 넓은 도약을 받아쓸 수 있다.',
    bank: ['m9', 'M9', 'A9', 'P11', 'A11', 'm13', 'M13'],
    relatedModules: ['m-l2-03-tensions', 'm-l3-01-chord-scales'],
  },
  {
    id: 'ed-chord-dominant-colors',
    title: '도미넌트 색 구별 — sus / b9 / #9 / #11 / alt',
    kind: 'chord-quality',
    levelId: 'L3',
    description:
      '루트와 퀄리티는 도미넌트로 고정하고 **텐션만 바꿔** 들려준다. `C7sus4` 는 3음이 없어 뭉툭하고, `C7b9` 는 날카롭게 찌르며, `C7#9` 는 거칠고, `C7#11` 은 떠 있고, `C7alt` 는 여러 긴장이 동시에 울린다. 이름을 맞히기 전에 색을 말로 붙이는 것이 먼저다.',
    bank: ['C7', 'C7sus4', 'C7b9', 'C7#9', 'C7#11', 'C7b13', 'C7alt'],
    relatedModules: ['m-l3-01-chord-scales', 'm-l2-03-tensions'],
  },
  {
    id: 'ed-prog-minor-ii-v-i',
    title: '마이너 ii-V-i 와 메이저 ii-V-I 가려듣기',
    kind: 'progression',
    levelId: 'L3',
    description:
      '두 진행을 번갈아 들려준다. 마이너 쪽은 **첫 코드에서 이미 5음이 내려가 불안하고**(`ø7`), 둘째 코드의 긴장이 훨씬 날카로우며(`7alt`), 해결해도 어둡게 끝난다. 가장 확실한 판별법은 마지막 코드의 3음이 밝은지 어두운지를 확인하는 것이다.',
    bank: [
      'Dø7|G7alt|C-7',
      'D-7|G7|C∆7',
      'Eø7|A7alt|D-7',
      'Aø7|D7alt|G-7',
      'Bø7|E7alt|A-7',
    ],
    relatedModules: ['m-l3-06-minor-harmony', 'm-l1-04-ii-v-i'],
  },
  {
    id: 'ed-bass-chromatic-descent',
    title: '베이스 반음 하행 — 트라이톤 서브를 귀로 잡기',
    kind: 'bass-motion',
    levelId: 'L3',
    description:
      '같은 자리에 원래 도미넌트를 쓴 버전과 트라이톤 서브를 쓴 버전을 번갈아 들려준다. **상성의 가이드 톤은 거의 같고 베이스만 다르다.** 베이스가 4도 뛰어오르면 원형, 반음으로 미끄러져 내려오면 서브다. 베이스 선만 따로 노래해 확인한다.',
    bank: ['D-7|G7|C∆7', 'D-7|Db7|C∆7', 'A-7|D7|G∆7', 'A-7|Ab7|G∆7'],
    relatedModules: ['m-l5-01-tritone-sub', 'm-l2-02-guide-tone-lines'],
  },

  /* ── L4 : 라인과 시간 ── */
  {
    id: 'ed-gt-chromatic-line',
    title: '반음으로 내려오는 가이드 톤 선 듣기',
    kind: 'guide-tone',
    levelId: 'L4',
    description:
      '네 마디 진행에서 **한 성부가 반음씩 내려오는지** 듣는다. 이 선이 들리면 곡의 화성 논리가 보이고, 리하모니제이션 후보도 바로 떠오른다. 들은 뒤에는 그 선만 오른손으로 연주하고 왼손으로 코드를 붙여 확인한다.',
    bank: [
      'C∆7|C7|F∆7|Fø7',
      'C∆7|Eb°7|D-7|Db7',
      'E-7|Eb°7|D-7|G7',
      'A-7|A-∆7|A-7|A-6',
    ],
    relatedModules: ['m-l2-02-guide-tone-lines', 'm-l5-04-passing-diminished'],
  },
  {
    id: 'ed-bass-pedal-inversion',
    title: '페달 포인트와 전위 — 최저음이 루트가 아닐 때',
    kind: 'bass-motion',
    levelId: 'L4',
    description:
      '최저음을 고정한 채 위 화성이 바뀌는 구간을 들려준다. **화음이 바뀌었는데 베이스가 그대로인가**를 판정한다. 페달이라고 느꼈다면 그 고정음이 각 코드의 몇 음인지(루트·3음·5음·텐션)까지 말해 본다. 발라드 인트로를 채보할 때 반드시 필요한 귀다.',
    bank: [
      'C∆7|C∆7/G|C7/G|F∆7/G',
      'G7sus4|G7|C∆7',
      'C∆7|C-7/C|Bb∆7/C|C∆7',
      'F∆7|F∆7/C|G-7/C|C7',
    ],
    relatedModules: ['m-l7-03-rubato-ballad', 'm-l6-01-modal-playing'],
  },

  /* ── L5 : 대리 화성 ── */
  {
    id: 'ed-prog-substitutions',
    title: '대리 화성 판별 — 백도어·모달 인터체인지·경과 디미니시',
    kind: 'progression',
    levelId: 'L5',
    description:
      '같은 목적지로 가는 네 가지 길을 번갈아 들려준다. 정면(`G7`), 뒷문(`F-7 | Bb7`), 빌려 온 어두운 색(`F-7`), 반음 경과(`C#°7`). **해결 직전 코드의 베이스가 어디에서 오는가**를 듣는 것이 판별의 열쇠다.',
    bank: [
      'D-7|G7|C∆7',
      'F-7|Bb7|C∆7',
      'F∆7|F-7|C∆7',
      'C∆7|C#°7|D-7|G7',
      'Ab∆7|Bb7|C∆7',
    ],
    relatedModules: ['m-l5-02-modal-interchange', 'm-l5-04-passing-diminished'],
  },
  {
    id: 'ed-chord-extended-colors',
    title: '확장 화음 색 구별 — ∆7#11 / ∆7#5 / -∆7 / 6/9',
    kind: 'chord-quality',
    levelId: 'L5',
    description:
      '발라드 리하모니제이션에서 실제로 고르게 되는 색들을 모았다. **최상성이 아니라 화음 속에서 무엇이 "떠 있는가"** 를 듣는다. `C∆7#11` 은 위로 떠오르고, `C∆7#5` 는 부풀어 오르며, `C6/9` 는 완전히 착지하고, `C-∆7` 은 어둡게 빛난다.',
    bank: ['C∆7', 'C∆7#11', 'C∆7#5', 'C6/9', 'C-∆7', 'C-9', 'Cø7'],
    relatedModules: ['m-l5-06-reharm-ballad', 'm-l5-03-upper-structures'],
  },

  /* ── L6~L8 : 현대 어법과 현장 ── */
  {
    id: 'ed-chord-quartal-modal',
    title: '쿼탈·모달 색 구별 — 3도로 쌓았는가 4도로 쌓았는가',
    kind: 'chord-quality',
    levelId: 'L6',
    description:
      '같은 모드 안에서 3도 쌓기와 4도 쌓기를 번갈아 들려준다. **4도로 쌓은 화음은 메이저인지 마이너인지 즉시 말하기 어렵다** — 그 모호함 자체가 판별 표지다. 3도 쌓기는 퀄리티가 곧바로 들린다.',
    bank: ['C-7', 'C-9', 'C-11', 'C7sus4', 'C-6', 'C∆7'],
    relatedModules: ['m-l6-02-quartal-voicings', 'm-l6-01-modal-playing'],
  },
  {
    id: 'ed-bass-slash-chords',
    title: '슬래시 화성 — 위와 아래를 따로 듣기',
    kind: 'bass-motion',
    levelId: 'L6',
    description:
      '베이스 한 음 위에 다른 조의 트라이어드를 얹은 소리를 들려준다. **먼저 최저음만 잡아내고, 그다음 위의 트라이어드를 통째로 듣는다.** 두 층을 분리해 들을 수 있으면 컨템포러리 보이싱을 받아쓸 수 있다.',
    bank: ['C∆7|D/C|C∆7', 'Bb/C|C7sus4|C7', 'F-7|Db/Eb|Ab∆7', 'E/C|C∆7#5|F∆7'],
    relatedModules: ['m-l6-06-contemporary-voicings', 'm-l5-03-upper-structures'],
  },
  {
    id: 'ed-gt-solo-piano-layers',
    title: '솔로 피아노 세 층 분리해 듣기',
    kind: 'guide-tone',
    levelId: 'L7',
    description:
      '혼자 치는 연주를 들으며 **베이스 선 / 가이드 톤 / 멜로디** 세 층을 각각 따로 따라 부른다. 가운데 층(가이드 톤)이 가장 어렵고 가장 중요하다. 이 층이 들리면 남의 솔로 편곡을 분해해 자기 것으로 옮길 수 있다.',
    bank: [
      'C∆7|A7|D-7|G7',
      'F∆7|Bb7|C∆7|A-7',
      'D-7|G7|E-7|A7',
      'Bb∆7|G7|C-7|F7',
    ],
    relatedModules: ['m-l7-01-solo-piano', 'm-l7-06-arrangement'],
  },
  {
    id: 'ed-prog-unknown-tune',
    title: '처음 듣는 곡의 첫 8마디 받아쓰기',
    kind: 'progression',
    levelId: 'L8',
    description:
      '모르는 진행을 한 번만 들려준다. 절차는 고정이다: **① 조성 잡기 → ② 마디 수 세기 → ③ 각 마디의 베이스 → ④ 퀄리티 → ⑤ 텐션.** 순서를 지키면 틀려도 어디서 틀렸는지 알 수 있다. 잼 세션에서 콜만 듣고 따라 들어가는 능력이 여기서 나온다.',
    bank: [
      'C∆7|A-7|D-7|G7|E-7|A7|D-7|G7',
      'F∆7|Eø7|A7alt|D-7|G-7|C7|F∆7|Db7',
      'C-7|F7|Bb∆7|Eb∆7|Aø7|D7alt|G-7|G-7',
      'D-7|G7|C∆7|Bø7|E7alt|A-7|D7|G7',
    ],
    relatedModules: ['m-l8-05-gig-readiness', 'm-l8-03-repertoire-building'],
  },
];
