import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from '@/hooks/useSession';
import { useGifticons } from '@/hooks/useGifticons';
import { useVote } from '@/hooks/useVote';
import Header from '@/components/Header';
import EventBanner from '@/components/EventBanner';

import MainTabs from '@/components/MainTabs';
import CategoryFilter from '@/components/CategoryFilter';
import RankingCard from '@/components/RankingCard';
import SkeletonCards from '@/components/SkeletonCards';
import VoteHistory from '@/components/VoteHistory';
import BottomNav from '@/components/BottomNav';

import EmptyState from '@/components/EmptyState';
import ShareButton from '@/components/ShareButton';
import SuggestButton from '@/components/SuggestButton';
import SuggestionsList from '@/components/SuggestionsList';
import HeartBurst from '@/components/HeartBurst';
import VoteGuide from '@/components/VoteGuide';

export default function Index() {
  const [activeTab, setActiveTab] = useState<'want' | 'bad'>('want');
  const [activeCategory, setActiveCategory] = useState('all');
  const [suggestionsRefreshKey, setSuggestionsRefreshKey] = useState(0);
  const [heartBurstTrigger, setHeartBurstTrigger] = useState(0);

  const handleSuggestionAdded = useCallback(() => {
    setSuggestionsRefreshKey((k) => k + 1);
  }, []);

  const { session, consumeVote, refreshSession } = useSession();
  const { gifticons, categories, loading, participantCount, optimisticVote, revertVote } = useGifticons();
  const { vote, todayVotes, votedIds } = useVote(
    session.sessionId,
    session.remainingWantVotes,
    session.remainingBadVotes,
    consumeVote,
    refreshSession,
    optimisticVote,
    revertVote
  );

  const sortedGifticons = useMemo(() => {
    const filtered = activeCategory === 'all'
      ? [...gifticons]
      : gifticons.filter((g) => g.category_slug === activeCategory);

    filtered.sort((a, b) => {
      const aCount = activeTab === 'want' ? a.vote_count_want : a.vote_count_bad;
      const bCount = activeTab === 'want' ? b.vote_count_want : b.vote_count_bad;
      if (bCount !== aCount) return bCount - aCount;
      return new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime();
    });
    return filtered;
  }, [gifticons, activeCategory, activeTab]);

  const currentRemaining = activeTab === 'want' ? session.remainingWantVotes : session.remainingBadVotes;

  return (
    <div className="min-h-screen bg-background max-w-[480px] mx-auto relative">
      <Header remainingWantVotes={session.remainingWantVotes} remainingBadVotes={session.remainingBadVotes} />

      <EventBanner participantCount={participantCount} />

      <div className="pt-[88px]">
        <MainTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          accentTab={activeTab}
        />

        <VoteGuide />
        <div className="pt-2 pb-[140px]">
          {loading ? (
            <SkeletonCards />
          ) : sortedGifticons.length === 0 ? (
            <EmptyState />
          ) : (
            <AnimatePresence mode="popLayout">
              {sortedGifticons.map((g, i) => (
                <motion.div
                  key={g.id}
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 35, mass: 0.8 }}
                >
                  <RankingCard
                    gifticon={g}
                    rank={i + 1}
                    tab={activeTab}
                    voted={votedIds.has(`${g.id}_${activeTab}`)}
                    canVote={currentRemaining > 0}
                    onVote={() => {
                      vote(g.id, activeTab, g.name, g.brand);
                      if (!votedIds.has(`${g.id}_${activeTab}`) && currentRemaining > 0) {
                        setHeartBurstTrigger((t) => t + 1);
                      }
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          <VoteHistory todayVotes={todayVotes} gifticons={gifticons} activeTab={activeTab} />

          <SuggestionsList sessionId={session.sessionId} refreshKey={suggestionsRefreshKey} />

          {todayVotes.length > 0 && (
            <p className="text-center text-[11px] text-muted-foreground mt-2 mb-4">
              투표 후 순위가 바뀔 수 있어요 ↕️
            </p>
          )}
        </div>
      </div>

      <SuggestButton sessionId={session.sessionId} onSuggestionAdded={handleSuggestionAdded} />
      <ShareButton />
      <HeartBurst trigger={heartBurstTrigger} />
      
      <BottomNav activeItem="home" />
    </div>
  );
}
