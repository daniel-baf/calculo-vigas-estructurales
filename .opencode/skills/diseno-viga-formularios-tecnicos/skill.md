---
name: diseno-viga-formularios-tecnicos
description: Estandar de UX/UI para formularios numericos de ingenieria con validaciones claras y lectura rapida de resultados.
version: 1.0.0
owner: frontend
---

# Skill: UX/UI Formularios Tecnicos

## Objetivo

Mejorar formularios tecnicos con foco en: ingreso rapido, prevencion de errores, y lectura clara de resultados/calculos.

## Principios

1. Contexto primero: cada campo debe mostrar unidad y significado.
2. Error accionable: todo error indica exactamente que corregir.
3. Dato clave visible: resultados principales deben destacarse.
4. Flujo continuo: minimizar saltos visuales y scroll innecesario.
5. Teclado primero: tab order correcto y atajos consistentes.

## Patron de layout

- Encabezado corto con nombre del paso y objetivo.
- Bloque de entrada (izquierda/arriba).
- Bloque de resultados y chequeos (derecha/abajo).
- Acciones persistentes (anterior/siguiente) visibles.

## Reglas de campos

- Mostrar unidad al lado del input (`cm`, `m`, `kgf/m`, `kgf/cm2`).
- Placeholder descriptivo, no ambiguo.
- Validar en tiempo real sin bloquear escritura.
- Mensaje de error debajo del campo.
- Estados visuales obligatorios: default, focus, error, disabled.

## Reglas de validacion

- Separar `errors` (bloquean avance) de `alertas` (recomendaciones).
- Evitar mensajes genericos tipo "invalido".
- Mensajes en lenguaje de dominio:
  - "Minimo 25 cm"
  - "Debe ser mayor a 0"
  - "No puede ser negativo"

## Reglas de resultados

- Resaltar 2-3 KPI por paso (ej. `As`, `phiMn`, `D/C`).
- Mostrar chequeos como chips (`Ok`/`No Ok`/`No chequea`).
- Permitir expandir formulas y sustitucion sin saturar la vista.
- Alinear decimales y unidades para comparacion rapida.

## Formulas y trazabilidad

- Mostrar formula en LaTeX y una sustitucion numerica.
- Mantener orden consistente: entrada -> derivado -> chequeo.
- Donde aplique, incluir referencia normativa en texto corto.

## Checklist UX

- [ ] Cada input tiene etiqueta + unidad.
- [ ] Cada error indica causa y solucion.
- [ ] Chequeos criticos se ven sin abrir paneles extra.
- [ ] El usuario puede completar el paso solo con teclado.
- [ ] En mobile los inputs no colapsan ni se cortan.

## Checklist tecnico

- [ ] Tipado explicito de estados por paso.
- [ ] Formateo numerico consistente (`toFixed` o helper comun).
- [ ] Sin logica de negocio en componentes de presentacion.
- [ ] Reusar hooks compartidos cuando el calculo sea comun.
- [ ] `pnpm run typecheck` y `pnpm run lint` sin errores.

## Aplicacion recomendada en este repo

- `src/features/diseno-viga/steps/1-parametros-basicos/`
- `src/features/diseno-viga/steps/2-cargas-gravitacionales/`
- `src/features/diseno-viga/steps/3-diseno-flexion/`
- `src/features/diseno-viga/steps/4-diseno-flexion-m2/`
- `src/features/diseno-viga/steps/5-diseno-flexion-m1/`
- `src/features/diseno-viga/steps/6-diseno-flexion-m1-pos/`

## Definition of done

1. Formulario entendible por primera vez sin explicacion externa.
2. Errores detectables y corregibles en menos de 5 segundos.
3. Resultados tecnicos legibles y comparables.
4. Flujo de pasos estable en desktop y mobile.
