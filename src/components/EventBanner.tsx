interface BannerProps {
  participantCount: number;
}

export default function EventBanner({ participantCount }: BannerProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] max-w-[480px] mx-auto h-[80px] flex items-center justify-between px-4 overflow-hidden"
      style={{ background: 'linear-gradient(90deg, #FF6B6B, #FF8C42)' }}
    >
      <div className="flex flex-col justify-center gap-0.5 z-10">
        <p className="text-white font-bold text-[14px] leading-tight">🎉 오픈 이벤트 진행중</p>
        <p className="text-white/70 text-[12px] leading-tight">매일 자정 초기화 · {participantCount}명 참여중</p>
      </div>
      <div className="relative h-[60px] flex-shrink-0">
        <div
          className="absolute inset-y-0 left-0 w-8 z-10"
          style={{ background: 'linear-gradient(90deg, #FF8C42, transparent)' }}
        />
        <img
          src="https://raw.githubusercontent.com/Sopiaa2/gifti-vibe/main/public/images/banner-trophy.jpg"
          alt="trophy"
          className="h-[60px] w-auto object-cover rounded-md"
        />
      </div>
    </div>
  );
}
