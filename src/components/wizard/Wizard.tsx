import { useCallback, useEffect, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { WizardProgress } from "./WizardProgress"
import { Button } from "@/components/ui/button"

interface WizardStepDef {
  id: string
  title: string
  component: ReactNode
  isValid: boolean
}

interface WizardProps {
  steps: WizardStepDef[]
  className?: string
  onStepChange?: (index: number) => void
}

interface ShortcutHintProps {
  shortcut: string
  label: string
}

function ShortcutHint({ shortcut, label }: ShortcutHintProps) {
  return (
    <span className="group relative inline-flex items-center">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border text-[10px] text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
        ?
      </span>
      <span className="pointer-events-none absolute top-full right-0 z-20 mt-2 w-max max-w-[220px] rounded-md border border-border bg-popover px-2 py-1 text-[11px] text-popover-foreground opacity-0 shadow-md transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 dark:bg-card">
        {label}:{" "}
        <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
          {shortcut}
        </kbd>
      </span>
    </span>
  )
}

/**
 * Wizard — contenedor genérico de pasos con animaciones CSS.
 */
export function Wizard({ steps, className, onStepChange }: WizardProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")
  const [animKey, setAnimKey] = useState(0)

  const isFirst = current === 0
  const isLast = current === steps.length - 1
  const step = steps[current]

  const navigate = useCallback(
    (nextIndex: number) => {
      setDirection(nextIndex > current ? "forward" : "backward")
      setCurrent(nextIndex)
      setAnimKey((k) => k + 1)
      onStepChange?.(nextIndex)
    },
    [current, onStepChange]
  )

  const canGoBack = !isFirst
  const canGoNext = !isLast && step.isValid

  useEffect(() => {
    function isTypingTarget(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false
      const tag = target.tagName
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable
      )
    }

    function onKeyDown(e: KeyboardEvent) {
      if (!e.ctrlKey || isTypingTarget(e.target)) return

      const key = e.key.toLowerCase()
      if (key === "j" && canGoBack) {
        e.preventDefault()
        navigate(current - 1)
      }

      if (key === "l" && canGoNext) {
        e.preventDefault()
        navigate(current + 1)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [canGoBack, canGoNext, current, navigate])

  function renderNavigation(position: "top" | "bottom") {
    const positionClass =
      position === "top"
        ? "dashboard-soft-surface mb-4 flex items-center justify-between rounded-xl border px-3 py-2 sm:px-4"
        : "dashboard-soft-surface mt-6 flex items-center justify-between rounded-xl border px-3 py-2 sm:px-4"

    return (
      <div className={positionClass}>
        <div className="flex flex-1 items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(current - 1)}
            disabled={!canGoBack}
            title="Ctrl + J"
          >
            ← Anterior
          </Button>
          <ShortcutHint shortcut="Ctrl + J" label="Atajo anterior" />
        </div>

        <span className="px-3 text-xs text-muted-foreground">
          Paso {current + 1} de {steps.length}
        </span>

        <div className="flex flex-1 items-center justify-end gap-2">
          <ShortcutHint
            shortcut="Ctrl + L"
            label={isLast ? "Atajo finalizar" : "Atajo siguiente"}
          />
          <Button
            onClick={() => navigate(current + 1)}
            disabled={!canGoNext}
            title={
              !step.isValid
                ? "Completa todos los campos requeridos"
                : "Ctrl + L"
            }
          >
            {isLast ? "Finalizar" : "Siguiente →"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <WizardProgress steps={steps} current={current} />
      {renderNavigation("top")}

      <div
        key={animKey}
        className={cn(
          "wizard-step",
          direction === "forward"
            ? "wizard-step--forward"
            : "wizard-step--backward"
        )}
      >
        {step.component}
      </div>

      {renderNavigation("bottom")}
    </div>
  )
}
