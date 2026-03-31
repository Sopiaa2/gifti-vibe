import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/hooks/useSession';
import { useGifticons } from '@/hooks/useGifticons';
import { useVote } from '@/hooks/useVote';
import Header from '@/components/Header';
import EventBanner from '@/components/EventBanner';
import HeroSection from '@/components/HeroSection';
import MainTabs from '@/components/MainTabs';
import CategoryFilter from '@/components/CategoryFilter';
import RankingCard from '@/components/RankingCard';
import SkeletonCards from '@/components/SkeletonCards';
import VoteHistory from '@/components/VoteHistory';
import BottomNav from '@/components/BottomNav';
import EmptyState from '@/components/EmptyState';

export default function Index() {
  const [activeTab, setActiveTab] = useState<'want' | 'bad'>('want');
  const [activeCategory, setActiveCategory] = useState('all');
  const [participantCount, setParticipantCount] = useState(0);

  const { session, consumeVote } = useSession();
  const { gifticons, categories, loading, optimisticVote, revertVote } = useGifticons();
  const { vote, todayVotes, votedIds } = useVote(
    session.sessionId,
    session.remainingVotes,
    consumeVote,
    optimisticVote,
    revertVote
  );

  useEffect(() => {
    supabase
      .from('user_sessions')
      .select('session_id', { count: 'exact', head: true })
      .then(({ count }) => {
        if (count) setParticipantCount(count);
      });
  }, []);

  const totalVotes = useMemo(
    () => gifticons.reduce((sum, g) => sum + g.vote_count_want + g.vote_count_bad, 0),
    [gifticons]
  );

  const sortedGifticons = useMemo(() => {
    const filtered = activeCategory === 'all'
      ? [...gifticons]
      : gifticons.filter((g) => g.category_slug === activeCategory);

    filtered.sort((a, b) =>
      activeTab === 'want'
        ? b.vote_count_want - a.vote_count_want
        : b.vote_count_bad - a.vote_count_bad
    );
    return filtered;
  }, [gifticons, activeCategory, activeTab]);

  return (
    <div className="min-h-screen bg-background max-w-[480px] mx-auto relative">
      <Header remainingVotes={session.remainingVotes} />

      <div className="pt-14">
        <EventBanner participantCount={participantCount} />
        <HeroSection totalVotes={totalVotes} />

        <MainTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          accentTab={activeTab}
        />

        <div className="pt-2 pb-[140px]">
          {loading ? (
            <SkeletonCards />
          ) : sortedGifticons.length === 0 ? (
            <EmptyState />
          ) : (
            sortedGifticons.map((g, i) => (
              <RankingCard
                key={g.id}
                gifticon={g}
                rank={i + 1}
                tab={activeTab}
                voted={votedIds.has(`${g.id}_${activeTab}`)}
                canVote={session.remainingVotes > 0}
                onVote={() => vote(g.id, activeTab, g.name, g.brand)}
              />
            ))
          )}

          <VoteHistory todayVotes={todayVotes} />
        </div>
      </div>

      <BottomNav activeItem="home" />
    </div>
  );
}
