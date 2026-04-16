import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

interface HeaderProps {
  remainingWantVotes: number;
  remainingBadVotes: number;
}

function TicketRow({ icon, label, remaining }: { icon: string; label: string; remaining: number }) {
  const statusText =
    remaining === 2
      ? `오늘 2번 투표할 수 있어요`
      : remaining === 1
        ? `오늘 1번 더 투표할 수 있어요`
        : `모두 사용 · 자정에 초기화`;

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs">{icon}</span>
      <span className="text-[11px] font-medium text-card-foreground">{label}</span>
      <div className="flex gap-0.5 ml-1">
        <AnimatePresence mode="popLayout">
          {remaining >= 1 && (
            <motion.span
              key="t1"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
              className="text-sm"
            >🎟️</motion.span>
          )}
          {remaining >= 2 && (
            <motion.span
              key="t2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
              className="text-sm"
            >🎟️</motion.span>
          )}
          {remaining === 0 && (
            <motion.span
              key="t-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm"
            >🎫</motion.span>
          )}
        </AnimatePresence>
      </div>
      <span className="text-[10px] text-muted-foreground ml-auto">{statusText}</span>
    </div>
  );
}

export default function Header({ remainingWantVotes, remainingBadVotes }: HeaderProps) {
  const handleTicketTap = () => {
    const total = remainingWantVotes + remainingBadVotes;
    if (total > 0) {
      toast(`받고싶어요 ${remainingWantVotes}표, 이건쫌 ${remainingBadVotes}표 남았어요 🕛`);
    } else {
      toast('오늘 투표를 모두 사용했어요 · 자정에 초기화 🕛');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card shadow-sm max-w-[480px] mx-auto">
      <div className="h-10 flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-primary">기프트랭크 🎁</h1>
        <button onClick={handleTicketTap} className="min-h-[44px] flex items-center text-xs text-muted-foreground">
          ℹ️
        </button>
      </div>
      <div className="px-4 pb-2 space-y-0.5">
        <TicketRow icon="🏆" label="받고싶어요" remaining={remainingWantVotes} />
        <TicketRow icon="😬" label="이건쫌" remaining={remainingBadVotes} />
      </div>
    </header>
  );
}
