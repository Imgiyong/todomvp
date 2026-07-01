import { CATEGORY_STYLES, TODO_CATEGORIES } from '../types/todo'
import type { CategoryFilter } from '../types/todo'

interface CategoryFilterBarProps {
  categoryFilter: CategoryFilter
  onChange: (filter: CategoryFilter) => void
}

const filters: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: '전체' },
  ...TODO_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
]

export function CategoryFilterBar({ categoryFilter, onChange }: CategoryFilterBarProps) {
  return (
    <div className="sticky top-16 z-40 mt-16 border-b border-surface-variant/60 bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto max-w-[800px] px-gutter py-sm">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map(({ id, label }) => {
            const isActive = categoryFilter === id
            const categoryStyle =
              id !== 'all' ? CATEGORY_STYLES[id] : null

            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange(id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-label-sm font-medium transition-all ${
                  isActive
                    ? id === 'all'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : `${categoryStyle!.activeBg} ${categoryStyle!.activeText} shadow-sm`
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
