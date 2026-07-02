import type { Todo } from '../types/todo'

interface StitchTaskItemProps {
  task: Todo
  onToggle: (id: string) => void
  onDeleteRequest: (id: string) => void
  exiting?: boolean
}

export function StitchTaskItem({
  task,
  onToggle,
  onDeleteRequest,
  exiting = false,
}: StitchTaskItemProps) {
  return (
    <div
      className={`todo-item-exit flex items-center justify-between rounded-xl border p-4 task-card-shadow transition-transform active:scale-[0.99] ${
        task.completed
          ? 'border-outline-variant/10 bg-surface/50 opacity-70'
          : 'border-outline-variant/30 bg-surface-container-lowest'
      } ${exiting ? 'translate-x-5 opacity-0' : ''}`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
            task.completed
              ? 'border-2 border-primary bg-primary'
              : 'border-2 border-outline hover:border-primary'
          }`}
          aria-label={task.completed ? '완료 취소' : '완료'}
        >
          {task.completed && (
            <span
              className="material-symbols-outlined text-[16px] text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check
            </span>
          )}
        </button>
        <span
          className={`text-body-lg ${
            task.completed ? 'text-on-surface-variant line-through' : 'text-on-surface'
          }`}
        >
          {task.text}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onDeleteRequest(task.id)}
        className={`rounded-full p-2 transition-colors hover:bg-error-container/20 ${
          task.completed ? 'text-error/60' : 'text-error'
        }`}
        aria-label="삭제"
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </div>
  )
}
