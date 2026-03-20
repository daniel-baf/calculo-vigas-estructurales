import type { ParametrosBasicosState } from "./useParametrosBasicos"
import { Header } from "./components/Header"
import { MaterialsSection } from "./components/MaterialsSection"
import { SystemSection } from "./components/SystemSection"
import { GeometrySection } from "./components/GeometrySection"

/**
 * PRESENTATION LAYER — Paso 1: Parámetros Básicos de la Viga.
 * Recibe el estado del hook useParametrosBasicos (spread desde App).
 */
export function ParametrosBasicosStep(props: ParametrosBasicosState) {
  const {
    fc,
    setFc,
    gradoAcero,
    setGradoAcero,
    tipoConcreto,
    setTipoConcreto,
    portico,
    setPortico,
    bw,
    setBw,
    h,
    setH,
    rec,
    setRec,
    L,
    setL,
    fy,
    lambda,
    beta,
    d,
    errors,
    GRADOS_ACERO,
    TIPOS_CONCRETO,
    TIPOS_PORTICO,
    FC_MIN,
    BW_MIN,
    H_MIN,
    REC_MIN,
  } = props

  return (
    <div className="space-y-8">
      <Header />

      <MaterialsSection
        fc={fc}
        setFc={setFc}
        gradoAcero={gradoAcero}
        setGradoAcero={setGradoAcero}
        tipoConcreto={tipoConcreto}
        setTipoConcreto={setTipoConcreto}
        fy={fy}
        lambda={lambda}
        beta={beta}
        GRADOS_ACERO={GRADOS_ACERO}
        TIPOS_CONCRETO={TIPOS_CONCRETO}
        FC_MIN={FC_MIN}
        errors={errors}
      />

      <SystemSection
        portico={portico}
        setPortico={setPortico}
        TIPOS_PORTICO={TIPOS_PORTICO}
      />

      <GeometrySection
        bw={bw}
        setBw={setBw}
        h={h}
        setH={setH}
        rec={rec}
        setRec={setRec}
        L={L}
        setL={setL}
        d={d}
        errors={errors}
        BW_MIN={BW_MIN}
        H_MIN={H_MIN}
        REC_MIN={REC_MIN}
      />
    </div>
  )
}
