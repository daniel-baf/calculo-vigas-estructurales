# GEMINI.md - Project Instructional Context

## Project Overview
**beam-calculation** is a structural engineering tool for the design of reinforced concrete beams, specifically focusing on roof beams (DI). It provides a step-by-step wizard-based interface for calculation and verification following ACI 318-19 / NSR-10 standards.

The application is built with:
- **Framework:** [React 19](https://react.dev/) + [Vite 7](https://vite.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Math Rendering:** [KaTeX](https://katex.org/) via a custom `FormulaRenderer`
- **Icons:** [Hugeicons](https://hugeicons.com/) & [Lucide React](https://lucide.dev/)
- **Theme:** [next-themes](https://github.com/pacocoursey/next-themes) with a custom `ThemeProvider`

## Project Architecture
The project follows a layered architecture (Domain-Application-Presentation) within a feature-based structure:

- **`/src/features`**: Contains feature-specific logic. The main feature is `diseno-viga`.
    - Each feature step (e.g., `1-parametros-basicos`, `2-cargas-gravitacionales`) typically includes:
        - `*.ts`: Domain logic and types.
        - `use*.ts`: Application layer (React Hook) for state and coordination.
        - `*Step.tsx`: Presentation layer (React Component).
- **`/src/shared`**: Reusable logic across features.
    - **`/diseno-refuerzo`**: Pure domain functions for reinforcement calculation, variants generation, and validation.
    - **`/hooks`**: Generic hooks like `useDisenoRefuerzo` that encapsulate reinforcement design logic for any moment (M1, M2, M+, etc.).
    - **`/components`**: Shared UI components like `FormulaRenderer`.
- **`/src/components`**: Core UI components (shadcn/ui), layout, and the wizard framework.

## Key Design Steps (Wizard)
1. **Parámetros Básicos**: Geometric properties (bw, h, L), concrete (f'c), and steel (fy) grades.
2. **Cargas Gravitacionales**: Tributary area, live/dead loads, and beam self-weight.
3. **Flexión**: Design moments (M1, Mcenter, M2) input and section checking.
4. **M2(-)**: Reinforcement design for the right support moment.
5. **M1(-)**: Reinforcement design for the left support moment.
6. **Resumen & Cortante**: (Planned) Shear design and project summary.

## Building and Running
The project uses `pnpm` as the preferred package manager (inferred from `pnpm-lock.yaml`).

| Task | Command |
| :--- | :--- |
| **Development** | `npm run dev` |
| **Build** | `npm run build` |
| **Lint** | `npm run lint` |
| **Format** | `npm run format` (using Prettier) |
| **Type Check** | `npm run typecheck` (tsc --noEmit) |
| **Preview** | `npm run preview` |

## Development Conventions
- **Naming:** Follow standard PascalCase for components/hooks and camelCase for functions/variables.
- **Purity:** Keep domain logic functions in `.ts` files pure and independent of React.
- **Formulas:** Use `FormulaRenderer` for mathematical expressions to ensure consistent KaTeX styling.
- **Validation:** Empirical reproduction of structural failures or logic errors is encouraged.
- **Icons:** Prefer Hugeicons or Lucide.
- **Styling:** Use Tailwind CSS utility classes and `clsx`/`tailwind-merge` (via `cn` utility) for dynamic classes.
- **Exports:** React components should be the primary export of their files to avoid HMR issues. Use `// eslint-disable-next-line react-refresh/only-export-components` only when necessary for small exports in component files.
