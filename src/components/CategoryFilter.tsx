interface CategoryFilterProps {
  categories: { name: string; slug: string; emoji: string }[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  accentTab: 'want' | 'bad';
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  accentTab,
}: CategoryFilterProps) {
  const activeClasses =
    accentTab === 'want'
      ? 'bg-primary text-primary-foreground'
      : 'bg-secondary text-secondary-foreground';

  return (
    <div className="sticky <div className="sticky top-[168px] z-30 bg-background h-10 flex items-center px-4 overflow-x-auto hide-scrollbar gap-2"> z-30 bg-background h-10 flex items-center px-4 overflow-x-auto hide-scrollbar gap-2">
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onCategoryChange(cat.slug)}
          className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors min-h-[28px] ${
            activeCategory === cat.slug
              ? activeClasses
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {cat.emoji} {cat.name}
        </button>
      ))}
    </div>
  );
}
