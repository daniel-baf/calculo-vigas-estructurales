import { ResultRow } from "@/components/ui/ResultRow"
import type { CargasGravitacionalesState } from "../useCargasGravitacionales"

type Props = Pick<CargasGravitacionalesState, "resultados">

export function ResultsSection({ resultados }: Props) {
  return (
    <section>
      <h3 className="step-block-title">Cálculo de Cargas Gravitacionales</h3>
      <div className="space-y-3">
        <ResultRow
          label="Peso propio de la viga (Wpp)"
          value={resultados?.pesoPropio}
          unit="kgf/m"
          proceso={resultados?.procesos.pesoPropio}
        />
        <ResultRow
          label="Carga Viva (CV)"
          value={resultados?.CV}
          unit="kgf/m"
          proceso={resultados?.procesos.CV}
        />
        <ResultRow
          label="Carga Muerta (CM)"
          value={resultados?.CM}
          unit="kgf/m"
          proceso={resultados?.procesos.CM}
        />
        <ResultRow
          label="Sismo vertical (Svd)"
          value={resultados?.Svd}
          unit="—"
        />
        <ResultRow
          label="Carga mayorada Wu = (1.2 + Svd)×CM + CV"
          value={resultados?.Wu}
          unit="kgf/m"
          highlight
          proceso={resultados?.procesos.Wu}
        />
      </div>
      {!resultados && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Completa los campos para ver los resultados.
        </p>
      )}
    </section>
  )
}
