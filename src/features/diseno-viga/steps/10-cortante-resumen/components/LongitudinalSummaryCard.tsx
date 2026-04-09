interface LongitudinalSummaryCardProps {
  minText: string
  leftTop: string
  leftBot: string
  centerBot: string
  rightTop: string
  rightBot: string
}

export function LongitudinalSummaryCard({
  minText,
  leftTop,
  leftBot,
  centerBot,
  rightTop,
  rightBot,
}: LongitudinalSummaryCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="bg-amber-100/50 p-3 text-sm font-semibold tracking-tight text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
        Resumen (NOTA: OBSERVAR EL ARMADO CORRIDO Y QUITARLO DEL RESUMEN)
      </div>

      <div className="divide-y divide-border">
        <div className="grid grid-cols-[1fr_2fr] sm:grid-cols-[1fr_3fr]">
          <div className="bg-muted/50 p-3 text-sm font-medium">
            Armado corrido superior e inferior (minimo)
          </div>
          <div className="p-3 font-semibold text-primary">
            {minText !== "-" ? minText : "Sin acero"}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2fr] sm:grid-cols-[1fr_3fr]">
          <div className="bg-muted/50 p-3 text-sm font-medium">
            Lado izquierdo
          </div>
          <div className="p-3 text-sm">
            <span className="font-medium text-muted-foreground">Superior:</span>
            <span className="font-semibold">{leftTop}</span>
            <span className="mx-2 text-muted-foreground">;</span>
            <span className="font-medium text-muted-foreground">Inferior:</span>
            <span className="font-semibold">{leftBot}</span>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2fr] sm:grid-cols-[1fr_3fr]">
          <div className="bg-muted/50 p-3 text-sm font-medium">Centro</div>
          <div className="p-3 text-sm">
            <span className="font-semibold">{centerBot}</span>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2fr] sm:grid-cols-[1fr_3fr]">
          <div className="bg-muted/50 p-3 text-sm font-medium">
            Lado derecho
          </div>
          <div className="p-3 text-sm">
            <span className="font-medium text-muted-foreground">Superior:</span>
            <span className="font-semibold">{rightTop}</span>
            <span className="mx-2 text-muted-foreground">;</span>
            <span className="font-medium text-muted-foreground">Inferior:</span>
            <span className="font-semibold">{rightBot}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
