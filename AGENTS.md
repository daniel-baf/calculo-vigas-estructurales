# Skills Conventions

Reglas de organizacion para skills locales en este repositorio.

## Naming

- Formato obligatorio: `<modulo>-<capacidad>`
- Modulo recomendado para este proyecto: `diseno-viga`
- Ejemplos:
  - `diseno-viga-dashboard-dark`
  - `diseno-viga-formularios-tecnicos`

## Estructura

- Cada skill vive en su propia carpeta:
  - `.opencode/skills/<nombre-skill>/skill.md`
- Frontmatter minimo requerido en `skill.md`:
  - `name`
  - `description`
  - `version`
  - `owner`

## Versionado

- Usar semver (`major.minor.patch`).
- Subir:
  - `patch` para ajustes editoriales.
  - `minor` para nuevas secciones/checklists.
  - `major` para cambios de enfoque incompatibles.

## Alcance

- Una skill debe resolver un tipo de trabajo concreto y repetible.
- No mezclar reglas de arquitectura del repo con instrucciones operativas de UX/UI.

## Calidad

- Incluir checklist UX y checklist tecnico.
- Incluir rutas objetivo del repo.
- Incluir definition of done verificable.
