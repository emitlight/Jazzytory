# 교수법 레이어 (Teaching Methods)

담당: `jazz-theory-author` · `learning-scientist` · `faculty-reviewer`

## 왜 만들었나

같은 내용을 **어떻게** 연습하느냐가 무엇을 연습하느냐보다 자주 결과를 가른다.

ii‑V‑I 을 배우는 방법은 최소 네 가지가 있다.
코드 심볼을 외워서 손 모양을 찾는 방법, 가이드 톤을 먼저 노래한 다음 손을 올리는 방법,
6음 화음과 감7화음의 교대로 보는 방법, 목표음을 정하고 거기로 도착하는 연습을 하는 방법.
넷 다 같은 세 코드를 다루지만 학습자에게 남는 것이 전혀 다르다.

재즈 교육에는 실제로 **서로 다른 학파**가 있고, 그 차이는 취향이 아니라 방법론이다.
Jazzytory 는 공개 출판물로 검증 가능한 교수법 18가지를 정리해 51개 모듈 전체에
84건으로 이식했다.

## 정직성 규칙

- 여기 기술한 것은 각 교육자가 **공개 출판물·공개 워크숍에서 가르친 방법**이다.
- 그분들이 Jazzytory 를 **검수하거나 승인한 것이 아니다.**
  `TeachingMethod.endorsedJazzytory` 는 타입상 `false` 로 고정되어 있고
  테스트가 이를 강제한다.
- 인용은 책·장 수준까지만 한다. **페이지 번호·인용문·일화를 지어내지 않는다.**
- 특정 인물이 특정 아이디어를 창안했는지 불확실하면 개인이 아니라 계보에 귀속시키거나 뺀다.
  (집필 과정에서 한 항목이 "실제로 그렇게 말했는지 확인할 수 없다"는 이유로 제외되었다.)

이것은 `Reviewer`(검수 패널)와 다른 층이다. 검수 패널은 여전히 **가상의 심사 기준**이고,
교수법은 **실존하는 공개 교수법**이다. 둘을 섞지 않는다.

## 수록된 18가지

| 계보 | id | 핵심 |
|---|---|---|
| Barry Harris | `pm-barry-harris-movement` | 화성은 목록이 아니라 움직임. 6음 화음↔감7화음 교대 |
| Barry Harris | `pm-barry-harris-workshop` | 그룹 워크숍, 콜 앤드 리스폰스, 노래 먼저 |
| Lennie Tristano | `pm-tristano-sing-first` | 치기 전에 노래하라. 귀로만 채보. 2·4박 메트로놈 느린 연습 |
| Hal Galper | `pm-galper-forward-motion` | 프레이즈는 다음 마디 강박**으로** 해결된다 |
| Hal Crook | `pm-crook-parameters` | 한 번에 파라미터 하나만 고정 |
| Hal Crook | `pm-crook-play-rest` | 연주/쉼 비율. 여백이 프레이즈를 만든다 |
| Charlie Banacos | `pm-banacos-one-thing` | 하나를 완전히 끝내기 전에 다음으로 가지 않는다 |
| Kenny Werner | `pm-werner-practice-mind` | 연습하는 마음과 연주하는 마음의 분리 |
| Jamey Aebersold | `pm-aebersold-twelve-keys` | 플레이어롱과 12키 원칙 |
| Berklee | `pm-berklee-solfege` | 이동도법 솔페지 + 리듬 음절 |
| Berklee | `pm-berklee-ensemble-lab` | 리듬 섹션을 과목으로 배운다 |
| Berklee | `pm-berklee-function-first` | 수직 구성음보다 기능이 먼저 |
| Suzanna Sifter | `pm-sifter-keyboard-harmony` | 화성은 건반 위에서 배운다 |
| David Baker | `pm-david-baker-bebop-vocabulary` | 비밥 어휘를 12키로 체계화 |
| Jerry Bergonzi | `pm-bergonzi-melodic-structures` | 4음 셀과 순열 |
| Mark Levine | `pm-levine-voicing-catalog` | 보이싱·코드스케일 카탈로그 |
| Bert Ligon | `pm-ligon-voice-leading` | 고전 성부진행 아웃라인에서 재즈 라인으로 |
| Jerry Coker | `pm-coker-naming-the-language` | 장치에 이름을 붙여야 스스로 진단한다 |

## 각 교수법이 갖춰야 하는 것

| 필드 | 요구 |
|---|---|
| `thesis` | 한 문장. 압축이 안 되면 아직 이해 못 한 것 |
| `fixes` | 학습자의 **구체적 증상** 2~4개. "음악성이 는다" 같은 건 금지 |
| `why` | 인지·운동학습 관점의 작동 원리 |
| `protocol` | 오늘 그대로 따라 할 수 있는 4~7단계. 메트로놈·손·키·실패 규칙 포함 |
| `caveats` | **한계 1~3개. 한계 없는 방법은 교수법이 아니라 광고다** |
| `sources` | 실존 출판물 ≥1, 장 수준 인용 |

전체 절차 단계 123개, 출처 34건.

## 모듈 이식

`MethodApplication` 은 교수법을 **그 모듈의 실제 내용**에 붙인다. 방법 설명의 재진술이 아니다.

나쁨
> 트리스타노의 방식대로 먼저 노래하고 나서 연주하세요.

좋음
> ii‑V‑I 을 손으로 찾기 전에 D‑7 G7 C∆7 의 **가이드 톤만** 목소리로 부른다 —
> F‑B, F‑B, E‑B. 두 음이 한 음만 움직이는 걸 목으로 느낀 다음에 건반에 손을 올린다.

각 적용은 `howToApply`(그 모듈에 어떻게), `drill`(8~25분 절차),
`expectedShift`(일주일 뒤 학습자가 관측할 변화)를 갖는다.

**84건이 51개 모듈 전체를 덮는다.** 20개 모듈은 1개, 29개는 2개, 2개는 3개를 갖는다.
한 교수법이 전체 모듈의 절반을 넘게 차지하면 테스트가 거부한다 — 어디에나 붙는 방법은
아무 뜻이 없기 때문이다. 최다는 `pm-tristano-sing-first` 12건.

## 연습 파라미터

크룩 계열의 매개변수 연습을 `/lab/design` 탭으로 구현했다.
밀도 · 음역 · 리듬 단위 · 다이내믹 · 여백 · 아티큘레이션 · 프레이즈 길이 · 모티프 반복률,
각 5~6단계.

즉흥 연습이 흐지부지되는 가장 흔한 이유는 한 코러스에서 전부 잘하려 하기 때문이다.
파라미터를 하나만 고정하면 귀가 그 하나에 붙고, 그 제약이 오히려 아이디어를 만든다.

## 테스트가 강제하는 것

`src/data/content.test.ts` 의 「교수법 레이어」 블록:

- 교수법·적용 id 중복 없음
- 모든 적용이 실존 교수법과 실존 모듈을 가리킴
- **51개 모듈 전부에 최소 한 개의 교수법**
- 모든 교수법에 절차 3단계 이상·한계·출처·고치는 증상
- **어떤 교육자도 Jazzytory 를 승인한 것으로 표기되지 않음**
- 한 교수법이 전체 모듈의 절반을 넘지 않음
- 적용 드릴 시간이 3~40분
