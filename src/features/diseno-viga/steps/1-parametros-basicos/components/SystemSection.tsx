import { SegmentedControl } from "@/components/ui/segmented-control"
import type { ParametrosBasicosState } from "../useParametrosBasicos"

interface Props {
  portico: ParametrosBasicosState["portico"]
  setPortico: ParametrosBasicosState["setPortico"]
  TIPOS_PORTICO: ParametrosBasicosState["TIPOS_PORTICO"]
}

export function SystemSection({ portico, setPortico, TIPOS_PORTICO }: Props) {
  const porticoOptions = TIPOS_PORTICO.map((p) => ({
    value: p.value,
    label: p.label,
  }))
  const porticoActual = TIPOS_PORTICO.find((p) => p.value === portico)

  return (
    <section>
      <h3 className="mb-4 border-b border-primary/10 pb-2 text-sm font-bold tracking-widest text-primary uppercase">
        Sistema Estructural
      </h3>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm leading-none font-medium">Pórtico</label>
        <SegmentedControl
          options={porticoOptions}
          value={portico}
          onChange={setPortico}
        />
        {porticoActual && (
          <p className="text-sm font-medium text-primary">
            {porticoActual.descripcion}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Afecta los factores de diseño en pasos posteriores.
        </p>
      </div>
    </section>
  )
}
