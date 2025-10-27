# Workflow Viz Examples

## Purpose

Usage examples and testing environment for the workflow-viz component using inline HTML approach.

## Layout

```
workflow-viz/
├── context.md  # This file
├── index.html  # Example page with inline HTML workflow definitions
├── vite.config.js  # Dev server config
└── package.json  # Dependencies
```

## Scope

- In-scope: Component usage examples with inline HTML, testing environment
- Out-of-scope: Component implementation (see src/workflow-viz/)

## Approach

Uses inline HTML with `<workflow-viz>` tags containing `<workflow-step>` children. This is more portable than JavaScript-based initialization and matches the pattern used in blog posts.

Example:
```html
<workflow-viz>
  <workflow-step id="..." label="..." subtitle="..." color="..." icon="...">
    <tier2>...</tier2>
    <tier3>...</tier3>
  </workflow-step>
  <workflow-styles>...</workflow-styles>
</workflow-viz>
```

## Entrypoints

- index.html: Example usage of workflow-viz component with various configurations

## Dependencies

- workflow-viz.js from ../../components/
- Fonts from ../../assets/
- Vite (dev server)
