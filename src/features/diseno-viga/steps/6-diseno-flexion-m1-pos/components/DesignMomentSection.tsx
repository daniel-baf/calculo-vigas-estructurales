import { Info } from "lucide-react"
import { ResultRow } from "@/components/ui/ResultRow"
import { fmtNumber } from "~/components/flexion/fmtNumber"
import type { M1PosState } from "../useDisenoFlexionM1Pos"

type Props = Pick<M1PosState, "resultado">

export function DesignMomentSection({ resultado }: Props) {
  if (!resultado) return null

  const fmt = (v: number | undefined | null, dec = 2) => fmtNumber(v, dec)

  return (
    <div className="space-y-3 rounded-xl bg-muted/30 p-4">
      <ResultRow
        label="Momento sísmico mínimo M1(+)"
        value={`${fmt(resultado.muSismico)} kgf-m`}
        proceso={resultado.proceso.muSismico}
      />
      <ResultRow
        label="Momento de diseño Mu (final)"
        value={`${fmt(resultado.mu)} kgf-m`}
        hint="Max entre sísmico y derivado de ETABS"
      />
      <ResultRow
        label="Área de acero requerida As"
        value={`${fmt(resultado.asReq)} cm²`}
        proceso={resultado.proceso.asReq}
      />
      <div className="flex items-center gap-2 rounded-lg bg-blue-500/5 p-2 text-xs font-medium text-blue-600">
        <Info className="h-4 w-4" />
        <span>
          El momento de diseño se calcula sobre la capacidad negativa phiMn-
          según NSR-10.
        </span>
      </div>
    </div>
  )
}
