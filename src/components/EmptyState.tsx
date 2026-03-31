export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <p className="text-sm text-muted-foreground mb-3">
        아직 이 카테고리엔 기프티콘이 없어요 🥲
      </p>
      <button className="text-sm text-primary font-medium border border-primary rounded-full px-4 py-2 min-h-[44px]">
        + 기프티콘 제안하기
      </button>
    </div>
  );
}
