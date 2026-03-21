# Architecture Documentation

This folder contains Architecture Decision Records (ADRs) for our Next.js codebase. Each ADR documents a decision, why it was made, and how to apply it consistently.

## Why ADRs?

ADRs keep implementation consistent across the project by documenting:
- **What** standard we follow
- **Why** we chose it
- **How** to apply it in everyday development

## Next.js ADR Index

1. [App Router and Route Layouts](./001-app-router-and-route-layouts.md) - Route groups, nested layouts, and ownership in `src/app`.
2. [Rendering Strategy](./002-rendering-strategy.md) - Rules for SSG, ISR, SSR, and dynamic rendering.
3. [Server vs Client Components](./003-server-vs-client-components.md) - Default server-component approach and client boundary guidance.
4. [Data Fetching and Caching](./004-data-fetching-and-caching.md) - `fetch` usage, revalidation, caching, and failure handling.
5. [Server Actions and Mutations](./005-server-actions-and-mutations.md) - Form/mutation patterns, validation, and side-effect handling.
6. [State Management with Redux](./006-state-management-redux.md) - Global state boundaries, slice design, and store usage.
7. [Styling with Tailwind and Global CSS](./007-styling-tailwind-and-global-css.md) - Styling conventions, composition rules, and shared tokens.
8. [API Integration and Boundaries](./008-api-integration-and-boundaries.md) - API layer patterns, typing, and UI/data separation.
9. [Project Structure and Naming](./009-project-structure-and-naming.md) - Folder boundaries, naming rules, and import conventions.

## How to Use

1. Open the ADR most relevant to your feature.
2. Follow the approved patterns in implementation.
3. Add new ADRs here whenever architectural decisions change.
