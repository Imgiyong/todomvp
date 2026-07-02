import { getCategoryLabel, type TodoCategory } from '../types/todo'

interface FilterBannerProps {
  category: TodoCategory
  onClear: () => void
}

export function FilterBanner({ category, onClear }: FilterBannerProps) {
  return (
    <div className="mb-sm mt-md flex items-center justify-between rounded-xl bg-primary-fixed/40 px-md py-sm dark:bg-primary-fixed-dim/20">
      <span className="text-body-md text-primary">
        &quot;{getCategoryLabel(category)}&quot; 카테고리
      </span>
      <button
        type="button"
        onClick={onClear}
        className="text-label-md font-semibold text-primary"
      >
        전체 보기
      </button>
    </div>
  )
}
