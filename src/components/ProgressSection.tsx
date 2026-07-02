interface ProgressSectionProps {
  progress: number
}

export function ProgressSection({ progress }: ProgressSectionProps) {
  return (
    <div>
      <div className="mb-md flex items-center justify-between">
        <span className="text-label-md font-label-md uppercase tracking-wider text-on-surface-variant">
          Today&apos;s Progress
        </span>
        <span className="text-label-md font-label-md font-bold text-primary">{progress}%</span>
      </div>
      <div className="mb-lg h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
        <div
          className="h-full rounded-full bg-primary-container transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
