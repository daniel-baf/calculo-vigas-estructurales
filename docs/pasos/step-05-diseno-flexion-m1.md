# Step 05 - Diseno de Flexion M1(-)

## Objetivo

Dimensionar acero longitudinal superior para el momento negativo M1 en el lado izquierdo.

## Diccionario de datos

| Campo                     | Tipo    | Unidad  | Fuente     | Descripcion                                 |
| ------------------------- | ------- | ------- | ---------- | ------------------------------------------- |
| `M1`                      | number  | kgf\*m  | step 3     | Momento de diseno en extremo izquierdo      |
| `fc`                      | number  | kgf/cm2 | step 1     | Resistencia a compresion del concreto       |
| `fy`                      | number  | kgf/cm2 | step 1     | Fluencia del acero                          |
| `bw`                      | number  | cm      | step 1     | Ancho de viga                               |
| `h`                       | number  | cm      | step 1     | Altura total (referencia de modelo)         |
| `rec`                     | number  | cm      | step 1     | Recubrimiento (referencia de modelo)        |
| `L`                       | number  | m       | step 1     | Luz de viga (referencia de modelo)          |
| `d`                       | number  | cm      | step 1     | Peralte efectivo                            |
| `beta`                    | number  | -       | step 1     | Factor del bloque equivalente de compresion |
| `asEtabs`                 | number  | cm2     | usuario    | Acero de referencia externo                 |
| `qty1`,`no1`,`qty2`,`no2` | number  | -       | usuario    | Configuracion de varillas                   |
| `asM1`                    | number  | cm2     | derivado   | Acero requerido                             |
| `asPropuesta`             | number  | cm2     | derivado   | Acero provisto                              |
| `phiMn`                   | number  | kgf\*m  | derivado   | Capacidad para transferencia a step 6       |
| `dc`                      | number  | -       | derivado   | Relacion demanda/capacidad                  |
| `asMin`,`asMax`           | number  | cm2     | derivado   | Limites de cuantia                          |
| `chequeo*`                | enum    | -       | derivado   | Estados de control (Ok/No Ok)               |
| `isValid`                 | boolean | -       | validacion | Estado global del paso                      |

## Flujo del paso

```mermaid
flowchart TD
  A[Entrada: asEtabs, qty1/no1, qty2/no2] --> B[Recibe M1 de step 3]
  B --> C[Recibe fc, fy, beta, bw, d de step 1]
  C --> D[calcularRefuerzo shared]
  D --> E[Chequeos de resistencia y cuantias]
  E --> F{todos Ok?}
  F -->|Si| G[isValid = true]
  F -->|No| H[isValid = false]
  G --> I[Publica phiMnNeg y asMin para step 6]
```

## Diagrama de estados

```mermaid
stateDiagram-v2
  [*] --> Empty
  Empty --> Editing
  Editing --> Invalid: errores o chequeos no Ok
  Editing --> Valid: chequeos completos en Ok
  Valid --> Editing: cambio de refuerzo
  Invalid --> Editing: correccion de datos
```

## Formulas usadas (LaTeX)

Este paso usa el mismo motor de calculo que Step 04.

$$
A_s = \frac{M\cdot 100}{\phi \cdot f_y \cdot j \cdot d}
$$

$$
A_{s,prop} = n_1A_{v1} + n_2A_{v2}
$$

$$
a = \frac{A_{s,prop}f_y}{0.85f'_cb_w}
$$

$$
\phi M_n = \frac{\phi A_{s,prop}f_y\left(d-\frac{a}{2}\right)}{100}
$$

$$
\frac{D}{C} = \frac{M}{\phi M_n}
$$

$$
A_{s,min}=\max\left(\frac{0.8\sqrt{f'_c}b_wd}{f_y},\ \frac{14b_wd}{f_y}\right),\qquad
A_{s,max}=0.025b_wd
$$

$$
c=\frac{a}{\beta_1},\qquad c<0.375d
$$
