import { useState } from 'react'
import { formatShortDate, getDueDateStatus, todayKey } from '../utils/date'
import type { Todo } from '../types/todo'
import type { SortHandleProps } from './SortableTaskList'
import { CategoryBadge } from './CategoryBadge'

interface TaskItemProps {
  task: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdateDueDate?: (id: string, dueDate: string | undefined) => void
  variant?: 'all' | 'active' | 'completed'
  isFocused?: boolean
  onFocus?: () => void
  sortHandle?: SortHandleProps
}

function CompletionCheckbox({
  completed,
  onToggle,
}: {
  completed: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={completed}
      onClick={onToggle}
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-all ${
        completed
          ? 'checkbox-checked bg-secondary text-on-secondary'
          : 'checkbox-well border-2 border-outline-variant bg-white hover:border-primary hover:bg-primary/5'
      }`}
      aria-label={completed ? '완료 해제' : '완료 표시'}
    >
      {completed && (
        <span
          className="material-symbols-outlined text-[18px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check
        </span>
      )}
    </button>
  )
}

function DueDateBadge({
  task,
  onUpdateDueDate,
}: {
  task: Todo
  onUpdateDueDate?: (id: string, dueDate: string | undefined) => void
}) {
  const [isEditing, setIsEditing] = useState(false)

  if (!onUpdateDueDate) {
    if (!task.dueDate) return null
    const status = getDueDateStatus(task.dueDate)
    return (
      <span
        className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-label-sm ${
          status === 'overdue'
            ? 'bg-error-container text-error'
            : status === 'today'
              ? 'bg-primary-fixed text-on-primary-fixed'
              : 'text-on-surface-variant'
        }`}
      >
        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
        {formatShortDate(task.dueDate)}
        {status === 'overdue' && !task.completed && ' · 지연'}
        {status === 'today' && !task.completed && ' · 오늘'}
      </span>
    )
  }

  if (isEditing) {
    return (
      <div className="inline-flex flex-wrap items-center gap-1.5">
        <label className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant">
          <input
            type="checkbox"
            checked={Boolean(task.dueDate)}
            onChange={(e) => {
              if (e.target.checked) {
                onUpdateDueDate(task.id, todayKey())
              } else {
                onUpdateDueDate(task.id, undefined)
                setIsEditing(false)
              }
            }}
            className="h-3.5 w-3.5 accent-primary"
          />
          마감일
        </label>
        {task.dueDate && (
          <input
            type="date"
            value={task.dueDate}
            onChange={(e) => onUpdateDueDate(task.id, e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="rounded-md border border-outline-variant px-1.5 py-0.5 text-label-sm outline-none focus:border-primary"
          />
        )}
      </div>
    )
  }

  if (!task.dueDate) {
    return (
      <button
        type="button"
        onClick={() => {
          onUpdateDueDate(task.id, todayKey())
          setIsEditing(true)
        }}
        className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-label-sm text-outline transition-colors hover:bg-surface-container hover:text-primary"
      >
        <span className="material-symbols-outlined text-[14px]">event</span>
        마감일 추가
      </button>
    )
  }

  const status = getDueDateStatus(task.dueDate)

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-label-sm transition-colors hover:opacity-80 ${
        task.completed
          ? 'text-on-surface-variant'
          : status === 'overdue'
            ? 'bg-error-container text-error'
            : status === 'today'
              ? 'bg-primary-fixed text-on-primary-fixed'
              : 'bg-surface-container text-on-surface-variant'
      }`}
    >
      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
      {formatShortDate(task.dueDate)}
      {!task.completed && status === 'overdue' && ' · 지연'}
      {!task.completed && status === 'today' && ' · 오늘'}
    </button>
  )
}

function TaskMeta({
  task,
  onUpdateDueDate,
}: {
  task: Todo
  onUpdateDueDate?: (id: string, dueDate: string | undefined) => void
}) {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1.5">
      <CategoryBadge category={task.category} />
      <DueDateBadge task={task} onUpdateDueDate={onUpdateDueDate} />
      {task.completed && (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-secondary/15 px-2 py-0.5 text-label-sm font-medium text-secondary">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          완료
        </span>
      )}
    </div>
  )
}

export function TaskItem({
  task,
  onToggle,
  onDelete,
  onUpdateDueDate,
  variant = 'all',
  isFocused = false,
  onFocus,
  sortHandle,
}: TaskItemProps) {
  if (variant === 'active') {
    return (
      <div
        className={`task-card group flex items-center gap-md rounded-xl bg-surface-container-lowest p-md ${
          isFocused
            ? 'scale-[1.02] shadow-[0px_8px_24px_rgba(0,0,0,0.08)] ring-2 ring-primary ring-offset-2'
            : 'shadow-[0px_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-[0px_8px_24px_rgba(0,0,0,0.08)]'
        }`}
      >
        <CompletionCheckbox completed={task.completed} onToggle={() => onToggle(task.id)} />
        <button
          type="button"
          onClick={onFocus}
          className="min-w-0 flex-1 cursor-pointer text-left"
        >
          <p className="break-words text-body-md font-medium text-on-surface">{task.text}</p>
          <TaskMeta task={task} onUpdateDueDate={onUpdateDueDate} />
        </button>
        {sortHandle ? (
          <div
            role="button"
            tabIndex={0}
            onPointerDown={sortHandle.onPointerDown}
            onPointerMove={sortHandle.onPointerMove}
            onPointerUp={sortHandle.onPointerUp}
            onPointerCancel={sortHandle.onPointerCancel}
            className="drag-handle shrink-0 cursor-grab text-outline-variant active:cursor-grabbing select-none"
            aria-label="드래그하여 순서 변경"
          >
            <span className="material-symbols-outlined pointer-events-none">drag_indicator</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="shrink-0 text-error opacity-100 transition-opacity hover:scale-110 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="할 일 삭제"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        )}
      </div>
    )
  }

  if (variant === 'completed') {
    return (
      <div className="group flex items-center justify-between gap-sm rounded-xl bg-surface-container-lowest p-md shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
        <div className="flex min-w-0 flex-1 items-center gap-md">
          <CompletionCheckbox completed={task.completed} onToggle={() => onToggle(task.id)} />
          <div className="min-w-0 flex-1">
            <span className="task-completed block break-words text-body-lg text-on-surface-variant">
              {task.text}
            </span>
            <div className="opacity-70">
              <TaskMeta task={task} onUpdateDueDate={onUpdateDueDate} />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="shrink-0 rounded-full p-2 text-on-surface-variant opacity-100 transition-opacity hover:bg-surface-container sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="할 일 삭제"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    )
  }

  return (
    <div
      className={`group flex items-center justify-between gap-sm rounded-xl bg-surface-container-lowest p-md shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-all ${
        task.completed ? 'opacity-90' : 'hover:-translate-y-0.5'
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-md">
        <CompletionCheckbox completed={task.completed} onToggle={() => onToggle(task.id)} />
        <div className="min-w-0 flex-1">
          <span
            className={`block break-words text-body-md ${
              task.completed ? 'task-completed text-on-surface-variant' : 'text-on-surface'
            }`}
          >
            {task.text}
          </span>
          <TaskMeta task={task} onUpdateDueDate={onUpdateDueDate} />
        </div>
      </div>
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        className="shrink-0 text-error opacity-100 transition-opacity hover:scale-110 sm:opacity-0 sm:group-hover:opacity-100"
        aria-label="할 일 삭제"
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </div>
  )
}
