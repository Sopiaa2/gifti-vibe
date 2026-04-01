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
        지금 투표하고 순위를 만들어가세요
      </p>
      <p className="text-xs text-primary mt-1 font-medium">
        총 {totalVotes.toLocaleString()}표 집계됨
      </p>
    </div>
  );
}
