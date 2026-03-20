import { cn } from "@/lib/utils"

interface WizardStep {
  id: string
  title: string
}

interface WizardProgressProps {
  steps: WizardStep[]
  current: number
}

/**
 * WizardProgress — indicador visual de pasos con círculos numerados.
 */
export function WizardProgress({ steps, current }: WizardProgressProps) {
  return (
    <nav aria-label="Pasos del formulario" className="mb-6">
      <div className="dashboard-soft-surface overflow-x-auto overflow-y-visible rounded-xl border px-2 py-3 sm:px-3">
        <ol className="mx-auto flex min-w-max items-center gap-0 sm:min-w-0">
          {steps.map((step, i) => {
            const isDone = i < current
            const isActive = i === current
            const distance = Math.abs(i - current)

            const sizeClass =
              distance === 0
                ? "w-11 h-11 text-base"
                : distance === 1
                  ? "w-9 h-9 text-sm"
                  : distance === 2
                    ? "w-8 h-8 text-xs"
                    : "w-7 h-7 text-[11px]"

            const liftClass =
              distance === 0
                ? "-translate-y-1"
                : distance === 1
                  ? "translate-y-0"
                  : "translate-y-1"

            const opacityClass = distance >= 3 ? "opacity-60" : "opacity-100"

            return (
              <li
                key={step.id}
                className="flex flex-none items-center py-1 sm:flex-1 sm:last:flex-none"
              >
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-full border-2 font-semibold transition-all duration-300",
                      sizeClass,
                      liftClass,
                      opacityClass,
                      isDone
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : isActive
                          ? "border-primary bg-card text-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.14)] dark:bg-card/95"
                          : "border-border bg-muted text-muted-foreground dark:bg-card/50"
                    )}
                  >
                    {isDone ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "hidden max-w-[80px] text-center text-[10px] leading-tight font-medium transition-all duration-300 sm:block",
                      distance >= 3
                        ? "opacity-40"
                        : distance === 2
                          ? "opacity-70"
                          : "opacity-100",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>

                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 mb-4 h-0.5 w-8 rounded-full transition-all duration-500 sm:w-auto sm:flex-1",
                      i < current ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
