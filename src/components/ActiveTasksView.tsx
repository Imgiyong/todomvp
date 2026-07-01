import { useRef, useState } from 'react'
import type { Todo, TodoCategory } from '../types/todo'
import { SortableTaskList } from './SortableTaskList'
import { TaskItem } from './TaskItem'
import { TodoInput } from './TodoInput'

interface ActiveTasksViewProps {
  tasks: Todo[]
  onAddTask: (text: string, category: TodoCategory, dueDate?: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdateDueDate?: (id: string, dueDate: string | undefined) => void
  reorderTasks: (visibleIds: string[], fromIndex: number, toIndex: number) => void
  defaultCategory?: TodoCategory
}

export function ActiveTasksView({
  tasks,
  onAddTask,
  onToggle,
  onDelete,
  onUpdateDueDate,
  reorderTasks,
  defaultCategory,
}: ActiveTasksViewProps) {
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const taskIds = tasks.map((t) => t.id)

  function handleReorder(fromIndex: number, toIndex: number) {
    reorderTasks(taskIds, fromIndex, toIndex)
  }

  return (
    <>
      <main className="mx-auto max-w-[800px] px-gutter pt-md pb-32">
        <section className="mb-xl">
          <h2 className="mb-md text-headline-lg-mobile font-bold text-on-surface md:text-headline-lg">
            진행 중인 할 일
          </h2>
          <div ref={inputRef}>
            <TodoInput
              onAddTask={onAddTask}
              placeholder="중요한 할 일을 추가하세요..."
              variant="active"
              defaultCategory={defaultCategory}
              showDatePicker
            />
          </div>
        </section>

        <section>
          {tasks.length === 0 ? (
            <div className="py-12 text-center opacity-40 select-none">
              <span className="material-symbols-outlined text-[64px] text-primary">
                pending_actions
              </span>
              <p className="mt-md text-body-lg">진행 중인 할 일에 집중하세요</p>
            </div>
          ) : (
            <SortableTaskList
              taskIds={taskIds}
              onReorder={handleReorder}
              className="space-y-md"
              layout="inline"
            >
              {(index, sort) => {
                const task = tasks[index]
                const isFocused = focusedId === task.id || (focusedId === null && index === 0)
                return (
                  <TaskItem
                    task={task}
                    variant="active"
                    isFocused={isFocused}
                    onFocus={() => setFocusedId(task.id)}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onUpdateDueDate={onUpdateDueDate}
                    sortHandle={sort}
                  />
                )
              }}
            </SortableTaskList>
          )}
        </section>
      </main>

      <button
        type="button"
        onClick={() => inputRef.current?.querySelector('input')?.focus()}
        className="fixed right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-lg transition-all duration-150 hover:scale-105 active:scale-95 sm:right-6"
        aria-label="할 일 추가"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
    </>
  )
}
