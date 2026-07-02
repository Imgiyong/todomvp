import type { TodoCategory } from '../types/todo'

interface CategoryCount {
  id: TodoCategory
  label: string
  total: number
  done: number
}

interface CategoriesViewProps {
  categories: CategoryCount[]
  onSelectCategory: (category: TodoCategory) => void
}

export function CategoriesView({ categories, onSelectCategory }: CategoriesViewProps) {
  return (
    <div className="mt-lg flex flex-col gap-gutter">
      {categories.map(({ id, label, total, done }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelectCategory(id)}
          className="flex w-full items-center justify-between rounded-xl border border-surface-container-high bg-surface-container-lowest p-md text-left shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-colors hover:border-primary-container"
        >
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-primary-container">folder</span>
            <div>
              <p className="text-body-lg text-on-surface">{label}</p>
              <p className="text-body-md text-outline">
                {done}/{total} 완료
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline">chevron_right</span>
        </button>
      ))}
    </div>
  )
}
