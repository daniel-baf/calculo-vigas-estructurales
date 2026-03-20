import { AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
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

      <div
        className={cn(
          "mt-6 flex items-center gap-4 rounded-xl border p-4 transition-all duration-500",
          resultado.cumpleDC
            ? "border-green-500/20 bg-green-500/10 text-green-700"
            : "border-red-500/20 bg-red-500/10 text-red-700"
        )}
      >
        {resultado.cumpleDC ? (
          <>
            <CheckCircle2 className="h-8 w-8 shrink-0" />
            <div>
              <p className="font-bold">Diseño Adecuado</p>
              <p className="text-xs text-balance opacity-80">
                El refuerzo propuesto cumple con la resistencia requerida y el
                armado mínimo sísmico.
              </p>
            </div>
          </>
        ) : (
          <>
            <AlertCircle className="h-8 w-8 shrink-0" />
            <div>
              <p className="font-bold">Ajustar Refuerzo</p>
              <p className="text-xs text-balance opacity-80">
                La capacidad de la sección es insuficiente o no cumple con el
                acero mínimo.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
