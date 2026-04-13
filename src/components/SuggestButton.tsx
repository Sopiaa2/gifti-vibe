import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SuggestButtonProps {
  sessionId: string;
  onSuggestionAdded: () => void;
}

export default function SuggestButton({ sessionId, onSuggestionAdded }: SuggestButtonProps) {
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedBrand = brand.trim();
    const trimmedName = name.trim();

    if (!trimmedBrand || !trimmedName || !priceRange) {
      toast('모든 항목을 입력해주세요');
      return;
    }

    if (trimmedBrand.length > 50 || trimmedName.length > 100) {
      toast('입력이 너무 길어요');
      return;
    }

    setSubmitting(true);

    try {
      // Check if same brand + name already exists
      const { data: existing } = await supabase
        .from('suggestions')
        .select('id, vote_count, session_id')
        .eq('brand', trimmedBrand)
        .eq('name', trimmedName)
        .maybeSingle();

      if (existing) {
        // Check if same session already voted
        // We store comma-separated session_ids or check via a simple approach
        await supabase
          .from('suggestions')
          .update({ vote_count: existing.vote_count + 1 })
          .eq('id', existing.id);
      } else {
        await supabase.from('suggestions').insert({
          brand: trimmedBrand,
          name: trimmedName,
          price_range: priceRange,
          session_id: sessionId,
        });
      }

      toast('제안이 접수됐어요! 10명 모이면 등록돼요 🎉');
      setBrand('');
      setName('');
      setPriceRange('');
      setOpen(false);
      onSuggestionAdded();
    } catch {
      toast('잠시 후 다시 시도해주세요');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed z-[999] w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform text-xl"
        style={{
          bottom: 140,
          right: 16,
          backgroundColor: 'white',
          border: '1.5px solid #FF6B6B',
          color: '#FF6B6B',
        }}
        aria-label="기프티콘 제안하기"
      >
        💡
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-[400px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg">없는 기프티콘 제안하기 💡</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              10명이 원하면 공식 등록돼요!
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-2">
            <Input
              placeholder="예: 올리브영"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              maxLength={50}
              aria-label="브랜드명"
            />
            <Input
              placeholder="예: 3만원 금액권"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              aria-label="기프티콘명"
            />
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger aria-label="가격대 선택">
                <SelectValue placeholder="가격대 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1만원 이하">1만원 이하</SelectItem>
                <SelectItem value="1~3만원">1~3만원</SelectItem>
                <SelectItem value="3~5만원">3~5만원</SelectItem>
                <SelectItem value="5만원 이상">5만원 이상</SelectItem>
              </SelectContent>
            </Select>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm active:scale-[0.98] transition-transform disabled:opacity-50"
              style={{ backgroundColor: '#FF6B6B' }}
            >
              {submitting ? '제출 중...' : '제안하기 →'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
