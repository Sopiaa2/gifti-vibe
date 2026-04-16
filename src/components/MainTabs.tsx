interface MainTabsProps {
  activeTab: 'want' | 'bad';
  onTabChange: (tab: 'want' | 'bad') => void;
}

export default function MainTabs({ activeTab, onTabChange }: MainTabsProps) {
  return (
    <div className="sticky top-[88px] z-40 bg-card flex h-11 border-b border-border">
      <button
        className={`flex-1 text-sm font-semibold transition-colors min-h-[44px] ${
          activeTab === 'want'
            ? 'text-primary border-b-2 border-primary'
            : 'text-muted-foreground'
        }`}
        onClick={() => onTabChange('want')}
      >
        받고싶어요 🏆
      </button>
      <button
        className={`flex-1 text-sm font-semibold transition-colors min-h-[44px] ${
          activeTab === 'bad'
            ? 'text-secondary border-b-2 border-secondary'
            : 'text-muted-foreground'
        }`}
        onClick={() => onTabChange('bad')}
      >
        별로예요 😬
      </button>
    </div>
  );
}
