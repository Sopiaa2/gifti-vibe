import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

interface HeaderProps {
  remainingVotes: number;
}

export default function Header({ remainingVotes }: HeaderProps) {
  const handleTicketTap = () => {
    if (remainingVotes > 0) {
      toast(`오늘 ${remainingVotes}표 남았어요. 자정에 충전돼요 🕛`);
    } else {
      toast('오늘 투표를 모두 사용했어요 · 자정에 초기화 🕛');
    }
  };

  const statusText =
    remainingVotes === 2
      ? '오늘 2번 투표할 수 있어요'
      : remainingVotes === 1
        ? '오늘 1번 더 투표할 수 있어요'
        : '오늘 투표를 모두 사용했어요 · 자정에 초기화';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card shadow-sm max-w-[480px] mx-auto">
      <div className="h-14 flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-primary">기프트랭크 🎁</h1>
        <button onClick={handleTicketTap} className="flex items-center gap-1 min-h-[44px]">
          <div className="flex gap-0.5">
            <AnimatePresence mode="popLayout">
              {remainingVotes >= 1 && (
                <motion.span
                  key="ticket-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                  className="text-xl"
                >
                  🎟️
                </motion.span>
              )}
              {remainingVotes >= 2 && (
                <motion.span
                  key="ticket-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                  className="text-xl"
                >
                  🎟️
                </motion.span>
              )}
              {remainingVotes === 0 && (
                <motion.span
                  key="ticket-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl"
                >
                  🎫
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </button>
      </div>
      <div className="px-4 pb-2 -mt-1">
        <p className={`text-[11px] text-center ${remainingVotes === 0 ? 'text-muted-foreground' : 'text-primary'}`}>
          {statusText}
        </p>
      </div>
    </header>
  );
}
