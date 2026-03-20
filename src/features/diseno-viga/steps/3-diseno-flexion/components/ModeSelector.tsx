import { SegmentedControl } from "@/components/ui/segmented-control"

interface Props {
  value: "manual" | "combinaciones"
  onChange: (v: "manual" | "combinaciones") => void
  onBlockedAttempt: () => void
}

export function ModeSelector({ value, onChange, onBlockedAttempt }: Props) {
  const handleChange = (v: string) => {
    if (v === "combinaciones") {
      onBlockedAttempt()
      return
    }
    onChange(v as typeof value)
  }

  return (
    <div className="mb-4 flex flex-col gap-1.5">
      <label className="text-sm font-medium">Modo de ingreso</label>
      <SegmentedControl
        options={[
          { value: "manual", label: "Manual" },
          { value: "combinaciones", label: "Generar combinaciones" },
        ]}
        value={value}
        onChange={handleChange}
      />
    </div>
  )
}
