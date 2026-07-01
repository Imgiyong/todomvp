import type { Todo, TodoCategory } from '../types/todo'
import { TaskItem } from './TaskItem'
import { TodoInput } from './TodoInput'

interface AllTasksViewProps {
  tasks: Todo[]
  activeCount: number
  onAddTask: (text: string, category: TodoCategory, dueDate?: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdateDueDate?: (id: string, dueDate: string | undefined) => void
  reorderTasks: (visibleIds: string[], fromIndex: number, toIndex: number) => void
  defaultCategory?: TodoCategory
}

export function AllTasksView({
  tasks,
  activeCount,
  onAddTask,
  onToggle,
  onDelete,
  onUpdateDueDate,
  defaultCategory,
}: AllTasksViewProps) {
  return (
    <main className="mx-auto min-h-screen max-w-[800px] px-gutter pt-md pb-32">
      <section className="mb-lg">
        <h2 className="hidden text-headline-lg font-bold tracking-tight text-on-surface md:block">
          전체 할 일
        </h2>
        <h2 className="text-headline-lg-mobile font-bold tracking-tight text-on-surface md:hidden">
          전체 할 일
        </h2>
        <p className="mt-base text-body-md text-on-surface-variant">
          해야 할 일을 한곳에서 관리하세요.
        </p>
      </section>

      <TodoInput
        onAddTask={onAddTask}
        placeholder="무엇을 해야 하나요?"
        showEnterHint
        defaultCategory={defaultCategory}
        showDatePicker
      />

      <div className="space-y-sm">
        {tasks.length === 0 ? (
          <div className="py-12 text-center opacity-50">
            <span className="material-symbols-outlined mb-sm text-[48px] text-primary">category</span>
            <p className="text-body-md text-on-surface-variant">이 카테고리에 할 일이 없습니다.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              variant="all"
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdateDueDate={onUpdateDueDate}
            />
          ))
        )}
      </div>

      {tasks.length > 0 && (
        <div className="mt-xl flex flex-col items-center justify-center py-lg opacity-40">
          <span className="material-symbols-outlined mb-sm text-[48px]">assignment</span>
          <p className="text-label-md font-medium">
            오늘 남은 진행 중 할 일 {activeCount}개
          </p>
        </div>
      )}
    </main>
  )
}
