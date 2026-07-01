import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react'
import { CATEGORY_STYLES, TODO_CATEGORIES } from '../types/todo'
import type { TodoCategory } from '../types/todo'
import { todayKey } from '../utils/date'

interface TodoInputProps {
  onAddTask: (text: string, category: TodoCategory, dueDate?: string) => void
  placeholder?: string
  variant?: 'default' | 'active' | 'completed' | 'welcome' | 'calendar'
  autoFocus?: boolean
  showEnterHint?: boolean
  showDatePicker?: boolean
  defaultCategory?: TodoCategory
  defaultDueDate?: string
}

function CategoryPicker({
  selected,
  onChange,
  compact = false,
}: {
  selected: TodoCategory
  onChange: (category: TodoCategory) => void
  compact?: boolean
}) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${compact ? '' : 'mt-sm'}`}>
      {TODO_CATEGORIES.map(({ id, label, icon }) => {
        const isSelected = selected === id
        const styles = CATEGORY_STYLES[id]
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-label-sm font-medium transition-all ${
              isSelected
                ? `${styles.activeBg} ${styles.activeText}`
                : `${styles.bg} ${styles.text} opacity-80 hover:opacity-100`
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">{icon}</span>
            {label}
          </button>
        )
      })}
    </div>
  )
}

function DatePicker({
  value,
  onChange,
  enabled,
  onEnabledChange,
}: {
  value: string
  onChange: (date: string) => void
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
}) {
  return (
    <div className="mt-sm flex flex-wrap items-center gap-sm">
      <label className="inline-flex cursor-pointer items-center gap-1.5">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
          className="h-4 w-4 rounded border-outline-variant text-primary accent-primary"
        />
        <span className="text-label-sm font-medium text-on-surface-variant">마감일 설정</span>
      </label>
      {enabled && (
        <>
          <span className="material-symbols-outlined text-[18px] text-outline">calendar_today</span>
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-2 py-1 text-label-sm text-on-surface outline-none focus:border-primary"
          />
        </>
      )}
    </div>
  )
}

export function TodoInput({
  onAddTask,
  placeholder = '무엇을 해야 하나요?',
  variant = 'default',
  autoFocus = false,
  showEnterHint = false,
  showDatePicker = false,
  defaultCategory = 'personal',
  defaultDueDate,
}: TodoInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [category, setCategory] = useState<TodoCategory>(defaultCategory)
  const [dueDateEnabled, setDueDateEnabled] = useState(Boolean(defaultDueDate))
  const [dueDate, setDueDate] = useState(defaultDueDate ?? todayKey())
  const hasText = inputValue.trim().length > 0

  useEffect(() => {
    setCategory(defaultCategory)
  }, [defaultCategory])

  useEffect(() => {
    if (defaultDueDate) {
      setDueDate(defaultDueDate)
      setDueDateEnabled(true)
    }
  }, [defaultDueDate])

  function submitTask() {
    if (!hasText) return
    onAddTask(inputValue, category, dueDateEnabled ? dueDate : undefined)
    setInputValue('')
    if (!defaultDueDate) {
      setDueDateEnabled(false)
      setDueDate(todayKey())
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    submitTask()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitTask()
    }
  }

  const datePicker = showDatePicker ? (
    <DatePicker
      value={dueDate}
      onChange={setDueDate}
      enabled={dueDateEnabled}
      onEnabledChange={setDueDateEnabled}
    />
  ) : null

  if (variant === 'welcome') {
    return (
      <form onSubmit={handleSubmit} className="mb-xl w-full">
        <div className="input-focus-glow group relative transition-all duration-200">
          <div className="pointer-events-none absolute inset-y-0 left-md flex items-center">
            <span className="material-symbols-outlined text-outline">add</span>
          </div>
          <input
            className="w-full rounded-xl border-2 border-outline-variant bg-surface-container-lowest py-4 pl-12 pr-24 text-body-md text-on-surface transition-colors placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-0 sm:pr-md"
            placeholder={placeholder}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="첫 할 일 추가"
            autoFocus={autoFocus}
          />
          {hasText && (
            <button
              type="submit"
              className="absolute inset-y-2 right-2 rounded-lg bg-primary px-3 text-label-sm font-medium text-on-primary transition-opacity hover:opacity-90"
            >
              추가
            </button>
          )}
        </div>
        <CategoryPicker selected={category} onChange={setCategory} />
        {datePicker}
      </form>
    )
  }

  if (variant === 'calendar') {
    return (
      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-surface-container-lowest p-md shadow-[0px_4px_12px_rgba(0,0,0,0.05)]"
      >
        <div className="flex items-center gap-md">
          <span className="material-symbols-outlined shrink-0 text-outline-variant">add_circle</span>
          <input
            className="min-w-0 flex-1 border-none bg-transparent text-body-md outline-none placeholder:text-outline focus:ring-0"
            placeholder={placeholder}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="새 할 일 추가"
          />
          {hasText && (
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-label-sm font-medium text-on-primary transition-opacity hover:opacity-90"
            >
              추가
            </button>
          )}
        </div>
        <CategoryPicker selected={category} onChange={setCategory} compact />
        {datePicker}
      </form>
    )
  }

  if (variant === 'active') {
    return (
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            className="h-14 w-full rounded-xl border border-outline-variant bg-surface-container-lowest pl-14 pr-20 text-body-lg outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:pr-4"
            placeholder={placeholder}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="새 할 일 추가"
          />
          <div className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
            <span className="material-symbols-outlined text-outline">add</span>
          </div>
          {hasText && (
            <button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg bg-primary px-3 py-1.5 text-label-sm font-medium text-on-primary transition-opacity hover:opacity-90"
            >
              추가
            </button>
          )}
        </div>
        <CategoryPicker selected={category} onChange={setCategory} compact />
        {datePicker}
      </form>
    )
  }

  if (variant === 'completed') {
    return (
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            className="ghost-input w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-md py-md pr-20 text-body-md transition-all outline-none focus:border-primary focus:ring-0 sm:pr-24"
            placeholder={placeholder}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="새 할 일 추가"
          />
          <div className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 items-center sm:flex">
            <span className="rounded-md bg-surface-container px-2 py-1 text-label-sm text-outline">
              입력
            </span>
          </div>
          {hasText && (
            <button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg bg-primary px-3 py-1.5 text-label-sm font-medium text-on-primary transition-opacity hover:opacity-90 sm:hidden"
            >
              추가
            </button>
          )}
        </div>
        <CategoryPicker selected={category} onChange={setCategory} compact />
        {datePicker}
      </form>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-xl rounded-xl bg-surface-container-lowest p-md shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center gap-md">
        <span className="material-symbols-outlined shrink-0 text-outline-variant">add_circle</span>
        <input
          className="min-w-0 flex-1 border-none bg-transparent text-body-lg outline-none placeholder:text-outline focus:ring-0"
          placeholder={placeholder}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="새 할 일 추가"
        />
        {hasText && (
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-label-sm font-medium text-on-primary transition-opacity hover:opacity-90"
          >
            추가
          </button>
        )}
      </div>
      <CategoryPicker selected={category} onChange={setCategory} />
      {datePicker}
      {showEnterHint && (
        <p className="mt-sm text-label-sm text-outline sm:hidden">엔터 키로도 추가할 수 있습니다</p>
      )}
    </form>
  )
}
