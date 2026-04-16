interface BannerProps {
  participantCount: number;
}

export default function EventBanner({ participantCount }: BannerProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] max-w-[480px] mx-auto h-[32px] flex items-center justify-center text-primary-foreground text-[11px] font-medium bg-primary"
    >
      <p>🎉 오픈 이벤트 · 매일 자정 초기화 · {participantCount}명 참여중</p>
    </div>
  );
}
