import type { TodoCategory } from '../types/todo'
import { TodoInput } from './TodoInput'

interface EmptyWelcomeProps {
  onAddTask: (text: string, category: TodoCategory, dueDate?: string) => void
  defaultCategory?: TodoCategory
}

export function EmptyWelcome({ onAddTask, defaultCategory }: EmptyWelcomeProps) {
  return (
    <main className="mx-auto mb-20 flex w-full max-w-[800px] flex-1 flex-col px-gutter pt-md pb-32">
      <TodoInput
        onAddTask={onAddTask}
        placeholder="오늘의 첫 할 일을 입력해 보세요!"
        variant="welcome"
        autoFocus
        defaultCategory={defaultCategory}
        showDatePicker
      />

      <div className="flex flex-1 flex-col items-center justify-center py-xl">
        <div className="relative mb-lg flex aspect-square w-full max-w-xs items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-secondary-container/20 blur-2xl" />
          <div className="relative z-10 flex h-64 w-64 flex-col items-center justify-center text-primary/40">
            <div
              className="h-full w-full rounded-2xl bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCfCNKwf9W9oSLUkleROC4vZsYpPTq84NdcBIkMrYRZI16bqzffFRXVt50VGaIYAHTbGkilXv3nfhU6StjGkBeqOnFw2Yfip2KStVvWovzE1V8-EEHFDn1spLyZ-Pc8B2T9KoOIcid6s313KH_A_ppxHog9owmz8kmEC-ohDU4ftZtfW15zkWwL5LiUW46YOqV17hcGPLmUc0VSipYMITzgrkHbdsk3fKrH2T89XAXowMq_6CSKDMTGUNigs7DpfP6zImRCK0pDyQ')",
              }}
            />
          </div>
        </div>

        <div className="max-w-md space-y-sm text-center">
          <h2 className="text-headline-lg-mobile text-on-surface md:text-headline-lg">
            아직 할 일이 없습니다
          </h2>
          <p className="px-md text-body-lg text-on-surface-variant">
            깨끗한 상태입니다. 위 입력창에 오늘의 할 일을 적어 보세요.
          </p>
        </div>

        <button
          type="button"
          onClick={() => document.querySelector<HTMLInputElement>('input[aria-label="새 할일"]')?.focus()}
          className="mt-lg rounded-full bg-primary px-lg py-md text-label-md font-medium text-on-primary shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          시작하기
        </button>
      </div>
    </main>
  )
}
