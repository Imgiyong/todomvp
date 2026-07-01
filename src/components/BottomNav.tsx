import type { ViewFilter } from '../types/todo'

interface BottomNavProps {
  viewFilter: ViewFilter
  onFilterChange: (filter: ViewFilter) => void
}

const tabs: { id: ViewFilter; label: string; icon: string; filled?: boolean }[] = [
  { id: 'all', label: '전체', icon: 'list_alt', filled: true },
  { id: 'active', label: '진행 중', icon: 'radio_button_unchecked' },
  { id: 'completed', label: '완료', icon: 'check_circle', filled: true },
  { id: 'calendar', label: '캘린더', icon: 'calendar_month', filled: true },
]

export function BottomNav({ viewFilter, onFilterChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl bg-surface-container-lowest px-1 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0px_-4px_12px_rgba(0,0,0,0.05)] dark:bg-inverse-surface sm:px-2">
      {tabs.map((tab) => {
        const isActive = viewFilter === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onFilterChange(tab.id)}
            className={`flex min-w-0 flex-1 flex-col items-center justify-center px-1 py-1 transition-all duration-200 sm:px-2 ${
              isActive
                ? 'rounded-full bg-secondary-container text-on-secondary-container dark:bg-on-secondary-fixed-variant dark:text-secondary-fixed'
                : 'text-on-surface-variant hover:text-primary dark:text-outline-variant dark:hover:text-primary-fixed'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${isActive && tab.filled ? 'fill-icon' : ''}`}
              style={isActive && tab.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {tab.icon}
            </span>
            <span className="text-[11px] font-medium sm:text-label-sm">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
