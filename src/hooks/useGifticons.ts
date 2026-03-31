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
}

export function useGifticons() {
  const [gifticons, setGifticons] = useState<Gifticon[]>([]);
  const [categories, setCategories] = useState<{ name: string; slug: string; emoji: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [gifRes, catRes] = await Promise.all([
      supabase.from('gifticons').select('*'),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    if (gifRes.data) setGifticons(gifRes.data);
    if (catRes.data) setCategories(catRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
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

  return { gifticons, categories, loading, optimisticVote, revertVote, refetch: fetchData };
}
