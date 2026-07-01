export type ViewFilter = 'all' | 'active' | 'completed' | 'calendar'

export type TodoCategory = 'work' | 'personal' | 'study' | 'hobby'

export type CategoryFilter = 'all' | TodoCategory

export interface Todo {
  id: string
  text: string
  completed: boolean
  category: TodoCategory
  dueDate?: string
  subtitle?: string
  subtitleIcon?: 'calendar_today' | 'flag' | 'group'
}

export const TODO_CATEGORIES = [
  { id: 'work' as const, label: '업무', icon: 'work' },
  { id: 'personal' as const, label: '개인', icon: 'person' },
  { id: 'study' as const, label: '학습', icon: 'school' },
  { id: 'hobby' as const, label: '취미', icon: 'interests' },
] as const

export const CATEGORY_STYLES: Record<
  TodoCategory,
  { bg: string; text: string; activeBg: string; activeText: string }
> = {
  work: {
    bg: 'bg-primary-fixed/40',
    text: 'text-on-primary-fixed',
    activeBg: 'bg-primary',
    activeText: 'text-on-primary',
  },
  personal: {
    bg: 'bg-secondary-container/50',
    text: 'text-on-secondary-container',
    activeBg: 'bg-secondary',
    activeText: 'text-on-secondary',
  },
  study: {
    bg: 'bg-surface-container-high',
    text: 'text-on-surface-variant',
    activeBg: 'bg-on-surface-variant',
    activeText: 'text-surface-container-lowest',
  },
  hobby: {
    bg: 'bg-primary-container/25',
    text: 'text-primary-container',
    activeBg: 'bg-primary-container',
    activeText: 'text-on-primary-container',
  },
}

export function normalizeCategory(value: unknown): TodoCategory {
  if (value === 'work' || value === '업무') return 'work'
  if (value === 'personal' || value === '개인') return 'personal'
  if (value === 'study' || value === '학습') return 'study'
  if (value === 'hobby' || value === '취미') return 'hobby'
  return 'personal'
}

export function getCategoryLabel(category: TodoCategory): string {
  return TODO_CATEGORIES.find((c) => c.id === category)?.label ?? '개인'
}
