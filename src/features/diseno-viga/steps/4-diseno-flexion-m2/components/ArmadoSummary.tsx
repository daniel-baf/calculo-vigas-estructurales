import type { DisenoFlexionM2State } from "../useDisenoFlexionM2"

type Props = Pick<DisenoFlexionM2State, "resultado">

export function ArmadoSummary({ resultado }: Props) {
  if (!resultado) return null

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
      <span className="text-sm font-semibold">Armado superior</span>
      <span className="font-mono text-lg font-bold tracking-wide text-primary">
        {resultado.armadoSuperior}
      </span>
    </div>
  )
}
