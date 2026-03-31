interface VoteHistoryProps {
  todayVotes: { gifticon_id: string; vote_type: string; gifticon_name?: string; gifticon_brand?: string }[];
}

export default function VoteHistory({ todayVotes }: VoteHistoryProps) {
  return (
    <div className="mx-4 my-4 p-4 bg-card rounded-2xl shadow-sm">
      <h3 className="text-sm font-bold text-card-foreground mb-2">오늘 내 투표 🗳️</h3>
      {todayVotes.length === 0 ? (
        <p className="text-xs text-muted-foreground">아직 투표하지 않았어요. 위에서 투표해보세요!</p>
      ) : (
        <div className="space-y-1.5">
          {todayVotes.map((v, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-card-foreground">
              <span>{v.vote_type === 'want' ? '🏆' : '😬'}</span>
              <span className="text-muted-foreground">{v.gifticon_brand}</span>
              <span className="font-medium">{v.gifticon_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
