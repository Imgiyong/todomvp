import { useCallback, useEffect, useMemo, useState } from 'react'
import { rowToTodo, supabase, type TodoRow } from '../lib/supabase'
import {
  type CategoryFilter,
  type Todo,
  type TodoCategory,
  type ViewFilter,
} from '../types/todo'

const FILTER_STORAGE_KEY = 'simple_todo_filter'
const CATEGORY_FILTER_STORAGE_KEY = 'simple_todo_category_filter'
const LAST_CATEGORY_STORAGE_KEY = 'simple_todo_last_category'

function loadFilter(): ViewFilter {
  if (typeof window === 'undefined') return 'all'
  const saved = localStorage.getItem(FILTER_STORAGE_KEY)
  if (saved === 'all' || saved === 'active' || saved === 'completed' || saved === 'calendar') {
    return saved
  }
  return 'all'
}

function loadCategoryFilter(): CategoryFilter {
  if (typeof window === 'undefined') return 'all'
  const saved = localStorage.getItem(CATEGORY_FILTER_STORAGE_KEY)
  if (saved === 'all' || saved === 'work' || saved === 'personal' || saved === 'study' || saved === 'hobby') {
    return saved
  }
  return 'all'
}

function loadLastCategory(): TodoCategory {
  if (typeof window === 'undefined') return 'personal'
  const saved = localStorage.getItem(LAST_CATEGORY_STORAGE_KEY)
  if (saved === 'work' || saved === 'personal' || saved === 'study' || saved === 'hobby') return saved
  return 'personal'
}

export function useTodos() {
  const [tasks, setTasks] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewFilter, setViewFilter] = useState<ViewFilter>(() => loadFilter())
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(() => loadCategoryFilter())
  const [lastCategory, setLastCategory] = useState<TodoCategory>(() => loadLastCategory())

  useEffect(() => {
    let cancelled = false

    async function fetchTodos() {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true })

      if (cancelled) return

      if (fetchError) {
        setError(fetchError.message)
        setTasks([])
      } else {
        setTasks((data as TodoRow[]).map(rowToTodo))
      }

      setLoading(false)
    }

    fetchTodos()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(FILTER_STORAGE_KEY, viewFilter)
  }, [viewFilter])

  useEffect(() => {
    localStorage.setItem(CATEGORY_FILTER_STORAGE_KEY, categoryFilter)
  }, [categoryFilter])

  useEffect(() => {
    localStorage.setItem(LAST_CATEGORY_STORAGE_KEY, lastCategory)
  }, [lastCategory])

  const filteredTasks = useMemo(() => {
    let result = tasks

    switch (viewFilter) {
      case 'active':
        result = result.filter((t) => !t.completed)
        break
      case 'completed':
        result = result.filter((t) => t.completed)
        break
      case 'calendar':
        result = result.filter((t) => Boolean(t.dueDate))
        break
    }

    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.category === categoryFilter)
    }

    return result
  }, [tasks, viewFilter, categoryFilter])

  const activeCount = useMemo(
    () =>
      tasks.filter(
        (t) => !t.completed && (categoryFilter === 'all' || t.category === categoryFilter),
      ).length,
    [tasks, categoryFilter],
  )

  const addTask = useCallback(
    async (text: string, category: TodoCategory = lastCategory, dueDate?: string) => {
      const trimmed = text.trim()
      if (!trimmed) return false

      setLastCategory(category)

      const { data, error: insertError } = await supabase
        .from('todos')
        .insert({ text: trimmed, is_done: false })
        .select()
        .single()

      if (insertError || !data) {
        setError(insertError?.message ?? '할 일 추가에 실패했습니다.')
        return false
      }

      const todo = rowToTodo(data as TodoRow)
      setTasks((prev) => [
        ...prev,
        {
          ...todo,
          category,
          dueDate,
        },
      ])
      return true
    },
    [lastCategory],
  )

  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    const nextDone = !task.completed

    const { error: updateError } = await supabase
      .from('todos')
      .update({ is_done: nextDone })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextDone } : t)),
    )
  }, [tasks])

  const deleteTask = useCallback(async (id: string) => {
    const { error: deleteError } = await supabase.from('todos').delete().eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const updateDueDate = useCallback((id: string, dueDate: string | undefined) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, dueDate } : t)),
    )
  }, [])

  const clearCompleted = useCallback(async () => {
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id)
    if (completedIds.length === 0) return

    const { error: deleteError } = await supabase.from('todos').delete().in('id', completedIds)

    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setTasks((prev) => prev.filter((t) => !t.completed))
  }, [tasks])

  const reorderTasks = useCallback((visibleIds: string[], fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return
    if (fromIndex >= visibleIds.length || toIndex >= visibleIds.length) return

    const newOrder = [...visibleIds]
    const [moved] = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, moved)

    setTasks((prev) => {
      const visibleSet = new Set(newOrder)
      const byId = new Map(prev.map((t) => [t.id, t]))
      const queue = [...newOrder]
      return prev.map((task) => {
        if (visibleSet.has(task.id)) {
          const nextId = queue.shift()!
          return byId.get(nextId)!
        }
        return task
      })
    })
  }, [])

  return {
    tasks,
    filteredTasks,
    viewFilter,
    categoryFilter,
    lastCategory,
    activeCount,
    loading,
    error,
    setViewFilter,
    setCategoryFilter,
    addTask,
    toggleTask,
    deleteTask,
    updateDueDate,
    reorderTasks,
    clearCompleted,
  }
}
