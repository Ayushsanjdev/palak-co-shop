interface CategoryRailProps {
  categories: string[];
}

// Pure presentation, no state — safe to use as-is. If you later want
// clicking a chip to filter the grid below, that's the same "where does
// filter state live" question flagged in products/page.tsx.
export default function CategoryRail({ categories }: CategoryRailProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {categories.map((c) => (
        <span
          key={c}
          className="whitespace-nowrap border px-4 py-1.5 text-sm"
          style={{ borderColor: "var(--color-line)", borderRadius: "999px" }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}
