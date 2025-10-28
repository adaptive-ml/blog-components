# Blog Components

Portable web components and interactive visualizations for blog posts. Builds Svelte components as standalone IIFE bundles.

## Structure

- `src/` - Svelte component source code
- `components/` - Built web components (IIFE bundles)
- `blog/` - Blog posts using components
- `examples/` - Component usage examples
- `assets/` - Shared assets (fonts, favicons, CSS)

## Quick Start

**Run blog post:**
```bash
cd blog/agents
bun install
npm run dev  # http://localhost:3000
```

Edit blog post in `blog/agents/blog_post.md`.

**Run examples:**
```bash
cd examples/workflow-viz
bun install
npm run dev  # http://localhost:3000
```

**Build component:**
```bash
cd src/workflow-viz
bun install
bun run build  # outputs to components/
```

## Workflow

1. Edit Svelte component in `src/[component-name]/`
2. Build with `bun run build` (outputs to `components/`)
3. Blog posts/examples copy built component locally via `build.js`

## Requirements

Bun runtime (install: `npm install -g bun`)

## Context Management

Uses [Shallot](https://github.com/dylanebert/shallot) for Claude Code context:

- `/plant` - Initialize context structure
- `/peel [prompt]` - Load context before working
- `/nourish` - Update context after working
