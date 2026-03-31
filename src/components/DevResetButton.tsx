import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DevResetButtonProps {
  sessionId: string;
}

export default function DevResetButton({ sessionId }: DevResetButtonProps) {
  const handleReset = async () => {
    if (!sessionId) return;

    await supabase.from('votes').delete().eq('session_id', sessionId);
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
