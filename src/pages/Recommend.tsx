import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

type Step = "intro" | "relation" | "game" | "result";
type Axis = "ext" | "int" | "plan" | "spon";

interface Question {
  q: string;
  a: { emoji: string; label: string; axis: Axis };
  b: { emoji: string; label: string; axis: Axis };
}

const QUESTIONS: Question[] = [
  { q: "이 사람, 약속 잡으면?", a: { emoji: "☕", label: "카페 가자고 함", axis: "ext" }, b: { emoji: "🍽", label: "밥 먹으러 가자고 함", axis: "ext" } },
  { q: "이 사람, 약속 장소 정할 때?", a: { emoji: "🎯", label: "늘 가던 데", axis: "plan" }, b: { emoji: "🗺", label: "새로운 데 가보자", axis: "spon" } },
  { q: "주말에 뭐 할 것 같아?", a: { emoji: "🛋", label: "집에서 쉼", axis: "int" }, b: { emoji: "🚶", label: "어디든 나감", axis: "ext" } },
  { q: "카페 가면?", a: { emoji: "☕", label: "아메리카노 자동 주문", axis: "plan" }, b: { emoji: "🧋", label: "그날 기분에 따라 다름", axis: "spon" } },
  { q: "먹고 싶은 거 생기면?", a: { emoji: "⚡", label: "바로 시킴", axis: "spon" }, b: { emoji: "🤔", label: "고민하다 참음", axis: "plan" } },
  { q: "단톡방에서는?", a: { emoji: "👀", label: "읽고 잠수", axis: "int" }, b: { emoji: "💬", label: "꼭 한마디 함", axis: "ext" } },
  { q: "스트레스받으면?", a: { emoji: "🛵", label: "배달 시킴", axis: "spon" }, b: { emoji: "🍫", label: "단 거 찾음", axis: "plan" } },
  { q: "선물 취향은?", a: { emoji: "🎯", label: "실용적인 거", axis: "plan" }, b: { emoji: "✨", label: "분위기 있는 거", axis: "spon" } },
  { q: "카톡 답장은?", a: { emoji: "⚡", label: "칼답", axis: "spon" }, b: { emoji: "🌊", label: "나중에 몰아서", axis: "plan" } },
  { q: '"뭐 먹고 싶어?" 물어보면?', a: { emoji: "💬", label: "바로 대답함", axis: "spon" }, b: { emoji: "🤷", label: '"아무거나"', axis: "plan" } },
];

const RESULTS = {
  A: { emoji: "🔥", name: "배달앱 열혈러", desc: "고민보다 실행, 받으면 당일에 다 씀", gifts: ["배달의민족 금액권", "BBQ 치킨", "편의점 금액권"] },
  B: { emoji: "🛋", name: "혼밥 장인", desc: "나가긴 싫고 먹고는 싶어, 배달이 답", gifts: ["쿠팡이츠 금액권", "편의점 금액권", "메가커피"] },
  C: { emoji: "☕", name: "카페 고정석", desc: "루틴이 곧 행복, 아아 한 잔이면 충분해", gifts: ["스타벅스", "투썸플레이스", "이디야"] },
  D: { emoji: "🌿", name: "조용한 미식가", desc: "분위기보다 퀄리티, 혼자 즐기는 게 제일 편해", gifts: ["뚜레쥬르", "올리브영 금액권", "스타벅스 디저트"] },
} as const;

type ResultKey = keyof typeof RESULTS;

const RELATIONS = [
  { emoji: "👥", label: "별로 안 친한 사이", rounds: 3 },
  { emoji: "🤝", label: "동네친구같은 사이", rounds: 5 },
  { emoji: "🔥", label: "가족같은 사이", rounds: 10 },
];

export default function Recommend() {
  const [step, setStep] = useState<Step>("intro");
  const [rounds, setRounds] = useState(3);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<"a" | "b" | null>(null);
  const [slide, setSlide] = useState(false);
  const [scores, setScores] = useState({ ext: 0, int: 0, plan: 0, spon: 0 });
  const [result, setResult] = useState<ResultKey>("A");

  const reset = () => {
    setStep("intro");
    setIdx(0);
    setPicked(null);
    setScores({ ext: 0, int: 0, plan: 0, spon: 0 });
  };

  const startRelation = () => setStep("relation");

  const startGame = (n: number) => {
    setRounds(n);
    setIdx(0);
    setPicked(null);
    setScores({ ext: 0, int: 0, plan: 0, spon: 0 });
    setStep("game");
  };

  const choose = (which: "a" | "b") => {
    if (picked) return;
    setPicked(which);
    const q = QUESTIONS[idx];
    const axis = which === "a" ? q.a.axis : q.b.axis;
    const next = { ...scores, [axis]: scores[axis] + 1 };
    setScores(next);

    setTimeout(() => {
      setSlide(true);
      setTimeout(() => {
        if (idx + 1 >= rounds) {
          const spon = next.spon >= next.plan;
          const ext = next.ext >= next.int;
          const key: ResultKey = spon && ext ? "A" : spon && !ext ? "B" : !spon && ext ? "C" : "D";
          setResult(key);
          setStep("result");
        } else {
          setIdx(idx + 1);
          setPicked(null);
        }
        setSlide(false);
      }, 250);
    }, 350);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "링크가 복사됐어요!" });
    } catch {
      toast({ title: "복사 실패", variant: "destructive" });
    }
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-[480px] mx-auto">
        {step === "intro" && (
          <div className="flex flex-col items-center text-center animate-fade-in">
            <div
              className="w-28 h-28 rounded-full mb-8 flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #FF6B6B 0%, #FF8C42 100%)", boxShadow: "0 20px 50px -12px rgba(255,107,107,.45)" }}
            >
              <span className="text-5xl" aria-hidden>🎁</span>
            </div>
            <h1 className="text-2xl font-bold mb-3 leading-snug">이 사람한테<br />뭐 선물할지 모르겠어?</h1>
            <p className="text-sm text-muted-foreground mb-10">간단한 밸런스게임으로 선물 유형을 찾아드려요</p>
            <Button
              onClick={startRelation}
              className="w-full h-14 text-base font-semibold rounded-2xl text-white border-0"
              style={{ background: "linear-gradient(90deg,#FF6B6B,#FF8C42)", boxShadow: "0 10px 25px -8px rgba(255,107,107,.5)" }}
            >
              선물 유형 찾아보기 →
            </Button>
          </div>
        )}

        {step === "relation" && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-8">이 사람 어떤 관계예요?</h2>
            <div className="space-y-3">
              {RELATIONS.map((r) => (
                <button
                  key={r.label}
                  onClick={() => startGame(r.rounds)}
                  className="w-full p-5 rounded-2xl bg-card border-2 border-border hover:border-[#FF6B6B] hover:scale-[1.02] transition-all flex items-center gap-4 text-left shadow-sm"
                >
                  <span className="text-3xl">{r.emoji}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-base">{r.label}</div>
                    <div className="text-xs text-muted-foreground">{r.rounds}라운드</div>
                  </div>
                  <span className="text-muted-foreground">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "game" && (
          <div>
            <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
              <span className="font-medium">{idx + 1} / {rounds}</span>
              <button onClick={reset} className="hover:text-foreground">처음으로</button>
            </div>
            <Progress value={((idx + 1) / rounds) * 100} className="h-2 mb-8" />

            <div className={`transition-all duration-300 ${slide ? "opacity-0 -translate-x-6" : "opacity-100 translate-x-0"}`}>
              <h2 className="text-xl font-bold text-center mb-8 leading-snug">{QUESTIONS[idx].q}</h2>
              <div className="grid grid-cols-2 gap-3">
                {(["a", "b"] as const).map((k) => {
                  const opt = QUESTIONS[idx][k];
                  const selected = picked === k;
                  const dim = picked && !selected;
                  return (
                    <button
                      key={k}
                      onClick={() => choose(k)}
                      disabled={!!picked}
                      className={`aspect-[3/4] rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-3 text-center transition-all ${
                        selected
                          ? "border-[#FF6B6B] bg-[#FFF1ED] scale-105 shadow-lg"
                          : dim
                          ? "border-border bg-card opacity-40"
                          : "border-border bg-card hover:border-[#FF8C42] hover:scale-[1.03] shadow-sm"
                      }`}
                      style={selected ? { boxShadow: "0 15px 30px -10px rgba(255,107,107,.4)" } : undefined}
                    >
                      <span className="text-5xl" aria-hidden>{opt.emoji}</span>
                      <span className="text-sm font-medium leading-snug">{opt.label}</span>
                      <span className="text-xs text-muted-foreground font-bold">{k.toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === "result" && (
          <div className="flex flex-col items-center text-center animate-fade-in">
            <div className="text-7xl mb-4 animate-scale-in" aria-hidden>{RESULTS[result].emoji}</div>
            <h1
              className="text-3xl font-bold mb-3 bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg,#FF6B6B,#FF8C42)" }}
            >
              {RESULTS[result].name}
            </h1>
            <p className="text-sm text-muted-foreground mb-8 px-4 leading-relaxed">{RESULTS[result].desc}</p>

            <div className="w-full bg-card border border-border rounded-2xl p-5 mb-6 shadow-sm">
              <div className="text-xs font-semibold text-muted-foreground mb-3 text-left">추천 기프티콘 TOP 3</div>
              <div className="space-y-2">
                {RESULTS[result].gifts.map((g, i) => (
                  <div key={g} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: "linear-gradient(135deg,#FF6B6B,#FF8C42)" }}
                    >
                      {i + 1}
                    </span>
                    <span className="font-medium text-sm">{g}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full space-y-3">
              <Button
                onClick={copyLink}
                variant="outline"
                className="w-full h-12 rounded-2xl font-semibold bg-white"
                style={{ borderColor: "#FF6B6B", color: "#FF6B6B" }}
              >
                🔗 링크 복사하기
              </Button>
              <a
                href="https://giftrank.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-12 rounded-2xl font-semibold text-white flex items-center justify-center"
                style={{ background: "linear-gradient(90deg,#FF6B6B,#FF8C42)", boxShadow: "0 10px 25px -8px rgba(255,107,107,.5)" }}
              >
                기프트랭크에서 더 보기 →
              </a>
              <button onClick={reset} className="w-full h-10 text-sm text-muted-foreground hover:text-foreground">
                다시 하기
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
