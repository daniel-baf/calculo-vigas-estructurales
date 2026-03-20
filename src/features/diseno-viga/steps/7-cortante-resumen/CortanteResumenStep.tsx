import { Sparkles } from "lucide-react"

export function CortanteResumenStep() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="h-8 w-8 animate-pulse text-primary" />
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          Paso 6: Cortante y Resumen
        </h2>
        <p className="mx-auto mt-1 max-w-[280px] text-sm text-muted-foreground">
          Aquí se implementará el diseño por cortante y el resumen final del
          proyecto.
        </p>
      </div>
    </div>
  )
}
