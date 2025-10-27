# Workflow Viz Component

## Purpose

Interactive workflow visualization. Builds as standalone web component (137KB). Content defined via inline custom elements.

## Layout

```
workflow-viz/
├── context.md  # This file
├── WorkflowViz.svelte  # Main component
├── main.js  # Build entry
├── vite.config.js  # Build config (IIFE format)
├── svelte.config.js  # Svelte compiler config
└── package.json  # Dependencies
```

## Scope

- In-scope: Workflow visualization component, build configuration
- Out-of-scope: Blog content, examples (see blog/ and examples/)

## Entrypoints

- main.js: Exports WorkflowViz.svelte as web component
- WorkflowViz.svelte: Main component

## Dependencies

- Svelte 5
- GSAP (dynamic import for animations)
- carbon-icons-svelte (direct icon imports for tree-shaking)
- Vite + @sveltejs/vite-plugin-svelte
