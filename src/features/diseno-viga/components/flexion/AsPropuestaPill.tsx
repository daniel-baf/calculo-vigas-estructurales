import { cn } from "@/lib/utils"

export interface AsPropuestaPillProps {
  cumple: boolean
  menorLabel?: string
  mayorLabel?: string
}

export function AsPropuestaPill({
  cumple,
  menorLabel = "Menor que As propuesta",
  mayorLabel = "Mayor que As propuesta",
}: AsPropuestaPillProps) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase",
        cumple
          ? "border-green-500/20 bg-green-500/10 text-green-600"
          : "border-red-500/20 bg-red-500/10 text-red-600"
      )}
    >
      {cumple ? menorLabel : mayorLabel}
    </span>
  )
}
