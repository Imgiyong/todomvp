interface SettingsViewProps {
  darkMode: boolean
  onDarkModeChange: (enabled: boolean) => void
  onClearCompleted: () => void
  onClearAll: () => void
}

export function SettingsView({
  darkMode,
  onDarkModeChange,
  onClearCompleted,
  onClearAll,
}: SettingsViewProps) {
  return (
    <div className="mt-lg flex flex-col gap-gutter">
      <div className="flex items-center justify-between rounded-xl border border-surface-container-high bg-surface-container-lowest p-md shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-md">
          <span className="material-symbols-outlined text-primary-container">dark_mode</span>
          <span className="text-body-lg">다크 모드</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={darkMode}
          onClick={() => onDarkModeChange(!darkMode)}
          className={`relative h-7 w-12 rounded-full transition-colors ${
            darkMode ? 'bg-primary-container' : 'bg-outline-variant'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              darkMode ? 'translate-x-5' : ''
            }`}
          />
        </button>
      </div>

      <div className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-md shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <button
          type="button"
          onClick={onClearCompleted}
          className="flex w-full items-center gap-md text-on-surface"
        >
          <span className="material-symbols-outlined">done_all</span>
          <span className="text-body-lg">완료된 할일 삭제</span>
        </button>
      </div>

      <div className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-md shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <button
          type="button"
          onClick={onClearAll}
          className="flex w-full items-center gap-md text-error"
        >
          <span className="material-symbols-outlined">delete_sweep</span>
          <span className="text-body-lg">모든 할일 삭제</span>
        </button>
      </div>
    </div>
  )
}
