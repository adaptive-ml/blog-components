# Workflow Viz Component

## Purpose

Svelte 5 component for interactive workflow visualization in blog posts. Builds as a standalone IIFE web component.

## Layout

```
workflow-viz/
├── context.md  # This file
├── WorkflowViz.svelte  # Main component
├── main.js  # Build entry (exports component)
├── vite.config.js  # Build config (IIFE format)
├── svelte.config.js  # Svelte compiler config
└── package.json  # Dependencies (Svelte 5, GSAP, Carbon icons)
```

## Scope

- In-scope: Workflow visualization component, build configuration
- Out-of-scope: Blog post content, usage examples (see blog/ and examples/)

## Entrypoints

- main.js: Imports WorkflowViz.svelte and exports as web component
- WorkflowViz.svelte: Main component implementation

## Dependencies

- Svelte 5 (component framework)
- GSAP (animations)
- carbon-icons-svelte (icons)
- Vite + @sveltejs/vite-plugin-svelte (build tooling)
