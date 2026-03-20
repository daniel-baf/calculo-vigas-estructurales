import { cn } from "@/lib/utils"

export interface BarSelectorProps {
  selected: number[]
  onChange: (nos: number[]) => void
}

export function BarSelector({ selected, onChange }: BarSelectorProps) {
  const options = [2, 3, 4, 5, 6, 7, 8]

  const toggle = (n: number) => {
    if (selected.includes(n)) {
      if (selected.length > 1) onChange(selected.filter((x) => x !== n))
    } else {
      onChange([...selected, n].sort((a, b) => a - b))
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => toggle(n)}
          className={cn(
            "flex h-9 w-12 items-center justify-center rounded-md border text-sm font-bold transition-all",
            selected.includes(n)
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-input bg-background text-muted-foreground hover:border-primary hover:text-primary"
          )}
        >
          #{n}
        </button>
      ))}
    </div>
  )
}
