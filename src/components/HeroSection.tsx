interface HeroProps {
  totalVotes: number;
}

export default function HeroSection({ totalVotes }: HeroProps) {
  return (
    <div className="bg-card py-2 px-4 text-center">
      <p className="text-xs text-muted-foreground">
        선물하기 전에 꼭 확인하세요 👀
      </p>
      <p className="text-[11px] text-muted-foreground/60 mt-0.5">
        총 {totalVotes.toLocaleString()}표 집계됨
      </p>
    </div>
  );
}
