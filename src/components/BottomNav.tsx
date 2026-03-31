interface BottomNavProps {
  activeItem: string;
}

export default function BottomNav({ activeItem }: BottomNavProps) {
  const items = [
    { id: 'home', icon: '🏠', label: '홈' },
    { id: 'rank', icon: '🏆', label: '순위' },
    { id: 'vote', icon: '🗳️', label: '투표' },
    { id: 'my', icon: '👤', label: '마이' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-[60px] bg-card border-t border-border flex items-center justify-around max-w-[480px] mx-auto"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-xs ${
            activeItem === item.id ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="mt-0.5">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
