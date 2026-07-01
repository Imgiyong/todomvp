import { useMemo, useState } from 'react'
import type { Todo, TodoCategory } from '../types/todo'
import { CATEGORY_STYLES } from '../types/todo'
import {
  formatDateLabel,
  formatMonthYear,
  getCalendarDays,
  parseDateKey,
  todayKey,
  WEEKDAY_LABELS,
} from '../utils/date'
import { TaskItem } from './TaskItem'
import { SortableTaskList } from './SortableTaskList'
import { TodoInput } from './TodoInput'

interface CalendarViewProps {
  tasks: Todo[]
  onAddTask: (text: string, category: TodoCategory, dueDate?: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdateDueDate?: (id: string, dueDate: string | undefined) => void
  reorderTasks: (visibleIds: string[], fromIndex: number, toIndex: number) => void
  defaultCategory?: TodoCategory
}

export function CalendarView({
  tasks,
  onAddTask,
  onToggle,
  onDelete,
  onUpdateDueDate,
  reorderTasks,
  defaultCategory,
}: CalendarViewProps) {
  const today = todayKey()
  const [selectedDate, setSelectedDate] = useState(today)
  const [viewDate, setViewDate] = useState(() => parseDateKey(today))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const calendarDays = useMemo(() => getCalendarDays(year, month), [year, month])

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Todo[]>()
    for (const task of tasks) {
      if (!task.dueDate) continue
      const list = map.get(task.dueDate) ?? []
      list.push(task)
      map.set(task.dueDate, list)
    }
    return map
  }, [tasks])

  const selectedTasks = tasksByDate.get(selectedDate) ?? []
  const selectedTaskIds = selectedTasks.map((t) => t.id)

  function handleReorder(fromIndex: number, toIndex: number) {
    reorderTasks(selectedTaskIds, fromIndex, toIndex)
  }

  function goToPrevMonth() {
    setViewDate(new Date(year, month - 1, 1))
  }

  function goToNextMonth() {
    setViewDate(new Date(year, month + 1, 1))
  }

  function goToToday() {
    const now = parseDateKey(todayKey())
    setViewDate(now)
    setSelectedDate(todayKey())
  }

  return (
    <main className="mx-auto max-w-[800px] px-gutter pt-md pb-32">
      <section className="mb-lg">
        <h2 className="text-headline-lg-mobile font-bold text-on-surface md:text-headline-lg">
          캘린더
        </h2>
        <p className="mt-base text-body-md text-on-surface-variant">
          날짜별로 할 일을 확인하고 관리하세요.
        </p>
      </section>

      <div className="mb-lg rounded-xl bg-surface-container-lowest p-md shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">
        <div className="mb-md flex items-center justify-between">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container"
            aria-label="이전 달"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <div className="flex items-center gap-sm">
            <h3 className="text-headline-md font-semibold text-on-surface">
              {formatMonthYear(year, month)}
            </h3>
            <button
              type="button"
              onClick={goToToday}
              className="rounded-full bg-primary-fixed px-2.5 py-1 text-label-sm font-medium text-on-primary-fixed transition-opacity hover:opacity-80"
            >
              오늘
            </button>
          </div>

          <button
            type="button"
            onClick={goToNextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container"
            aria-label="다음 달"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((label, index) => (
            <div
              key={label}
              className={`py-1 text-center text-label-sm font-medium ${
                index === 0 ? 'text-error' : index === 6 ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const dayTasks = tasksByDate.get(day.dateKey) ?? []
            const isSelected = selectedDate === day.dateKey
            const dayOfWeek = day.date.getDay()

            return (
              <button
                key={day.dateKey}
                type="button"
                onClick={() => setSelectedDate(day.dateKey)}
                className={`relative flex min-h-[52px] flex-col items-center rounded-lg p-1 transition-all sm:min-h-[64px] ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-sm'
                    : day.isToday
                      ? 'bg-primary-fixed/50 ring-2 ring-primary ring-inset'
                      : 'hover:bg-surface-container'
                } ${!day.isCurrentMonth ? 'opacity-40' : ''}`}
              >
                <span
                  className={`text-label-sm font-medium ${
                    isSelected
                      ? 'text-on-primary'
                      : dayOfWeek === 0
                        ? 'text-error'
                        : dayOfWeek === 6
                          ? 'text-primary'
                          : 'text-on-surface'
                  }`}
                >
                  {day.date.getDate()}
                </span>

                {dayTasks.length > 0 && (
                  <div className="mt-0.5 flex max-w-full flex-wrap justify-center gap-0.5 px-0.5">
                    {dayTasks.slice(0, 3).map((task) => (
                      <span
                        key={task.id}
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected
                            ? 'bg-on-primary'
                            : task.completed
                              ? 'bg-outline'
                              : CATEGORY_STYLES[task.category].activeBg
                        }`}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <span
                        className={`text-[9px] leading-none ${isSelected ? 'text-on-primary' : 'text-on-surface-variant'}`}
                      >
                        +{dayTasks.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <section className="mb-md">
        <h3 className="mb-sm text-headline-md font-semibold text-on-surface">
          {formatDateLabel(selectedDate)}
        </h3>
        <TodoInput
          onAddTask={onAddTask}
          placeholder="이 날짜에 할 일 추가..."
          variant="calendar"
          defaultCategory={defaultCategory}
          defaultDueDate={selectedDate}
          showDatePicker
        />
      </section>

      <section className="space-y-sm">
        {selectedTasks.length === 0 ? (
          <div className="py-10 text-center opacity-50">
            <span className="material-symbols-outlined mb-sm text-[48px] text-primary">
              event_available
            </span>
            <p className="text-body-md text-on-surface-variant">이 날짜에 예정된 할 일이 없습니다.</p>
          </div>
        ) : (
          <SortableTaskList taskIds={selectedTaskIds} onReorder={handleReorder}>
            {(index) => (
              <TaskItem
                task={selectedTasks[index]}
                variant="all"
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdateDueDate={onUpdateDueDate}
              />
            )}
          </SortableTaskList>
        )}
      </section>
    </main>
  )
}
