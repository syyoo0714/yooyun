# DESIGN SYSTEM — 유연 변호사 · 변리사 · 법무법인 리브로

> Base: **Google Material Design 3 / Modern Tech Minimal**
> 성격 = "clean white/gray surfaces, soft rounded corners, crisp sans-serif typography, and vibrant Google Blue accents."

선택 이유 — 기존의 올드한 종이 신문 감성(Editorial)을 걷어내고, 특허·기술 분야를 전문으로 하는 젊고 상큼한 **신세대 변호사**의 전문성과 현대적인 감각을 시각화한다. 정돈된 레이아웃과 구글 스타일의 색상/컴포넌트 설계를 적용하여 146건의 수행사건과 기업법 노트를 현대적이고 깔끔한 대시보드 형태로 제공한다.

---

## 1. Tokens

`src/app/globals.css` §1이 이 디자인 시스템의 핵심 토큰이다. **토큰 밖의 색을 새로 만들지 않는다**.

| Token | Hex | 용도 |
|---|---|---|
| `--bg` | `#f8f9fa` | 페이지 바탕 (맑고 깨끗한 라이트 그레이) |
| `--surface` | `#ffffff` | 카드·표·폼 표면 (퓨어 화이트) |
| `--surface-warm` | `#e8f0fe` | 강조 블록·인용·초상 캡션 바탕 (연하고 상큼한 구글 블루 톤) |
| `--fg` | `#202124` | 대제목·브랜드 네임 (구글 시그니처 딥 차콜) |
| `--fg-2` | `#3c4043` | 본문 텍스트 (신뢰감 있는 다크 그레이) |
| `--muted` | `#5f6368` | 캡션·연도·보조 텍스트 |
| `--border` / `--border-soft` | `#dadce0` / `#f1f3f4` | 미니멀한 경계선 |
| `--accent` / `--meta` | `#1a73e8` | 구글 블루 — 대표 포인트 컬러, 링크, 활성 배지 |
| `--success` / `--warn` / `--danger` | `#1e8e3e` / `#f9ab00` / `#d93025` | 구글 머티리얼 상태 컬러 |

반전 면(히어로 하위 페이지·푸터)의 `--ink` / `--on-ink`는 각각 `#174ea6` / `#ffffff`로 설정하여 구글 블루의 산뜻한 색조를 일관되게 유지한다.

## 2. Typography — 신세대 산세리프화

아재/올드한 느낌을 주는 명조체(Serif)를 완전히 배제하고, 깔끔한 고딕(Sans-serif) 폰트를 적용하여 트렌디하고 상큼한 전문직의 서명을 완성한다.

- **제목 / display** — `Noto Sans KR` → `Inter` → system-ui
- **본문 / UI** — `Noto Sans KR` → Inter → system-ui
- **수치·folio·연도** — `IBM Plex Mono`, tabular-nums
- `word-break: keep-all` — 한글 어절 단위 줄바꿈
- `letter-spacing: -0.01em` (display) — 타이틀 자간 미세 조정

## 3. Layout

- 8pt baseline. `--space-*` 밖의 임의 여백을 쓰지 않는다.
- `--container-max: 1120px` / 읽기 열 `--container-narrow: 760px`
- 섹션 상하 여백 = `--section-y-{desktop|tablet|phone}` = 112 / 80 / 56px

## 4. UI 장치 및 컴포넌트

- `.brand-mark` — 각진 사각형 대신 둥근 사각형(`border-radius: 8px`)과 악센트 블루 배경을 적용하여 산뜻한 앱 아이콘 형태로 연출.
- `.hero-rule` — 신문 느낌의 무거운 이중 괘선을 걷어내고, 깔끔하고 투명한 1px 그레이 경계로 치환.
- `.section-head` — 검은 밑줄 대신, 왼쪽의 구글 블루(`--accent`) 포인트 세로 바를 배치하여 깔끔하고 세련된 헤더를 완성.
- `.stats` — 배경 없는 격자 괘선 대신, 개별 둥근 모서리가 가미된 화이트 카드형 그리드로 변경하여 스마트 대시보드 룩을 구성.
- `.cases li` — 아재 감성의 점선 구분선과 브론즈 불릿을 걷어내고, 구글 블루/그린 톤 도트 및 미니멀한 라인으로 정돈.
- `.btn` — 각진 모서리 대신 부드럽고 둥근 필(Pill) 스타일의 둥근 모서리를 적용.

## 5. Motion & Interaction

- `--motion-fast: 180ms` / `--motion-base: 280ms`, `--ease-standard: cubic-bezier(.22,1,.36,1)`
- hover 시에는 둥근 카드가 살짝 부유하며 미세하게 부드러운 머티리얼 그림자(`--elev-raised`)가 발생하도록 설계.
- `:focus-visible`은 전역에서 `--focus-ring` (구글 블루 25% 4px).
