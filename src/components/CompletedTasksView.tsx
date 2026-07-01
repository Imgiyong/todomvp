import type { Todo, TodoCategory } from '../types/todo'
import { TaskItem } from './TaskItem'
import { TodoInput } from './TodoInput'

interface CompletedTasksViewProps {
  tasks: Todo[]
  onAddTask: (text: string, category: TodoCategory, dueDate?: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdateDueDate?: (id: string, dueDate: string | undefined) => void
  reorderTasks: (visibleIds: string[], fromIndex: number, toIndex: number) => void
  onClearAll: () => void
  defaultCategory?: TodoCategory
}

export function CompletedTasksView({
  tasks,
  onAddTask,
  onToggle,
  onDelete,
  onUpdateDueDate,
  onClearAll,
  defaultCategory,
}: CompletedTasksViewProps) {
  return (
    <main className="mx-auto w-full max-w-[800px] px-gutter pt-md pb-32">
      <section className="mb-xl">
        <TodoInput
          onAddTask={onAddTask}
          placeholder="새 할 일을 입력하세요..."
          variant="completed"
          defaultCategory={defaultCategory}
          showDatePicker
        />
      </section>

      <section className="flex flex-col gap-md">
        <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
          <h2 className="text-headline-md font-semibold text-on-surface">완료된 할 일</h2>
          <span className="rounded-full bg-surface-container-high px-3 py-1 text-label-sm text-on-surface-variant">
            {tasks.length}개
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-xl text-center">
            <span className="material-symbols-outlined mb-md text-[80px] text-primary opacity-20 sm:text-[120px]">
              inventory_2
            </span>
            <h3 className="text-headline-md text-on-surface-variant">완료된 할 일이 없습니다</h3>
            <p className="mt-xs text-body-md text-outline">할 일을 완료하면 여기에 표시됩니다.</p>
          </div>
        ) : (
          <>
            <div className="space-y-md">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  variant="completed"
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onUpdateDueDate={onUpdateDueDate}
                />
              ))}
            </div>

            <div className="mt-lg flex justify-center border-t border-surface-variant pt-lg">
              <button
                type="button"
                onClick={onClearAll}
                className="flex items-center gap-sm rounded-full px-6 py-3 text-label-md text-error transition-colors hover:bg-error-container/20 active:scale-95"
              >
                <span className="material-symbols-outlined">delete_sweep</span>
                완료 항목 모두 삭제
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
