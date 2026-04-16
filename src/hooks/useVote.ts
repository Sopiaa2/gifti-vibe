import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VoteRecord {
  gifticon_id: string;
  vote_type: string;
  gifticon_name?: string;
  gifticon_brand?: string;
}

function getKSTDate(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().split('T')[0];
}

export function useVote(
  sessionId: string,
  remainingWantVotes: number,
  remainingBadVotes: number,
  consumeVote: (voteType: 'want' | 'bad') => Promise<void>,
  refreshSession: () => Promise<void>,
  optimisticVote: (id: string, type: 'want' | 'bad') => void,
  revertVote: (id: string, type: 'want' | 'bad') => void
) {
  const [todayVotes, setTodayVotes] = useState<VoteRecord[]>([]);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const loadTodayVotes = useCallback(async () => {
    if (!sessionId) return;
    const dateStr = getKSTDate();

    const { data } = await supabase
      .from('votes')
      .select('gifticon_id, vote_type')
      .eq('session_id', sessionId)
      .gte('voted_at', `${dateStr}T00:00:00+09:00`);

    if (data) {
      setTodayVotes(data);
      setVotedIds(new Set(data.map((v) => `${v.gifticon_id}_${v.vote_type}`)));
    }
  }, [sessionId]);

  useEffect(() => {
    loadTodayVotes();
  }, [loadTodayVotes]);

  const vote = useCallback(
    async (gifticonId: string, voteType: 'want' | 'bad', name: string, brand: string) => {
      const key = `${gifticonId}_${voteType}`;
      if (votedIds.has(key)) {
        toast('이미 공감했어요!');
        return;
      }

      const remaining = voteType === 'want' ? remainingWantVotes : remainingBadVotes;

      // Re-fetch session from DB to get accurate vote count
      const todayKST = getKSTDate();
      const { data: sessionData } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (!sessionData) return;

      const field = voteType === 'want' ? 'want_votes_used' : 'bad_votes_used';
      let currentUsed = (sessionData as any)[field] ?? 0;

      if (sessionData.last_vote_date !== todayKST) {
        currentUsed = 0;
        await supabase
          .from('user_sessions')
          .update({ daily_votes_used: 0, want_votes_used: 0, bad_votes_used: 0, last_vote_date: todayKST } as any)
          .eq('session_id', sessionId);
      }

      const limit = 2;
      if (currentUsed >= limit) {
        const label = voteType === 'want' ? '받고싶어요' : '별로예요';
        toast(`${label} 투표를 모두 사용했어요 🎟️ 자정에 충전돼요!`);
        await refreshSession();
        return;
      }

      optimisticVote(gifticonId, voteType);
      setVotedIds((prev) => new Set(prev).add(key));
      setTodayVotes((prev) => [...prev, { gifticon_id: gifticonId, vote_type: voteType, gifticon_name: name, gifticon_brand: brand }]);

      try {
        const { error: voteError } = await supabase.from('votes').insert({
          gifticon_id: gifticonId,
          session_id: sessionId,
          vote_type: voteType,
        });
        if (voteError) throw voteError;

        const voteField = voteType === 'want' ? 'vote_count_want' : 'vote_count_bad';
        const { data: current } = await supabase.from('gifticons').select(voteField).eq('id', gifticonId).single();
        if (current) {
          const updateData: Record<string, string | number> = {
            [voteField]: (current as Record<string, number>)[voteField] + 1,
            updated_at: new Date().toISOString(),
          };
          await supabase
            .from('gifticons')
            .update(updateData as any)
            .eq('id', gifticonId);
        }

        await consumeVote(voteType);
        await refreshSession();
        const label = voteType === 'want' ? '받고싶어요' : '별로예요';
        toast(`${label} 투표 완료! 🎟️ 1장 사용`, { duration: 2000 });
      } catch {
        revertVote(gifticonId, voteType);
        setVotedIds((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
        setTodayVotes((prev) => prev.filter((v) => !(v.gifticon_id === gifticonId && v.vote_type === voteType)));
        await refreshSession();
        toast('잠시 후 다시 시도해주세요');
      }
    },
    [sessionId, votedIds, remainingWantVotes, remainingBadVotes, consumeVote, refreshSession, optimisticVote, revertVote]
  );

  return { vote, todayVotes, votedIds };
}
