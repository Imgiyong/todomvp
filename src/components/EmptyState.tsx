interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = '아직 할일이 없습니다',
  description = '첫 번째 할일을 추가해 보세요',
}: EmptyStateProps) {
  return (
    <div className="relative flex flex-grow flex-col items-center justify-center px-section-padding py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="z-10 max-w-sm space-y-6 text-center">
        <div className="empty-state-bounce">
          <div className="mb-2 inline-flex h-32 w-32 items-center justify-center rounded-full bg-surface-container-high">
            <span className="material-symbols-outlined text-[64px] text-primary">
              list_alt
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-headline-md font-semibold text-on-surface">{title}</h2>
          <p className="text-body-md text-on-surface-variant">{description}</p>
        </div>
      </div>
    </div>
  )
}
