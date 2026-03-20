import { useState, useMemo } from 'react';
import {
  type M1PosInput,
  calcularDisenoM1Pos,
  buscarVariantesM1Pos,
} from './diseno-flexion-m1-pos';
import type { ResultadoRefuerzo } from '@/shared/diseno-refuerzo';

export interface UseM1PosProps {
  fc: number;
  fy: number;
  bw: number;
  h: number;
  d: number;
  rec: number;
  portico: string;
  phiMnNeg: number;
  asMin: number;
}

export function useDisenoFlexionM1Pos({
  fc, fy, bw, h, d, rec, portico, phiMnNeg, asMin,
}: UseM1PosProps) {
  const [asEtabs, setAsEtabs] = useState('');
  const [n1, setN1] = useState('3');
  const [no1, setNo1] = useState('4');
  const [n2, setN2] = useState('0');
  const [no2, setNo2] = useState('4');

  // Configuración de variantes
  const [nosPermitidos, setNosPermitidos] = useState<number[]>([3, 4, 5]);
  const [variantes, setVariantes] = useState<ResultadoRefuerzo[]>([]);
  const [maxVariantes, setMaxVariantes] = useState('5');
  const [soloHorizontales, setSoloHorizontales] = useState(true);

  const input: M1PosInput = { asEtabs, n1, no1, n2, no2 };

  const params = useMemo(() => ({
    fc, fy, bw, h, d, rec, portico, phiMnNeg, asMin
  }), [fc, fy, bw, h, d, rec, portico, phiMnNeg, asMin]);

  const resultado = useMemo(() => {
    return calcularDisenoM1Pos(params, input, nosPermitidos);
  }, [params, input, nosPermitidos]);

  // Validaciones de UI
  const errors: Record<string, string> = resultado?.errors || {};
  if (parseFloat(asEtabs) < 0) errors.asEtabs = 'No puede ser negativo';

  const isValid = !!resultado && resultado.cumpleDC;

  const buscarVariantes = () => {
    const res = buscarVariantesM1Pos(
      params,
      nosPermitidos,
      parseInt(maxVariantes) || 5,
      soloHorizontales
    );
    setVariantes(res);
  };

  const limpiarVariantes = () => setVariantes([]);

  const seleccionarVariante = (v: ResultadoRefuerzo) => {
    setN1(v.inputs.qty1.toString());
    setNo1(v.inputs.no1.toString());
    setN2(v.inputs.qty2.toString());
    setNo2(v.inputs.no2.toString());
    setVariantes([]);
  };

  return {
    asEtabs, setAsEtabs,
    n1, setN1,
    no1, setNo1,
    n2, setN2,
    no2, setNo2,
    resultado,
    errors,
    isValid,
    nosPermitidos, setNosPermitidos,
    variantes,
    maxVariantes, setMaxVariantes,
    soloHorizontales, setSoloHorizontales,
    buscarVariantes,
    limpiarVariantes,
    seleccionarVariante,
  };
}

export type M1PosState = ReturnType<typeof useDisenoFlexionM1Pos>;
