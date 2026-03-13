/**
 * DOMAIN LAYER — Cálculos de Cargas Gravitacionales
 * Módulo: Diseño de Viga Entrepiso (DI) — Viga de Techo
 *
 * Depende de: parámetros del Paso 1 (bw, h)
 * Unidades: kgf/m para cargas lineales, kg/m² para cargas por área, m² para área.
 */

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface InputsCargasGravitacionales {
  /** Área tributaria (m²) */
  AT: number;
  /** Carga viva por área (kg/m²) */
  cvKgM2: number;
  /** Sobrecarga — carga muerta adicional (kg/m²) */
  scKgM2: number;
  /** Factor de sismo vertical Svd (adimensional) */
  Svd: number;
  /** Ancho de viga del Paso 1 (cm) */
  bw: number;
  /** Altura de viga del Paso 1 (cm) */
  h: number;
}

export interface ResultadosCargasIntermedios {
  /** CV distribuida = AT × CV_kg/m² (kgf/m) */
  cvDistribuida: number;
  /** CM distribuida (solo SC) = AT × SC_kg/m² (kgf/m) */
  cmDistribuida: number;
}

export interface ResultadosCargasTabla {
  /** Carga Viva total (kgf/m) */
  CV: number;
  /** Carga Muerta total = peso propio + CM distribuida (kgf/m) */
  CM: number;
  /** Sismo vertical (adimensional, tal como se ingresó) */
  Svd: number;
  /** Carga mayorada Wu = (1.2 + Svd) × CM + CV (kgf/m) */
  Wu: number;
}

// ── Funciones puras ───────────────────────────────────────────────────────────

/**
 * Calcula el peso propio de la viga (kgf/m).
 * γ_concreto = 2400 kg/m³; dimensiones en cm → se dividen entre 100×100.
 */
export function calcularPesoPropio(bw: number, h: number): number {
  return 2400 * ((bw * h) / (100 * 100));
}

/**
 * Calcula las cargas intermedias (tablas auxiliares).
 */
export function calcularCargasIntermedias(
  inputs: Pick<InputsCargasGravitacionales, 'AT' | 'cvKgM2' | 'scKgM2'>
): ResultadosCargasIntermedios {
  const cvDistribuida = parseFloat((inputs.AT * inputs.cvKgM2).toFixed(2));
  const cmDistribuida = parseFloat((inputs.AT * inputs.scKgM2).toFixed(2));
  return { cvDistribuida, cmDistribuida };
}

/**
 * Calcula la tabla de cargas gravitacionales (resultados principales).
 */
export function calcularCargasGravitacionales(
  inputs: InputsCargasGravitacionales
): ResultadosCargasTabla {
  const { cvDistribuida, cmDistribuida } = calcularCargasIntermedias(inputs);

  const pesoProp = calcularPesoPropio(inputs.bw, inputs.h);
  const CM = parseFloat((pesoProp + cmDistribuida).toFixed(2));
  const CV = cvDistribuida;
  const Wu = parseFloat(((1.2 + inputs.Svd) * CM + CV).toFixed(2));

  return {
    CV,
    CM,
    Svd: inputs.Svd,
    Wu,
  };
}

// ── Validación ────────────────────────────────────────────────────────────────

export interface ErroresCargas {
  AT?: string;
  cvKgM2?: string;
  scKgM2?: string;
  Svd?: string;
}

export function validarCargasGravitacionales(
  inputs: InputsCargasGravitacionales
): ErroresCargas {
  const e: ErroresCargas = {};

  if (!inputs.AT || isNaN(inputs.AT))           e.AT    = 'Campo requerido';
  else if (inputs.AT <= 0)                       e.AT    = 'Debe ser mayor a 0';

  if (!inputs.cvKgM2 || isNaN(inputs.cvKgM2))   e.cvKgM2 = 'Campo requerido';
  else if (inputs.cvKgM2 < 0)                    e.cvKgM2 = 'No puede ser negativo';

  if (!inputs.scKgM2 || isNaN(inputs.scKgM2))   e.scKgM2 = 'Campo requerido';
  else if (inputs.scKgM2 < 0)                    e.scKgM2 = 'No puede ser negativo';

  if (inputs.Svd === undefined || isNaN(inputs.Svd)) e.Svd = 'Campo requerido';
  else if (inputs.Svd < 0)                            e.Svd = 'No puede ser negativo';

  return e;
}
