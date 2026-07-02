import { useRef, useState, type KeyboardEvent } from 'react'

interface StitchTodoInputProps {
  onAddTask: (text: string) => Promise<boolean> | boolean
  variant?: 'default' | 'footer'
  className?: string
}

export function StitchTodoInput({
  onAddTask,
  variant = 'default',
  className = '',
}: StitchTodoInputProps) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const isFooter = variant === 'footer'

  async function submit() {
    const added = await onAddTask(text)
    if (!added) return
    setText('')
    inputRef.current?.focus()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      void submit()
    }
  }

  return (
    <div className={`${isFooter ? '' : 'mb-8'} ${className}`}>
      <div
        className={`flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-1.5 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 ${
          isFooter
            ? 'p-2 shadow-[0px_4px_12px_rgba(0,0,0,0.05)]'
            : 'shadow-sm'
        }`}
      >
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow border-none bg-transparent px-3 py-2 text-body-md text-on-surface placeholder:text-outline focus:ring-0"
          placeholder={isFooter ? '새로운 할일 입력...' : '할 일을 입력하세요'}
          type="text"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => void submit()}
          className={`flex items-center gap-1 rounded-lg bg-primary px-5 py-2 text-label-md text-on-primary transition-all hover:opacity-90 active:scale-95 ${
            isFooter ? 'duration-100' : ''
          }`}
        >
          {isFooter && (
            <span className="material-symbols-outlined text-[18px]">add</span>
          )}
          추가
        </button>
      </div>
    </div>
  )
}
