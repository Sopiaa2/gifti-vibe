import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Gifticon } from '@/hooks/useGifticons';

interface RankInfo {
  rank: number;
  total: number;
}

export default function WishView() {
  const { wishId } = useParams<{ wishId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [items, setItems] = useState<Gifticon[]>([]);
  const [rankings, setRankings] = useState<Record<string, RankInfo>>({});

  useEffect(() => {
    async function load() {
      if (!wishId) return;
      setLoading(true);
      const { data: wish, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('wish_id', wishId)
        .maybeSingle();

      if (error || !wish) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // bump view count
      supabase
        .from('wishlists')
        .update({ view_count: (wish.view_count || 0) + 1 })
        .eq('wish_id', wishId)
        .then(() => {});

      const { data: allGifticons } = await supabase.from('gifticons').select('*');
      if (!allGifticons) {
        setLoading(false);
        return;
      }

      // compute "want" rankings overall
      const sortedWant = [...allGifticons].sort(
        (a, b) => b.vote_count_want - a.vote_count_want
      );
      const rankMap: Record<string, RankInfo> = {};
      sortedWant.forEach((g, i) => {
        rankMap[g.id] = { rank: i + 1, total: sortedWant.length };
      });
      setRankings(rankMap);

      const picked = (wish.gifticon_ids as string[])
        .map((id) => allGifticons.find((g) => g.id === id))
        .filter(Boolean) as Gifticon[];
      setItems(picked);
      setLoading(false);
    }
    load();
  }, [wishId]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: '내 위시리스트 🎁', url });
        return;
      } catch {
        // fall through to copy
      }
    }
    await navigator.clipboard.writeText(url);
    toast('링크가 복사되었어요');
  };

  const handleGift = (g: Gifticon) => {
    const query = encodeURIComponent(`${g.brand} ${g.name}`);
    window.open(`https://gift.kakao.com/search/${query}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background max-w-[480px] mx-auto flex items-center justify-center">
        <p className="text-muted-foreground text-sm">불러오는 중...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background max-w-[480px] mx-auto flex flex-col items-center justify-center px-4 gap-4">
        <p className="text-base font-bold">위시리스트를 찾을 수 없어요</p>
        <Link to="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
          기프트랭크로 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-[480px] mx-auto relative pb-32">
      {/* Hero */}
      <div
        className="px-4 py-6 text-white"
        style={{ background: 'linear-gradient(90deg, #FF6B6B, #FF8C42)' }}
      >
        <p className="text-xl font-bold leading-snug">
          이 분이 직접 고른<br />기프티콘이에요 🎁
        </p>
        <p className="text-sm mt-2 opacity-90">실패 없는 선물 보장</p>
      </div>

      {/* Items */}
      <div className="pt-4">
        {items.map((g) => {
          const r = rankings[g.id];
          return (
            <div
              key={g.id}
              className="bg-card rounded-2xl shadow-sm mx-4 mb-3 p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                  {g.product_image_url ? (
                    <img src={g.product_image_url} alt={g.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-muted-foreground">
                      {g.brand.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{g.brand}</p>
                  <p
                    className="text-base font-bold overflow-hidden"
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                  >
                    {g.name}
                  </p>
                  <p className="text-sm font-semibold text-primary mt-0.5">
                    {g.price.toLocaleString()}원
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
                {r && <span>🏆 현재 {r.rank}위</span>}
                <span>·</span>
                <span>{g.wish_count || 0}명이 위시리스트에 담았어요</span>
              </div>
              <button
                onClick={() => handleGift(g)}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
              >
                🎁 선물하기
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="px-4 mt-6 space-y-2">
        <button
          onClick={handleShare}
          className="w-full h-11 rounded-xl border border-border bg-card font-medium text-sm"
        >
          🔗 이 링크 공유하기
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full h-11 rounded-xl bg-secondary/10 text-secondary font-semibold text-sm"
        >
          나도 위시리스트 만들기 →
        </button>
      </div>
    </div>
  );
}
