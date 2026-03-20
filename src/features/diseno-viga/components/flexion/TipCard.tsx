export function TipCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 dark:border-indigo-900/30 dark:bg-indigo-900/20">
      <span className="text-sm text-indigo-600 dark:text-indigo-400">💡</span>
      <div className="text-xs leading-relaxed text-indigo-700 dark:text-indigo-300">
        {children}
      </div>
    </div>
  )
}
