import type { Gifticon } from '@/hooks/useGifticons';

interface VoteRecord {
  gifticon_id: string;
  vote_type: string;
  gifticon_name?: string;
  gifticon_brand?: string;
}

interface VoteHistoryProps {
  todayVotes: VoteRecord[];
  gifticons: Gifticon[];
  activeTab: 'want' | 'bad';
}

export default function VoteHistory({ todayVotes, gifticons, activeTab }: VoteHistoryProps) {
  const maxSlots = 2;

  // Compute current ranks for lookup
  const rankedWant = [...gifticons].sort((a, b) => b.vote_count_want - a.vote_count_want);
  const rankedBad = [...gifticons].sort((a, b) => b.vote_count_bad - a.vote_count_bad);

  function getCurrentRank(gifticonId: string, voteType: string): number | null {
    const list = voteType === 'want' ? rankedWant : rankedBad;
    const idx = list.findIndex((g) => g.id === gifticonId);
    return idx >= 0 ? idx + 1 : null;
  }

  function getPrevRank(gifticonId: string, voteType: string): number | null {
    const g = gifticons.find((g) => g.id === gifticonId);
    if (!g) return null;
    return voteType === 'want' ? g.prev_rank_want : g.prev_rank_bad;
  }

  function getRankChangeEl(currentRank: number | null, prevRank: number | null) {
    if (currentRank === null) return <span className="text-[10px] text-muted-foreground">−</span>;
    if (prevRank === null) return <span className="text-[10px] text-green-500 font-bold">NEW</span>;
    const diff = prevRank - currentRank;
    if (diff > 0) return <span className="text-[10px] text-red-500">▲{diff}</span>;
    if (diff < 0) return <span className="text-[10px] text-blue-500">▼{Math.abs(diff)}</span>;
    return <span className="text-[10px] text-muted-foreground">−</span>;
  }

  // Slot indicators
  const slots = Array.from({ length: maxSlots }, (_, i) => {
    const vote = todayVotes[i];
    if (!vote) return <span key={i} className="w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground/40 text-xs">○</span>;
    const emoji = vote.vote_type === 'want' ? '❤️' : '😱';
    return (
      <span key={i} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
        {emoji}
      </span>
    );
  });

  return (
    <div className="mx-4 mt-6 mb-4">
      <h3 className="text-base font-bold text-card-foreground mb-3">오늘 내 투표 🗳️</h3>

      {/* Slot indicators */}
      <div className="flex items-center gap-2 mb-3">
        {slots}
        <span className="text-[11px] text-muted-foreground ml-1">
          {todayVotes.length}/{maxSlots} 사용
        </span>
      </div>

      {todayVotes.length === 0 ? (
        <div className="bg-card rounded-xl shadow-sm px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">아직 투표하지 않았어요</p>
          <p className="text-xs text-muted-foreground mt-1">위에서 원하는 기프티콘에 투표해보세요! 🗳️</p>
        </div>
      ) : (
        <div className="space-y-2">
          {todayVotes.slice(0, maxSlots).map((v, i) => {
            const currentRank = getCurrentRank(v.gifticon_id, v.vote_type);
            const prevRank = getPrevRank(v.gifticon_id, v.vote_type);
            const tabIcon = v.vote_type === 'want' ? '🏆' : '😬';

            return (
              <div key={i} className="bg-card rounded-xl shadow-sm px-4 py-3 flex items-center gap-3">
                <span className="text-xl">{tabIcon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{v.gifticon_brand}</p>
                  <p className="text-sm font-bold text-card-foreground truncate">{v.gifticon_name}</p>
                  <p className="text-xs text-primary">현재 {currentRank ?? '?'}위</p>
                </div>
                <div className="flex-shrink-0">
                  {getRankChangeEl(currentRank, prevRank)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
