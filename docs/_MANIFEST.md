# Jazzytory ID 매니페스트 (고정 계약)

병렬 작업하는 모든 콘텐츠 에이전트는 **이 파일의 id 를 그대로** 사용한다.
여기에 없는 id 를 참조하면 `npm run validate:content` 가 실패한다.

## 표기 표준 (전 프로젝트 공통)
- 마이너7 `C-7` / 메이저7 `C∆7` / 도미넌트 `C7` / 하프디미니시 `Cø7` / 디미니시 `C°7`
- 얼터드 `C7alt`, 서스 `C7sus4`, 식스나인 `C6/9`, 마이너메이저 `C-∆7`, 슬래시 `C/E`
- 플랫은 `b`, 샵은 `#` (예: `Bb∆7`, `F7#11`, `G7b9`)

## 검수자 ID (faculty.ts)
| id | 대표하는 심사 기준 계보 |
|---|---|
| `rv-chord-scale` | 버클리 코드스케일/기능화성 계열 |
| `rv-barry-harris` | 배리 해리스·밥 구전 계열 |
| `rv-transcription` | 채보 중심·귀 우선 계열 |
| `rv-contemporary` | 컨템포러리 보이싱·포스트밥 계열 |
| `rv-keyboard-technique` | 클래식 전향자 테크닉·손 건강 계열 |
| `rv-pedagogy` | 음악교수법·학습설계 계열 |

## 레벨 ID
`L0` `L1` `L2` `L3` `L4` `L5` `L6` `L7` `L8`

## 모듈 ID (총 51)

### L0 — 진단과 준비
- `m-l0-01-placement` 나는 지금 어디에 있는가
- `m-l0-02-practice-design` 연습 설계와 루틴
- `m-l0-03-keyboard-geography` 건반 지형과 재즈식 운지

### L1 — 코드 심볼의 문해력
- `m-l1-01-chord-symbols` 코드 심볼 읽기: 3화음에서 7화음까지
- `m-l1-02-shell-voicings` 셸 보이싱: 세 음으로 만드는 재즈
- `m-l1-03-diatonic-harmony` 다이어토닉 화성과 로마숫자
- `m-l1-04-ii-v-i` ii‑V‑I: 재즈의 기본 문장
- `m-l1-05-blues-form` 12마디 블루스: 첫 즉흥
- `m-l1-06-swing-feel` 스윙 8분음표와 타임

### L2 — 보이싱과 컴핑
- `m-l2-01-rootless` 루트리스 보이싱 A/B
- `m-l2-02-guide-tone-lines` 가이드 톤 라인
- `m-l2-03-tensions` 텐션 9·11·13과 어보이드 노트
- `m-l2-04-comping-rhythm` 컴핑 리듬과 여백
- `m-l2-05-turnarounds` 턴어라운드·인트로·엔딩
- `m-l2-06-form-navigation` 폼 안에서 길 잃지 않기

### L3 — 코드 스케일과 선율
- `m-l3-01-chord-scales` 코드 스케일 이론
- `m-l3-02-guide-tone-improv` 가이드 톤으로 솔로하기
- `m-l3-03-approach-notes` 어프로치 노트와 엔클로저
- `m-l3-04-digital-patterns` 디지털 패턴
- `m-l3-05-forward-motion` 목표음 조준과 포워드 모션
- `m-l3-06-minor-harmony` 마이너 조성의 화성과 스케일

### L4 — 비밥 어휘와 채보
- `m-l4-01-bebop-scales` 비밥 스케일과 강박 정렬
- `m-l4-02-transcription` 채보: 귀로 훔치기
- `m-l4-03-motivic-development` 릭에서 언어로: 모티프 전개
- `m-l4-04-articulation` 아티큘레이션과 프레이징
- `m-l4-05-rhythmic-displacement` 리듬 변위
- `m-l4-06-blues-language` 블루스 어법

### L5 — 리하모니제이션
- `m-l5-01-tritone-sub` 트라이톤 서브스티튜션
- `m-l5-02-modal-interchange` 백도어와 모달 인터체인지
- `m-l5-03-upper-structures` 어퍼 스트럭처 트라이어드
- `m-l5-04-passing-diminished` 대리 화성과 경과 디미니시
- `m-l5-05-coltrane-changes` 콜트레인 체인지 입문
- `m-l5-06-reharm-ballad` 발라드 리하모니제이션

### L6 — 모달·컨템포러리
- `m-l6-01-modal-playing` 모달 연주와 정적 화성
- `m-l6-02-quartal-voicings` 쿼탈·So What 보이싱
- `m-l6-03-pentatonic-superimposition` 펜타토닉 중첩
- `m-l6-04-intervallic` 인터발릭 어프로치
- `m-l6-05-odd-meters` 변박과 메트릭 모듈레이션
- `m-l6-06-contemporary-voicings` 컨템포러리 보이싱과 슬래시 화성

### L7 — 솔로 피아노와 트리오
- `m-l7-01-solo-piano` 솔로 피아노: 세 층을 동시에
- `m-l7-02-stride` 스트라이드와 좌수 전통
- `m-l7-03-rubato-ballad` 루바토 발라드와 인트로
- `m-l7-04-trio-comping` 트리오에서 컴핑하기
- `m-l7-05-interplay` 트레이딩과 인터플레이
- `m-l7-06-arrangement` 셀프 어레인지먼트

### L8 — 자기 언어
- `m-l8-01-personal-vocabulary` 자기 어휘 목록 만들기
- `m-l8-02-composition` 작곡과 컨트라팩트
- `m-l8-03-repertoire-building` 레퍼토리 구축과 암보
- `m-l8-04-self-critique` 녹음과 자기 비평
- `m-l8-05-gig-readiness` 잼 세션과 무대 준비
- `m-l8-06-recital` 졸업 연주 프로그램

## 교차 참조 방향
`Module.repertoire / listening / videos` 와
`Tune.? / Album.relatedModules / VideoResource.relatedModules` **양방향 모두** 허용한다.
빌드 시 `src/data/index.ts` 가 역인덱스를 만들어 합집합으로 병합하므로,
튠·앨범·영상 에이전트는 **자기 쪽에서 모듈 id 를 참조**하면 충분하다.
