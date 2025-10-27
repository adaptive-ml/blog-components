# Agents Blog Post

## Purpose

Blog post using workflow-viz component. Build script copies components and assets locally for standalone serving.

## Layout

```
agents/
├── context.md  # This file
├── build.js  # Copies workflow-viz.js and assets from root
├── index.html  # Blog post entry page
├── blog_post.md  # Markdown content with inline workflow-viz HTML
├── components/  # Copied from ../../components/
└── shared_assets/  # Copied from ../../assets/
```

## Scope

- In-scope: Blog post content, local build script
- Out-of-scope: Component implementation (see src/workflow-viz/)

## Entrypoints

- build.js: Copies built components and assets locally for serving
- index.html: Main page that includes workflow-viz.js

## Dependencies

- serve (dev server for local testing)
- Pre-built workflow-viz.js from ../../components/
- Shared assets from ../../assets/
