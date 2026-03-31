import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Gifticon {
  id: string;
  name: string;
  brand: string;
  category_slug: string;
  price: number;
  image_url: string | null;
  trend_badge: string | null;
  vote_count_want: number;
  vote_count_bad: number;
  prev_rank_want: number | null;
  prev_rank_bad: number | null;
  updated_at: string;
  created_at: string;
}

export function useGifticons() {
  const [gifticons, setGifticons] = useState<Gifticon[]>([]);
  const [categories, setCategories] = useState<{ name: string; slug: string; emoji: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [gifRes, catRes, sessRes] = await Promise.all([
      supabase.from('gifticons').select('*'),
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('user_sessions').select('session_id', { count: 'exact', head: true }),
    ]);
    if (gifRes.data) setGifticons(gifRes.data);
    if (catRes.data) setCategories(catRes.data);
    setParticipantCount(Math.max(sessRes.count || 0, 1));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('realtime-rankings')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'gifticons' },
        (payload) => {
          const updated = payload.new as Gifticon;
          setGifticons((prev) =>
            prev.map((g) => (g.id === updated.id ? { ...g, ...updated } : g))
          );
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_sessions' },
        () => {
          setParticipantCount((c) => c + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  const optimisticVote = useCallback(
    (gifticonId: string, voteType: 'want' | 'bad') => {
      setGifticons((prev) =>
        prev.map((g) =>
          g.id === gifticonId
            ? {
                ...g,
                vote_count_want: voteType === 'want' ? g.vote_count_want + 1 : g.vote_count_want,
                vote_count_bad: voteType === 'bad' ? g.vote_count_bad + 1 : g.vote_count_bad,
              }
            : g
        )
      );
    },
    []
  );

  const revertVote = useCallback(
    (gifticonId: string, voteType: 'want' | 'bad') => {
      setGifticons((prev) =>
        prev.map((g) =>
          g.id === gifticonId
            ? {
                ...g,
                vote_count_want: voteType === 'want' ? g.vote_count_want - 1 : g.vote_count_want,
                vote_count_bad: voteType === 'bad' ? g.vote_count_bad - 1 : g.vote_count_bad,
              }
            : g
        )
      );
    },
    []
  );

  return { gifticons, categories, loading, participantCount, optimisticVote, revertVote, refetch: fetchData };
}
