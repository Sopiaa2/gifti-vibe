import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useGifticons } from '@/hooks/useGifticons';
import { useWishlist, MAX_WISHLIST } from '@/hooks/useWishlist';
import BottomNav from '@/components/BottomNav';
import SkeletonCards from '@/components/SkeletonCards';

function generateWishId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default function Wish() {
  const navigate = useNavigate();
  const { gifticons, loading } = useGifticons();
  const { ids, add, remove, has, clear } = useWishlist();
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');

  const picked = useMemo(
    () => ids.map((id) => gifticons.find((g) => g.id === id)).filter(Boolean) as typeof gifticons,
    [ids, gifticons]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return gifticons;
    const q = search.toLowerCase();
    return gifticons.filter(
      (g) => g.name.toLowerCase().includes(q) || g.brand.toLowerCase().includes(q)
    );
  }, [gifticons, search]);

  const handleToggle = (id: string) => {
    if (has(id)) {
      remove(id);
    } else {
      if (ids.length >= MAX_WISHLIST) {
        toast(`최대 ${MAX_WISHLIST}개까지 담을 수 있어요`);
        return;
      }
      add(id);
    }
  };

  const handleCreate = async () => {
    if (ids.length === 0) {
      toast('기프티콘을 1개 이상 골라주세요');
      return;
    }
    setCreating(true);
    try {
      const wishId = generateWishId();
      const { error } = await supabase.from('wishlists').insert({
        wish_id: wishId,
        gifticon_ids: ids,
      });
      if (error) throw error;

      // bump wish_count for picked gifticons
      await Promise.all(
        ids.map(async (gid) => {
          const g = gifticons.find((x) => x.id === gid);
          if (!g) return;
          await supabase
            .from('gifticons')
            .update({ wish_count: (g.wish_count || 0) + 1 })
            .eq('id', gid);
        })
      );

      navigate(`/wish/${wishId}`);
    } catch (e) {
      console.error(e);
      toast('링크 생성 실패. 다시 시도해주세요');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-[480px] mx-auto relative">
      <header className="sticky top-0 z-40 bg-card border-b border-border h-14 flex items-center justify-center px-4">
        <h1 className="text-base font-bold">🎁 내 위시리스트</h1>
      </header>

      <div className="px-4 pt-4 pb-2">
        <p className="text-sm text-muted-foreground mb-3">
          받고 싶은 기프티콘을 최대 {MAX_WISHLIST}개까지 골라보세요
        </p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="브랜드 또는 상품명 검색"
          className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm outline-none focus:border-primary"
        />
      </div>

      {/* Picked summary */}
      {picked.length > 0 && (
        <div className="mx-4 mb-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">
              담은 기프티콘 {picked.length}/{MAX_WISHLIST}
            </span>
            <button onClick={clear} className="text-xs text-muted-foreground underline">
              전체 비우기
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {picked.map((g) => (
              <button
                key={g.id}
                onClick={() => remove(g.id)}
                className="flex-shrink-0 flex items-center gap-1 px-2 py-1 bg-card rounded-full border border-border text-xs"
              >
                <span className="truncate max-w-[100px]">{g.name}</span>
                <span className="text-muted-foreground">✕</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      <div className="pb-[200px]">
        {loading ? (
          <SkeletonCards />
        ) : (
          filtered.map((g) => {
            const picked = has(g.id);
            return (
              <div
                key={g.id}
                className="bg-card rounded-2xl shadow-sm mx-4 mb-2 px-4 py-3 flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                  {g.product_image_url ? (
                    <img src={g.product_image_url} alt={g.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">
                      {g.brand.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{g.brand}</p>
                  <p
                    className="text-sm font-semibold overflow-hidden"
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                  >
                    {g.name}
                  </p>
                  <p className="text-xs text-primary font-medium">{g.price.toLocaleString()}원</p>
                </div>
                <button
                  onClick={() => handleToggle(g.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 transition-colors ${
                    picked
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-primary/20'
                  }`}
                  aria-label={picked ? '제거' : '담기'}
                >
                  {picked ? '✓' : '+'}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* CTA */}
      {ids.length > 0 && (
        <div className="fixed bottom-[60px] left-0 right-0 max-w-[480px] mx-auto px-4 pb-3 pt-2 bg-gradient-to-t from-background via-background to-transparent z-40">
          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50"
          >
            {creating ? '링크 생성 중...' : `🔗 내 위시리스트 공유하기 (${ids.length})`}
          </button>
        </div>
      )}

      <BottomNav activeItem="wish" />
    </div>
  );
}
