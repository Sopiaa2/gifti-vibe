import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

function getKSTDate(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().split('T')[0];
}

function generateUUID(): string {
  return crypto.randomUUID();
}

export interface SessionState {
  sessionId: string;
  wantVotesUsed: number;
  badVotesUsed: number;
  wantVotesLimit: number;
  badVotesLimit: number;
  remainingWantVotes: number;
  remainingBadVotes: number;
  loading: boolean;
}

export function useSession() {
  const [session, setSession] = useState<SessionState>({
    sessionId: '',
    wantVotesUsed: 0,
    badVotesUsed: 0,
    wantVotesLimit: 2,
    badVotesLimit: 2,
    remainingWantVotes: 2,
    remainingBadVotes: 2,
    loading: true,
  });

  const initSession = useCallback(async () => {
    let sid = localStorage.getItem('gifrank_session_id');
    if (!sid) {
      sid = generateUUID();
      localStorage.setItem('gifrank_session_id', sid);
    }

    const { data } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_id', sid)
      .single();

    const todayKST = getKSTDate();

    if (!data) {
      await supabase.from('user_sessions').insert({
        session_id: sid,
        daily_votes_used: 0,
        daily_votes_limit: 2,
        want_votes_used: 0,
        bad_votes_used: 0,
        is_open_event: true,
        last_vote_date: todayKST,
      });
      setSession({
        sessionId: sid,
        wantVotesUsed: 0,
        badVotesUsed: 0,
        wantVotesLimit: 2,
        badVotesLimit: 2,
        remainingWantVotes: 2,
        remainingBadVotes: 2,
        loading: false,
      });
    } else {
      let wantUsed = (data as any).want_votes_used ?? 0;
      let badUsed = (data as any).bad_votes_used ?? 0;
      if (data.last_vote_date !== todayKST) {
        wantUsed = 0;
        badUsed = 0;
        await supabase
          .from('user_sessions')
          .update({ daily_votes_used: 0, want_votes_used: 0, bad_votes_used: 0, last_vote_date: todayKST } as any)
          .eq('session_id', sid);
      }
      const limit = 2;
      setSession({
        sessionId: sid,
        wantVotesUsed: wantUsed,
        badVotesUsed: badUsed,
        wantVotesLimit: limit,
        badVotesLimit: limit,
        remainingWantVotes: limit - wantUsed,
        remainingBadVotes: limit - badUsed,
        loading: false,
      });
    }
  }, []);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const consumeVote = useCallback(async (voteType: 'want' | 'bad') => {
    const todayKST = getKSTDate();
    if (voteType === 'want') {
      const newUsed = session.wantVotesUsed + 1;
      await supabase
        .from('user_sessions')
        .update({ want_votes_used: newUsed, daily_votes_used: session.wantVotesUsed + session.badVotesUsed + 1, last_vote_date: todayKST } as any)
        .eq('session_id', session.sessionId);
      setSession((prev) => ({
        ...prev,
        wantVotesUsed: newUsed,
        remainingWantVotes: prev.wantVotesLimit - newUsed,
      }));
    } else {
      const newUsed = session.badVotesUsed + 1;
      await supabase
        .from('user_sessions')
        .update({ bad_votes_used: newUsed, daily_votes_used: session.wantVotesUsed + session.badVotesUsed + 1, last_vote_date: todayKST } as any)
        .eq('session_id', session.sessionId);
      setSession((prev) => ({
        ...prev,
        badVotesUsed: newUsed,
        remainingBadVotes: prev.badVotesLimit - newUsed,
      }));
    }
  }, [session.sessionId, session.wantVotesUsed, session.badVotesUsed]);

  return { session, consumeVote, refreshSession: initSession };
}
