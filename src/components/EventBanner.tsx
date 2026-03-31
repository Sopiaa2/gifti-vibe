interface BannerProps {
  participantCount: number;
}

export default function EventBanner({ participantCount }: BannerProps) {
  return (
    <div
      className="h-[60px] flex flex-col items-center justify-center text-primary-foreground text-sm"
      style={{ background: 'linear-gradient(135deg, hsl(0 100% 70.6%), hsl(24 100% 63.1%))' }}
    >
      <p className="font-bold">🎉 오픈 기념! 오늘 하루 2표 드려요</p>
      <p className="text-xs opacity-90">
        매일 자정 초기화 · 지금 {participantCount}명 참여중
      </p>
    </div>
  );
}
