import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ShareButton() {
  const handleShare = async () => {
    const shareData = {
      title: '기프트랭크 🎁',
      text: '선물하기 전에 꼭 확인하세요! 받고 싶은 기프티콘 실시간 순위',
      url: 'https://gifti-vibe.lovable.app',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast('링크가 복사됐어요! 📋');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="fixed z-[999] w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
      style={{ bottom: 80, right: 16, backgroundColor: '#FF6B6B' }}
      aria-label="공유하기"
    >
      <Share2 className="w-5 h-5 text-white" />
    </button>
  );
}
