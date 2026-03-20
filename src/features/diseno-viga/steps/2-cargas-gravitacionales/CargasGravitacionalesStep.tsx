import type { CargasGravitacionalesState } from "./useCargasGravitacionales"
import { Header } from "./components/Header"
import { InputGrid } from "./components/InputGrid"
import { ResultsSection } from "./components/ResultsSection"

/**
 * PRESENTATION LAYER — Paso 2: Cargas Gravitacionales.
 */
export function CargasGravitacionalesStep(props: CargasGravitacionalesState) {
  const {
    AT,
    setAT,
    cvKgM2,
    setCvKgM2,
    scKgM2,
    setScKgM2,
    Svd,
    setSvd,
    resultados,
    errors,
  } = props

  return (
    <div className="space-y-8">
      <Header />
      <InputGrid
        AT={AT}
        setAT={setAT}
        cvKgM2={cvKgM2}
        setCvKgM2={setCvKgM2}
        scKgM2={scKgM2}
        setScKgM2={setScKgM2}
        Svd={Svd}
        setSvd={setSvd}
        errors={errors}
      />
      <ResultsSection resultados={resultados} />
    </div>
  )
}
