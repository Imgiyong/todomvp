import { Header } from './components/Header'
import { BottomNav } from './components/BottomNav'
import { CategoryFilterBar } from './components/CategoryFilterBar'
import { EmptyWelcome } from './components/EmptyWelcome'
import { AllTasksView } from './components/AllTasksView'
import { ActiveTasksView } from './components/ActiveTasksView'
import { CompletedTasksView } from './components/CompletedTasksView'
import { CalendarView } from './components/CalendarView'
import { useTodos } from './hooks/useTodos'
import type { TodoCategory, ViewFilter } from './types/todo'

export default function App() {
  const {
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
  } = useTodos()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-on-surface-variant">
        불러오는 중...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-surface px-4 text-center">
        <p className="text-body-md text-error">데이터를 불러오지 못했습니다.</p>
        <p className="text-body-sm text-on-surface-variant">{error}</p>
      </div>
    )
  }

  const isEmpty = tasks.length === 0
  const showEmptyWelcome = isEmpty && viewFilter === 'all' && categoryFilter === 'all'

  function handleAddTask(
    text: string,
    category: TodoCategory,
    dueDate?: string,
    fromFilter?: ViewFilter,
  ) {
    const added = addTask(text, category, dueDate)
    if (!added) return

    if (fromFilter === 'completed' || viewFilter === 'completed') {
      setViewFilter('all')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <Header
        viewFilter={viewFilter}
        isEmptyWelcome={showEmptyWelcome}
        onFilterChange={setViewFilter}
      />
      {!showEmptyWelcome && (
        <CategoryFilterBar categoryFilter={categoryFilter} onChange={setCategoryFilter} />
      )}

      {showEmptyWelcome ? (
        <EmptyWelcome
          onAddTask={(text, category, dueDate) => handleAddTask(text, category, dueDate)}
          defaultCategory={lastCategory}
        />
      ) : viewFilter === 'calendar' ? (
        <CalendarView
          tasks={filteredTasks}
          onAddTask={(text, category, dueDate) => handleAddTask(text, category, dueDate)}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onUpdateDueDate={updateDueDate}
          reorderTasks={reorderTasks}
          defaultCategory={lastCategory}
        />
      ) : viewFilter === 'all' ? (
        <AllTasksView
          tasks={filteredTasks}
          activeCount={activeCount}
          onAddTask={(text, category, dueDate) => handleAddTask(text, category, dueDate)}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onUpdateDueDate={updateDueDate}
          reorderTasks={reorderTasks}
          defaultCategory={lastCategory}
        />
      ) : viewFilter === 'active' ? (
        <ActiveTasksView
          tasks={filteredTasks}
          onAddTask={(text, category, dueDate) => handleAddTask(text, category, dueDate)}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onUpdateDueDate={updateDueDate}
          reorderTasks={reorderTasks}
          defaultCategory={lastCategory}
        />
      ) : (
        <CompletedTasksView
          tasks={filteredTasks}
          onAddTask={(text, category, dueDate) =>
            handleAddTask(text, category, dueDate, 'completed')
          }
          onToggle={toggleTask}
          onDelete={deleteTask}
          onUpdateDueDate={updateDueDate}
          reorderTasks={reorderTasks}
          onClearAll={clearCompleted}
          defaultCategory={lastCategory}
        />
      )}

      <BottomNav viewFilter={viewFilter} onFilterChange={setViewFilter} />
    </div>
  )
}
