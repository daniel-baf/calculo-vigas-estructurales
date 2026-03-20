import type { ParametrosBasicosState } from "../useParametrosBasicos"
import { NumericField } from "./NumericField"
import { CalculatedField } from "./CalculatedField"

interface Props {
  bw: ParametrosBasicosState["bw"]
  setBw: ParametrosBasicosState["setBw"]
  h: ParametrosBasicosState["h"]
  setH: ParametrosBasicosState["setH"]
  rec: ParametrosBasicosState["rec"]
  setRec: ParametrosBasicosState["setRec"]
  L: ParametrosBasicosState["L"]
  setL: ParametrosBasicosState["setL"]
  d: ParametrosBasicosState["d"]
  errors: ParametrosBasicosState["errors"]
  BW_MIN: ParametrosBasicosState["BW_MIN"]
  H_MIN: ParametrosBasicosState["H_MIN"]
  REC_MIN: ParametrosBasicosState["REC_MIN"]
}

export function GeometrySection(props: Props) {
  const {
    bw,
    setBw,
    h,
    setH,
    rec,
    setRec,
    L,
    setL,
    d,
    errors,
    BW_MIN,
    H_MIN,
    REC_MIN,
  } = props

  return (
    <section>
      <h3 className="mb-4 border-b border-primary/10 pb-2 text-sm font-bold tracking-widest text-primary uppercase">
        Geometría
      </h3>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <NumericField
          id="bw"
          label="Ancho de viga (bw)"
          unit="cm"
          value={bw}
          onChange={setBw}
          min={BW_MIN}
          error={errors.bw}
          hint={`Mínimo: ${BW_MIN} cm`}
        />
        <NumericField
          id="h"
          label="Altura de viga (h)"
          unit="cm"
          value={h}
          onChange={setH}
          min={H_MIN}
          error={errors.h}
          hint={`Mínimo: ${H_MIN} cm`}
        />
        <NumericField
          id="rec"
          label="Recubrimiento (rec)"
          unit="cm"
          value={rec}
          onChange={setRec}
          min={REC_MIN}
          error={errors.rec}
          hint={`Mínimo: ${REC_MIN} cm`}
        />
        <CalculatedField
          label="Peralte efectivo (d)"
          value={d}
          unit="cm"
          formula="h − rec"
        />
        <div className="sm:col-span-2">
          <NumericField
            id="L"
            label="Luz entre apoyos (L)"
            unit="m"
            value={L}
            onChange={setL}
            min={0.01}
            step="0.01"
            error={errors.L}
          />
        </div>
      </div>
    </section>
  )
}
