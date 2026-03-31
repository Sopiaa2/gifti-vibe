import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DevResetButtonProps {
  sessionId: string;
}

export default function DevResetButton({ sessionId }: DevResetButtonProps) {
  const handleReset = async () => {
    if (!sessionId) return;

    // 1. Fetch all votes for this session
    const { data: votes } = await supabase
      .from('votes')
      .select('gifticon_id, vote_type')
      .eq('session_id', sessionId);

    // 2. Decrement vote counts for each vote
    if (votes && votes.length > 0) {
      for (const v of votes) {
        const field = v.vote_type === 'want' ? 'vote_count_want' : 'vote_count_bad';
        const { data: current } = await supabase
          .from('gifticons')
          .select(field)
          .eq('id', v.gifticon_id)
          .single();
        if (current) {
          const newVal = Math.max(0, (current as Record<string, number>)[field] - 1);
          await supabase
            .from('gifticons')
            .update({ [field]: newVal })
            .eq('id', v.gifticon_id);
        }
      }
    }

    // 3. Delete votes
    await supabase.from('votes').delete().eq('session_id', sessionId);

    // 4. Reset session
    await supabase
      .from('user_sessions')
      .update({ daily_votes_used: 0, last_vote_date: null })
      .eq('session_id', sessionId);

    toast('투표가 초기화되었어요');
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <button
      onClick={handleReset}
      className="fixed bottom-20 right-4 z-50 bg-muted/70 backdrop-blur-sm text-muted-foreground rounded-full px-3 py-1.5 shadow-sm flex items-center gap-1"
    >
      <span className="text-[11px]">🔄 초기화</span>
      <span className="text-[9px] bg-muted-foreground/20 rounded px-1">DEV</span>
    </button>
  );
}
