import { BottomNav } from './components/BottomNav'
import { CalendarView } from './components/CalendarView'
import { Header } from './components/Header'
import { StitchTodoInput } from './components/StitchTodoInput'
import { TasksView } from './components/TasksView'
import { Toast } from './components/Toast'
import { useTodos } from './hooks/useTodos'
import { useToast } from './hooks/useToast'

export default function App() {
  const {
    tasks,
    visibleTasks,
    activeTab,
    loading,
    error,
    setTab,
    addTask,
    toggleTask,
    deleteTask,
  } = useTodos()

  const { message, showToast } = useToast()

  const isTasksTab = activeTab === 'tasks'
  const isCalendarTab = activeTab === 'calendar'
  const isEmpty = visibleTasks.length === 0
  const useEmptyLayout = isTasksTab && isEmpty

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-on-surface-variant">
        불러오는 중...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background px-4 text-center">
        <p className="text-body-md text-error">데이터를 불러오지 못했습니다.</p>
        <p className="text-body-md text-on-surface-variant">{error}</p>
      </div>
    )
  }

  async function handleAddTask(text: string) {
    const added = await addTask(text)
    if (added) showToast('할일이 추가되었습니다.')
    return added
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-background">
      <Header />

      <main
        className={`mx-auto flex w-full max-w-2xl flex-grow flex-col px-container-margin pt-4 ${
          useEmptyLayout ? 'overflow-hidden' : 'pb-24'
        }`}
      >
        {isCalendarTab ? (
          <CalendarView
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ) : (
          <>
            {isTasksTab && !isEmpty && (
              <StitchTodoInput onAddTask={handleAddTask} />
            )}

            <TasksView
              tasks={visibleTasks}
              activeTab={activeTab}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          </>
        )}
      </main>

      {useEmptyLayout ? (
        <footer className="w-full space-y-6 bg-surface px-section-padding pt-4 pb-safe">
          <StitchTodoInput variant="footer" onAddTask={handleAddTask} />
          <BottomNav activeTab={activeTab} onTabChange={setTab} embedded />
        </footer>
      ) : (
        <BottomNav activeTab={activeTab} onTabChange={setTab} />
      )}

      <Toast message={message} />
    </div>
  )
}
