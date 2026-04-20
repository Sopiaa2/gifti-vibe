import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type Stage = 'intro' | 'relation' | 'game' | 'result';
type Score = { 즉흥: number; 계획: number; 외향: number; 내향: number };

interface Question {
  q: string;
  a: { text: string; emoji: string; trait: keyof Score };
  b: { text: string; emoji: string; trait: keyof Score };
}

const ALL_QUESTIONS: Question[] = [
  { q: '이 사람, 약속 잡으면?', a: { emoji: '☕', text: '카페 가자고 함', trait: '외향' }, b: { emoji: '🍽', text: '밥 먹으러 가자고 함', trait: '외향' } },
  { q: '이 사람, 약속 장소 정할 때?', a: { emoji: '🎯', text: '늘 가던 데', trait: '계획' }, b: { emoji: '🗺', text: '새로운 데 가보자', trait: '즉흥' } },
  { q: '주말에 뭐 할 것 같아?', a: { emoji: '🛋', text: '집에서 쉼', trait: '내향' }, b: { emoji: '🚶', text: '어디든 나감', trait: '외향' } },
  { q: '카페 가면?', a: { emoji: '☕', text: '아메리카노 자동 주문', trait: '계획' }, b: { emoji: '🧋', text: '그날 기분에 따라 다름', trait: '즉흥' } },
  { q: '먹고 싶은 거 생기면?', a: { emoji: '⚡', text: '바로 시킴', trait: '즉흥' }, b: { emoji: '🤔', text: '고민하다 참음', trait: '계획' } },
  { q: '단톡방에서는?', a: { emoji: '👀', text: '읽고 잠수', trait: '내향' }, b: { emoji: '💬', text: '꼭 한마디 함', trait: '외향' } },
  { q: '스트레스받으면?', a: { emoji: '🛵', text: '배달 시킴', trait: '즉흥' }, b: { emoji: '🍫', text: '단 거 찾음', trait: '계획' } },
  { q: '선물 취향은?', a: { emoji: '🎯', text: '실용적인 거', trait: '계획' }, b: { emoji: '✨', text: '분위기 있는 거', trait: '즉흥' } },
  { q: '카톡 답장은?', a: { emoji: '⚡', text: '칼답', trait: '즉흥' }, b: { emoji: '🌊', text: '나중에 몰아서', trait: '계획' } },
  { q: '"뭐 먹고 싶어?" 물어보면?', a: { emoji: '💬', text: '바로 대답함', trait: '즉흥' }, b: { emoji: '🤷', text: '"아무거나"', trait: '계획' } },
];

const RESULT_TYPES = {
  A: { emoji: '🔥', name: '배달앱 열혈러', desc: '고민보다 실행, 받으면 당일에 다 씀', items: ['배달의민족 금액권', 'BBQ 치킨', '편의점 금액권'] },
  B: { emoji: '🛋', name: '혼밥 장인', desc: '나가긴 싫고 먹고는 싶어, 배달이 답', items: ['쿠팡이츠 금액권', '편의점 금액권', '메가커피'] },
  C: { emoji: '☕', name: '카페 고정석', desc: '루틴이 곧 행복, 아아 한 잔이면 충분해', items: ['스타벅스', '투썸플레이스', '이디야'] },
  D: { emoji: '🌿', name: '조용한 미식가', desc: '분위기보다 퀄리티, 혼자 즐기는 게 제일 편해', items: ['뚜레쥬르', '올리브영 금액권', '스타벅스 디저트'] },
};

function calcType(score: Score): keyof typeof RESULT_TYPES {
  const impulsive = score.즉흥 >= score.계획;
  const extrovert = score.외향 >= score.내향;
  if (impulsive && extrovert) return 'A';
  if (impulsive && !extrovert) return 'B';
  if (!impulsive && extrovert) return 'C';
  return 'D';
}

export default function Recommend() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('intro');
  const [rounds, setRounds] = useState(5);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState<Score>({ 즉흥: 0, 계획: 0, 외향: 0, 내향: 0 });
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);

  const questions = ALL_QUESTIONS.slice(0, rounds);

  const startGame = (r: number) => {
    setRounds(r);
    setStep(0);
    setScore({ 즉흥: 0, 계획: 0, 외향: 0, 내향: 0 });
    setStage('game');
  };

  const choose = (side: 'a' | 'b') => {
    if (selected) return;
    setSelected(side);
    const choice = questions[step][side];
    const newScore = { ...score, [choice.trait]: score[choice.trait] + 1 };
    setScore(newScore);
    setTimeout(() => {
      if (step + 1 >= questions.length) {
        setStage('result');
      } else {
        setStep(step + 1);
        setSelected(null);
      }
    }, 500);
  };

  const resultType = stage === 'result' ? calcType(score) : null;
  const result = resultType ? RESULT_TYPES[resultType] : null;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('링크가 복사되었어요!');
  };

  return (
    <div className="min-h-screen bg-background pb-[80px] max-w-[480px] mx-auto">
      <header className="h-14 flex items-center justify-center border-b border-border bg-card sticky top-0 z-40">
        <h1 className="font-bold text-base">🎯 선물 유형 찾기</h1>
      </header>

      <div className="px-4 py-6">
        <AnimatePresence mode="wait">
          {stage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center text-center pt-20 gap-6"
            >
              <div className="text-6xl mb-2">🎯</div>
              <h1 className="text-2xl font-bold leading-tight">
                이 사람한테<br />뭐 선물할지 모르겠어?
              </h1>
              <p className="text-muted-foreground text-sm">
                간단한 밸런스게임으로 선물 유형을 찾아보세요
              </p>
              <Button
                onClick={() => setStage('relation')}
                className="mt-4 h-12 px-8 text-base bg-gradient-to-r from-[#FF6B6B] to-[#FF8C42] hover:opacity-90"
              >
                선물 유형 찾아보기 →
              </Button>
            </motion.div>
          )}

          {stage === 'relation' && (
            <motion.div
              key="relation"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="flex flex-col gap-4 pt-8"
            >
              <h2 className="text-xl font-bold text-center mb-4">이 사람 어떤 관계예요?</h2>
              {[
                { emoji: '👥', label: '별로 안 친한 사이', sub: '3라운드', rounds: 3 },
                { emoji: '🤝', label: '동네친구같은 사이', sub: '5라운드', rounds: 5 },
                { emoji: '🔥', label: '가족같은 사이', sub: '10라운드', rounds: 10 },
              ].map((opt) => (
                <button
                  key={opt.rounds}
                  onClick={() => startGame(opt.rounds)}
                  className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-primary hover:shadow-md transition-all text-left"
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{opt.sub}</div>
                  </div>
                  <span className="text-muted-foreground">→</span>
                </button>
              ))}
            </motion.div>
          )}

          {stage === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{step + 1} / {questions.length}</span>
                  <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
                </div>
                <Progress value={((step + 1) / questions.length) * 100} className="h-2" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-6 pt-4"
                >
                  <h2 className="text-xl font-bold text-center leading-snug">
                    {questions[step].q}
                  </h2>

                  <div className="grid grid-cols-2 gap-3">
                    {(['a', 'b'] as const).map((side) => {
                      const opt = questions[step][side];
                      const isSelected = selected === side;
                      const isFaded = selected && !isSelected;
                      return (
                        <motion.button
                          key={side}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => choose(side)}
                          className={`aspect-[3/4] rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-3 transition-all ${
                            isSelected
                              ? 'border-primary bg-gradient-to-br from-[#FF6B6B]/10 to-[#FF8C42]/10 shadow-lg'
                              : isFaded
                              ? 'border-border bg-card opacity-40'
                              : 'border-border bg-card hover:border-primary/50'
                          }`}
                        >
                          <span className="text-5xl">{opt.emoji}</span>
                          <span className="text-sm font-semibold text-center leading-snug">
                            {opt.text}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {stage === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-6 pt-4"
            >
              <div className="bg-gradient-to-br from-[#FF6B6B] to-[#FF8C42] rounded-3xl p-8 text-center text-white">
                <div className="text-7xl mb-3">{result.emoji}</div>
                <h1 className="text-2xl font-bold mb-2">{result.name}</h1>
                <p className="text-sm text-white/90">{result.desc}</p>
              </div>

              <div className="bg-card rounded-2xl p-5 border border-border">
                <h3 className="font-bold mb-3 text-sm">🎁 추천 기프티콘 TOP3</h3>
                <div className="flex flex-col gap-2">
                  {result.items.map((item, i) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                    >
                      <span className="text-lg font-bold text-primary w-6">{i + 1}</span>
                      <span className="font-medium text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={copyLink}
                  variant="outline"
                  className="h-12"
                >
                  🔗 결과 링크 복사하기
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  className="h-12 bg-gradient-to-r from-[#FF6B6B] to-[#FF8C42] hover:opacity-90"
                >
                  기프트랭크에서 더 보기 →
                </Button>
                <Button
                  onClick={() => setStage('intro')}
                  variant="ghost"
                  className="h-10 text-sm text-muted-foreground"
                >
                  다시 해보기
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNavInline />
    </div>
  );
}

function BottomNavInline() {
  const BottomNav = require('@/components/BottomNav').default;
  return <BottomNav activeItem="recommend" />;
    </div>
  );
}
