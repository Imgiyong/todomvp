import type { AppTab } from '../types/todo'

interface BottomNavProps {
  activeTab: AppTab
  onTabChange: (tab: AppTab) => void
  embedded?: boolean
}

const tabs: { id: AppTab; label: string; icon: string }[] = [
  { id: 'tasks', label: '할일', icon: 'list_alt' },
  { id: 'completed', label: '완료', icon: 'check_circle' },
  { id: 'calendar', label: '캘린더', icon: 'calendar_month' },
]

export function BottomNav({ activeTab, onTabChange, embedded = false }: BottomNavProps) {
  return (
    <nav
      className={`flex items-center justify-around px-4 py-2 ${
        embedded
          ? ''
          : 'fixed inset-x-0 bottom-0 z-50 rounded-t-xl bg-surface pb-safe shadow-[0px_-4px_12px_rgba(0,0,0,0.05)] dark:bg-surface'
      }`}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center px-3 py-1 transition-transform duration-150 active:scale-90 ${
              active
                ? 'rounded-full bg-primary-container text-on-primary-container'
                : 'text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined">{tab.icon}</span>
            <span className="text-label-md">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
