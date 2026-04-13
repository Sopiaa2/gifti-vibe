import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface Suggestion {
  id: string;
  brand: string;
  name: string;
  price_range: string;
  vote_count: number;
}

interface SuggestionsListProps {
  sessionId: string;
  refreshKey: number;
}

export default function SuggestionsList({ sessionId, refreshKey }: SuggestionsListProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = useCallback(async () => {
    const { data } = await supabase
      .from('suggestions')
      .select('id, brand, name, price_range, vote_count')
      .order('vote_count', { ascending: false })
      .limit(5);

    if (data) setSuggestions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions, refreshKey]);

  // Load voted suggestion ids from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`suggestion_votes_${sessionId}`);
    if (stored) {
      try {
        setVotedIds(new Set(JSON.parse(stored)));
      } catch { /* ignore */ }
    }
  }, [sessionId]);

  const handleVote = async (suggestion: Suggestion) => {
    if (votedIds.has(suggestion.id)) {
      toast('이미 투표했어요!');
      return;
    }

    // Optimistic
    const newVotedIds = new Set(votedIds).add(suggestion.id);
    setVotedIds(newVotedIds);
    localStorage.setItem(`suggestion_votes_${sessionId}`, JSON.stringify([...newVotedIds]));
    setSuggestions((prev) =>
      prev.map((s) => (s.id === suggestion.id ? { ...s, vote_count: s.vote_count + 1 } : s))
    );

    const { error } = await supabase
      .from('suggestions')
      .update({ vote_count: suggestion.vote_count + 1 })
      .eq('id', suggestion.id);

    if (error) {
      // Revert
      const reverted = new Set(newVotedIds);
      reverted.delete(suggestion.id);
      setVotedIds(reverted);
      localStorage.setItem(`suggestion_votes_${sessionId}`, JSON.stringify([...reverted]));
      setSuggestions((prev) =>
        prev.map((s) => (s.id === suggestion.id ? { ...s, vote_count: s.vote_count - 1 } : s))
      );
      toast('잠시 후 다시 시도해주세요');
    }
  };

  if (loading || suggestions.length === 0) return null;

  return (
    <div className="px-4 mt-6 mb-4">
      <h3 className="text-base font-bold text-foreground mb-1">이런 기프티콘 어때요? 💡</h3>
      <p className="text-xs text-muted-foreground mb-3">사람들이 원하는 기프티콘 제안 목록</p>

      <div className="flex flex-col gap-2">
        {suggestions.map((s) => {
          const progress = Math.min((s.vote_count / 10) * 100, 100);
          const isHot = s.vote_count >= 10;
          const voted = votedIds.has(s.id);

          return (
            <div
              key={s.id}
              className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {s.brand} {s.name}
                  </span>
                  {isHot && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                      🔥 등록 임박
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-muted-foreground">{s.price_range}</span>
                  <span className="text-[11px] text-muted-foreground">·</span>
                  <span className="text-[11px] text-muted-foreground">{s.vote_count}명 원해요</span>
                </div>
                <div className="mt-1.5">
                  <Progress value={progress} className="h-1.5" />
                </div>
              </div>

              <button
                onClick={() => handleVote(s)}
                disabled={voted}
                className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors min-h-[32px]"
                style={{
                  backgroundColor: voted ? '#f3f4f6' : 'white',
                  borderColor: voted ? '#d1d5db' : '#FF6B6B',
                  color: voted ? '#9ca3af' : '#FF6B6B',
                }}
              >
                {voted ? '투표 완료' : '나도 원해요'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
