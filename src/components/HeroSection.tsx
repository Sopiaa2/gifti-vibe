interface HeroProps {
  totalVotes: number;
}

export default function HeroSection({ totalVotes }: HeroProps) {
  return (
    <div className="bg-card py-4 px-4 text-center">
      <p className="text-base font-bold text-card-foreground">
        선물하기 전에 꼭 확인하세요 👀
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        받고 싶은 기프티콘과 피해야 할 기프티콘 실시간 순위
      </p>
      <p className="text-xs text-primary mt-1 font-medium">
        총 {totalVotes.toLocaleString()}표 집계됨
      </p>
    </div>
  );
}
