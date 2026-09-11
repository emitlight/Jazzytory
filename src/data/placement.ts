/**
 * Jazzytory — 배치고사 (F11)
 * ---------------------------------------------------------------------------
 * 목적은 점수를 매기는 것이 아니라 **어느 레벨의 첫 모듈에서 시작할지** 정하는 것이다.
 *
 *  - `signals` 는 "이 문항을 해결하면 도달한 것으로 보는 레벨"이다.
 *    맞힌 문항들이 신호하는 레벨의 분포를 8개 축(`SkillAxis`)별로 모아 배치를 결정한다.
 *  - `kind: 'choice'` 는 정답이 하나뿐인 이론·독보 문항이다.
 *  - `kind: 'self-report'` 는 정답이 없는 능력 자기보고 문항이며, 각 선택지의
 *    `value`(0~3)가 숙련도 점수가 된다. **정직하게 답할수록 배치가 정확해진다**는
 *    안내를 UI 에서 함께 노출한다.
 *  - `explanation` 은 틀린 사람에게도 하나를 가르치도록 썼다. 배치고사 자체가
 *    첫 수업이 되어야 한다.
 *
 * 문항 순서는 쉬운 것 → 어려운 것이며, 축은 고르게 섞여 있다.
 * 코드 표기는 docs/_MANIFEST.md 표기 표준을 따른다.
 */

import type { PlacementQuestion } from './types';

export const PLACEMENT: PlacementQuestion[] = [
  {
    id: 'pq-01-major-triad',
    axis: 'harmony',
    signals: 'L0',
    kind: 'choice',
    prompt: 'C 장3화음(C major triad)을 이루는 세 음은 무엇입니까?',
    options: [
      { label: 'C · E · G', correct: true },
      { label: 'C · Eb · G', correct: false },
      { label: 'C · E · A', correct: false },
      { label: 'C · F · G', correct: false },
    ],
    explanation:
      '장3화음은 루트 위에 장3도(C→E), 그 위에 단3도(E→G)를 쌓습니다. 3음 하나를 반음 내리면 C·Eb·G 가 되어 단3화음이 됩니다. 재즈에서는 여기에 7음을 하나 더 얹어 `C∆7`(C-E-G-B) 이나 `C7`(C-E-G-Bb) 을 만들며, 사실상 모든 재즈 화음은 이 4음 구조에서 출발합니다.',
  },
  {
    id: 'pq-02-hand-independence',
    axis: 'technique',
    signals: 'L0',
    kind: 'self-report',
    prompt: '왼손으로 화음을 짚고 오른손으로 다른 리듬의 선율을 동시에 연주할 수 있습니까?',
    options: [
      { label: '양손이 같은 리듬일 때만 가능하다', value: 0 },
      { label: '느린 템포에서 단순한 형태라면 된다', value: 1 },
      { label: '왼손이 당김음이어도 오른손이 흔들리지 않는다', value: 2 },
      { label: '양손이 서로 다른 박 묶음(3:2 등)이어도 유지된다', value: 3 },
    ],
    explanation:
      '재즈 피아노에서 양손 독립은 "동시에 다른 음을 친다"가 아니라 **"왼손이 예상 밖의 자리에 들어와도 오른손의 시간이 흔들리지 않는다"**를 뜻합니다. 클래식 훈련으로 손가락은 충분히 움직이지만 이 부분에서 막히는 경우가 가장 많습니다. 한쪽 손만 메트로놈에 맞추고 다른 손을 의도적으로 어긋나게 놓는 연습으로 키웁니다.',
  },
  {
    id: 'pq-03-hear-chord-quality',
    axis: 'ear',
    signals: 'L1',
    kind: 'self-report',
    prompt: '누군가 피아노로 친 7화음을 듣고 메이저7 / 마이너7 / 도미넌트7 을 구별할 수 있습니까?',
    options: [
      { label: '구별되지 않는다', value: 0 },
      { label: '밝은지 어두운지 정도는 안다', value: 1 },
      { label: '세 가지는 대체로 맞힌다', value: 2 },
      { label: '하프디미니시·디미니시까지 포함해 구별한다', value: 3 },
    ],
    explanation:
      '판별 순서를 고정하면 쉬워집니다. **① 3음이 밝은가 어두운가 → ② 7음이 장7도인가 단7도인가 → ③ 5음이 온전한가 내려갔는가.** 이 세 질문만으로 `∆7` `-7` `7` `ø7` 네 가지가 남김없이 갈립니다. 귀가 아니라 질문의 순서를 훈련하는 것이 요령입니다.',
  },
  {
    id: 'pq-04-minor-seventh-spelling',
    axis: 'harmony',
    signals: 'L1',
    kind: 'choice',
    prompt: '코드 심볼 `C-7` 의 구성음은 무엇입니까?',
    options: [
      { label: 'C · Eb · G · Bb', correct: true },
      { label: 'C · E · G · B', correct: false },
      { label: 'C · Eb · Gb · Bb', correct: false },
      { label: 'C · E · G · Bb', correct: false },
    ],
    explanation:
      '`-` 는 마이너를 뜻하며 3음과 7음을 모두 내립니다. 나머지 보기는 각각 `C∆7`(C-E-G-B), `Cø7`(C-Eb-Gb-Bb), `C7`(C-E-G-Bb) 입니다. 네 화음의 차이는 **3음과 7음, 단 두 음**에서만 납니다. 이 두 음을 가이드 톤이라 부르며, 재즈 보이싱과 즉흥의 뼈대가 됩니다.',
  },
  {
    id: 'pq-05-chorus-length',
    axis: 'form',
    signals: 'L1',
    kind: 'choice',
    prompt: 'AABA 32마디 스탠다드에서 "솔로 두 코러스"는 몇 마디를 연주한다는 뜻입니까?',
    options: [
      { label: '64마디', correct: true },
      { label: '16마디', correct: false },
      { label: '32마디', correct: false },
      { label: '8마디', correct: false },
    ],
    explanation:
      '재즈에서 **코러스는 노래의 후렴이 아니라 폼을 한 바퀴 도는 단위**입니다. 32마디 곡의 1코러스는 32마디이므로 두 코러스는 64마디입니다. 현장에서 "두 코러스 돌자"는 말은 곧 "64마디 동안 길을 잃지 말라"는 뜻이며, 이 때문에 폼을 세는 능력이 즉흥 능력보다 먼저 요구됩니다.',
  },
  {
    id: 'pq-06-shell-voicing',
    axis: 'voicing',
    signals: 'L1',
    kind: 'choice',
    prompt: '`G7` 을 왼손 셸 보이싱(1-3-7)으로 잡으면 어떤 세 음입니까?',
    options: [
      { label: 'G · B · F', correct: true },
      { label: 'G · B · F#', correct: false },
      { label: 'G · D · B', correct: false },
      { label: 'G · C · F', correct: false },
    ],
    explanation:
      '셸 보이싱은 루트와 가이드 톤(3음·7음)만 씁니다. `G7` 의 7음은 단7도 F 이고, F# 로 올리면 `G∆7` 이 되어 기능이 완전히 달라집니다. 5음 D 는 화음의 정체를 결정하지 않으므로 과감히 버립니다. **왼손 세 음만으로 화성이 성립한다**는 것이 재즈 보이싱의 첫 발견입니다.',
  },
  {
    id: 'pq-07-metronome-24',
    axis: 'rhythm',
    signals: 'L1',
    kind: 'self-report',
    prompt: '메트로놈을 2·4박에 놓고 스윙 8분음표로 4마디를 흔들리지 않게 연주할 수 있습니까?',
    options: [
      { label: '메트로놈을 2·4박에 놓는다는 말을 처음 듣는다', value: 0 },
      { label: '해 봤지만 몇 마디 안 가서 박을 놓친다', value: 1 },
      { label: '4마디는 유지되지만 12마디를 넘기면 흔들린다', value: 2 },
      { label: '한 코러스 내내 유지되고, 일부러 앞뒤로 놓을 수도 있다', value: 3 },
    ],
    explanation:
      '메트로놈을 1·3박이 아니라 **2·4박(백비트)에 재해석해 놓는 것**은 재즈 연습의 표준입니다. 박이 조금만 밀려도 메트로놈이 갑자기 1·3박처럼 들리기 때문에, 타임이 흐트러지는 순간이 즉시 드러납니다. 120bpm 곡이라면 메트로놈은 60bpm 으로 두고 그 소리를 2·4박으로 듣습니다.',
  },
  {
    id: 'pq-08-blues-bar-five',
    axis: 'repertoire',
    signals: 'L1',
    kind: 'choice',
    prompt: '기본형 12마디 블루스에서 5마디째에 오는 코드의 기능은 무엇입니까?',
    options: [
      { label: 'IV7', correct: true },
      { label: 'I7', correct: false },
      { label: 'V7', correct: false },
      { label: 'ii-7', correct: false },
    ],
    explanation:
      '12마디 블루스의 골격은 **1~4마디 I7 → 5~6마디 IV7 → 7~8마디 I7 → 9마디 V7 → 10마디 IV7 → 11~12마디 I7 과 턴어라운드** 입니다. F 블루스라면 5마디째는 `Bb7` 입니다. 5마디째와 9마디째 두 지점만 몸에 넣으면 코드 차트 없이도 폼을 셀 수 있고, 이것이 첫 즉흥의 안전망이 됩니다.',
  },
  {
    id: 'pq-09-ii-v-i-in-f',
    axis: 'harmony',
    signals: 'L1',
    kind: 'choice',
    prompt: 'F 장조의 ii-V-I 진행은 무엇입니까?',
    options: [
      { label: '`G-7 | C7 | F∆7`', correct: true },
      { label: '`G7 | C7 | F∆7`', correct: false },
      { label: '`A-7 | D7 | G∆7`', correct: false },
      { label: '`G-7 | C-7 | F∆7`', correct: false },
    ],
    explanation:
      'ii 는 마이너7, V 는 도미넌트7, I 은 메이저7 입니다. F 장조의 2번째 음은 G 이므로 `G-7`, 5번째 음은 C 이므로 `C7` 입니다. ii 를 도미넌트로 바꾸면(`G7`) 세컨더리 도미넌트가 되어 조성이 흔들리고, V 를 마이너로 바꾸면(`C-7`) 해결하려는 힘 자체가 사라집니다. **12키 ii-V-I 을 끊김 없이 돌리는 것이 L1~L2 의 통과 기준입니다.**',
  },
  {
    id: 'pq-10-twelve-major-scales',
    axis: 'technique',
    signals: 'L2',
    kind: 'self-report',
    prompt: '12개 장음계를 양손 2옥타브로 운지 실수 없이 연주할 수 있습니까?',
    options: [
      { label: 'C 장음계 정도만 된다', value: 0 },
      { label: '플랫이 적은 몇 개 조성만 된다', value: 1 },
      { label: '12키 모두 되지만 느리고 생각이 필요하다', value: 2 },
      { label: '12키를 생각 없이 자동으로 친다', value: 3 },
    ],
    explanation:
      '재즈는 한 곡 안에서도 조성이 계속 이동하므로, 12키는 선택이 아니라 전제입니다. 다만 **음계를 다 외운 뒤 재즈를 시작하는 것이 아니라**, ii-V-I 같은 실제 진행을 12키로 돌리면서 필요한 음계가 손에 붙게 만드는 순서를 권합니다. 이 문항의 점수가 낮아도 L1 진입에는 지장이 없습니다.',
  },
  {
    id: 'pq-11-rootless-12-keys',
    axis: 'voicing',
    signals: 'L2',
    kind: 'self-report',
    prompt: '왼손 루트리스 보이싱(A형 3-5-7-9 / B형 7-9-3-5)으로 12키 ii-V-I 을 돌릴 수 있습니까?',
    options: [
      { label: '루트리스 보이싱이 무엇인지 모른다', value: 0 },
      { label: '형태는 알지만 몇 개 키에서만 잡힌다', value: 1 },
      { label: '12키가 되지만 느리고 A·B형 전환이 버겁다', value: 2 },
      { label: '120bpm 에서 A·B형을 골라 가며 끊김 없이 돌린다', value: 3 },
    ],
    explanation:
      '루트리스 보이싱은 베이스가 루트를 맡는 상황을 전제로 왼손에서 루트를 빼는 배치입니다. 진행 안에서는 **손이 가장 적게 움직이는 형태를 고르는 것**이 원칙이라, A형과 B형을 번갈아 쓰게 됩니다. `D-7` A형 = F-A-C-E, B형 = C-E-F-A 입니다.',
  },
  {
    id: 'pq-12-keep-the-form',
    axis: 'form',
    signals: 'L2',
    kind: 'self-report',
    prompt: '반주 음원에 맞춰 연주할 때 지금이 폼의 몇 마디째인지 놓치지 않고 따라갈 수 있습니까?',
    options: [
      { label: '악보를 보지 않으면 곧바로 길을 잃는다', value: 0 },
      { label: '블루스 12마디 정도는 유지된다', value: 1 },
      { label: '32마디 AABA 도 유지되지만 브리지에서 흔들린다', value: 2 },
      { label: '솔로하면서도 폼 위치를 항상 알고 있다', value: 3 },
    ],
    explanation:
      '폼을 잃는 것은 기억력 문제가 아니라 **세는 습관의 문제**입니다. 마디를 하나씩 세지 말고 8마디 덩어리를 단위로 "하나-둘-셋-넷"을 세면 부담이 1/8 로 줄어듭니다. AABA 에서 가장 많이 길을 잃는 지점은 브리지 진입이므로, 브리지 첫 코드를 미리 외워 두고 A 파트 마지막 마디에서 준비하는 습관을 만듭니다.',
  },
  {
    id: 'pq-13-memorized-tunes',
    axis: 'repertoire',
    signals: 'L2',
    kind: 'self-report',
    prompt: '악보 없이 처음부터 끝까지 연주할 수 있는 재즈 스탠다드가 몇 곡 있습니까?',
    options: [
      { label: '없다', value: 0 },
      { label: '1~3곡', value: 1 },
      { label: '4~10곡', value: 2 },
      { label: '11곡 이상', value: 3 },
    ],
    explanation:
      '재즈에서 "곡을 안다"는 것은 멜로디를 안다는 뜻이 아니라 **폼과 코드 진행을 로마숫자로 기억한다**는 뜻입니다. 확인법은 간단합니다 — 외운 곡을 반음 위 조성으로 연주해 보십시오. 막힌다면 손 모양만 외운 것입니다. 최종 목표는 블루스·리듬 체인지·AABA 스탠다드를 합쳐 30곡 암보입니다.',
  },
  {
    id: 'pq-14-improvise-eight-bars',
    axis: 'melody',
    signals: 'L2',
    kind: 'self-report',
    prompt: '코드 진행 위에서 멈추지 않고 8마디를 즉흥으로 연주할 수 있습니까?',
    options: [
      { label: '음표가 적혀 있지 않으면 손이 멈춘다', value: 0 },
      { label: '블루스 스케일 하나로 더듬더듬 채운다', value: 1 },
      { label: '코드가 바뀌면 음을 바꿔 가며 8마디를 채운다', value: 2 },
      { label: '프레이즈의 시작·끝을 의도적으로 설계해 연주한다', value: 3 },
    ],
    explanation:
      '이 서비스가 줄이려는 것은 이론 지식의 양이 아니라 **"음표 없는 악보 앞에서 손이 움직이기까지 걸리는 시간"** 입니다. 첫 즉흥은 재료를 최대한 줄여 시작합니다 — 한 코드당 코드 톤 네 개만 쓰기, 또는 3음과 7음 두 음만 쓰기. 재료가 적을수록 리듬에 신경 쓸 여유가 생기고, 그때 비로소 재즈처럼 들립니다.',
  },
  {
    id: 'pq-15-enclosure',
    axis: 'melody',
    signals: 'L3',
    kind: 'choice',
    prompt: '`C∆7` 의 3음 E 를 목표음으로 삼을 때, "엔클로저"에 해당하는 접근은 무엇입니까?',
    options: [
      { label: 'F · Eb · E (위·아래로 감싼 뒤 도착)', correct: true },
      { label: 'C · D · E (음계를 따라 순차 상행)', correct: false },
      { label: 'E · E · E (같은 음을 반복)', correct: false },
      { label: 'G · A · B (목표음을 지나쳐 계속 상행)', correct: false },
    ],
    explanation:
      '엔클로저는 목표음을 **위와 아래에서 번갈아 감싼 뒤 도착**하는 장식입니다. 순차 상행은 어프로치이긴 하지만 감싸지 않으므로 엔클로저가 아닙니다. 핵심은 장식 자체가 아니라 **목표음이 강박에 떨어지도록 앞 박을 세어 배치하는 것**입니다. 3음·4음짜리 형태 두어 개를 외워 12키로 굴리면 어떤 목표음에도 붙일 수 있습니다.',
  },
  {
    id: 'pq-16-minor-ii-v-scale',
    axis: 'harmony',
    signals: 'L3',
    kind: 'choice',
    prompt: '`Dø7 | G7 | C-7` 마이너 ii-V-i 에서 V7(`G7`) 위에 가장 흔히 쓰는 코드 스케일은 무엇입니까?',
    options: [
      { label: 'G 얼터드 스케일 (= Ab 멜로딕 마이너)', correct: true },
      { label: 'G 믹솔리디안', correct: false },
      { label: 'G 리디안', correct: false },
      { label: 'G 도리안', correct: false },
    ],
    explanation:
      '마이너로 해결하는 도미넌트는 목적지의 어두운 색(b13, b9)을 미리 품어야 자연스럽습니다. 얼터드 스케일은 **루트에서 반음 위의 멜로딕 마이너와 같은 음 집합**이므로, `G7alt` 에서는 Ab 멜로딕 마이너를 연주하면 됩니다. 믹솔리디안은 메이저로 해결하는 도미넌트의 스케일이며, 모든 도미넌트에 기계적으로 믹솔리디안을 붙이는 것이 가장 흔한 오류입니다. (또 하나의 표준 선택지는 하모닉 마이너의 5번 모드로, b9 와 b13 을 주되 9·#9 는 주지 않습니다.)',
  },
  {
    id: 'pq-17-anticipation',
    axis: 'rhythm',
    signals: 'L4',
    kind: 'choice',
    prompt: '컴핑에서 "앤티시페이션(푸시)"이란 무엇입니까?',
    options: [
      { label: '다음 마디의 코드를 앞 마디 4박 뒤 8분음표에 미리 치는 것', correct: true },
      { label: '코드를 한 박 늦게 치는 것', correct: false },
      { label: '모든 코드를 마디 1박에 정확히 맞춰 치는 것', correct: false },
      { label: '양손으로 같은 화음을 동시에 치는 것', correct: false },
    ],
    explanation:
      '앤티시페이션은 재즈 컴핑에서 가장 흔한 장치로, 화음을 마디선보다 8분음표 하나 **앞당겨** 놓습니다. 이것만 익혀도 반주가 굳어 있지 않게 들립니다. 박보다 늦게 놓는 것은 레이백이며, 이는 타임이 확립된 뒤에 의도적으로 쓰는 다른 기술입니다. 모든 코드를 1박에 정확히 치는 것은 이론적으로는 틀리지 않지만 재즈 관용어법으로는 거의 쓰이지 않습니다.',
  },
  {
    id: 'pq-18-bebop-scale',
    axis: 'melody',
    signals: 'L4',
    kind: 'choice',
    prompt: '`G7` 의 비밥 도미넌트 스케일은 믹솔리디안에 어떤 음을 하나 더한 것입니까?',
    options: [
      { label: '7음과 루트 사이의 반음 (F#)', correct: true },
      { label: 'b9 (Ab)', correct: false },
      { label: '#11 (C#)', correct: false },
      { label: 'b13 (Eb)', correct: false },
    ],
    explanation:
      '비밥 스케일의 목적은 색을 더하는 것이 아니라 **8분음표로 순차 진행할 때 코드 톤이 강박에 떨어지도록 정렬시키는 것**입니다. 7음 F 와 루트 G 사이에 F# 를 끼워 8음으로 만들면, 루트에서 시작해 한 옥타브를 내려올 때 G·F·D·B 가 모두 강박에 놓입니다. 나머지 보기는 텐션 변화음이며 정렬 기능이 없습니다. 그래서 이 스케일은 "어디에 통과음을 넣는가"가 전부입니다.',
  },
  {
    id: 'pq-19-transcribe-four-bars',
    axis: 'ear',
    signals: 'L4',
    kind: 'self-report',
    prompt: '좋아하는 솔로의 4마디를 악보 없이 귀로만 찾아서 연주할 수 있습니까?',
    options: [
      { label: '시도해 본 적이 없다', value: 0 },
      { label: '아주 느리게 하면 몇 음은 찾는다', value: 1 },
      { label: '4마디를 며칠에 걸쳐 완성할 수 있다', value: 2 },
      { label: '한 코러스를 채보하고 12키로 옮겨 쓸 수 있다', value: 3 },
    ],
    explanation:
      '채보의 목적은 악보를 만드는 것이 아니라 **그 언어를 자기 손에 넣는 것**입니다. 그래서 순서가 정해져 있습니다 — ① 속도를 낮춰 반복해 듣고 ② 따라 부를 수 있을 때까지 부르고 ③ 그다음에 건반에서 찾고 ④ 마지막에 적습니다. 부르지 못하는 것을 먼저 적으려 하면 시간만 오래 걸리고 남는 것이 없습니다.',
  },
  {
    id: 'pq-20-tritone-sub',
    axis: 'harmony',
    signals: 'L5',
    kind: 'choice',
    prompt: '`D-7 | G7 | C∆7` 에서 `G7` 을 트라이톤 서브스티튜션으로 바꾸면 어떤 코드가 됩니까?',
    options: [
      { label: '`Db7`', correct: true },
      { label: '`Ab7`', correct: false },
      { label: '`Bb7`', correct: false },
      { label: '`F#-7`', correct: false },
    ],
    explanation:
      '트라이톤 서브는 도미넌트를 **증4도(트라이톤) 떨어진 다른 도미넌트**로 바꿉니다. G 에서 트라이톤 떨어진 음은 Db 입니다. 성립하는 이유는 두 코드가 같은 두 음을 가이드 톤으로 공유하기 때문입니다 — `G7` 의 B·F 와 `Db7` 의 F·Cb(=B) 는 3음과 7음이 서로 맞바뀐 같은 음입니다. 그 결과 베이스가 D → Db → C 로 반음 하행하게 되어 진행이 매끄러워집니다.',
  },
  {
    id: 'pq-21-upper-structure',
    axis: 'voicing',
    signals: 'L5',
    kind: 'choice',
    prompt: '`G7` 에서 왼손에 B·F(3음·7음)를 두고 오른손에 A 장3화음(A·C#·E)을 얹으면 어떤 텐션이 울립니까?',
    options: [
      { label: '9 · #11 · 13', correct: true },
      { label: 'b9 · #11 · b13', correct: false },
      { label: '#9 · 11 · b13', correct: false },
      { label: '9 · 11 · b13', correct: false },
    ],
    explanation:
      'G 를 기준으로 A 는 9음, C# 는 #11, E 는 13음입니다. 어퍼 스트럭처의 요령은 **아래에 가이드 톤을 깔고 위에는 단순한 트라이어드만 얹는 것**이라, 복잡해 보이는 얼터드 화음을 오른손 트라이어드 하나로 처리할 수 있습니다. 참고로 같은 왼손 위에 Eb 장3화음을 얹으면 b13·루트·#9 가, Ab 장3화음을 얹으면 b9·11·b13 이 나와 `G7alt` 쪽 색이 됩니다.',
  },
  {
    id: 'pq-22-odd-meter-grouping',
    axis: 'rhythm',
    signals: 'L6',
    kind: 'choice',
    prompt: '7/4 박자로 연주할 때 가장 흔히 쓰는 박 묶음은 무엇입니까?',
    options: [
      { label: '4+3 또는 3+4', correct: true },
      { label: '7박을 묶지 않고 하나씩 균등하게 센다', correct: false },
      { label: '6+1', correct: false },
      { label: '1+1+5', correct: false },
    ],
    explanation:
      '변박은 숫자를 세는 문제가 아니라 **묶는 문제**입니다. 7 을 4+3 으로 묶으면 "4/4 한 마디 + 3/4 한 마디"처럼 느껴져 이미 아는 감각을 그대로 쓸 수 있습니다. 3+4 로 묶으면 같은 7박도 완전히 다른 그루브가 됩니다. 새 박자에 들어갈 때는 먼저 묶음을 정하고, 익숙한 `D-7 | G7 | C∆7` 을 그 위에 다시 배치해 보는 순서를 권합니다.',
  },
];
