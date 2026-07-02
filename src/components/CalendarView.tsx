import { useMemo, useState } from 'react'
import type { Todo } from '../types/todo'
import {
  formatMonthYear,
  formatSelectedDate,
  getCalendarCells,
  getWeekdayLabels,
  todayKey,
  toDateKey,
} from '../utils/date'
import { DeleteDialog } from './DeleteDialog'
import { StitchTaskItem } from './StitchTaskItem'

interface CalendarViewProps {
  tasks: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => Promise<boolean> | boolean
}

export function CalendarView({ tasks, onToggle, onDelete }: CalendarViewProps) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(todayKey())
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [exitingId, setExitingId] = useState<string | null>(null)

  const taskDates = useMemo(() => {
    const dates = new Set<string>()
    for (const task of tasks) {
      dates.add(toDateKey(task.createdAt))
    }
    return dates
  }, [tasks])

  const cells = useMemo(
    () => getCalendarCells(viewYear, viewMonth),
    [viewYear, viewMonth],
  )

  const selectedTasks = useMemo(
    () => tasks.filter((task) => toDateKey(task.createdAt) === selectedDate),
    [tasks, selectedDate],
  )

  function shiftMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  async function handleConfirmDelete() {
    if (!deleteTargetId) return

    const id = deleteTargetId
    setDeleteTargetId(null)
    setExitingId(id)

    window.setTimeout(async () => {
      await onDelete(id)
      setExitingId(null)
    }, 200)
  }

  const today = todayKey()

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 task-card-shadow">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low active:scale-95"
            aria-label="이전 달"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h2 className="text-headline-md font-semibold text-on-surface">
            {formatMonthYear(viewYear, viewMonth)}
          </h2>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low active:scale-95"
            aria-label="다음 달"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {getWeekdayLabels().map((label) => (
            <div
              key={label}
              className="py-1 text-center text-label-md text-on-surface-variant"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, index) => {
            if (!cell) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }

            const { day, dateKey } = cell
            const hasTasks = taskDates.has(dateKey)
            const isSelected = selectedDate === dateKey
            const isToday = today === dateKey

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => setSelectedDate(dateKey)}
                className={`flex aspect-square items-center justify-center rounded-full text-body-md transition-all active:scale-95 ${
                  hasTasks
                    ? 'bg-primary font-semibold text-on-primary'
                    : isToday
                      ? 'font-semibold text-primary ring-2 ring-primary'
                      : 'text-on-surface hover:bg-surface-container-low'
                } ${isSelected && !hasTasks ? 'ring-2 ring-primary ring-offset-2' : ''} ${
                  isSelected && hasTasks ? 'ring-2 ring-primary-container ring-offset-2' : ''
                }`}
                aria-label={`${day}일${hasTasks ? ', 할일 있음' : ''}`}
                aria-pressed={isSelected}
              >
                {day}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-body-lg font-semibold text-on-surface">
          {formatSelectedDate(selectedDate)}
        </h3>

        {selectedTasks.length === 0 ? (
          <p className="rounded-xl border border-outline-variant/30 bg-surface-container-low px-4 py-6 text-center text-body-md text-on-surface-variant">
            이 날짜에 등록된 할일이 없습니다.
          </p>
        ) : (
          <div className="space-y-3">
            {selectedTasks.map((task) => (
              <StitchTaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDeleteRequest={setDeleteTargetId}
                exiting={exitingId === task.id}
              />
            ))}
          </div>
        )}
      </section>

      <DeleteDialog
        open={deleteTargetId !== null}
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  )
}
