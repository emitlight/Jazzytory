/**
 * Jazzytory — 용어집 (a11y-i18n-engineer 산출물)
 * ---------------------------------------------------------------------------
 * 한국어 표기는 `.claude/agents/a11y-i18n-engineer.md` 의 용어 표준 표를 따른다.
 *   voicing → 보이싱 / comping → 컴핑 / guide tone → 가이드 톤 / rootless → 루트리스
 *   tension → 텐션 / lead sheet → 리드시트 / changes → 코드 진행·체인지
 *   chorus → 코러스 / head → 헤드 / turnaround → 턴어라운드
 * 현장에서 통용되는 다른 표기는 버리지 않고 `aka` 에 기록해 검색이 걸리게 한다.
 *
 * 코드 표기는 docs/_MANIFEST.md 표기 표준을 따른다.
 *   마이너7 `C-7` / 메이저7 `C∆7` / 도미넌트 `C7` / 하프디미니시 `Cø7` / 디미니시 `C°7`
 *   얼터드 `C7alt` / 서스 `C7sus4` / 식스나인 `C6/9` / 마이너메이저 `C-∆7` / 슬래시 `C/E`
 *
 * 숫자와 단위는 붙여 쓴다: `120bpm`, `12키`, `4마디`.
 * 정의는 "읽고 나서 건반에서 바로 해볼 수 있는가"를 기준으로 썼다.
 */

import type { GlossaryEntry } from './types';

export const GLOSSARY: GlossaryEntry[] = [
  /* ───────────── 코드 표기와 화음 ───────────── */
  {
    id: 'g-chord-symbol',
    term: '코드 심볼',
    termEn: 'chord symbol',
    aka: ['코드 기호'],
    definition:
      '한 화음을 글자 몇 개로 압축한 표기. 왼쪽부터 루트(알파벳) → 퀄리티(-, ∆, ø, ° 등) → 텐션(9, #11, b13) 순으로 읽는다. 이 순서대로 소리 내어 읽는 습관을 들이면 처음 보는 심볼도 3초 안에 구성음을 말할 수 있다.',
    example: '`Bb∆7#11` = 루트 Bb / 메이저7 / 텐션 #11 → Bb-D-F-A + E',
    relatedModules: ['m-l1-01-chord-symbols', 'm-l0-01-placement'],
  },
  {
    id: 'g-root',
    term: '루트',
    termEn: 'root',
    aka: ['근음'],
    definition:
      '코드 심볼의 알파벳이 가리키는 음. 화음의 이름을 정하지만, 피아노가 반드시 쳐야 하는 음은 아니다. 트리오에서는 베이스가 맡으므로 왼손에서 루트를 빼는 선택(루트리스)이 가능해진다.',
    example: '`C-7` 의 루트는 C. `C/E` 는 루트가 C 이고 최저음만 E 다.',
    relatedModules: ['m-l1-01-chord-symbols', 'm-l2-01-rootless'],
  },
  {
    id: 'g-chord-tone',
    term: '코드 톤',
    termEn: 'chord tone',
    aka: ['화음 구성음'],
    definition:
      '7화음의 1·3·5·7음. 즉흥에서 강박에 놓으면 화성이 선명하게 들리고, 약박에 놓으면 지나가는 소리로 들린다. 프레이즈의 착지점은 거의 항상 코드 톤이다.',
    example: '`G7` 의 코드 톤 = G·B·D·F',
    relatedModules: ['m-l1-01-chord-symbols', 'm-l3-05-forward-motion'],
  },
  {
    id: 'g-guide-tone',
    term: '가이드 톤',
    termEn: 'guide tone',
    aka: ['3음·7음'],
    definition:
      '화음의 3음과 7음. 이 두 음만으로 메이저·마이너·도미넌트가 구별되므로 재즈 보이싱과 즉흥의 뼈대가 된다. 새 곡을 만나면 가장 먼저 모든 코드의 3음·7음 위치를 찾아 둔다.',
    example: '`D-7` → F·C / `G7` → B·F / `C∆7` → E·B (F→E, C→B 로 반음씩 내려간다)',
    relatedModules: ['m-l2-02-guide-tone-lines', 'm-l3-02-guide-tone-improv', 'm-l1-02-shell-voicings'],
  },
  {
    id: 'g-tension',
    term: '텐션',
    termEn: 'tension',
    aka: ['익스텐션', 'extension'],
    definition:
      '코드 톤 위에 얹는 9·11·13 및 그 변형(b9, #9, #11, b13). 화음의 기능은 바꾸지 않고 색만 바꾼다. 초심자는 9음 하나만 추가하는 것으로 시작하면 소리가 즉시 달라진다.',
    example: '`C-7` 에 9음을 더하면 `C-9` (C-Eb-G-Bb + D)',
    relatedModules: ['m-l2-03-tensions', 'm-l3-01-chord-scales'],
  },
  {
    id: 'g-avoid-note',
    term: '어보이드 노트',
    termEn: 'avoid note',
    aka: ['피해야 할 음'],
    definition:
      '그 코드 위에서 지속하면 화음의 정체를 흐리는 음. 대개 코드 톤과 단2도로 부딪히는 음이다. 금지어가 아니라 "길게 끌지 말 것"이라는 뜻이므로, 지나가는 음으로는 쓸 수 있다.',
    example: '`C∆7` 위의 F(11음)는 3음 E 와 단2도로 부딪힌다 → `C∆7#11` 로 올려 쓴다.',
    relatedModules: ['m-l2-03-tensions', 'm-l3-01-chord-scales'],
  },
  {
    id: 'g-slash-chord',
    term: '슬래시 코드',
    termEn: 'slash chord',
    aka: ['분수 코드', '온 베이스'],
    definition:
      '`상부화음/최저음` 으로 쓰는 표기. 왼손은 슬래시 뒤 음 하나, 오른손은 앞의 화음을 잡는다고 생각하면 그대로 연주된다. 전위 표기일 수도, 상부 구조를 가리키는 표기일 수도 있다.',
    example: '`C/E` 는 C 트라이어드의 1전위. `D/C` 는 C 위에 D 트라이어드 → `C7#11(9,13)` 색.',
    relatedModules: ['m-l6-06-contemporary-voicings', 'm-l1-01-chord-symbols'],
  },
  {
    id: 'g-sus-chord',
    term: '서스 코드',
    termEn: 'suspended chord',
    aka: ['sus4'],
    definition:
      '3음 대신 4음을 쓰는 화음. 도미넌트의 긴장이 누그러져 해결을 미룰 수 있다. `G7sus4` 는 `D-7/G` 와 같은 음 집합이라, 왼손에 G 를 두고 오른손에 `D-7` 을 잡으면 바로 만들어진다.',
    example: '`G7sus4` = G-C-D-F (오른손 `D-7`, 왼손 G)',
    relatedModules: ['m-l6-01-modal-playing', 'm-l2-03-tensions'],
  },
  {
    id: 'g-six-nine',
    term: '식스나인',
    termEn: 'six-nine chord',
    aka: ['6/9'],
    definition:
      '7음 대신 6음을 쓰고 9음을 더한 화음. 7음이 없어 해결을 요구하지 않으므로 곡의 마지막 화음으로 자주 쓴다. 메이저7 의 B 음이 주는 날카로움을 피하고 싶을 때 고른다.',
    example: '`C6/9` = C-E-G-A-D (엔딩에서 `C∆7` 대신)',
    relatedModules: ['m-l2-05-turnarounds', 'm-l7-06-arrangement'],
  },
  {
    id: 'g-half-diminished',
    term: '하프 디미니시',
    termEn: 'half-diminished seventh',
    aka: ['ø7', '마이너7 플랫5', '-7b5'],
    definition:
      '감3화음에 단7도를 얹은 화음. 마이너 ii-V-i 의 ii 자리를 맡는다. `C-7` 에서 5음만 반음 내리면 되므로, 마이너7 을 잡은 손에서 한 손가락만 움직여 만든다.',
    example: '`Dø7` = D-F-Ab-C → 마이너 ii-V-i 는 `Dø7 | G7alt | C-7`',
    relatedModules: ['m-l3-06-minor-harmony', 'm-l1-01-chord-symbols'],
  },
  {
    id: 'g-diminished-seventh',
    term: '디미니시드 7화음',
    termEn: 'diminished seventh chord',
    aka: ['°7', '감7화음'],
    definition:
      '단3도 간격만으로 쌓은 4음 화음. 완전히 대칭이라 전위해도 같은 화음이 되고, 결과적으로 서로 다른 감7화음은 세 종류뿐이다. 대개 두 코드 사이를 반음으로 잇는 경과 화음으로 쓴다.',
    example: '`C°7` = C-Eb-Gb-A. `C∆7 | C#°7 | D-7` 처럼 사이에 끼운다.',
    relatedModules: ['m-l5-04-passing-diminished', 'm-l1-01-chord-symbols'],
  },
  {
    id: 'g-minor-major',
    term: '마이너 메이저7',
    termEn: 'minor-major seventh',
    aka: ['-∆7', '마이너 메이저'],
    definition:
      '마이너 트라이어드에 장7도를 얹은 화음. 멜로딕 마이너의 I 화음이며, 마이너 키의 토닉으로 쓰면 해결감이 강하면서도 긴장이 남는다.',
    example: '`C-∆7` = C-Eb-G-B',
    relatedModules: ['m-l3-06-minor-harmony', 'm-l5-06-reharm-ballad'],
  },
  {
    id: 'g-altered-dominant',
    term: '얼터드 도미넌트',
    termEn: 'altered dominant',
    aka: ['7alt'],
    definition:
      '5음과 9음을 모두 변화시킨 도미넌트(b9, #9, b5/#11, #5/b13). 해결할 목적지가 분명할 때만 쓴다. 표기가 `7alt` 면 어떤 변화음을 고를지는 연주자의 선택이다.',
    example: '`G7alt` → C 로 해결. 자주 쓰는 조합은 G-B-Eb-F + Ab 또는 G-B-F-Bb',
    relatedModules: ['m-l3-06-minor-harmony', 'm-l5-03-upper-structures'],
  },

  /* ───────────── 화성 ───────────── */
  {
    id: 'g-diatonic',
    term: '다이어토닉',
    termEn: 'diatonic',
    aka: ['조성 내'],
    definition:
      '한 조성의 음계 음만으로 만들어진 것. 장조의 다이어토닉 7화음은 I∆7-ii-7-iii-7-IV∆7-V7-vi-7-viiø7 일곱 개다. 이 일곱 개를 12키로 칠 수 있으면 대부분의 스탠다드에서 "조성 밖" 코드를 골라낼 수 있다.',
    example: 'C장조 → `C∆7` `D-7` `E-7` `F∆7` `G7` `A-7` `Bø7`',
    relatedModules: ['m-l1-03-diatonic-harmony', 'm-l1-01-chord-symbols'],
  },
  {
    id: 'g-roman-numeral',
    term: '로마숫자 분석',
    termEn: 'Roman numeral analysis',
    aka: ['기능 분석'],
    definition:
      '코드를 조성 안에서의 자리 번호로 바꿔 적는 방법. 키가 달라져도 같은 번호가 나오므로, 한 번 외운 패턴을 12키로 옮길 수 있다. 새 곡을 만나면 조성을 정하고 번호부터 적는다.',
    example: '`D-7 | G7 | C∆7` → C장조에서 ii-7 | V7 | I∆7',
    relatedModules: ['m-l1-03-diatonic-harmony', 'm-l2-06-form-navigation'],
  },
  {
    id: 'g-cadence',
    term: '케이던스',
    termEn: 'cadence',
    aka: ['종지'],
    definition:
      '긴장을 만들고 푸는 화성의 마침 공식. 재즈에서 가장 흔한 것은 V7 → I 이고, 그 앞에 ii-7 을 붙인 것이 ii-V-I 다. 리드시트에서 케이던스 위치를 표시하면 폼의 단락이 보인다.',
    example: '`G7 | C∆7` (정격 종지) / `F-7 | Bb7 | C∆7` (백도어 종지)',
    relatedModules: ['m-l1-04-ii-v-i', 'm-l2-06-form-navigation'],
  },
  {
    id: 'g-ii-v-i',
    term: 'ii-V-I',
    termEn: 'ii-V-I progression',
    aka: ['투 파이브 원'],
    definition:
      '재즈에서 가장 자주 나오는 세 화음 문장. ii 는 준비, V 는 긴장, I 은 해결이다. 12키 ii-V-I 을 왼손 보이싱으로 끊김 없이 돌리는 것이 L1~L2 의 핵심 통과 기준이다.',
    example: 'C장조: `D-7 | G7 | C∆7` / C단조: `Dø7 | G7alt | C-7`',
    relatedModules: ['m-l1-04-ii-v-i', 'm-l2-01-rootless', 'm-l3-06-minor-harmony'],
  },
  {
    id: 'g-turnaround',
    term: '턴어라운드',
    termEn: 'turnaround',
    definition:
      '폼의 마지막 1~2마디에서 다음 코러스의 첫 코드로 되돌아가게 만드는 짧은 진행. 같은 자리를 여러 방식으로 채울 수 있어, 반복되는 폼에 변화를 주는 가장 싼 수단이다.',
    example: '`C∆7 | A-7 | D-7 | G7` → 변형 `C∆7 | A7 | D-7 | Db7`',
    relatedModules: ['m-l2-05-turnarounds', 'm-l1-05-blues-form'],
  },
  {
    id: 'g-secondary-dominant',
    term: '세컨더리 도미넌트',
    termEn: 'secondary dominant',
    aka: ['부속 도미넌트', 'V7/x'],
    definition:
      '토닉이 아닌 다른 다이어토닉 코드를 임시 목적지로 삼는 도미넌트. 목적지 코드의 완전5도 위에 도미넌트를 세우면 된다. 조성 밖 음이 하나 생기므로 귀에 먼저 걸린다.',
    example: 'C장조에서 `A7 | D-7` → A7 은 V7/ii (D 의 도미넌트)',
    relatedModules: ['m-l2-05-turnarounds', 'm-l1-03-diatonic-harmony'],
  },
  {
    id: 'g-tritone-sub',
    term: '트라이톤 서브스티튜션',
    termEn: 'tritone substitution',
    aka: ['트라이톤 서브', '이명동음 대리'],
    definition:
      '도미넌트를 증4도(트라이톤) 떨어진 다른 도미넌트로 바꾸는 것. 두 코드의 3음과 7음이 서로 맞바뀐 같은 두 음이라 성립한다. 베이스가 반음으로 내려가 진행이 매끄러워진다.',
    example: '`D-7 | G7 | C∆7` → `D-7 | Db7 | C∆7` (G7 의 B·F = Db7 의 F·Cb)',
    relatedModules: ['m-l5-01-tritone-sub', 'm-l2-05-turnarounds'],
  },
  {
    id: 'g-modal-interchange',
    term: '모달 인터체인지',
    termEn: 'modal interchange',
    aka: ['모드 믹스처', '차용 화음'],
    definition:
      '같은 루트를 가진 다른 조성(주로 동주음 단조)에서 코드를 빌려 오는 기법. 멜로디는 그대로 두고 화음만 어둡게 만들 수 있다. 장조 곡에 `IV-7` `bVI∆7` `bVII7` 이 나오면 대개 이것이다.',
    example: 'C장조에 `F-7` 또는 `Ab∆7` 을 넣는다 → C단조에서 빌려 온 코드',
    relatedModules: ['m-l5-02-modal-interchange', 'm-l5-06-reharm-ballad'],
  },
  {
    id: 'g-backdoor',
    term: '백도어 진행',
    termEn: 'backdoor progression',
    aka: ['백도어 ii-V'],
    definition:
      'IV-7 → bVII7 → I 로 토닉에 도달하는 진행. 정면의 V7 대신 뒷문으로 들어온다고 해서 붙은 이름이다. bVII7 의 7음이 I 의 3음으로 반음 해결하는 것이 핵심이다.',
    example: 'C장조: `F-7 | Bb7 | C∆7` (Bb7 의 Ab → C∆7 의 E 가 아니라 G→E 의 반음 이동)',
    relatedModules: ['m-l5-02-modal-interchange', 'm-l5-06-reharm-ballad'],
  },
  {
    id: 'g-passing-diminished',
    term: '패싱 디미니시',
    termEn: 'passing diminished chord',
    aka: ['경과 디미니시'],
    definition:
      '온음으로 떨어진 두 코드 사이에 반음 간격을 메우려고 끼워 넣는 감7화음. 베이스가 반음계로 걸어가게 되어 진행이 부드러워진다. 상행·하행 모두 쓴다.',
    example: '`C∆7 | C#°7 | D-7` / `F∆7 | F#°7 | C/G`',
    relatedModules: ['m-l5-04-passing-diminished', 'm-l2-05-turnarounds'],
  },
  {
    id: 'g-pedal-point',
    term: '페달 포인트',
    termEn: 'pedal point',
    aka: ['페달', '지속저음'],
    definition:
      '한 음(대개 루트나 5음)을 베이스에 계속 붙잡아 둔 채 위에서 화성을 바꾸는 장치. 긴장을 쌓거나 인트로를 만들 때 쓴다. 왼손을 고정하고 오른손만 움직이면 바로 연습된다.',
    example: 'G 페달 위에서 `C∆7/G → C-7/G → Bb∆7/G`',
    relatedModules: ['m-l7-03-rubato-ballad', 'm-l6-01-modal-playing'],
  },
  {
    id: 'g-reharmonization',
    term: '리하모니제이션',
    termEn: 'reharmonization',
    aka: ['리하모', '재화성화'],
    definition:
      '멜로디는 그대로 두고 아래의 화음을 바꾸는 것. 멜로디 음이 새 코드의 어떤 텐션이 되는지 확인하는 것이 출발점이다. 발라드에서 같은 A 파트를 두 번째에 다르게 칠할 때 쓴다.',
    example: '멜로디 E 아래 `C∆7` → `A7b13`(E=b13) 또는 `F-7`(E 는 경과) 로 교체',
    relatedModules: ['m-l5-06-reharm-ballad', 'm-l5-01-tritone-sub'],
  },
  {
    id: 'g-coltrane-changes',
    term: '콜트레인 체인지',
    termEn: 'Coltrane changes',
    aka: ['자이언트 스텝스 사이클', '장3도 사이클'],
    definition:
      '조성 중심을 장3도씩 이동시키며 도미넌트로 이어 붙이는 진행. 한 옥타브를 3등분하므로 조성 중심이 셋뿐이고, 각 지점의 3음 착지점을 미리 외워 두면 빠른 템포에서도 길을 잃지 않는다.',
    example: '`C∆7 | Eb7 | Ab∆7 | B7 | E∆7 | G7 | C∆7`',
    relatedModules: ['m-l5-05-coltrane-changes'],
  },
  {
    id: 'g-voice-leading',
    term: '보이스 리딩',
    termEn: 'voice leading',
    aka: ['성부 진행'],
    definition:
      '코드가 바뀔 때 각 성부가 가장 가까운 음으로 이동하도록 배치하는 원리. 손이 덜 움직일수록 좋은 보이스 리딩인 경우가 많다. 공통음은 붙잡고, 나머지는 반음·온음으로 옮긴다.',
    example: '`D-7`(F-A-C-E) → `G7`(F-A-B-E) : F·A·E 를 유지하고 C→B 만 이동',
    relatedModules: ['m-l2-02-guide-tone-lines', 'm-l2-01-rootless'],
  },
  {
    id: 'g-rhythm-changes',
    term: '리듬 체인지',
    termEn: 'rhythm changes',
    definition:
      '「I Got Rhythm」의 화성 골격을 가져다 쓰는 32마디 AABA 진행. 블루스와 함께 잼 세션의 공통어이며, A 파트의 I-vi-ii-V 순환과 B 파트의 도미넌트 사이클을 따로 연습한다.',
    example: 'A 파트(Bb조): `Bb∆7 | G7 | C-7 | F7` 순환 / B 파트: `D7 | G7 | C7 | F7`',
    relatedModules: ['m-l8-02-composition', 'm-l8-03-repertoire-building'],
  },
  {
    id: 'g-contrafact',
    term: '콘트라팩트',
    termEn: 'contrafact',
    aka: ['컨트라팩트'],
    definition:
      '기존 곡의 코드 진행 위에 새 멜로디를 얹어 만든 곡. 비밥 시대의 표준 작곡법이자, 화성 감각을 확인하는 가장 좋은 과제다. Jazzytory 의 오리지널 연습곡도 이 방식으로 만든다.',
    example: '리듬 체인지 진행 위에 자기 8마디 멜로디를 써서 A 파트를 만든다.',
    relatedModules: ['m-l8-02-composition', 'm-l8-01-personal-vocabulary'],
  },

  /* ───────────── 스케일 ───────────── */
  {
    id: 'g-chord-scale',
    term: '코드 스케일',
    termEn: 'chord scale',
    aka: ['코드스케일'],
    definition:
      '한 코드 위에서 쓸 수 있는 음 집합을 음계 형태로 정리한 것. 코드가 조성 안에서 어떤 기능인지 먼저 정하고, 그 기능에 맞는 음 집합을 고른다. 기능을 보지 않고 기계적으로 붙이면 틀린다.',
    example: 'C장조의 `G7` → 믹솔리디안 / C단조로 해결하는 `G7alt` → 얼터드',
    relatedModules: ['m-l3-01-chord-scales', 'm-l2-03-tensions'],
  },
  {
    id: 'g-mode',
    term: '모드',
    termEn: 'mode',
    aka: ['선법', '교회선법'],
    definition:
      '같은 음 집합을 다른 음에서 시작해 만든 음계. 중요한 것은 시작음이 아니라 그 음에서 볼 때의 음정 구조(어디에 반음이 있는가)다. 모드 이름을 외우기 전에 특징음 하나씩을 귀로 잡는다.',
    example: 'D 도리안 = C장조 음 집합을 D 에서 시작 → 특징음은 장6도 B',
    relatedModules: ['m-l3-01-chord-scales', 'm-l6-01-modal-playing'],
  },
  {
    id: 'g-dorian',
    term: '도리안',
    termEn: 'Dorian mode',
    definition:
      '단음계에 장6도가 들어간 모드. 마이너7 코드의 기본 코드 스케일이며, 어두우면서도 닫히지 않은 느낌을 만든다. 자연단음계와 6음 하나만 다르다는 점을 손으로 확인한다.',
    example: 'D 도리안 = D-E-F-G-A-B-C → `D-7` 위에서 사용',
    relatedModules: ['m-l3-01-chord-scales', 'm-l6-01-modal-playing'],
  },
  {
    id: 'g-mixolydian',
    term: '믹솔리디안',
    termEn: 'Mixolydian mode',
    definition:
      '장음계에서 7음만 반음 내린 모드. 조성 안에서 제자리 역할을 하는 도미넌트(V7)의 기본 코드 스케일이다. 4음은 3음과 부딪히므로 길게 끌지 않는다.',
    example: 'G 믹솔리디안 = G-A-B-C-D-E-F → `G7` 위에서 사용 (C 는 어보이드)',
    relatedModules: ['m-l3-01-chord-scales', 'm-l4-01-bebop-scales'],
  },
  {
    id: 'g-lydian-dominant',
    term: '리디안 도미넌트',
    termEn: 'Lydian dominant',
    aka: ['믹솔리디안 #11', '멜로딕 마이너 4번 모드'],
    definition:
      '믹솔리디안의 4음을 반음 올린 음계. 해결하지 않고 제자리에 머무는 도미넌트나 트라이톤 서브 코드에 쓴다. 어보이드 노트가 사라져 스케일 전체를 자유롭게 쓸 수 있다.',
    example: '`Db7` (G7 의 트라이톤 서브) → Db 리디안 도미넌트 = Ab 멜로딕 마이너',
    relatedModules: ['m-l5-01-tritone-sub', 'm-l3-01-chord-scales'],
  },
  {
    id: 'g-altered-scale',
    term: '얼터드 스케일',
    termEn: 'altered scale',
    aka: ['수퍼로크리안', '멜로딕 마이너 7번 모드'],
    definition:
      '도미넌트의 5음과 9음을 모두 변화시킨 음계. 루트에서 반음 위의 멜로딕 마이너와 같은 음 집합이므로, 이미 아는 멜로딕 마이너를 반음 위로 옮겨 치면 된다.',
    example: '`G7alt` → Ab 멜로딕 마이너를 연주 → C 로 해결',
    relatedModules: ['m-l3-06-minor-harmony', 'm-l5-03-upper-structures'],
  },
  {
    id: 'g-melodic-minor',
    term: '멜로딕 마이너',
    termEn: 'melodic minor',
    aka: ['재즈 멜로딕 마이너', '가락단음계'],
    definition:
      '장음계에서 3음만 반음 내린 음계(재즈에서는 올라갈 때·내려갈 때 모두 같은 형태를 쓴다). 이 한 음계에서 얼터드·리디안 도미넌트·하프디미니시용 음계가 모두 파생되므로 12키로 외울 값어치가 있다.',
    example: 'C 멜로딕 마이너 = C-D-Eb-F-G-A-B → `C-∆7` 의 음계',
    relatedModules: ['m-l3-06-minor-harmony', 'm-l3-01-chord-scales'],
  },
  {
    id: 'g-harmonic-minor',
    term: '하모닉 마이너',
    termEn: 'harmonic minor',
    aka: ['화성단음계'],
    definition:
      '자연단음계의 7음을 반음 올려 도미넌트를 만들 수 있게 한 음계. 마이너 키에서 V7 이 생기는 이유가 여기 있다. 6음과 7음 사이의 증2도가 이 음계 특유의 색이다.',
    example: 'C 하모닉 마이너 = C-D-Eb-F-G-Ab-B → 여기서 `G7` 이 나온다',
    relatedModules: ['m-l3-06-minor-harmony', 'm-l1-03-diatonic-harmony'],
  },
  {
    id: 'g-whole-tone',
    term: '홀톤 스케일',
    termEn: 'whole tone scale',
    aka: ['온음음계'],
    definition:
      '온음 간격만으로 쌓은 6음 음계. 완전히 대칭이라 중력감이 없고, 증5도(#5)를 가진 도미넌트에 쓴다. 서로 다른 홀톤 음계는 두 개뿐이다.',
    example: '`G7#5` → G-A-B-C#-D#-F',
    relatedModules: ['m-l3-01-chord-scales', 'm-l6-04-intervallic'],
  },
  {
    id: 'g-diminished-scale',
    term: '디미니시드 스케일',
    termEn: 'diminished scale',
    aka: ['옥타토닉', '하프홀', '홀하프'],
    definition:
      '반음과 온음을 번갈아 쌓은 8음 음계. 도미넌트에는 반음부터 시작하는 형태(하프홀), 감7화음에는 온음부터 시작하는 형태(홀하프)를 쓴다. 3음마다 패턴이 반복되어 이조 연습이 쉽다.',
    example: '`G7b9` → G-Ab-Bb-B-C#-D-E-F (하프홀)',
    relatedModules: ['m-l5-04-passing-diminished', 'm-l3-01-chord-scales'],
  },
  {
    id: 'g-bebop-scale',
    term: '비밥 스케일',
    termEn: 'bebop scale',
    definition:
      '7음 음계에 반음 하나를 더해 8음으로 만든 음계. 8분음표로 순차 진행할 때 코드 톤이 강박에 오도록 정렬시키는 것이 목적이다. 어디에 통과음을 넣는지가 전부이므로 위치를 반드시 지정해 연습한다.',
    example: '`G7` → G-A-B-C-D-E-F-F# (7음과 루트 사이에 F# 추가)',
    relatedModules: ['m-l4-01-bebop-scales', 'm-l4-04-articulation'],
  },
  {
    id: 'g-blues-scale',
    term: '블루스 스케일',
    termEn: 'blues scale',
    definition:
      '단5음 음계에 b5 를 더한 6음 음계. 12마디 블루스 전체에 한 음계로 대응할 수 있어 첫 즉흥의 발판이 된다. 다만 계속 쓰면 단조로워지므로 코드 톤과 섞어 쓰는 단계로 넘어가야 한다.',
    example: 'F 블루스 스케일 = F-Ab-Bb-B-C-Eb → F 블루스 12마디 전체에 사용 가능',
    relatedModules: ['m-l1-05-blues-form', 'm-l4-06-blues-language'],
  },
  {
    id: 'g-blue-note',
    term: '블루 노트',
    termEn: 'blue note',
    definition:
      '장음계의 3·5·7음을 살짝 내려 쓰는 음. 건반에서는 반음으로 근사하되, 인접한 제자리음과 붙여 치거나 빠르게 미끄러뜨려 "사이 음"의 느낌을 만든다.',
    example: 'F 블루스에서 Ab 를 치고 곧바로 A 로 밀어 올린다.',
    relatedModules: ['m-l4-06-blues-language', 'm-l1-05-blues-form'],
  },
  {
    id: 'g-pentatonic',
    term: '펜타토닉 스케일',
    termEn: 'pentatonic scale',
    aka: ['5음 음계'],
    definition:
      '5개 음으로 된 음계. 반음 충돌이 없어 어느 음을 눌러도 크게 틀리지 않고, 4도·5도 도약이 자연스럽게 나와 현대적인 라인을 만들기 쉽다. 장5음·단5음 두 형태를 12키로 익힌다.',
    example: 'C 장5음 = C-D-E-G-A / A 단5음 = A-C-D-E-G (같은 음 집합)',
    relatedModules: ['m-l6-03-pentatonic-superimposition', 'm-l3-04-digital-patterns'],
  },
  {
    id: 'g-pentatonic-superimposition',
    term: '펜타토닉 중첩',
    termEn: 'pentatonic superimposition',
    aka: ['펜타토닉 슈퍼임포지션'],
    definition:
      '코드의 루트가 아닌 다른 음에서 시작하는 펜타토닉을 그 코드 위에 얹는 기법. 어떤 펜타토닉을 고르느냐에 따라 나타나는 텐션이 달라지므로, "이 선택은 어떤 음을 부각시키는가"를 먼저 확인한다.',
    example: '`C-7` 위에 Eb 장5음 → 3·5·7·9·11 이 나온다 / Bb 장5음 → 7·9·11·13 이 나온다',
    relatedModules: ['m-l6-03-pentatonic-superimposition', 'm-l6-01-modal-playing'],
  },

  /* ───────────── 보이싱과 컴핑 ───────────── */
  {
    id: 'g-voicing',
    term: '보이싱',
    termEn: 'voicing',
    definition:
      '같은 코드를 어떤 음을 골라 어떤 높이에 배치해 칠 것인가의 선택. 코드 심볼은 무엇을 칠지 정하지 않고 무엇이 허용되는지만 알려주므로, 보이싱은 연주자의 결정이다.',
    example: '`C∆7` → 셸(C-E-B) / 루트리스(E-G-B-D) / 쿼탈(D-G-C-E) 모두 가능',
    relatedModules: ['m-l1-02-shell-voicings', 'm-l2-01-rootless'],
  },
  {
    id: 'g-shell-voicing',
    term: '셸 보이싱',
    termEn: 'shell voicing',
    aka: ['껍데기 보이싱', '1-3-7 / 1-7-3'],
    definition:
      '루트와 가이드 톤만 쓰는 세 음 보이싱. 왼손 하나로 화성을 성립시키는 가장 싼 방법이며, 두 형태를 번갈아 쓰면 진행에서 손이 거의 움직이지 않는다.',
    example: '`D-7`(D-F-C) → `G7`(G-F-B) → `C∆7`(C-E-B)',
    relatedModules: ['m-l1-02-shell-voicings', 'm-l1-04-ii-v-i'],
  },
  {
    id: 'g-rootless',
    term: '루트리스 보이싱',
    termEn: 'rootless voicing',
    aka: ['루트리스', 'A형/B형'],
    definition:
      '루트를 빼고 3-5-7-9 (A형) 또는 7-9-3-5 (B형) 로 쌓는 네 음 보이싱. 베이스가 루트를 맡는 상황을 전제하며, 왼손 음역이 탁해지지 않아 트리오 컴핑의 기본이 된다.',
    example: '`D-7` A형 = F-A-C-E / B형 = C-E-F-A',
    relatedModules: ['m-l2-01-rootless', 'm-l7-04-trio-comping'],
  },
  {
    id: 'g-drop2',
    term: '드롭2',
    termEn: 'drop 2 voicing',
    definition:
      '밀집 배치된 4성 화음에서 위에서 두 번째 음을 한 옥타브 내려 벌린 보이싱. 소리가 트이고 양손 배분이 쉬워져, 멜로디를 최상성에 얹은 편곡에 널리 쓴다.',
    example: '`C∆7` 밀집 E-G-B-C → 드롭2 = G(아래) + E-B-C',
    relatedModules: ['m-l6-06-contemporary-voicings', 'm-l7-06-arrangement'],
  },
  {
    id: 'g-block-chords',
    term: '블록 코드',
    termEn: 'block chords',
    aka: ['4-way close', '락트 핸즈'],
    definition:
      '멜로디의 각 음마다 그 아래에 화음을 통째로 붙여 양손이 한 덩어리로 움직이는 기법. 멜로디를 옥타브로 두껍게 하고 그 사이를 채우는 형태가 가장 흔하다.',
    example: '멜로디 E 위에 `C∆7` 을 붙여 양손으로 E(옥타브) + G-B-C 를 동시에',
    relatedModules: ['m-l7-01-solo-piano', 'm-l7-06-arrangement'],
  },
  {
    id: 'g-quartal',
    term: '쿼탈 보이싱',
    termEn: 'quartal voicing',
    aka: ['4도 보이싱', 'So What 보이싱'],
    definition:
      '3도 대신 4도를 쌓아 만드는 보이싱. 화음의 퀄리티가 흐려져 모달 연주에 어울린다. 4도 세 개 위에 장3도를 얹은 5성 형태가 대표적이며, 모드를 따라 평행 이동시킬 수 있다.',
    example: 'D 도리안 위: D-G-C-F-A → E-A-D-G-B 로 평행 이동',
    relatedModules: ['m-l6-02-quartal-voicings', 'm-l6-01-modal-playing'],
  },
  {
    id: 'g-upper-structure',
    term: '어퍼 스트럭처 트라이어드',
    termEn: 'upper structure triad',
    aka: ['어퍼 스트럭처', 'US'],
    definition:
      '아래에 가이드 톤을 두고 위에 다른 조의 트라이어드를 얹어 텐션을 한꺼번에 만드는 기법. 오른손이 단순한 트라이어드이므로, 복잡한 얼터드 화음을 쉽게 잡는 지름길이다.',
    example: '`G7` 아래 B-F, 위에 A 트라이어드 → 9·#11·13 / Db 트라이어드 → b9·#11·b13',
    relatedModules: ['m-l5-03-upper-structures', 'm-l6-06-contemporary-voicings'],
  },
  {
    id: 'g-spread-voicing',
    term: '스프레드 보이싱',
    termEn: 'spread voicing',
    aka: ['오픈 보이싱'],
    definition:
      '양손을 넓게 벌려 저음에 루트, 중음역에 가이드 톤, 고음역에 텐션을 배치하는 보이싱. 저음역에서 음이 뭉치는 것을 피할 수 있어 솔로 피아노와 발라드에 적합하다.',
    example: '`C∆7` → 왼손 C(저음) + 오른손 E-B-D',
    relatedModules: ['m-l7-01-solo-piano', 'm-l7-03-rubato-ballad'],
  },
  {
    id: 'g-comping',
    term: '컴핑',
    termEn: 'comping',
    aka: ['콤핑'],
    definition:
      '솔리스트 뒤에서 화성과 리듬을 대주는 연주. 코드를 균등하게 채우는 것이 아니라, 솔리스트의 프레이즈에 반응해 치고 비우는 대화다. "무엇을 칠까"보다 "언제 비울까"가 먼저다.',
    example: '`D-7 | G7 | C∆7` 을 마디마다 치지 말고, 2박과 4박 앞의 8분음표에만 얹어 본다.',
    relatedModules: ['m-l2-04-comping-rhythm', 'm-l7-04-trio-comping'],
  },
  {
    id: 'g-comp',
    term: '컴프',
    termEn: 'comp',
    aka: ['컴핑하다'],
    definition:
      '컴핑을 하는 행위를 가리키는 동사형("컴프한다"). 현장에서는 "내가 컴프할 테니 솔로해"처럼 역할 지정에 쓰인다. 명사형 컴핑과 구분해 적는다.',
    example: '헤드가 끝나면 오른손을 비우고 왼손으로만 컴프한다.',
    relatedModules: ['m-l2-04-comping-rhythm', 'm-l7-05-interplay'],
  },
  {
    id: 'g-guide-tone-line',
    term: '가이드 톤 라인',
    termEn: 'guide tone line',
    definition:
      '진행 전체에 걸쳐 3음·7음만 골라 이어 만든 선. 대개 반음이나 온음으로만 움직이며, 이 선 하나만 연주해도 코드 진행이 들린다. 보이싱과 즉흥 양쪽의 골격이 된다.',
    example: '`D-7 | G7 | C∆7` 의 7음 선 = C → B → B (또는 3음 선 F → B → E)',
    relatedModules: ['m-l2-02-guide-tone-lines', 'm-l3-02-guide-tone-improv'],
  },
  {
    id: 'g-walking-bass',
    term: '워킹 베이스',
    termEn: 'walking bass',
    definition:
      '4분음표로 한 박에 한 음씩 걸어가는 베이스 라인. 강박에 코드 톤(특히 루트와 5음)을 놓고, 다음 코드의 루트로 반음 또는 온음으로 접근하며 연결한다. 솔로 피아노의 왼손에도 쓴다.',
    example: '`D-7 | G7` → D-F-A-B | G-B-D-Db (Db 는 다음 C 로의 반음 접근)',
    relatedModules: ['m-l7-01-solo-piano', 'm-l7-02-stride'],
  },
  {
    id: 'g-stride',
    term: '스트라이드',
    termEn: 'stride piano',
    definition:
      '왼손이 1·3박의 저음 루트와 2·4박의 중음역 화음을 오가며 도약하는 좌수 주법. 혼자 연주할 때 베이스와 화성을 동시에 해결한다. 느린 템포에서 도약 거리를 눈으로 확인하며 익힌다.',
    example: 'C 에서: 1박 C(저음) → 2박 `C∆7` 화음 → 3박 G(저음) → 4박 화음',
    relatedModules: ['m-l7-02-stride', 'm-l7-01-solo-piano'],
  },

  /* ───────────── 선율과 즉흥 ───────────── */
  {
    id: 'g-approach-note',
    term: '어프로치 노트',
    termEn: 'approach note',
    aka: ['접근음'],
    definition:
      '목표음 바로 앞에 놓아 목표음을 돋보이게 하는 음. 반음 위·아래, 또는 음계상 인접음에서 접근한다. 목표음이 강박에 오도록 앞의 박을 세어 배치하는 것이 핵심이다.',
    example: '`C∆7` 의 3음 E 를 목표로 → Eb-E 또는 F-E 로 접근',
    relatedModules: ['m-l3-03-approach-notes', 'm-l4-01-bebop-scales'],
  },
  {
    id: 'g-enclosure',
    term: '엔클로저',
    termEn: 'enclosure',
    aka: ['감싸기'],
    definition:
      '목표음을 위와 아래에서 번갈아 감싼 뒤 도착하는 장식. 3음 또는 4음짜리 상투구로 외워 두고, 어떤 목표음에도 붙일 수 있게 12키로 굴린다.',
    example: 'E 를 목표로: F-Eb-E (위-아래-목표) 또는 G-Eb-F-E',
    relatedModules: ['m-l3-03-approach-notes', 'm-l4-03-motivic-development'],
  },
  {
    id: 'g-target-note',
    term: '타깃 노트',
    termEn: 'target note',
    aka: ['목표음'],
    definition:
      '프레이즈가 도착할 지점으로 미리 정해 둔 음. 보통 다음 코드의 3음이나 7음이다. 즉흥을 "지금 무슨 음을 칠까"가 아니라 "어디에 도착할까"로 바꿔 주는 개념이다.',
    example: '`D-7 | G7` 에서 G7 첫 박의 B 를 타깃으로 정하고 그 앞 3음을 설계한다.',
    relatedModules: ['m-l3-05-forward-motion', 'm-l3-03-approach-notes'],
  },
  {
    id: 'g-forward-motion',
    term: '포워드 모션',
    termEn: 'forward motion',
    definition:
      '프레이즈가 마디 첫 박에서 시작해 멈추는 대신, 다음 마디의 코드 톤을 향해 흘러가도록 설계하는 사고방식. 프레이즈의 도착점을 마디선 뒤에 두면 라인이 끊기지 않는다.',
    example: '3박에서 시작해 다음 마디 1박의 3음에 도착하도록 8분음표를 배치한다.',
    relatedModules: ['m-l3-05-forward-motion', 'm-l4-04-articulation'],
  },
  {
    id: 'g-digital-pattern',
    term: '디지털 패턴',
    termEn: 'digital pattern',
    aka: ['넘버 패턴', '1235'],
    definition:
      '음계 위의 자리 번호로 정의한 짧은 음형(1235, 1357, 3421 등). 번호로 외우므로 어떤 코드·어떤 키에도 그대로 옮길 수 있다. 손가락을 움직이게 하는 출발 재료로 쓰고, 그대로 연주에 쓰지는 않는다.',
    example: '`D-7` 에 1235 → D-E-F-A / `G7` 에 1235 → G-A-B-D',
    relatedModules: ['m-l3-04-digital-patterns', 'm-l3-01-chord-scales'],
  },
  {
    id: 'g-lick',
    term: '릭',
    termEn: 'lick',
    aka: ['프레이즈 상투구'],
    definition:
      '반복해서 쓸 수 있게 외워 둔 짧은 선율 조각. 릭 자체가 목적이 아니라, 변형하고 조합해 자기 문장을 만드는 재료다. 외울 때 반드시 12키와 리듬 변형까지 함께 굴린다.',
    example: 'ii-V-I 용 2마디 릭 하나를 C 로 외운 뒤 4도 순환으로 12키에 옮긴다.',
    relatedModules: ['m-l4-03-motivic-development', 'm-l8-01-personal-vocabulary'],
  },
  {
    id: 'g-motif',
    term: '모티프',
    termEn: 'motif',
    aka: ['동기'],
    definition:
      '솔로를 끌고 가는 최소 단위의 아이디어. 대개 3~5음이며, 음정보다 리듬이 정체성을 만든다. 하나를 정해 코러스 내내 붙잡고 있으면 즉흥에 구조가 생긴다.',
    example: '4분음표 세 개로 된 상행 3음형을 정하고 코드가 바뀔 때마다 음만 바꾼다.',
    relatedModules: ['m-l4-03-motivic-development', 'm-l8-01-personal-vocabulary'],
  },
  {
    id: 'g-motivic-development',
    term: '모티프 전개',
    termEn: 'motivic development',
    definition:
      '하나의 동기를 이조·확대·축소·반전·리듬 변형으로 굴려 솔로를 구성하는 방법. 새 아이디어를 계속 꺼내는 대신 하나를 오래 쓰는 훈련이며, 듣는 사람에게 이야기로 들리게 만든다.',
    example: '동기를 그대로 한 번, 3도 위로 한 번, 리듬만 두 배로 늘려 한 번 반복한다.',
    relatedModules: ['m-l4-03-motivic-development', 'm-l8-02-composition'],
  },
  {
    id: 'g-intervallic',
    term: '인터발릭 어프로치',
    termEn: 'intervallic approach',
    aka: ['인터발릭'],
    definition:
      '음계를 순차로 오르내리는 대신 특정 음정(주로 4도·5도·7도)의 도약으로 라인을 구성하는 방식. 스케일 냄새를 지우고 현대적인 윤곽을 만든다. 손의 관성을 깨는 연습이 함께 필요하다.',
    example: '`C-7` 위에서 C-F-Bb-Eb 처럼 4도만으로 라인을 만든다.',
    relatedModules: ['m-l6-04-intervallic', 'm-l6-02-quartal-voicings'],
  },
  {
    id: 'g-call-response',
    term: '콜 앤 리스폰스',
    termEn: 'call and response',
    aka: ['부름과 응답'],
    definition:
      '한 프레이즈를 던지고 그에 답하는 프레이즈를 잇는 구성. 블루스의 뿌리이자 트레이딩의 원리다. 솔로를 혼자 할 때도 자문자답 형태로 쓰면 빈 공간이 자연스러워진다.',
    example: '2마디 프레이즈 → 2마디 침묵 → 그 프레이즈에 답하는 2마디',
    relatedModules: ['m-l4-06-blues-language', 'm-l7-05-interplay'],
  },

  /* ───────────── 리듬과 타임 ───────────── */
  {
    id: 'g-swing',
    term: '스윙',
    termEn: 'swing',
    definition:
      '재즈의 기본 리듬 감각. 8분음표를 불균등하게 나누고, 뒷박에 무게를 실으며, 앙상블이 미세하게 같은 방향으로 밀거나 당기는 상태를 함께 가리킨다. 수치보다 녹음을 따라 부르며 익힌다.',
    example: '메트로놈을 2·4박에 놓고 `D-7 | G7 | C∆7` 을 8분음표로 돌린다.',
    relatedModules: ['m-l1-06-swing-feel', 'm-l4-04-articulation'],
  },
  {
    id: 'g-swing-eighths',
    term: '스윙 8분음표',
    termEn: 'swing eighth notes',
    aka: ['스윙 에잇스'],
    definition:
      '앞 8분음표를 길게, 뒤를 짧게 치는 분할. 흔히 셋잇단 2:1 로 설명하지만 실제 비율은 템포에 따라 달라져, 빠를수록 균등에 가까워진다. 뒷박에 액센트를 주는 것이 비율보다 중요하다.',
    example: '같은 라인을 스트레이트로 한 번, 스윙으로 한 번 쳐서 차이를 귀로 확인한다.',
    relatedModules: ['m-l1-06-swing-feel', 'm-l4-04-articulation'],
  },
  {
    id: 'g-time-feel',
    term: '타임 필',
    termEn: 'time feel',
    aka: ['타임'],
    definition:
      '박에 대해 음을 어디에 놓는가의 개인적 습관. 정확히 맞추는 것만이 좋은 것이 아니라, 의도적으로 앞·뒤에 놓는 것까지 포함한다. 녹음해서 들어야만 자기 타임을 알 수 있다.',
    example: '같은 프레이즈를 박 위·박 뒤에 놓고 각각 녹음해 비교한다.',
    relatedModules: ['m-l1-06-swing-feel', 'm-l8-04-self-critique'],
  },
  {
    id: 'g-backbeat',
    term: '백비트',
    termEn: 'backbeat',
    aka: ['2·4박'],
    definition:
      '4박자에서 2박과 4박에 실리는 무게. 재즈에서는 드럼의 하이햇이 이 자리를 친다. 연습할 때 메트로놈을 2·4박으로 재해석해 놓으면 박이 밀리는 순간이 즉시 드러난다.',
    example: '메트로놈 60bpm 을 2·4박으로 듣고 120bpm 의 곡을 연주한다.',
    relatedModules: ['m-l1-06-swing-feel', 'm-l0-02-practice-design'],
  },
  {
    id: 'g-syncopation',
    term: '싱코페이션',
    termEn: 'syncopation',
    aka: ['당김음'],
    definition:
      '강박이 아닌 자리에 음을 놓아 박의 무게를 옮기는 것. 재즈 컴핑 리듬의 기본 재료이며, 같은 화음도 어디에 놓느냐에 따라 전혀 다르게 들린다.',
    example: '`C∆7` 을 1박이 아니라 4박 뒤의 8분음표에 얹는다(찰스턴 리듬).',
    relatedModules: ['m-l2-04-comping-rhythm', 'm-l4-05-rhythmic-displacement'],
  },
  {
    id: 'g-anticipation',
    term: '앤티시페이션',
    termEn: 'anticipation',
    aka: ['푸시', '선행'],
    definition:
      '다음 마디의 코드를 반박 먼저 치는 것. 재즈 컴핑에서 가장 흔한 장치로, 마디선 바로 앞 8분음표에 얹는다. 이것만 익혀도 반주가 굳어 있지 않게 들린다.',
    example: '`C∆7` 을 다음 마디 1박이 아니라 앞 마디 4박 뒤 8분음표에 미리 친다.',
    relatedModules: ['m-l2-04-comping-rhythm', 'm-l7-04-trio-comping'],
  },
  {
    id: 'g-ghost-note',
    term: '고스트 노트',
    termEn: 'ghost note',
    definition:
      '거의 들리지 않을 만큼 약하게 치는 음. 라인의 음 개수를 유지하면서 액센트만 골라내는 장치이며, 피아노에서는 타건 깊이를 줄이거나 손가락을 스치듯 눌러 만든다.',
    example: '8분음표 라인에서 뒷박만 살리고 앞박을 고스트로 처리한다.',
    relatedModules: ['m-l4-04-articulation', 'm-l4-06-blues-language'],
  },
  {
    id: 'g-layback',
    term: '레이백',
    termEn: 'layback',
    aka: ['레이드백', 'laid-back'],
    definition:
      '박보다 의도적으로 조금 늦게 치는 연주 습관. 느긋하고 여유 있는 인상을 만든다. 박을 놓친 것과 구별되려면 반주가 흔들리지 않아야 하므로, 타임이 확립된 뒤에 시도한다.',
    example: '발라드에서 멜로디만 박보다 살짝 늦게 놓고 왼손은 정확히 유지한다.',
    relatedModules: ['m-l7-03-rubato-ballad', 'm-l4-04-articulation'],
  },
  {
    id: 'g-rhythmic-displacement',
    term: '리듬 변위',
    termEn: 'rhythmic displacement',
    aka: ['디스플레이스먼트'],
    definition:
      '같은 음형을 박 위치만 옮겨 반복하는 기법. 음정은 그대로이므로 아이디어를 새로 만들지 않고도 긴장을 만든다. 8분음표 하나씩 밀어 가며 세 위치에서 연주하는 훈련이 기본이다.',
    example: '2마디 릭을 원위치, 8분음표 1개 뒤, 4분음표 1개 뒤 세 가지로 친다.',
    relatedModules: ['m-l4-05-rhythmic-displacement', 'm-l6-05-odd-meters'],
  },
  {
    id: 'g-polyrhythm',
    term: '폴리리듬',
    termEn: 'polyrhythm',
    aka: ['복합리듬'],
    definition:
      '서로 다른 박 묶음을 동시에 겹쳐 놓는 것. 3:2, 4:3 이 가장 흔하다. 손으로 나누기 전에 두 묶음을 각각 소리 내어 세면서 몸에 넣는다.',
    example: '4/4 안에서 점4분음표(3:2)로 화음을 반복해 마디선을 가로지른다.',
    relatedModules: ['m-l6-05-odd-meters', 'm-l4-05-rhythmic-displacement'],
  },
  {
    id: 'g-metric-modulation',
    term: '메트릭 모듈레이션',
    termEn: 'metric modulation',
    aka: ['박자 전조'],
    definition:
      '기존 박의 일부를 새 박의 단위로 삼아 템포 감각 자체를 바꾸는 기법. 실제 속도는 비례 관계로 이어지므로 끊김 없이 넘어간다. 셋잇단 하나를 새 4분음표로 삼는 형태가 가장 흔하다.',
    example: '기존 셋잇단 8분음표 3개 = 새 4분음표 1개로 재해석해 템포를 바꾼다.',
    relatedModules: ['m-l6-05-odd-meters', 'm-l7-05-interplay'],
  },
  {
    id: 'g-articulation',
    term: '아티큘레이션',
    termEn: 'articulation',
    aka: ['어티큘레이션'],
    definition:
      '음을 어떻게 시작하고 끊는가의 처리. 어느 음을 붙이고 어느 음을 떼는지가 같은 음렬을 재즈답게도, 연습곡처럼도 들리게 만든다. 피아노에서는 손가락 떼는 타이밍과 타건 세기로 만든다.',
    example: '8분음표 라인에서 뒷박에 액센트를 주고 강박은 짧게 뗀다.',
    relatedModules: ['m-l4-04-articulation', 'm-l4-01-bebop-scales'],
  },
  {
    id: 'g-phrasing',
    term: '프레이징',
    termEn: 'phrasing',
    definition:
      '프레이즈를 어디서 시작하고 어디서 끝낼 것인가의 설계. 숨 쉴 자리를 남기는 것이 좋은 프레이징의 기본이며, 폼의 마디 수와 어긋나게 시작하면 라인이 살아난다.',
    example: '8마디 중 6마디만 연주하고 2마디는 비워 두는 실험을 한다.',
    relatedModules: ['m-l4-04-articulation', 'm-l3-05-forward-motion'],
  },
  {
    id: 'g-odd-meter',
    term: '변박',
    termEn: 'odd meter',
    aka: ['홀수 박자'],
    definition:
      '4/4 가 아닌 박자(5/4, 7/4, 7/8 등)로 연주하는 것. 묶음을 어떻게 나눌지 먼저 정해야 손이 움직인다. 익숙한 진행을 새 박자에 다시 배치하는 방식으로 접근한다.',
    example: '7/4 를 4+3 으로 묶고 `D-7 | G7 | C∆7` 을 그 위에 다시 배치한다.',
    relatedModules: ['m-l6-05-odd-meters', 'm-l6-01-modal-playing'],
  },

  /* ───────────── 폼과 레퍼토리 ───────────── */
  {
    id: 'g-lead-sheet',
    term: '리드시트',
    termEn: 'lead sheet',
    definition:
      '멜로디와 코드 심볼만 적힌 한 장짜리 악보. 보이싱·리듬·반주 형태는 적혀 있지 않으므로 연주자가 정해야 한다. Jazzytory 는 저작권상 멜로디를 배포하지 않고 코드 진행만 수록한다.',
    example: '리드시트를 받으면 조성 → 폼 → 케이던스 위치 순으로 90초 안에 파악한다.',
    relatedModules: ['m-l2-06-form-navigation', 'm-l0-01-placement'],
  },
  {
    id: 'g-changes',
    term: '코드 진행',
    termEn: 'changes',
    aka: ['체인지', '체인지스'],
    definition:
      '한 곡의 코드가 시간 순으로 늘어선 것. 현장에서는 "체인지"라고 부른다. 곡을 안다는 것은 멜로디를 안다는 뜻이 아니라 체인지를 폼과 함께 외웠다는 뜻이다.',
    example: '"블루스 체인지로 돌리자" = 12마디 블루스 진행으로 연주하자',
    relatedModules: ['m-l2-06-form-navigation', 'm-l8-03-repertoire-building'],
  },
  {
    id: 'g-head',
    term: '헤드',
    termEn: 'head',
    definition:
      '곡의 주선율 부분. 보통 헤드 → 솔로 코러스들 → 헤드 순으로 연주한다(헤드 인/헤드 아웃). 마지막 헤드는 앞의 헤드와 다르게 연주하는 것이 관례다.',
    example: '"헤드 두 번 치고 솔로 두 코러스, 그다음 헤드 아웃"',
    relatedModules: ['m-l2-06-form-navigation', 'm-l8-05-gig-readiness'],
  },
  {
    id: 'g-chorus',
    term: '코러스',
    termEn: 'chorus',
    definition:
      '폼을 한 바퀴 도는 단위. 노래의 후렴이 아니다. "두 코러스 솔로"는 32마디 곡이라면 64마디를 연주한다는 뜻이다.',
    example: '32마디 AABA 곡에서 1코러스 = 32마디',
    relatedModules: ['m-l2-06-form-navigation', 'm-l4-03-motivic-development'],
  },
  {
    id: 'g-form',
    term: '폼',
    termEn: 'form',
    aka: ['형식'],
    definition:
      '곡이 반복하는 마디 구조. 재즈 스탠다드의 대부분은 12마디 블루스, 32마디 AABA, 32마디 ABAC 중 하나다. 폼을 세는 능력은 즉흥 능력의 하부 구조다.',
    example: '연주하면서 8마디 단위로 "1-2-3-4" 를 속으로 세어 위치를 잃지 않는다.',
    relatedModules: ['m-l2-06-form-navigation', 'm-l1-05-blues-form'],
  },
  {
    id: 'g-aaba',
    term: 'AABA 폼',
    termEn: 'AABA form',
    aka: ['32마디 송폼'],
    definition:
      '8마디 A 를 두 번, 8마디 B(브리지), 다시 8마디 A 로 이루어진 32마디 구조. 스탠다드에서 가장 흔하다. A 는 거의 같고 B 에서 조성이 이동하므로, B 진입 지점만 놓치지 않으면 된다.',
    example: '리듬 체인지: A(Bb조 순환) × 2 → B(도미넌트 사이클) → A',
    relatedModules: ['m-l2-06-form-navigation', 'm-l8-03-repertoire-building'],
  },
  {
    id: 'g-bridge',
    term: '브리지',
    termEn: 'bridge',
    aka: ['채널', 'B 파트'],
    definition:
      'AABA 폼에서 조성과 분위기가 바뀌는 B 부분. 여기서 길을 잃는 경우가 가장 많으므로, 브리지만 따로 떼어 12키가 아니라 원조로 여러 번 돌리는 연습을 한다.',
    example: '브리지 첫 코드만 미리 외워 두고, A 파트 마지막 마디에서 미리 준비한다.',
    relatedModules: ['m-l2-06-form-navigation', 'm-l8-03-repertoire-building'],
  },
  {
    id: 'g-tag-ending',
    term: '태그 엔딩',
    termEn: 'tag ending',
    aka: ['태그'],
    definition:
      '곡의 마지막 몇 마디를 두세 번 반복해 끝맺는 관습적 엔딩. 보통 마지막 4마디의 턴어라운드를 되풀이한 뒤 종지한다. 합주에서 신호만 주면 누구나 따라올 수 있는 공통어다.',
    example: '`C∆7 | A7 | D-7 | G7` 을 세 번 반복한 뒤 `C6/9` 로 종료',
    relatedModules: ['m-l2-05-turnarounds', 'm-l8-05-gig-readiness'],
  },
  {
    id: 'g-real-book',
    term: '리얼북',
    termEn: 'Real Book',
    aka: ['페이크북', 'fake book'],
    definition:
      '재즈 스탠다드의 리드시트를 모은 악보집. 원래는 비공식 유통물이었으나 현재는 정식판이 있다. 코드 표기와 진행이 판본마다 다르므로, 실제 녹음과 대조해 자기 버전을 정해야 한다.',
    example: '같은 곡이라도 판본에 따라 `C∆7` 이 `C6` 로 적혀 있을 수 있다.',
    relatedModules: ['m-l8-03-repertoire-building', 'm-l2-06-form-navigation'],
  },
  {
    id: 'g-standard',
    term: '스탠다드',
    termEn: 'jazz standard',
    definition:
      '재즈 연주자들이 공통으로 아는 레퍼토리. 처음 만나는 사람과도 곡명·조성·템포만 정하면 함께 연주할 수 있게 해 주는 공용어다. 폭넓게 아는 것보다 깊이 외운 곡 수가 중요하다.',
    example: '잼 세션 대비로 조성까지 포함해 "미디엄 스윙 10곡, 발라드 3곡, 블루스 3곡" 을 확보한다.',
    relatedModules: ['m-l8-03-repertoire-building', 'm-l8-05-gig-readiness'],
  },
  {
    id: 'g-trading',
    term: '트레이딩',
    termEn: 'trading',
    aka: ['트레이딩 포즈', '주고받기'],
    definition:
      '솔로를 4마디·8마디 단위로 나눠 주고받는 연주 방식. 드럼과 트레이딩할 때는 상대의 리듬을 받아 내 구간에 되돌려 주는 것이 요령이다. 짧은 구간에 아이디어를 압축하는 훈련이 된다.',
    example: '"포스 트레이딩" = 4마디씩 번갈아 솔로',
    relatedModules: ['m-l7-05-interplay', 'm-l4-03-motivic-development'],
  },
  {
    id: 'g-interplay',
    term: '인터플레이',
    termEn: 'interplay',
    aka: ['상호작용'],
    definition:
      '연주 중 서로의 리듬·음형·강약에 실시간으로 반응하는 것. 미리 정한 역할을 지키는 것이 아니라 듣고 바꾸는 능력이다. 녹음을 듣고 "누가 먼저 시작했는가"를 짚어 보는 훈련부터 시작한다.',
    example: '드럼이 리듬을 바꾸면 다음 마디에서 컴핑 리듬을 그에 맞춰 바꾼다.',
    relatedModules: ['m-l7-05-interplay', 'm-l7-04-trio-comping'],
  },
  {
    id: 'g-jam-session',
    term: '잼 세션',
    termEn: 'jam session',
    aka: ['잼'],
    definition:
      '리허설 없이 모여 공통 레퍼토리를 연주하는 자리. 곡·조성·템포를 말로 정하고 바로 시작하므로, 곡을 아는 것보다 폼을 흔들리지 않게 유지하는 능력이 먼저 평가된다.',
    example: '"블루스, F, 미디엄" 이라는 콜만 듣고 바로 시작할 수 있어야 한다.',
    relatedModules: ['m-l8-05-gig-readiness', 'm-l8-03-repertoire-building'],
  },
  {
    id: 'g-rubato',
    term: '루바토',
    termEn: 'rubato',
    definition:
      '고정된 박 없이 프레이즈의 호흡에 따라 시간을 늘이고 줄이는 연주. 발라드의 인트로와 마지막 코러스에 흔히 쓴다. 박이 없어도 화성의 흐름은 유지되어야 길을 잃지 않는다.',
    example: '인트로를 루바토로 시작해 헤드 첫 마디부터 인 타임으로 들어간다.',
    relatedModules: ['m-l7-03-rubato-ballad', 'm-l7-01-solo-piano'],
  },

  /* ───────────── 연습과 학습 ───────────── */
  {
    id: 'g-transcription',
    term: '채보',
    termEn: 'transcription',
    aka: ['트랜스크립션'],
    definition:
      '녹음된 연주를 귀로 듣고 따라 연주하거나 악보로 옮기는 작업. 목적은 악보를 만드는 것이 아니라 그 언어를 자기 손에 넣는 것이므로, 적기 전에 반드시 부를 수 있어야 한다.',
    example: '4마디를 정해 속도를 낮추고 → 따라 부르고 → 건반에서 찾고 → 그다음 적는다.',
    relatedModules: ['m-l4-02-transcription', 'm-l8-01-personal-vocabulary'],
  },
  {
    id: 'g-memorization',
    term: '암보',
    termEn: 'memorization',
    definition:
      '악보 없이 곡을 연주할 수 있는 상태. 재즈에서는 멜로디뿐 아니라 폼과 체인지를 로마숫자로 기억하는 것을 뜻한다. 조성을 바꿔 연주해 보면 진짜 외웠는지 알 수 있다.',
    example: '외운 곡을 반음 위 조성으로 연주해 본다. 막히면 손 모양만 외운 것이다.',
    relatedModules: ['m-l8-03-repertoire-building', 'm-l2-06-form-navigation'],
  },
  {
    id: 'g-cycle-of-fourths',
    term: '4도 순환',
    termEn: 'circle of fourths',
    aka: ['5도권', '사이클'],
    definition:
      '완전4도씩 올라가며 12키를 한 바퀴 도는 순서(C-F-Bb-Eb-Ab-Db-Gb-B-E-A-D-G). 도미넌트 해결 방향과 같아 재즈 진행의 기본 뼈대이며, 모든 12키 드릴의 기본 순서로 쓴다.',
    example: 'ii-V-I 을 이 순서로 12번 돌리면 모든 키를 한 번씩 지난다.',
    relatedModules: ['m-l0-02-practice-design', 'm-l1-04-ii-v-i'],
  },
  {
    id: 'g-self-critique',
    term: '자기 비평',
    termEn: 'self-critique',
    aka: ['셀프 크리틱'],
    definition:
      '자기 연주를 녹음해 듣고 문제를 스스로 진단하는 절차. 인상 평가가 아니라 항목별 점검이어야 한다(타임 / 보이싱 / 프레이즈 종결 / 폼 유지). 다음 연습 과제가 도출되지 않으면 비평이 아니다.',
    example: '한 코러스를 녹음해 네 항목에 각각 1~5점을 매기고, 가장 낮은 항목만 다음 주 과제로 삼는다.',
    relatedModules: ['m-l8-04-self-critique', 'm-l0-02-practice-design'],
  },
];
