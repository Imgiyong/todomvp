export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-surface dark:bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between px-section-padding">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">
            checklist
          </span>
          <h1 className="text-headline-md font-bold text-on-surface dark:text-on-surface">
            My Todo
          </h1>
        </div>
        <button
          type="button"
          className="rounded-full p-2 transition-colors duration-100 hover:bg-surface-container-high active:scale-95 dark:hover:bg-surface-container-high"
          aria-label="더보기"
        >
          <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
        </button>
      </div>
    </header>
  )
}
