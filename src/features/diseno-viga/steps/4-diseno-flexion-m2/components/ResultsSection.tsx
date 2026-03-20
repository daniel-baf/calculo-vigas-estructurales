import { ResultRow } from "@/components/ui/ResultRow"
import { fmtNumber } from "~/components/flexion/fmtNumber"
import type { DisenoFlexionM2State } from "../useDisenoFlexionM2"

type Props = Pick<DisenoFlexionM2State, "resultado" | "asEtabs">

export function ResultsSection({ resultado, asEtabs }: Props) {
  if (!resultado) return null

  const fmt = (v: number | undefined | null, dec = 2) => fmtNumber(v, dec)

  return (
    <div className="space-y-2">
      <ResultRow
        label="Área de acero propuesta As"
        value={fmt(resultado.asPropuesta)}
        unit="cm²"
        status={resultado.chequeoAsEtabs === "Ok" ? "ok" : "no ok"}
        proceso={resultado.procesos.asPropuesta}
      />
      <ResultRow
        label="Área de acero por ETABS"
        value={fmt(Number(asEtabs))}
        unit="cm²"
      />
      <ResultRow
        label="a"
        value={fmt(resultado.a)}
        unit="cm"
        proceso={resultado.procesos.a}
      />
      <ResultRow
        label="Momento nominal φMn"
        value={fmt(resultado.phiMn)}
        unit="kgf·m"
        proceso={resultado.procesos.phiMn}
      />
      <ResultRow
        label="D/C"
        value={fmt(resultado.dc)}
        status={resultado.chequeo_dc === "Ok" ? "ok" : "no ok"}
        proceso={resultado.procesos.dc}
      />
      <ResultRow
        label="Acero mínimo a flexión As min"
        value={fmt(resultado.asMin)}
        unit="cm²"
        proceso={resultado.procesos.asMin}
      />
      <ResultRow
        label="Acero máximo a flexión As max"
        value={fmt(resultado.asMax)}
        unit="cm²"
        status={resultado.chequeoAsMinMax === "Ok" ? "ok" : "no ok"}
        proceso={resultado.procesos.asMax}
      />
      <ResultRow
        label="c = a/β₁"
        value={fmt(resultado.c)}
        unit="cm"
        proceso={resultado.procesos.c}
      />
      <ResultRow
        label="Chequeo por sección controlada"
        status={resultado.chequeoSeccionControlada === "Ok" ? "ok" : "no ok"}
        proceso={resultado.procesos.chequeoSeccionControlada}
      />
    </div>
  )
}
