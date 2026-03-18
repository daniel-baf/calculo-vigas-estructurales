import { useState, useMemo } from 'react';
import {
  calcularDisenoM1,
  validarDisenoM1,
  generarVariantesM1,
  type ResultadoDisenoM1,
  type ErroresDisenoM1,
  type AlertasDisenoM1,
} from './diseno-flexion-m1';
import { PHI_FLEXION, BRAZO_J } from '../3-diseno-flexion/diseno-flexion';

// ── Interfaz pública del hook ──────────────────────────────────────────────────

export interface DisenoFlexionM1State {
  // Inputs controlados
  asEtabs: string;  setAsEtabs: (v: string) => void;
  qty1: string;     setQty1:    (v: string) => void;
  no1: number;      setNo1:     (v: number) => void;
  qty2: string;     setQty2:    (v: string) => void;
  no2: number;      setNo2:     (v: number) => void;
  // Derivados
  resultado: ResultadoDisenoM1 | null;
  /** As mínimo a flexión (cm²) — disponible para pasos posteriores */
  asMin: number;
  errors: ErroresDisenoM1;
  alertas: AlertasDisenoM1;
  isValid: boolean;
  // Búsqueda de variantes
  nosPermitidos: number[];
  setNosPermitidos: (nos: number[]) => void;
  variantes: ResultadoDisenoM1[];
  maxVariantes: string;
  setMaxVariantes: (v: string) => void;
  soloHorizontales: boolean;
  setSoloHorizontales: (v: boolean) => void;
  buscarVariantes: () => void;
  limpiarVariantes: () => void;
  seleccionarVariante: (v: ResultadoDisenoM1) => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * APPLICATION LAYER — Paso 5: Diseño a Flexión M1(−) Lado Izquierdo.
 *
 * @param M1    - Momento M1 (kgf·m, del Paso 3)
 * @param fc    - Resistencia concreto kgf/cm² (Paso 1)
 * @param fy    - Resistencia acero kgf/cm² (Paso 1)
 * @param beta  - β₁ (Paso 1)
 * @param bw    - Ancho viga cm (Paso 1)
 * @param d     - Peralte efectivo cm (Paso 1)
 */
export function useDisenoFlexionM1(
  M1: number,
  fc: number,
  fy: number,
  beta: number,
  bw: number,
  d: number,
): DisenoFlexionM1State {
  const [asEtabs, setAsEtabs] = useState('');
  const [qty1,    setQty1]    = useState('');
  const [no1,     setNo1]     = useState<number>(6);
  const [qty2,    setQty2]    = useState('');
  const [no2,     setNo2]     = useState<number>(0); 

  // Estado para variantes
  const [nosPermitidos, setNosPermitidos] = useState<number[]>([3, 4, 5, 6]);
  const [variantes,     setVariantes]     = useState<ResultadoDisenoM1[]>([]);
  const [maxVariantes,  setMaxVariantes]  = useState('20');
  const [soloHorizontales, setSoloHorizontales] = useState(false);

  const { errors, alertas } = useMemo(() =>
    validarDisenoM1({
      asEtabs: Number(asEtabs),
      qty1: Number(qty1),
      no1,
      qty2: Number(qty2),
      no2,
    }),
    [asEtabs, qty1, no1, qty2, no2]
  );

  const resultado = useMemo<ResultadoDisenoM1 | null>(() => {
    const hasBase = !!asEtabs && !!qty1 && !!no1;
    if (!hasBase) return null;
    return calcularDisenoM1({
      M1,
      phiFlexion: PHI_FLEXION,
      brazoJ: BRAZO_J,
      fc, fy, beta, bw, d,
      asEtabs: Number(asEtabs),
      qty1: Number(qty1),
      no1,
      qty2: Number(qty2),
      no2,
    });
  }, [M1, fc, fy, beta, bw, d, asEtabs, qty1, no1, qty2, no2]);

  const isValid =
    Object.keys(errors).length === 0 &&
    !!asEtabs && !!qty1 && !!no1 &&
    resultado !== null &&
    resultado.chequeoAsEtabs === 'Ok' &&
    resultado.chequeo_dc === 'Ok' &&
    resultado.chequeoAsMinMax === 'Ok' &&
    resultado.chequeoSeccionControlada === 'Ok';

  const buscarVariantes = () => {
    if (!asEtabs || isNaN(Number(asEtabs))) return;
    const res = generarVariantesM1(
      { M1, fc, fy, beta, bw, d, phiFlexion: PHI_FLEXION, brazoJ: BRAZO_J, asEtabs: Number(asEtabs) },
      { nosPermitidos, maxOpciones: Number(maxVariantes) || 20, soloHorizontales }
    );
    setVariantes(res);
  };

  const seleccionarVariante = (v: ResultadoDisenoM1) => {
    setQty1(v.inputs.qty1.toString());
    setNo1(v.inputs.no1);
    setQty2(v.inputs.qty2 === 0 ? '' : v.inputs.qty2.toString());
    setNo2(v.inputs.no2);
  };

  return {
    asEtabs, setAsEtabs,
    qty1,    setQty1,
    no1,     setNo1,
    qty2,    setQty2,
    no2,     setNo2,
    resultado,
    asMin: resultado?.asMin ?? 0,
    errors, alertas,
    isValid,
    nosPermitidos, setNosPermitidos,
    variantes, maxVariantes, setMaxVariantes,
    soloHorizontales, setSoloHorizontales,
    buscarVariantes, limpiarVariantes: () => setVariantes([]), seleccionarVariante,
  };
}
