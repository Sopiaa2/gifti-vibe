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
  dailyVotesUsed: number;
  dailyVotesLimit: number;
  remainingVotes: number;
  loading: boolean;
}

export function useSession() {
  const [session, setSession] = useState<SessionState>({
    sessionId: '',
    dailyVotesUsed: 0,
    dailyVotesLimit: 2,
    remainingVotes: 2,
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
        is_open_event: true,
        last_vote_date: todayKST,
      });
      setSession({
        sessionId: sid,
        dailyVotesUsed: 0,
        dailyVotesLimit: 2,
        remainingVotes: 2,
        loading: false,
      });
    } else {
      let used = data.daily_votes_used;
      if (data.last_vote_date !== todayKST) {
        used = 0;
        await supabase
          .from('user_sessions')
          .update({ daily_votes_used: 0, last_vote_date: todayKST })
          .eq('session_id', sid);
      }
      setSession({
        sessionId: sid,
        dailyVotesUsed: used,
        dailyVotesLimit: data.daily_votes_limit,
        remainingVotes: data.daily_votes_limit - used,
        loading: false,
      });
    }
  }, []);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const consumeVote = useCallback(async () => {
    const newUsed = session.dailyVotesUsed + 1;
    const todayKST = getKSTDate();
    await supabase
      .from('user_sessions')
      .update({ daily_votes_used: newUsed, last_vote_date: todayKST })
      .eq('session_id', session.sessionId);
    setSession((prev) => ({
      ...prev,
      dailyVotesUsed: newUsed,
      remainingVotes: prev.dailyVotesLimit - newUsed,
    }));
  }, [session.sessionId, session.dailyVotesUsed]);

  return { session, consumeVote, refreshSession: initSession };
}
