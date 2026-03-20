export function SignConventionNotice() {
  return (
    <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-900/50 dark:bg-amber-900/20">
      <span className="mt-0.5 text-amber-600 dark:text-amber-400">⚠</span>
      <p className="text-xs text-amber-700 dark:text-amber-300">
        <strong>Convención de signos:</strong> M1 y M2 son momentos negativos
        (hogging). Ingresa el valor
        <strong> positivo</strong> — el sistema aplicará el signo negativo
        internamente.
      </p>
    </div>
  )
}
