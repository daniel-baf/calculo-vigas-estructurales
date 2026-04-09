import { ResultRow } from "@/components/ui/ResultRow"
import { fmtNumber } from "~/components/flexion/fmtNumber"
import type { ResultadoMomentoMinimo } from "../diseno-momento-minimo"

interface ResultsSectionProps {
  resultado: ResultadoMomentoMinimo
}

export function ResultsSection({ resultado }: ResultsSectionProps) {
  if (!resultado) return null

  const fmt = (v: number | undefined | null, dec = 2) => fmtNumber(v, dec)

  return (
    <div className="space-y-2">
      <ResultRow
        label="Área de acero propuesto As"
        value={fmt(resultado.asPropuesta)}
        unit="cm²"
        status={resultado.chequeoAsEtabs === "Ok" ? "ok" : "no ok"}
        proceso={resultado.procesos.asPropuesta}
      />
      <ResultRow
        label="Área de acero mín longitudinal"
        value={fmt(resultado.asMin)}
        unit="cm²"
        status={resultado.chequeoAsMinMax === "Ok" ? "ok" : "no ok"}
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
        label="Relación D/C"
        value={fmt(resultado.dc)}
        status={resultado.chequeo_dc === "Ok" ? "ok" : "no ok"}
        proceso={resultado.procesos.dc}
      />
    </div>
  )
}
