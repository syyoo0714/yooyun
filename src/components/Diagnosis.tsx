"use client";

import { useActionState, useMemo, useState } from "react";
import { submitDiagnosis, type DiagState } from "@/app/diagnosis/actions";
import Disclaimer from "@/components/Disclaimer";
import { notePath } from "@/lib/site";
import s from "./Diagnosis.module.css";
import ENGINE from "@/data/diagnosis/engine.json";
const W = ENGINE.w;

const NOTES: [string, string][] = [
  ["기술-관련-사건-이직자에-대한-전-직장의-전직금지가처분-공격을-방어한-사", "이직자에 대한 전 직장의 전직금지가처분 공격을 방어한 사례"],
  ["전직금지-가처분-대응의-핵심-핵심인재의-전직금지-2년은-과하다고-본-최근", "핵심인재의 전직금지 2년은 과하다고 본 최근 결정"],
  ["경업금지약정-효력-서명만으로-충분할까", "경업금지약정 효력, 서명만으로 충분할까?"],
];

type Card = {
  case: string;
  court: string;
  date: string | null;
  validity: string;
  real: string;
  kf: string;
  win?: string;
  side?: string;
  f: Record<string, string | number | null>;
};
type Val = string | number | null;
type Opt = [string, Val];
type Q = { k: string; t: string; h?: string; multi?: boolean; show?: (a: Ans) => boolean; o: Opt[] };
type Ans = Record<string, Val | Val[]>;

const yn: Opt[] = [["예", "예"], ["아니요", "아니요"]];
const Qs: Q[] = [
  { k: "q7_직위", t: "퇴사 전 맡았던 일은 무엇에 가장 가까운가요?", o: ["임원", "연구개발", "엔지니어·생산기술", "영업·마케팅", "강사·시술자", "팀장·관리직", "일반사무"].map((x) => [x, x] as Opt) },
  { k: "q10_고객이동형", t: "고객·수강생·환자가 회사보다 나를 보고 찾아오는 일이었나요?", h: "강사, 미용·시술, 개인 영업처럼 사람을 따라 고객이 옮겨 가는 업무인지 묻는 질문입니다.", o: yn },
  { k: "q1_4_일반적업무", t: "업계에서 일하면 누구나 익히는 기술·경험 위주의 일이었나요?", h: "교육, 시술, 판매, 단순 생산처럼 그 회사만의 비밀이 아닌 일반적인 업무인지 묻습니다.", o: yn },
  { k: "x_업종", t: "전 회사는 어떤 업종인가요?", o: [["교육·학원", "교육"], ["미용·의료·시술", "의료"], ["IT·소프트웨어·게임", "IT"], ["제조·반도체·기계", "제조"], ["영업·유통·도소매", "유통"], ["그 밖의 업종", "기타"]] },
  { k: "x_근속", t: "전 회사에서 일한 기간은 얼마인가요?", o: [["1년 미만", "short"], ["1년 ~ 5년", "mid"], ["5년 이상", "long"]] },
  { k: "q4_약정형식", multi: true, t: "경업금지 약속은 어떤 문서로 했나요?", h: "여러 장에 서명했다면 모두 골라 주세요.", o: [["입사할 때 쓴 서약서", "입사시서약서"], ["근로계약서 안의 조항", "근로계약조항"], ["재직 중 따로 쓴 서약서", "재직중서약서"], ["퇴사할 때 쓴 서약서", "퇴직시서약서"], ["별도의 경업금지 약정서", "별도약정"], ["임원 계약서", "임원계약"]] },
  { k: "q5_약정기간개월", t: "퇴사 후 몇 개월 동안 금지하나요?", h: "행위마다 기간이 다르면(예: 취업 1년, 개업 2년) 가장 긴 기간을 골라 주세요.", o: [["6개월 이하", 6], ["1년", 12], ["2년", 24], ["3년 이상", 36]] },
  { k: "q8_지역제한", multi: true, t: "금지 지역은 어떻게 정해져 있나요?", h: "행위마다 다르면 해당하는 것을 모두 골라 주세요.", o: [["반경 몇 km, 같은 상권처럼 좁게", "반경·상권 한정"], ["국내 전역", "국내 전역"], ["지역 없이 동종업계 전부", "제한 없음"]] },
  { k: "q9_금지범위", multi: true, t: "무엇을 금지하나요?", h: "해당하는 것을 모두 골라 주세요.", o: [["특정 경쟁사 몇 곳에 가는 것", "특정 경쟁사만"], ["동종 개업이나 고객 유인", "개업·고객유인만"], ["동종업체 취업 전부", "동종업체 취업 전부"]] },
  { k: "x_업무범위", t: "금지하는 일의 범위는 어떻게 되어 있나요?", h: "약정 문구에 「동일한 업무」, 「경쟁 업무」처럼 하던 일로 한정하는 표현이 있는지 보세요.", o: [["전 회사에서 하던 것과 같은 업무만 금지", "same"], ["업무와 상관없이 그 업계 회사에 가는 것 자체를 금지", "all"]] },
  { k: "q3_경쟁사명시", t: "약정에 경쟁사 이름이 적혀 있나요?", o: yn },
  { k: "q2_1_받은돈", multi: true, t: "경업금지와 관련해 회사에서 받은 돈이 있나요?", h: "받은 것을 모두 골라 주세요.", o: [["경업금지 대가로 따로 받은 돈", "명시대가"], ["퇴직위로금", "퇴직위로금"], ["재직 중 높은 연봉·처우", "재직중고액연봉·처우"], ["리텐션·인센티브(반환 조건부)", "리텐션·인센티브"], ["스톡옵션·주식", "스톡옵션·주식"], ["받은 것 없음", "없음"]] },
  { k: "q2_금액원", show: (a) => Array.isArray(a["q2_1_받은돈"]) && (a["q2_1_받은돈"] as Val[]).includes("명시대가"), t: "경업금지 대가는 모두 합쳐 얼마였나요?", o: [["월 수당 등 합계 2천만 원 이하", 10000000], ["2천만 원 ~ 1억 원", 50000000], ["1억 원 이상", 150000000]] },
  { k: "q6_퇴직경위", t: "어떻게 퇴사했나요(퇴사 예정인가요)?", o: [["스스로 퇴사", "자진"], ["해고·권고사직", "해고·권고사직"], ["계약 만료", "계약만료"]] },
  { k: "x_이직처", t: "어디로 옮기나요(옮겼나요)?", o: [["같은 업계 경쟁 회사에 취업", "competitor"], ["같은 업종으로 창업·개업", "startup"], ["해외 회사", "overseas"], ["다른 업계이거나 아직 정하지 않음", "other"]] },
  { k: "x_회사조치", t: "회사는 지금 어떤 조치를 했나요?", o: [["전직금지가처분을 신청했거나 하겠다고 알려 옴", "injunction"], ["내용증명·소송으로 위약금·손해배상을 청구", "suit"], ["아직 아무 조치 없음", "none"]] },
  { k: "p2_자료반출", t: "퇴사하면서 회사 자료(파일·고객 명단 등)를 옮겨 두었거나, 회사가 그렇게 문제 삼고 있나요?", h: "아래 네 문항은 지수에 넣지 않고, 약정과 별도로 회사가 청구할 수 있는 부분을 알려 드리는 데 씁니다.", o: yn },
  { k: "s_고객", t: "퇴사 후 전 회사 고객에게 연락했거나, 그 고객과 거래할 예정인가요?", o: yn },
  { k: "s_재직중", t: "퇴사 전 재직 중에 이직처·창업을 준비하면서 회사 일과 겹치는 일을 했나요?", h: "재직 중 경쟁 회사 일을 돕거나, 회사 거래를 새 회사로 돌린 경우 등입니다.", o: yn },
  { k: "s_위약금", t: "약정에 위반 시 위약금이나 손해배상 금액이 정해져 있나요?", o: yn },
];
const SIDE: [string, keyof typeof ENGINE.side.items, string][] = [
  ["p2_자료반출", "data", "회사 자료 반출"],
  ["s_고객", "client", "전 회사 고객 접촉"],
  ["s_재직중", "during", "재직 중 경쟁 준비"],
  ["s_위약금", "penalty", "위약금 조항"],
];
const WIDE8 = ["제한 없음", "국내 전역", "반경·상권 한정"];
const WIDE9 = ["동종업체 취업 전부", "개업·고객유인만", "특정 경쟁사만"];

function pick(v: Val | Val[] | undefined, order: string[]): Val {
  const arr = (Array.isArray(v) ? v : [v]).filter((x) => x != null) as string[];
  for (const o of order) if (arr.includes(o)) return o;
  return null;
}

function score(a: Ans): [number, [number, string][]] {
  const f: [number, string][] = [];
  let sc = 0;
  const add = (v: number, t: string) => { if (!v) return; sc += v; f.push([v, t]); };
  const money = ((Array.isArray(a["q2_1_받은돈"]) ? a["q2_1_받은돈"] : []) as string[]);
  const amt = a["q2_금액원"] as number | null | undefined;
  const cands: [number, string][] = [];
  if (money.includes("명시대가")) {
    if (typeof amt === "number" && amt <= W.explicitSmallMax) cands.push([W.explicitSmall, "경업금지 대가를 받았지만 금액이 크지 않습니다"]);
    else if (typeof amt === "number") cands.push([W.explicitLarge, "경업금지 대가로 상당한 돈을 따로 받았습니다"]);
    else cands.push([W.explicitUnknown, "경업금지 대가를 따로 받았습니다"]);
  }
  if (money.includes("퇴직위로금")) cands.push([W.severance, "퇴직위로금을 받았습니다"]);
  if (money.includes("재직중고액연봉·처우")) cands.push([W.highPay, "재직 중 높은 처우를 받았습니다(법원은 대가로 잘 보지 않습니다)"]);
  if (cands.length) { const best = cands.sort((x, y) => y[0] - x[0])[0]; add(best[0], best[1]); }

  const r = pick(a["q9_금지범위"], WIDE9);
  const geo = pick(a["q8_지역제한"], WIDE8) === "반경·상권 한정";
  const p = a["q5_약정기간개월"] as number | null | undefined;
  const pos = a["q7_직위"];
  const gen = a["q1_4_일반적업무"] === "예" || pos === "강사·시술자" || a["q10_고객이동형"] === "예";
  const narrow = r === "개업·고객유인만" || r === "특정 경쟁사만";
  const short = typeof p === "number" && p <= W.shortTermMaxMonths;

  if (a["q3_경쟁사명시"] === "예" || r === "특정 경쟁사만") add(W.namedCompetitor, "금지 대상 경쟁사가 특정되어 있습니다");
  if (pos === "임원" || pos === "연구개발") add(W.execOrRnd, "임원·연구개발직은 보호할 회사 이익이 인정되기 쉽습니다");
  if (pos === "강사·시술자") add(W.posInstructor, "강사·시술자 사건에서는 짧고 좁은 약정이 유지된 판결이 있습니다");
  if (pos === "엔지니어·생산기술") add(W.posEngineer, "엔지니어·생산기술직은 일반적인 기술로 보아 약정을 무효로 본 판결이 많습니다");
  if (pos === "영업·마케팅") add(W.posSales, "영업·마케팅직은 보호할 회사 이익이 약하다고 본 판결이 많습니다");
  if (a["q1_4_일반적업무"] === "아니요") add(W.generalNo, "그 회사에서만 익힐 수 있는 기술·정보를 다루는 일이었습니다");
  else if (a["q1_4_일반적업무"] === "예") add(W.generalYes, "업계에서 일하면 누구나 익히는 일반적인 업무였습니다");
  if (typeof p === "number" && p <= W.term6MaxMonths) add(W.term6, "금지 기간이 6개월 이하로 짧습니다");
  else if (short) add(W.term7to12, "금지 기간이 1년 이하입니다");
  else if (typeof p === "number" && p > W.longTermMinMonths) add(W.longTerm, "금지 기간이 2년을 넘습니다");
  const forms = ((Array.isArray(a["q4_약정형식"]) ? a["q4_약정형식"] : []) as string[]);
  if (forms.length && forms.every((x) => x === "입사시서약서" || x === "근로계약조항")) add(W.hireFormOnly, "입사 때 일괄로 받은 서약서·계약 조항뿐입니다");
  if (forms.includes("재직중서약서")) add(W.formDuring, "재직 중 회사가 일괄로 받은 서약서입니다");
  if (forms.includes("퇴직시서약서")) add(W.formExit, "퇴사할 때 쓴 서약서입니다");
  if (gen && !geo && !narrow && !short) add(W.generalWideLong, "업계 일반 기술·고객을 따라가는 업무인데 지역·범위 제한이 넓고 기간도 1년을 넘습니다");
  if (narrow && short) add(W.narrowAndShort, "금지 범위가 좁고 기간도 짧습니다");
  if (a["x_업무범위"] === "same") add(W.jobSame, "금지가 전 회사에서 하던 것과 같은 업무로 한정되어 있습니다");
  else if (a["x_업무범위"] === "all") add(W.jobAll, "업무와 상관없이 그 업계 회사에 가는 것 자체를 막습니다");
  if (r === "특정 경쟁사만") add(W.targetNamed, "금지 대상이 특정 경쟁사 몇 곳으로 좁혀져 있습니다");
  else if (r === "동종업체 취업 전부") add(W.targetIndustry, "동종업계 회사 전부를 금지 대상으로 삼습니다");
  if (r === "개업·고객유인만") add(W.scopeOpenClient, "취업이 아니라 개업·고객 유인만 막습니다");
  if (geo) add(W.targetRadius, "금지 지역이 반경·상권으로 좁게 정해져 있습니다");
  if (a["x_근속"] === "short") add(W.tenureShort, "근무 기간이 1년 미만으로 짧습니다");
  else if (a["x_근속"] === "long") add(W.tenureLong, "5년 이상 오래 근무했습니다");
  if (a["x_이직처"] === "startup") add(W.destStartup, "취업이 아니라 직접 창업·개업하는 경우입니다");
  else if (a["x_이직처"] === "overseas") add(W.destOverseas, "해외 회사로 옮기는 경우입니다");
  if (a["q6_퇴직경위"] === "자진") add(W.exitSelf, "스스로 퇴사했습니다");
  else if (a["q6_퇴직경위"] === "계약만료") add(W.exitExpire, "계약 기간이 끝나 퇴사했습니다");
  if (a["x_업종"] === "교육") add(W.indEdu, "교육·학원 업종에서는 약정을 무효로 본 판결이 많습니다");
  if (a["x_회사조치"] === "injunction") add(W.injunction, "회사가 전직금지가처분으로 다투는 사건입니다");
  return [sc, f];
}

function pctl(x: number): number {
  const P = ENGINE.pct;
  if (x <= P[0]) return 1;
  if (x >= P[P.length - 1]) return 99;
  for (let k = 0; k < P.length - 1; k++)
    if (x < P[k + 1]) return Math.min(99, Math.max(1, Math.round(5 * k + (5 * (x - P[k])) / Math.max(1, P[k + 1] - P[k]))));
  return 99;
}

function band(ix: number) {
  return ENGINE.bands.find((z) => ix < z.max) ?? ENGINE.bands[ENGINE.bands.length - 1];
}

function label(q: Q, v: Val | Val[] | undefined): string {
  const arr = Array.isArray(v) ? v : [v];
  if (!arr.length || arr.every((x) => x == null)) return "잘 모르겠음";
  return arr.map((x) => q.o.find((o) => o[1] === x)?.[0] ?? String(x)).join(", ");
}

export default function Diagnosis({ cards }: { cards: Card[] }) {
  const [stage, setStage] = useState<"intro" | "quiz" | "text" | "result">("intro");
  const [a, setA] = useState<Ans>({});
  const [i, setI] = useState(0);
  const [clause, setClause] = useState("");
  const [dest, setDest] = useState("");
  const [state, action, pending] = useActionState<DiagState, FormData>(submitDiagnosis, null);

  const qs = Qs.filter((q) => !q.show || q.show(a));
  const q = qs[Math.min(i, qs.length - 1)];
  const next = () => { if (i + 1 >= qs.length) setStage("text"); else setI(i + 1); window.scrollTo(0, 0); };
  const prev = () => { if (i > 0) setI(i - 1); else setStage("intro"); };

  const choose = (v: Val) => {
    if (!q.multi) { setA({ ...a, [q.k]: v }); setTimeout(next, 120); return; }
    const cur = (Array.isArray(a[q.k]) ? a[q.k] : []) as Val[];
    let nv: Val[];
    if (v === null) nv = cur.includes(null) ? [] : [null];
    else nv = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur.filter((x) => x !== null), v];
    setA({ ...a, [q.k]: nv });
  };
  const isSel = (v: Val) => (q.multi ? ((a[q.k] as Val[] | undefined) ?? []).includes(v) : a[q.k] === v && q.k in a);

  const res = useMemo(() => {
    if (stage !== "result") return null;
    const [sc, f] = score(a);
    const ix = pctl(sc);
    const bd = band(ix);
    const bn = bd.name, bs = bd.desc;
    const single = (k: string, order: string[]) => pick(a[k], order);
    const comp: Record<string, Val> = {
      ...Object.fromEntries(Object.entries(a).map(([k, v]) => [k, Array.isArray(v) ? (v[0] ?? null) : v])),
      q8_지역제한: single("q8_지역제한", WIDE8),
      q9_금지범위: single("q9_금지범위", WIDE9),
    };
    const sim = (c: Card) => {
      let n = 0;
      for (const k of ["q2_1_받은돈", "q7_직위", "q8_지역제한", "q9_금지범위", "q10_고객이동형", "q4_약정형식", "q3_경쟁사명시"])
        if (comp[k] != null && c.f[k] === comp[k]) n++;
      const p = comp["q5_약정기간개월"] as number | null, cp = c.f["q5_약정기간개월"] as number | null;
      if (p != null && cp != null && Math.abs(p - cp) <= 6) n++;
      return n;
    };
    const top = cards.map((c) => [sim(c), c] as [number, Card]).sort((x, y) => y[0] - x[0]).slice(0, 3).map((z) => z[1]);
    const up = f.filter((z) => z[0] > 0).sort((x, y) => y[0] - x[0]).slice(0, 3);
    const dn = f.filter((z) => z[0] < 0).sort((x, y) => x[0] - y[0]).slice(0, 3);
    const sides = SIDE.filter(([k]) => a[k] === "예").map(([, key, name]) => ({ name, ...ENGINE.side.items[key] }));
    const summary = [
      `[전직금지·경업금지 진단] 약정 효력 지수 ${ix} · ${bn} (구간 판결 ${bd.n}건 중 약정 유효 ${bd.rate}%) · 별도 청구 신호 ${sides.length}/4`,
      ...qs.map((qq) => `- ${qq.t} → ${label(qq, a[qq.k])}`),
      `[약정 조항 원문]\n${clause || "(입력 없음)"}`,
      `[이직처 업종·맡을 업무]\n${dest || "(입력 없음)"}`,
      `[비슷한 판결] ${top.map((c) => c.case).join(" / ")}`,
    ].join("\n");
    const brief = qs
      .filter((qq) => !qq.k.startsWith("q1_") && !qq.k.startsWith("s_") && !qq.k.startsWith("p2_"))
      .map((qq) => label(qq, a[qq.k]))
      .filter((t) => t !== "잘 모르겠음")
      .join(" · ");
    return { ix, bn, bs, bd, up, dn, top, summary, brief, sides };
  }, [stage, a, cards, clause, dest, qs]);

  if (stage === "intro")
    return (
      <div className={s.intro}>
        <div className={s.trust}>
          <div><b>약 900건</b><span>분석 판결</span></div>
          <div><b>{Qs.filter((x) => !x.show).length}문항</b><span>약 4분</span></div>
          <div><b>무료</b><span>바로 결과 확인</span></div>
        </div>
        <button className="btn btn-primary" onClick={() => { setStage("quiz"); setI(0); }}>진단 시작하기</button>
        <Disclaimer diag="short" />
        <p className={s.who}>유연 변호사·변리사가 전직금지·경업금지 판결을 직접 분류해 진단 기준을 만들었습니다. 입력하신 내용은 상담을 신청하시기 전까지 저장되지 않습니다.</p>
      </div>
    );

  if (stage === "quiz")
    return (
      <div className={s.card}>
        <div className={s.bar}><i style={{ width: `${(i / qs.length) * 100}%` }} /></div>
        <div className={s.qn}>질문 {i + 1} / {qs.length}{q.multi ? " · 여러 개 선택" : ""}</div>
        <div className={s.q}>{q.t}</div>
        {q.h && <p className={s.qh}>{q.h}</p>}
        {[...q.o, ["잘 모르겠어요", null] as Opt].map(([l, v]) => (
          <button key={l} className={`${s.opt} ${isSel(v) ? s.sel : ""} ${v === null ? s.unk : ""}`} onClick={() => choose(v)}>
            {q.multi && <span className={s.box}>{isSel(v) ? "✓" : ""}</span>}
            {l}
          </button>
        ))}
        <div className={s.nav}>
          <button className={s.back} onClick={prev}>← 이전 질문</button>
          {q.multi && <button className="btn btn-primary" disabled={!((a[q.k] as Val[] | undefined)?.length)} onClick={next}>다음</button>}
        </div>
      </div>
    );

  if (stage === "text")
    return (
      <div className={s.card}>
        <div className={s.qn}>마지막 · 선택 입력</div>
        <div className={s.q}>약정 내용을 조금 더 알려 주시겠어요?</div>
        <p className={s.qh}>적지 않아도 결과는 나옵니다. 상담을 신청하시면 이 내용이 함께 전달되어 처음부터 다시 설명하실 필요가 없습니다.</p>
        <label className={s.label}>약정서·서약서의 경업금지 조항 (붙여넣기)</label>
        <textarea className={s.ta} value={clause} onChange={(e) => setClause(e.target.value)} maxLength={3000} placeholder="예: 퇴직 후 2년간 회사와 경쟁관계에 있는 업체에 취업하거나 동종 업체를 설립하지 않는다." />
        <label className={s.label}>이직처(창업) 업종과 맡을 업무</label>
        <textarea className={s.ta} value={dest} onChange={(e) => setDest(e.target.value)} maxLength={1000} placeholder="예: 같은 업계 중견기업, 해외영업 팀장으로 이직 예정" />
        <div className={s.nav}>
          <button className={s.back} onClick={() => { setStage("quiz"); setI(qs.length - 1); }}>← 이전</button>
          <button className="btn btn-primary" onClick={() => { setStage("result"); window.scrollTo(0, 0); }}>결과 보기</button>
        </div>
      </div>
    );

  const R = res!;
  const ang = Math.PI * (1 - R.ix / 100), gx = 120 + 100 * Math.cos(ang), gy = 120 - 100 * Math.sin(ang);
  return (
    <div className={s.card}>
      <div className={s.gauge}>
        <svg viewBox="0 0 240 130">
          <path d="M20 120 A100 100 0 0 1 220 120" fill="none" stroke="var(--border-soft)" strokeWidth="16" strokeLinecap="round" />
          <path d={`M20 120 A100 100 0 0 1 ${gx.toFixed(1)} ${gy.toFixed(1)}`} fill="none" stroke="var(--accent)" strokeWidth="16" strokeLinecap="round" />
        </svg>
        <div className={s.score}><b>{R.ix}</b><span>약정 효력 지수 (0~100)</span></div>
      </div>
      <div className={s.band}>{R.bn}</div>
      <p className={s.bandsub}>
        법원이 약정의 효력을 판단한 판결 {ENGINE.n}건을 약정이 유지되기 쉬운 순서로 세웠을 때, 입력하신 사정은 아래에서 {R.ix}번째쯤입니다.
        이 구간 판결 {R.bd.n}건 가운데 약정이 전부 또는 일부 유효로 인정된 판결은 <b>{R.bd.rate}%</b>입니다. {R.bs}
      </p>
      <Disclaimer diag="index" />
      {R.brief && <p className={s.brief}><b>입력하신 조건</b> {R.brief}</p>}

      <h3 className={s.h}>지수를 올린 사정</h3>
      {R.up.length ? R.up.map((z) => <div key={z[1]} className={`${s.fac} ${s.up}`}><em>+{z[0]}</em><span>{z[1]}</span></div>) : <div className={s.fac}><span>해당 사정이 없습니다.</span></div>}
      <h3 className={s.h}>지수를 낮춘 사정</h3>
      {R.dn.length ? R.dn.map((z) => <div key={z[1]} className={`${s.fac} ${s.dn}`}><em>−{-z[0]}</em><span>{z[1]}</span></div>) : <div className={s.fac}><span>해당 사정이 없습니다.</span></div>}

      <h3 className={s.h}>약정과 별도로 회사가 청구할 수 있는 부분 · {R.sides.length} / 4</h3>
      {R.sides.length ? R.sides.map((z) => (
        <div key={z.name} className={s.fac}>
          <span><b>{z.name}</b> {z.text} (약정이 무효이거나 효력 판단 없이 끝난 판결 {ENGINE.side.pop}건 중 {z.n}건, 예: {z.ex})</span>
        </div>
      )) : <div className={s.fac}><span>입력하신 사정 가운데 약정과 별도로 청구될 만한 사정은 없습니다.</span></div>}

      <h3 className={s.h}>사정이 비슷한 실제 판결</h3>
      {R.top.map((c) => {
        const ok = !c.validity.startsWith("무효");
        const tag = (ok ? (c.validity.startsWith("일부") ? "약정 일부 유효" : "약정 유효") : "약정 무효") + (c.side === "예" ? " · 다른 구제 인정" : "");
        return (
          <div key={c.case} className={s.case}>
            <b>{c.court} {c.date ? c.date.slice(0, 4) : ""} {c.case.split("-").pop()}</b>
            <span className={`${s.tag} ${ok ? s.tagV : s.tagN}`}>{tag}</span>
            {c.kf && <p>{c.kf}</p>}
          </div>
        );
      })}

      <h3 className={s.h}>지금 해 두실 일</h3>
      <ol className={s.todo}>
        <li>서명한 약정서·서약서·근로계약서 사본을 모두 확보해 두세요.</li>
        <li>이직처와 맡을 업무가 약정의 금지 범위에 들어가는지 적어 보세요.</li>
        <li>회사 자료는 개인 메일·저장매체로 옮기지 말고, 이미 옮긴 것이 있으면 정리해 두세요.</li>
      </ol>

      <div className={s.urgent}>
        <h3>전직금지가처분은 빠르게 진행됩니다</h3>
        <p>회사가 전직금지가처분을 신청하면 보통 몇 주 안에 심문 기일이 열리고, 그 자리에서 약정의 효력과 이직처 업무를 다투게 됩니다. 내용증명을 받았거나 이직 날짜가 잡혀 있다면, 심문 전에 약정서와 담당 업무를 정리해 두는 것이 결과를 가릅니다.</p>
      </div>

      <h3 className={s.h}>유연 변호사가 다룬 전직금지·경업금지 사건</h3>
      {NOTES.map(([slug, title]) => (
        <a key={slug} className={s.note} href={notePath(slug)}>{title} →</a>
      ))}

      <div className={s.cta}>
        <h3>내 약정서, 변호사에게 보이기</h3>
        <p>붙여 넣으신 약정 조항과 진단 결과를 유연 변호사가 직접 보고 연락드립니다. 처음부터 다시 설명하실 필요가 없습니다.</p>
        <form action={action}>
          <input type="hidden" name="summary" value={R.summary} />
          <div className={s.row2}>
            <input className="input" name="name" placeholder="성함" maxLength={60} required />
            <input className="input" name="contact" placeholder="연락처(전화 또는 이메일)" maxLength={120} required />
          </div>
          <textarea className={s.ta} name="memo" placeholder="이직 예정 시기, 궁금한 점(선택)" maxLength={2000} />
          <label className={s.agree}><input type="checkbox" name="agree" /> 상담 회신을 위한 개인정보(성함·연락처·진단 내용) 수집·이용에 동의합니다.</label>
          <button className="btn btn-primary" disabled={pending}>{pending ? "접수 중…" : "내 약정서 변호사에게 보이기"}</button>
          <a className="btn btn-ghost" href="tel:025329824" style={{ marginLeft: 8 }}>전화 상담 02-532-9824</a>
          {state && <p className={s.msg}>{state.message}</p>}
        </form>
      </div>

      <div style={{ marginTop: 24 }}><Disclaimer diag="full" /></div>
      <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => { setA({}); setClause(""); setDest(""); setI(0); setStage("quiz"); }}>다시 진단하기</button>
    </div>
  );
}
