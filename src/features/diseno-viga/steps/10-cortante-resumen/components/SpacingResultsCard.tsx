interface SpacingResultsCardProps {
  separacionLibre: number
  sEje: number
  qty: number
}

const MIN_CLEAR_SPACING_CM = 2.5

export function SpacingResultsCard({
  separacionLibre,
  sEje,
  qty,
}: SpacingResultsCardProps) {
  const cumpleSeparacion = separacionLibre >= MIN_CLEAR_SPACING_CM

  return (
    <div className="flex flex-col justify-center gap-6 rounded-xl border border-border bg-card p-5 lg:p-8">
      <div>
        <div className="text-sm font-medium text-muted-foreground">
          Separación libre
        </div>
        <div
          className={`mt-1 flex items-baseline gap-2 text-3xl font-bold ${
            cumpleSeparacion ? "text-primary" : "text-destructive"
          }`}
        >
          {separacionLibre.toFixed(2)}
          <span className="text-sm font-medium text-muted-foreground">cm</span>
        </div>
        {!cumpleSeparacion && qty > 1 && (
          <div className="mt-1 text-sm font-medium text-destructive">
            No cumple espacio mínimo ({MIN_CLEAR_SPACING_CM} cm)
          </div>
        )}
      </div>

      <div className="h-px bg-border" />

      <div>
        <div className="text-sm font-medium text-muted-foreground">S a eje</div>
        <div className="mt-1 flex items-baseline gap-2 text-3xl font-bold">
          {sEje.toFixed(2)}
          <span className="text-sm font-medium text-muted-foreground">cm</span>
        </div>
      </div>
    </div>
  )
}
