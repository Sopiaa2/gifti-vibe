interface BannerProps {
  participantCount: number;
}

export default function EventBanner({ participantCount }: BannerProps) {
  const imageUrl = 'https://raw.githubusercontent.com/Sopiaa2/gifti-vibe/main/public/images/banner-trophy.jpg';

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] max-w-[480px] mx-auto h-[80px] flex items-center px-4"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(255, 107, 107, 0.75), rgba(255, 140, 66, 0.75)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex flex-col justify-center gap-0.5">
        <p
          className="text-white font-bold text-[14px] leading-tight"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
        >
          🎉 오픈 이벤트 진행중
        </p>
        <p
          className="text-white text-[12px] leading-tight"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
        >
          매일 자정 초기화 · {participantCount}명 참여중
        </p>
      </div>
    </div>
  );
}
