# Blog Directory

## Purpose

Root directory for all blog posts. Each subdirectory contains a standalone blog post with its own assets.

## Layout

```
blog/
├── context.md  # This file
├── index.html  # Root index listing all blog posts
├── agents/  # Individual blog post
│   ├── index.html
│   ├── components/
│   └── shared_assets/
└── [future-posts]/  # Additional blog posts
```

## Deployment

The entire `blog/` directory is deployed to GitHub Pages via `.github/workflows/deploy-pages.yml`, creating the following URL structure:
- Root: `https://adaptive-ml.github.io/blog-components/` (lists all posts)
- Posts: `https://adaptive-ml.github.io/blog-components/agents/`, etc.

## Adding New Posts

1. Create new subdirectory: `blog/[post-name]/`
2. Add `index.html`, `build.js`, and post content
3. Update `blog/index.html` to include the new post in the list
4. Build script will run automatically on deployment
