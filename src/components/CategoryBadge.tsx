import { CATEGORY_STYLES, getCategoryLabel, TODO_CATEGORIES } from '../types/todo'
import type { TodoCategory } from '../types/todo'

interface CategoryBadgeProps {
  category: TodoCategory
  size?: 'sm' | 'md'
}

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const styles = CATEGORY_STYLES[category]
  const icon = TODO_CATEGORIES.find((c) => c.id === category)?.icon

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full font-medium ${styles.bg} ${styles.text} ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-label-sm'
      }`}
    >
      {icon && (
        <span className="material-symbols-outlined text-[12px]">{icon}</span>
      )}
      {getCategoryLabel(category)}
    </span>
  )
}
