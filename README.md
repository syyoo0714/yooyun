# 유연 변호사 홈페이지

법무법인 리브로 대표변호사 · 변리사 **유연**의 개인 홈페이지.
KWY(유경원 교수 홈페이지)의 구조를 이식하되 스타일은 Tailwind가 아닌 **순수 CSS**,
디자인은 **open-design / editorial**을 베이스로 한다.

- Front: Next.js 16 (App Router, RSC) · React 19 · TypeScript · 순수 CSS
- Back: Supabase (Postgres + Auth + RLS)
- Dev 포트: **3400** (KWY 3300 · Lebro 3200 · KODATA 3100 과 충돌 방지)

```bash
npm install
npm run dev          # http://localhost:3400
npm run build && npm start
```

`.env.local` 없이도 그대로 뜬다. Supabase가 없으면 CV 정본(TS/JSON)으로 폴백한다.

---

## 1. 페이지

| 경로 | 내용 | 렌더 |
|---|---|---|
| `/` | 마스트헤드 · 이력 요약 4칸 · 소개 · 업무분야 6 · 특허 실무 · 대표 수행사건 · 최근 노트 6 · 문의 | Static |
| `/profile` | 소개 · 전문분야 태그 · 학력 · 자격 · 경력 · 특허 실무 · 저술 · 대외활동 | Static |
| `/practice` | 업무분야 6개, 각 분야 아래 근거 수행사건 | Static |
| `/cases` | 수행사건 149건 전체(11개 분류) + 리브로 기게시 성공사례 | Static |
| `/faq` | 자주 묻는 질문 17문항 (이력 · 업무분야 · 상담) — FAQPage 구조화 데이터 | Static |
| `/notes` | 기업법 노트 119편 아카이브 (시리즈 필터) | Dynamic (searchParams) |
| `/notes/[slug]` | 노트 상세 — 3줄 요약 · 본문 · 태그 · 같은 시리즈 | SSG 119개 |
| `/cv` | CV 전문 18개 섹션 · A4 인쇄 | Static |
| `/contact` | 상담 문의 폼 + 사무소 정보 | Static |
| `/admin` · `/admin/login` | 관리자 (골격) | Dynamic |

## 2. 데이터 계층

**DB 1순위 · TS 정본 폴백**. `src/lib/content.ts`와 `src/lib/notes.ts`의 모든 `getX`가
try/catch 안에서만 Supabase를 부르고, 환경변수 미설정·오류·빈 결과이면 조용히 폴백한다.
모듈 로드 시점에 throw 하지 않으므로 빌드가 통째로 깨지지 않는다.

```
src/data/profile.ts        정체성 · 연락처 · 지표 · 전문분야 태그   ← CV 01·02
src/data/career.ts         학력 · 자격 · 경력 · 특허 실무 이력      ← CV 01·03
src/data/practice.ts       업무분야 6묶음 (cvSections 로 사건 연결)
src/data/cv.generated.json 수행사건 149건 · 저술 · 기게시 성공사례  ← scripts/import-cv.mjs
src/data/faq.ts            자주 묻는 질문 (위 데이터에서 조립 — 새 사실 없음)
src/data/notes.generated.json + content/notes/*.txt  노트 119편    ← scripts/import-notes.mjs
```

### 원본 → 데이터 재생성

```bash
node scripts/import-cv.mjs      # ../260813_유연_CV_경력기술서.html → cv.generated.json
node scripts/import-notes.mjs   # ../*_네이버용.txt (119편) → notes.generated.json + content/notes/
```

두 스크립트는 상위 폴더(`BrunchFlgu/`)의 원본을 읽는다. 원고를 새로 쓰면 다시 돌리면 된다.

## 3. Supabase

1. 프로젝트 생성 → `supabase/schema.sql` 을 SQL Editor에 붙여넣고 Run
2. `.env.example` → `.env.local` 복사 후 URL·anon 키 입력
3. 관리자 계정 생성 후 `schema.sql` 의 `admin_uid` 를 그 uid로 바꾸고 다시 Run
4. Authentication → 공개 signup 비활성화

RLS 요지
- 콘텐츠 테이블(`profile` `timeline` `practice_areas` `cases` `notes` `writings`)
  = anon 읽기만 / 관리자 uid 만 쓰기
- `inquiries`(상담 문의) = **반대**. anon 은 INSERT 만, 읽기·수정은 관리자만.
  개인정보가 들어가므로 공개 읽기를 절대 열지 않는다.

## 4. ⚠️ 컴플라이언스 (반드시 읽을 것)

근거 = `../유연가드레일.md`, `../role_유연_블로그에이전트.md` §5.

| 코드 | 규칙 |
|---|---|
| G1 | 이력을 정본(CV) 밖으로 확장 금지 — 변호사법 제23조 제2항 제1호 거짓광고. 사내 소속·직위·보고라인 창작 금지 |
| G2 | 과거 대리 고객사 실명 + 그 회사 기술·소송 논평 조합 금지 — 변리사법 제23조 |
| G4 | 미확정·계쟁 중 사건에 위법 단정 금지 |
| G5 | 면책 문언은 서두·말미 일치. `components/Disclaimer.tsx` 하나만 쓴다 |
| G6 | 자격을 다른 변호사와 비교·우위 제시 금지. 변협 인증·공인 표시 금지 |
| G8 | 법령 최초 1회 정식명칭. 수치는 출처 없이 단정 금지 |
| — | 승소·처벌 보장 표현 금지. 수임·성공보수 단정 금지 |
| — | 발행형 텍스트에 별표(`*`) 금지. 강조는 `★` `▣` `·` 「」 |

### 원본 자료 취급

`../260813_유연_원본자료_전체/` 의 `송무서면_md`(197건) · `자문의견서_md`(45건)에는
**실제 당사자명과 사건번호가 그대로 남아 있다.** 이 사이트에 옮기지 않는다.
게시 가능한 것은 CV의 익명화본(`cv.generated.json`)뿐이며, CV 자체가
"당사자명과 사건번호는 모두 제거하고 기술·분야로만 기재" 원칙으로 작성된 문서다.

## 5. SEO · AEO · GEO

| 파일 | 역할 |
|---|---|
| `src/lib/site.ts` `SITE.url` | 배포 주소 (기본 `https://yoolaw.vercel.app`, 환경변수 `NEXT_PUBLIC_SITE_URL` 로 교체). ⚠️ `lawlebro.com` 은 법인 사이트라 넣지 않는다 |
| `src/lib/seo.ts` | `pageMeta()` = 페이지별 canonical·OG·Twitter / schema.org 노드 빌더 |
| `src/app/layout.tsx` | 전역 JSON-LD: `WebSite` + `Person`(유연) + `LegalService`(리브로) — `@id` 로 연결 |
| 각 `page.tsx` | `ProfilePage` · `CollectionPage`+`Service`×6 · `FAQPage` · `Blog` · `BlogPosting` · `ContactPage` + `BreadcrumbList` |
| `src/app/robots.ts` | 전체 허용 + AI 크롤러(GPTBot·ClaudeBot·PerplexityBot·Google-Extended·Yeti 등) 명시 허용, `/admin/` 차단 |
| `src/app/sitemap.ts` | 정적 8 + 노트 전편 |
| `src/app/llms.txt/route.ts` | 생성형 AI용 사이트 요약본(llmstxt.org 형식) |
| `public/naver….html` | 네이버 서치어드바이저 소유확인 |

규칙: 페이지를 새로 만들면 `export const metadata = pageMeta({...})` 로 canonical 을 반드시 넣는다
(layout 에는 canonical 을 두지 않는다 — 빠뜨린 페이지가 전부 홈을 가리키게 됨).
구조화 데이터에도 화면에 없는 사실·평점·수상을 넣지 않는다(G1·G6).

## 6. 남은 일

- [ ] `/admin` 편집 화면 6종 구현 (현재 대시보드 골격만)
- [ ] 커스텀 도메인 연결 시 Vercel 에 `NEXT_PUBLIC_SITE_URL` 설정 + 네이버·구글에 새 도메인 재등록
- [ ] 네이버 서치어드바이저 · 구글 서치콘솔에 `/sitemap.xml` 제출
- [ ] CV 18번 "확인필요" 2건 — KYPG 정식명칭, 저서 출간일·ISBN
