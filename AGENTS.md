<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your
training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.
Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 이 저장소에서 일할 때

1. 스타일은 **순수 CSS**다. Tailwind·CSS-in-JS를 도입하지 않는다.
   토큰은 `src/app/globals.css` §1 (open-design / editorial). 토큰 밖 색을 만들지 않는다.
   근거·규칙 = `DESIGN.md`.

2. 이력·사건·수치는 **CV 정본**(`../260813_유연_CV_경력기술서.html`)이 유일한 출처다.
   문구를 손으로 옮기지 말고 `scripts/import-cv.mjs` 로 재생성한다.

3. **컴플라이언스 가드**를 어기는 문구를 쓰지 않는다. 요약 = `README.md` §4,
   전문 = `../유연가드레일.md` · `../role_유연_블로그에이전트.md` §5.
   특히 ① 정본 밖 이력 확장 ② 고객사 실명+논평 ③ 자기비교 ④ 승소 보장 ⑤ 별표(`*`).

4. `../260813_유연_원본자료_전체/송무서면_md` 와 `자문의견서_md` 에는 실명·사건번호가 있다.
   이 사이트로 내용을 옮기지 않는다.

5. 면책 문구는 `components/Disclaimer.tsx` 하나만 쓴다(서두·말미 문언 불일치 방지).

6. Next 16 규칙: `middleware.ts` 가 아니라 `src/proxy.ts` / `cookies()` 는 async /
   `params`·`searchParams` 는 Promise.
