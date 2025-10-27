# Project Structure

Portable web components and interactive visualizations for blog posts and articles.

## Stack

- Runtime: Bun (Node.js compatible)
- Language: JavaScript (ES modules)
- Framework: Svelte 5
- Build: Vite (IIFE format for web components)
- Database: None
- Testing: None (manual testing via examples)

## Commands

- Dev (component): `cd src/workflow-viz && bun run dev` (develop Svelte component with hot reload)
- Build (component): `cd src/workflow-viz && bun run build` (build to components/ folder)
- Dev (agents blog): `cd blog/agents && npm run dev` (build and serve on port 3000)
- Dev (examples): `cd examples/workflow-viz && npm run dev` (run examples server)
- Install: `bun install` (install dependencies in any subproject)

## Layout

```
blog-components/
├── CLAUDE.md  # Global context (Tier 0)
├── layers/
│   ├── structure.md  # Project-level context (Tier 1)
│   └── context-template.md  # Template for context files
├── src/
│   └── workflow-viz/  # Svelte component source
│       ├── context.md
│       ├── WorkflowViz.svelte  # Main component
│       ├── main.js  # Build entry point
│       ├── vite.config.js
│       └── package.json
├── components/  # Built output (web components)
│   └── workflow-viz.js  # IIFE bundle
├── blog/
│   ├── context.md
│   ├── index.html  # Landing page listing all posts
│   └── agents/  # Blog post about agents
│       ├── context.md
│       ├── build.js  # Copy components/assets locally
│       ├── blog_post.md
│       └── index.html
├── examples/
│   └── workflow-viz/  # Component usage examples
│       └── context.md
├── assets/  # Shared assets (fonts, favicons, CSS)
├── package.json  # Package metadata and exports
└── README.md
```

## Architecture

- **Pattern**: Component-based (Svelte → Web Components)
- **Layers**: Source (Svelte) → Build (Vite) → Output (IIFE) → Usage (HTML)
- **Flow**: Edit .svelte → Build → Copy to blog/examples → Serve

## Entry points

- Component source: src/workflow-viz/WorkflowViz.svelte (main Svelte component)
- Component entry: src/workflow-viz/main.js (Vite build entry)
- Built output: components/workflow-viz.js (standalone web component)
- Blog landing: blog/index.html (lists all posts)
- Blog posts: blog/agents/index.html, etc.

## Naming Conventions

- Files: kebab-case for configs, PascalCase for Svelte components
- Directories: kebab-case (e.g., workflow-viz, blog/agents)
- Components: PascalCase (e.g., WorkflowViz.svelte)
- Variables/Constants: camelCase

## Configuration

- Vite: src/workflow-viz/vite.config.js (component build configuration)
- Svelte: src/workflow-viz/svelte.config.js (Svelte compiler settings)
- Package: package.json (exports definition, metadata)

## Where to add code

- New Svelte component → src/[component-name]/ (with own package.json, vite.config.js)
- Component logic → src/[component-name]/*.svelte
- Build entry → src/[component-name]/main.js
- Blog posts → blog/[post-name]/ (with build.js to copy assets)
- Examples → examples/[component-name]/
