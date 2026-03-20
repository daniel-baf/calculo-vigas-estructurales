import { cn } from "@/lib/utils"

export type BadgeVariant = "ok" | "nook" | "na" | "neutral" | "warn"

export function Badge({
  value,
  variant,
}: {
  value: string
  variant: BadgeVariant
}) {
  return (
    <span
      className={cn(
        "rounded px-2 py-0.5 font-mono text-sm font-semibold",
        variant === "ok" &&
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        variant === "nook" &&
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        variant === "na" && "bg-muted-foreground/20 text-muted-foreground",
        variant === "warn" &&
          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        variant === "neutral" && "text-foreground"
      )}
    >
      {value}
    </span>
  )
}
