import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

interface HeaderProps {
  remainingWantVotes: number;
  remainingBadVotes: number;
}

function TicketDots({ remaining }: { remaining: number }) {
  return (
    <div className="flex gap-0.5">
      <AnimatePresence mode="popLayout">
        {remaining >= 1 && (
          <motion.span
            key="t1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
            className="text-xs"
          >🎟️</motion.span>
        )}
        {remaining >= 2 && (
          <motion.span
            key="t2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
            className="text-xs"
          >🎟️</motion.span>
        )}
        {remaining === 0 && (
          <motion.span
            key="t-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs opacity-50"
          >🎫</motion.span>
        )}
      </AnimatePresence>
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
    <header
      className="fixed top-0 left-0 right-0 z-50 shadow-sm max-w-[480px] mx-auto"
      style={{ background: 'linear-gradient(180deg, hsl(0 80% 95%), hsl(0 0% 100%))' }}
    >
      <div className="h-10 flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-primary">기프트랭크 🎁</h1>
        <button onClick={handleTicketTap} className="min-h-[44px] flex items-center gap-1.5">
          <span className="text-[11px]">🏆</span>
          <TicketDots remaining={remainingWantVotes} />
          <span className="text-[11px] ml-1">😬</span>
          <TicketDots remaining={remainingBadVotes} />
        </button>
      </div>
    </header>
  );
}
