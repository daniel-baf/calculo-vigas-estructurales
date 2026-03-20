import {
  VARILLA_MAP,
  generarVariantes,
  validarRefuerzo as validarRefuerzoShared,
  type ResultadoRefuerzo,
} from "@/shared/diseno-refuerzo"

/**
 * Domain Logic — Step 6: Diseño a Flexión para Momento Positivo M1(+).
 */

export interface M1PosParams {
  fc: number
  fy: number
  bw: number
  h: number
  d: number
  rec: number
  portico: string // "P.E" | "P.I" | "P.O"
  phiMnNeg: number // Capacidad nominal negativa (phiMn) del Paso 5
  asMin: number
}

export interface M1PosInput {
  asEtabs: string
  n1: string
  no1: number
  n2: string
  no2: number
}

export interface M1PosResult {
  asPropuesta: number
  mu: number // Momento de diseño (max entre sísmico y ETABS)
  muSismico: number // Momento mínimo por norma (0.5 o 0.33 de phiMnNeg)
  asReq: number // Acero requerido por Mu
  a: number // Profundidad bloque compresión
  phiMn: number // Resistencia nominal
  dc: number // Relación Demanda/Capacidad
  asMin: number
  cumpleAsMin: boolean
  cumpleDC: boolean
  esSeccionControlada: boolean
  proceso: {
    muSismico: { formula: string; sustitucion: string }
    asReq: { formula: string; sustitucion: string }
    a: { formula: string; sustitucion: string }
    phiMn: { formula: string; sustitucion: string }
    dc: { formula: string; sustitucion: string }
    seccionControlada: { formula: string; sustitucion: string }
  }
  errors: Record<string, string>
  alertas: Record<string, string>
}

/**
 * Calcula el diseño para M1(+) basado en los momentos y el acero propuesto.
 */
export function calcularDisenoM1Pos(
  params: M1PosParams,
  input: M1PosInput
): M1PosResult | null {
  const { fc, fy, bw, d, portico, phiMnNeg, asMin } = params

  // 1. Calcular Momento Sísmico Mínimo M1(+)
  // NSR-10 C.21.5.2.1: Sobre la resistencia proporcionada (phiMn)
  let factorSismico = 0
  if (portico === "P.E") factorSismico = 0.5
  else if (portico === "P.I") factorSismico = 1 / 3

  const muSismico = (Math.abs(phiMnNeg) || 0) * factorSismico

  // Considerar también el acero de ETABS para derivar un momento si es mayor
  const asEtabsVal = parseFloat(input.asEtabs) || 0
  const phiFlexion = 0.9
  const jAsumido = 0.9
  const muEtabs =
    (asEtabsVal * phiFlexion * (fy || 4200) * jAsumido * (d || 1)) / 100

  const mu = Math.max(muSismico, muEtabs)
  const asReq = (mu * 100) / (phiFlexion * (fy || 4200) * jAsumido * (d || 1))

  // 2. Calcular acero propuesto
  const n1 = parseInt(input.n1) || 0
  const no1 = input.no1 || 0
  const n2 = parseInt(input.n2) || 0
  const no2 = input.no2 || 0

  const v1 = VARILLA_MAP[no1] || { area: 0 }
  const v2 = VARILLA_MAP[no2] || { area: 0 }
  const asProp = n1 * v1.area + n2 * v2.area

  // 3. Validaciones compartidas
  const { errors, alertas } = validarRefuerzoShared({
    asEtabs: parseFloat(input.asEtabs) || 0,
    qty1: n1,
    no1: no1,
    qty2: n2,
    no2: no2,
  })

  // 4. Cálculos de resistencia
  const a = (asProp * (fy || 4200)) / (0.85 * (fc || 210) * (bw || 1))
  const phiMn = (phiFlexion * asProp * (fy || 4200) * ((d || 1) - a / 2)) / 100
  const dc = mu / (phiMn || 1)

  const cumpleAsMin = asProp >= (asMin || 0)
  const cumpleDC = dc <= 1.0 && cumpleAsMin && asProp > 0

  // Chequeo de sección controlada
  const beta = 0.85 // Simplificado o pasar desde params
  const c = a / beta
  const limiteC = 0.375 * (d || 1)
  const esSeccionControlada = c < limiteC

  // LaTeX (Usando caracteres planos con espacios para que el FormulaRenderer genere KaTeX válido)
  const sMuSismico =
    portico === "P.E"
      ? {
          formula: "M1(+) = 0.50 · φMn-",
          sustitucion: `M1(+) = 0.50 · ${(Math.abs(phiMnNeg) || 0).toFixed(2)} = ${(muSismico || 0).toFixed(2)} kgf·m`,
        }
      : portico === "P.I"
        ? {
            formula: "M1(+) = 1/3 · φMn-",
            sustitucion: `M1(+) = ${(Math.abs(phiMnNeg) || 0).toFixed(2)} / 3 = ${(muSismico || 0).toFixed(2)} kgf·m`,
          }
        : {
            formula: "M1(+) = 0 (Pórtico Ordinario)",
            sustitucion: "M1(+) = 0 kgf·m",
          }

  const sAsReq = {
    formula: "As_req = (Mu · 100) / (φ · fy · j · d)",
    sustitucion: `As_req = (${(mu || 0).toFixed(2)} · 100) / (0.9 · ${fy || 0} · 0.9 · ${(d || 0).toFixed(2)}) = ${(asReq || 0).toFixed(2)} cm^2`,
  }

  const sA = {
    formula: "a = (As_prop · fy) / (0.85 · f'c · bw)",
    sustitucion: `a = (${(asProp || 0).toFixed(2)} · ${fy || 0}) / (0.85 · ${fc || 0} · ${(bw || 0).toFixed(2)}) = ${(a || 0).toFixed(2)} cm`,
  }

  const sPhiMn = {
    formula: "φMn = (φ · As_prop · fy · (d - a/2)) / 100",
    sustitucion: `φMn = (0.9 · ${(asProp || 0).toFixed(2)} · ${fy || 0} · (${(d || 0).toFixed(2)} - ${(a || 0).toFixed(2)}/2)) / 100 = ${(phiMn || 0).toFixed(2)} kgf·m`,
  }

  const sDC = {
    formula: "D/C = Mu / φMn",
    sustitucion: `D/C = ${(mu || 0).toFixed(2)} / ${(phiMn || 0).toFixed(2)} = ${(dc || 0).toFixed(2)}`,
  }

  const sSeccionControlada = {
    formula: "c = a / β1 < 0.375 d",
    sustitucion: `c = ${c.toFixed(2)} cm < ${(limiteC || 0).toFixed(2)} cm → ${c < limiteC ? "Ok" : "No Ok"}`,
  }

  return {
    asPropuesta: asProp,
    mu,
    muSismico,
    asReq,
    a,
    phiMn,
    dc,
    asMin,
    cumpleAsMin,
    cumpleDC,
    esSeccionControlada,
    errors: errors as Record<string, string>,
    alertas: alertas as Record<string, string>,
    proceso: {
      muSismico: sMuSismico,
      asReq: sAsReq,
      a: sA,
      phiMn: sPhiMn,
      dc: sDC,
      seccionControlada: sSeccionControlada,
    },
  }
}

/**
 * Sugiere variantes de refuerzo.
 */
export function buscarVariantesM1Pos(
  params: M1PosParams,
  nosPermitidos: number[],
  max: number,
  soloHorizontales: boolean
): ResultadoRefuerzo[] {
  const { fc, fy, bw, d, portico, phiMnNeg } = params

  // 1. Calcular Momento Sísmico Mínimo M1(+)
  let factorSismico = 0
  if (portico === "P.E") factorSismico = 0.5
  else if (portico === "P.I") factorSismico = 1 / 3

  const muSismico = (Math.abs(phiMnNeg) || 0) * factorSismico
  const mu = muSismico

  const phiFlexion = 0.9
  const jAsumido = 0.9

  return generarVariantes(
    {
      momento: mu,
      momentoLabel: "M1(+)",
      phiFlexion,
      brazoJ: jAsumido,
      fc,
      fy,
      beta: 0.85,
      bw,
      d,
      asEtabs: 0,
    },
    {
      nosPermitidos,
      maxOpciones: max,
      soloHorizontales,
    }
  )
}
