import type { ViewFilter } from '../types/todo'

interface HeaderProps {
  viewFilter: ViewFilter
  isEmptyWelcome?: boolean
  onFilterChange: (filter: ViewFilter) => void
}

const DESKTOP_NAV: { id: ViewFilter; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'active', label: '진행 중' },
  { id: 'completed', label: '완료' },
]

export function Header({ viewFilter, isEmptyWelcome = false, onFilterChange }: HeaderProps) {
  const showDesktopTabs = viewFilter === 'completed'

  return (
    <header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center bg-surface px-gutter dark:bg-on-surface">
      <div className="mx-auto flex w-full max-w-[800px] items-center justify-between">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary dark:text-primary-fixed">
            checklist
          </span>
          <h1 className="text-headline-md font-semibold text-primary dark:text-primary-fixed">
            Simple Todo
          </h1>
        </div>

        {showDesktopTabs && (
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-lg md:flex">
            {DESKTOP_NAV.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => onFilterChange(id)}
                className={`text-label-md transition-opacity hover:opacity-80 ${
                  viewFilter === id
                    ? 'font-bold text-primary dark:text-primary-fixed'
                    : 'text-on-surface-variant dark:text-outline-variant'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-md">
          <button
            type="button"
            className="rounded-full p-2 text-on-surface-variant transition-opacity hover:opacity-80 dark:text-outline-variant"
            aria-label="검색"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
          {isEmptyWelcome ? (
            <button
              type="button"
              className="rounded-full p-2 text-on-surface-variant transition-opacity hover:opacity-80 dark:text-outline-variant"
              aria-label="더보기"
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          ) : (
            !showDesktopTabs && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-fixed text-label-md font-bold text-on-primary-fixed">
                나
              </div>
            )
          )}
        </div>
      </div>
    </header>
  )
}
