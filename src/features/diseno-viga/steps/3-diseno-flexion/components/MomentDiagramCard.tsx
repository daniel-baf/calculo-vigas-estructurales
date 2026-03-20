import { MomentDiagram } from "@/components/charts/MomentDiagram"

interface Props {
  M1: number
  Mcenter: number
  M2: number
}

export function MomentDiagramCard({ M1, Mcenter, M2 }: Props) {
  return (
    <section>
      <h3 className="mb-4 border-b border-primary/10 pb-2 text-sm font-bold tracking-widest text-primary uppercase">
        Diagrama de Momentos
      </h3>
      <div className="rounded-lg border border-border bg-card p-3">
        <MomentDiagram M1={M1} Mcenter={Mcenter} M2={M2} />
        <div className="mt-2 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-red-400 opacity-70" />
            Negativo (hogging)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-indigo-400 opacity-70" />
            Positivo (sagging)
          </span>
        </div>
      </div>
    </section>
  )
}
