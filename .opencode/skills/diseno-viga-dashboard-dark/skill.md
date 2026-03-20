---
name: diseno-viga-dashboard-dark
description: Aplica estilo dashboard premium oscuro manteniendo la paleta actual del proyecto.
version: 1.0.0
owner: frontend
---

# Skill: UX/UI Dashboard Dark (Palette-Safe)

## Objetivo

Transformar pantallas funcionales en una interfaz con lenguaje visual de dashboard premium, sin alterar la paleta ya definida en tokens CSS del proyecto.

## Reglas de oro

1. Mantener variables de color existentes (`--primary`, `--card`, `--muted`, etc.).
2. No introducir un nuevo sistema cromatico; solo usar variaciones de opacidad, contraste y elevacion.
3. Priorizar jerarquia visual: contenedor principal, tarjetas secundarias, datos clave.
4. Mantener responsive first: mobile estable y desktop denso.

## Patron visual

- Fondo: gradiente sutil + textura ligera (sin ruido agresivo).
- Panel principal: borde suave, sombra amplia, radios grandes.
- Tarjetas: capas internas con separacion clara (borde + sombra corta).
- Tipografia: titulos con peso alto, metadatos compactos, numeros con alto contraste.
- Espaciado: escala consistente (4/8/12/16/24/32).

## Componentes clave a intervenir

1. Contenedor de vista (shell/panel).
2. Navegacion primaria (acciones arriba y abajo si aplica).
3. Progreso de pasos (estado activo dominante + vecinos degradados).
4. Tarjetas de resultados/resumen.
5. Estados de validacion y foco accesible.

## Checklist UX

- [ ] El paso activo se identifica en menos de 1 segundo.
- [ ] La accion principal es unica y destacada.
- [ ] Los errores de formulario se ven sin desplazar demasiado.
- [ ] Existe feedback visual para hover/focus/disabled.
- [ ] El layout no se rompe con 7+ pasos en mobile.

## Checklist tecnico

- [ ] Reutilizar componentes existentes (`Button`, `Card`, `Wizard`, etc.).
- [ ] Evitar magic numbers; preferir tokens y clases utilitarias.
- [ ] Soportar teclado (atajos y focus visible).
- [ ] Evitar cambios de logica de negocio al retocar UI.

## Aplicacion recomendada en este repo

- `src/features/diseno-viga/DesignWizard.tsx`
- `src/components/wizard/Wizard.tsx`
- `src/components/wizard/WizardProgress.tsx`

## Definition of done

Se considera terminado cuando:

1. El flujo se percibe como dashboard premium, sin cambiar paleta.
2. La navegacion por pasos es clara en desktop y mobile.
3. Se mantienen accesibilidad basica y atajos de teclado.
4. `pnpm run typecheck` y `pnpm run lint` pasan.
