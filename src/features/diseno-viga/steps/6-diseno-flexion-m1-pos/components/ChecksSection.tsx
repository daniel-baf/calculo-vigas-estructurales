import { ResultRow } from "@/components/ui/ResultRow"
import { fmtNumber } from "~/components/flexion/fmtNumber"
import type { M1PosState } from "../useDisenoFlexionM1Pos"

type Props = Pick<M1PosState, "resultado">

export function ChecksSection({ resultado }: Props) {
  if (!resultado) return null

  const fmt = (v: number | undefined | null, dec = 2) => fmtNumber(v, dec)

  return (
    <div className="space-y-2">
      <ResultRow
        label="Área de acero propuesta As"
        value={`${fmt(resultado.asPropuesta)} cm²`}
        status={resultado.cumpleAsMin ? "ok" : "no ok"}
        hint={`Min: ${fmt(resultado.asMin)} cm²`}
      />

      <ResultRow
        label="Profundidad del bloque de compresión (a)"
        value={`${fmt(resultado.a)} cm`}
        proceso={resultado.proceso.a}
      />

      <ResultRow
        label="Momento nominal ϕMn"
        value={`${fmt(resultado.phiMn)} kgf-m`}
        proceso={resultado.proceso.phiMn}
      />

      <ResultRow
        label="Relación Demanda/Capacidad (D/C)"
        value={fmt(resultado.dc)}
        status={resultado.cumpleDC ? "ok" : "no ok"}
        proceso={resultado.proceso.dc}
      />

      <ResultRow
        label="Sección controlada por tensión"
        status={resultado.esSeccionControlada ? "ok" : "no ok"}
        proceso={resultado.proceso.seccionControlada}
      />
    </div>
  )
}
