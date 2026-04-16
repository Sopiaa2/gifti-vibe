interface BannerProps {
  participantCount: number;
}

export default function EventBanner({ participantCount }: BannerProps) {
  return (
    <div
      className="h-[32px] flex items-center justify-center text-primary-foreground text-[11px]"
      style={{ background: 'linear-gradient(135deg, hsl(0 100% 70.6%), hsl(24 100% 63.1%))' }}
    >
      <p>🎉 오픈 이벤트 진행중 · 매일 자정 초기화 · 지금 {participantCount}명 참여중</p>
    </div>
  );
}
