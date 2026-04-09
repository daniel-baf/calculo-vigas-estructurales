/**
 * DOMAIN LAYER — Validación de inputs de refuerzo
 * Módulo: shared/diseno-refuerzo
 */

import {
  VARILLA_MAX_RECOMENDADO,
  VARILLA_MIN_RECOMENDADO,
  VARILLA_MAX_DIFF,
} from "./varillas"

export interface ErroresRefuerzo {
  asEtabs?: string
  qty1?: string
  no1?: string
  qty2?: string
  no2?: string
}

export interface AlertasRefuerzo {
  no1Caro?: string
  no2Caro?: string
  diffVarillas?: string
}

export interface ValidarRefuerzoInputs {
  asEtabs?: number
  qty1?: number
  no1?: number
  qty2?: number
  no2?: number
}

export function validarRefuerzo(inp: ValidarRefuerzoInputs): {
  errors: ErroresRefuerzo
  alertas: AlertasRefuerzo
} {
  const errors: ErroresRefuerzo = {}
  const alertas: AlertasRefuerzo = {}

  if (inp.asEtabs == null || isNaN(inp.asEtabs) || inp.asEtabs < 0)
    errors.asEtabs = "Ingresa el área de acero por ETABS (≥ 0)"

  if (!inp.qty1 || inp.qty1 <= 0) errors.qty1 = "Cantidad requerida"

  if (!inp.no1) errors.no1 = "Selecciona el No. de varilla"

  if (inp.qty2 !== undefined && inp.qty2 > 0) {
    if (!inp.no2 || inp.no2 === 0) errors.no2 = "Selecciona el No. de varilla"
  }

  if (inp.no1 && inp.no1 > VARILLA_MAX_RECOMENDADO)
    alertas.no1Caro = `No. ${inp.no1} es posible pero costoso. Se recomienda No. ${VARILLA_MIN_RECOMENDADO}–${VARILLA_MAX_RECOMENDADO}.`

  if (inp.qty2 !== undefined && inp.qty2 > 0) {
    if (inp.no2 && inp.no2 > VARILLA_MAX_RECOMENDADO)
      alertas.no2Caro = `No. ${inp.no2} es posible pero costoso. Se recomienda No. ${VARILLA_MIN_RECOMENDADO}–${VARILLA_MAX_RECOMENDADO}.`

    if (inp.no1 && inp.no2 && inp.no2 !== 0) {
      const diff = Math.abs(inp.no1 - inp.no2)
      if (diff > VARILLA_MAX_DIFF)
        alertas.diffVarillas = `Diferencia entre No. ${inp.no1} y No. ${inp.no2} es de ${diff} — máximo recomendado: ${VARILLA_MAX_DIFF}.`
    }
  }

  return { errors, alertas }
}
