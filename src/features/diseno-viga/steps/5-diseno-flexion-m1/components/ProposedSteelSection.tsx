import { AlertTriangle } from "lucide-react"
import { RebarRow } from "~/components/flexion/RebarRow"
import type { DisenoFlexionM1State } from "../useDisenoFlexionM1"

type Props = Pick<
  DisenoFlexionM1State,
  | "qty1"
  | "setQty1"
  | "no1"
  | "setNo1"
  | "qty2"
  | "setQty2"
  | "no2"
  | "setNo2"
  | "alertas"
  | "errors"
>

export function ProposedSteelSection(props: Props) {
  const {
    qty1,
    setQty1,
    no1,
    setNo1,
    qty2,
    setQty2,
    no2,
    setNo2,
    alertas,
    errors,
  } = props

  return (
    <div className="space-y-4">
      <RebarRow
        prefix="v1"
        label="Longitudinales"
        qty={qty1}
        no={no1}
        onQtyChange={setQty1}
        onNoChange={setNo1}
        qtyError={errors.qty1}
        noError={errors.no1}
      />

      {alertas.no1Caro && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-900/50 dark:bg-amber-900/20">
          <span className="mt-0.5 text-amber-600 dark:text-amber-400">⚠</span>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            {alertas.no1Caro}
          </p>
        </div>
      )}

      <RebarRow
        prefix="v2"
        label="Transversales"
        qty={qty2}
        no={no2}
        onQtyChange={setQty2}
        onNoChange={setNo2}
        noError={errors.qty2}
        optional
      />

      {no2 === 0 && (
        <div className="flex animate-in items-center gap-2 rounded-md border border-red-100 bg-red-50 px-3 py-2 duration-300 fade-in slide-in-from-top-1 dark:border-red-900/20 dark:bg-red-900/10">
          <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
          <span className="text-[10px] font-bold tracking-wider text-red-700 uppercase dark:text-red-300">
            NO SE RECOMIENDA HACER ESTO: Se prefiere diseño con adicionales
            (transversales)
          </span>
        </div>
      )}

      {alertas.no2Caro && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-900/50 dark:bg-amber-900/20">
          <span className="mt-0.5 text-amber-600 dark:text-amber-400">⚠</span>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            {alertas.no2Caro}
          </p>
        </div>
      )}

      {alertas.diffVarillas && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 dark:border-red-900/50 dark:bg-red-900/20">
          <span className="mt-0.5 text-red-600 dark:text-red-400">⛔</span>
          <p className="text-xs text-red-700 dark:text-red-300">
            {alertas.diffVarillas}
          </p>
        </div>
      )}
    </div>
  )
}
