import type { Gifticon } from '@/hooks/useGifticons';

interface RankingCardProps {
  gifticon: Gifticon;
  rank: number;
  tab: 'want' | 'bad';
  voted: boolean;
  canVote: boolean;
  onVote: () => void;
}

function TrendBadge({ badge }: { badge: string }) {
  const styles: Record<string, string> = {
    '급상승': 'bg-red-50 text-red-500',
    '신규': 'bg-blue-50 text-blue-500',
    '화제': 'bg-purple-50 text-purple-500',
    '스테디': 'bg-yellow-50 text-yellow-600',
  };
  const icons: Record<string, string> = {
    '급상승': '🔥',
    '신규': '✨',
    '화제': '💬',
    '스테디': '👑',
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${styles[badge] || ''}`}>
      {icons[badge]} {badge}
    </span>
  );
}

function getRankChange(currentRank: number, prevRank: number | null): JSX.Element {
  if (prevRank === null) return <span className="text-[10px] text-green-500 font-bold">NEW</span>;
  const diff = prevRank - currentRank;
  if (diff > 0) return <span className="text-[10px] text-red-500">▲{diff}</span>;
  if (diff < 0) return <span className="text-[10px] text-blue-500">▼{Math.abs(diff)}</span>;
  return <span className="text-[10px] text-muted-foreground">−</span>;
}

export default function RankingCard({ gifticon, rank, tab, voted, canVote, onVote }: RankingCardProps) {
  const voteCount = tab === 'want' ? gifticon.vote_count_want : gifticon.vote_count_bad;
  const prevRank = tab === 'want' ? gifticon.prev_rank_want : gifticon.prev_rank_bad;

  const rankColor =
    rank === 1
      ? 'text-primary text-[28px]'
      : rank === 2
        ? 'text-secondary text-[26px]'
        : rank === 3
          ? 'text-yellow-500 text-[24px]'
          : 'text-muted-foreground text-[20px]';

  const brandInitial = gifticon.brand.charAt(0);

  // Vote button states
  let voteEmoji: string;
  let voteLabel: string;
  let voteStyle: string;

  if (tab === 'want') {
    if (voted) {
      voteEmoji = '❤️';
      voteLabel = '투표완료!';
      voteStyle = 'text-primary';
    } else if (!canVote) {
      voteEmoji = '🤍';
      voteLabel = '내일 가능';
      voteStyle = 'opacity-40 text-muted-foreground';
    } else {
      voteEmoji = '🤍';
      voteLabel = '나도 원해요';
      voteStyle = 'text-muted-foreground';
    }
  } else {
    if (voted) {
      voteEmoji = '😱';
      voteLabel = '공감완료!';
      voteStyle = 'text-secondary';
    } else if (!canVote) {
      voteEmoji = '😬';
      voteLabel = '내일 가능';
      voteStyle = 'opacity-40 text-muted-foreground';
    } else {
      voteEmoji = '😬';
      voteLabel = '나도 그래';
      voteStyle = 'text-muted-foreground';
    }
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm mx-4 mb-2 px-4 py-3 flex items-center gap-3 min-h-[80px] transition-all duration-200">
      {/* Rank */}
      <div className="flex flex-col items-center w-10 flex-shrink-0">
        <span className={`font-bold leading-none ${rankColor}`}>{rank}</span>
        <span className="mt-0.5">{getRankChange(rank, prevRank)}</span>
      </div>

      {/* Brand icon */}
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
        {gifticon.image_url ? (
          <img
            src={gifticon.image_url}
            alt={gifticon.brand}
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <span
          className="text-lg font-bold text-muted-foreground items-center justify-center"
          style={{ display: gifticon.image_url ? 'none' : 'flex' }}
        >
          {brandInitial}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">{gifticon.brand}</span>
          {gifticon.trend_badge && <TrendBadge badge={gifticon.trend_badge} />}
        </div>
        <p className="text-base font-bold text-card-foreground truncate">{gifticon.name}</p>
        <div className="flex items-center gap-1">
          <span className={`text-sm font-medium ${tab === 'want' ? 'text-primary' : 'text-muted-foreground'}`}>
            {gifticon.price.toLocaleString()}원
          </span>
          <span className="text-[11px] text-muted-foreground">
            · {tab === 'want' ? '원하는 사람' : '이건 좀...'}
          </span>
        </div>
      </div>

      {/* Vote */}
      <button
        onClick={onVote}
        disabled={voted || !canVote}
        className={`flex flex-col items-center min-w-[56px] min-h-[44px] justify-center ${voteStyle}`}
      >
        <span className="text-xl">{voteEmoji}</span>
        <span className={`text-xs font-medium ${voted ? '' : ''}`}>{voteCount}</span>
        <span className="text-[10px]">{voteLabel}</span>
      </button>
    </div>
  );
}
