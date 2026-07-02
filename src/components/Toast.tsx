interface ToastProps {
  message: string | null
}

export function Toast({ message }: ToastProps) {
  const visible = Boolean(message)

  return (
    <div
      className={`fixed bottom-28 left-1/2 z-[60] max-w-[90vw] -translate-x-1/2 rounded-xl bg-on-surface px-4 py-2 text-center text-body-md text-surface shadow-lg transition-all duration-300 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      {message}
    </div>
  )
}
