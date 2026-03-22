# Public Documentation Site

This subtree is a standalone Docusaurus application for public-facing documentation.

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

It is a published product, not a mirror of `docs/dev`.

## Responsibilities

This site is responsible for:
- public product docs
- public tutorials
- public changelog
- public FAQ
- public API reference presentation
- public blog and selected website-style pages

## Content sources

Content may come from:
1. directly authored public docs in `content/`
2. generated public artifacts in `generated/`
3. approved promotions from `docs/dev`

## Do not do this

Do not:
- ingest all of `docs/dev` directly
- publish internal docs by path coincidence
- treat generated API docs as hand-edited docs
- mix editorial content with internal implementation notes

## Site structure

- `content/` — hand-authored public documentation
- `generated/` — generated public artifacts
- `blog/` — blog posts and announcements
- `src/` — React components, custom pages, styling
- `tina/` — TinaCMS config for public content editing
- `scripts/` — validation and import/promotion utilities

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
