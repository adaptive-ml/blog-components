# Blog Components

**Tip:** Install bun globally with `npm install -g bun`

## Quick Start

Agents blog post:

```bash
cd blog/agents
bun install
npm run dev
```

Visit `http://localhost:3000/`

Edit `blog/agents/blog_post.md` as needed.

---

Workflow-viz examples:

```bash
cd examples/workflow-viz
bun install
npm run dev
```

Visit `http://localhost:3000/`

## Development

Build the Svelte components:

```bash
cd src/workflow-viz
bun install
bun run build
```

This builds the Svelte code to the `components/` folder.
