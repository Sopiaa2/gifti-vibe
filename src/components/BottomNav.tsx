import { useNavigate } from 'react-router-dom';

interface BottomNavProps {
  activeItem: string;
}

export default function BottomNav({ activeItem }: BottomNavProps) {
  const navigate = useNavigate();
  const items = [
    { id: 'home', icon: '🏠', label: '홈', path: '/' },
    { id: 'rank', icon: '🏆', label: '순위', path: '/' },
    { id: 'wish', icon: '🎁', label: '위시', path: '/wish' },
    { id: 'my', icon: '👤', label: '마이', path: '/' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-[60px] bg-card border-t border-border flex items-center justify-around max-w-[480px] mx-auto"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.path)}
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
