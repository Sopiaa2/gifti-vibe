interface HeaderProps {
  remainingVotes: number;
}

export default function Header({ remainingVotes }: HeaderProps) {
  const tickets = Array.from({ length: 2 }, (_, i) =>
    i < remainingVotes ? '🎟️' : '⬜'
  );

  const handleTicketTap = () => {
    const { toast } = require('sonner');
    toast(`오늘 ${remainingVotes}표 남았어요. 자정에 충전돼요 🕛`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-card shadow-sm flex items-center justify-between px-4 max-w-[480px] mx-auto">
      <h1 className="text-lg font-bold text-primary">기프랭크 🎁</h1>
      <button onClick={handleTicketTap} className="text-xl flex gap-0.5 min-h-[44px] items-center">
        {tickets.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </button>
    </header>
  );
}
