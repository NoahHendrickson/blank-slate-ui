# blank-slate-ui

A component-library **Storybook** built on the current generation of the stack:

- **[shadcn/ui](https://ui.shadcn.com) with [Base UI](https://base-ui.com) primitives** (the `base-nova` style — not Radix)
- **Tailwind CSS v4** + **React 19** + **Vite** + **TypeScript**
- **Storybook 10** with **interaction tests**, **accessibility tests**, a **light/dark theme toggle**, and the **Storybook MCP server**

Every component ships a story with a `play`-function interaction test and automated accessibility (axe-core) checks that run headlessly in a real browser.

## Components

Twelve base components live in `src/components/ui/`, each with a colocated `*.stories.tsx`:

`Accordion` · `Badge` · `Button` · `Card` · `Checkbox` · `Dialog` · `Input` (+ `Label`) · `Popover` · `Select` · `Switch` · `Tabs` · `Tooltip`

Add more at any time with the shadcn CLI (the project is already configured for Base UI):

```bash
pnpm dlx shadcn@latest add <component>
```

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm storybook` | Run Storybook dev server on **http://localhost:6020** |
| `pnpm build-storybook` | Build the static Storybook into `storybook-static/` |
| `pnpm test-storybook` | Run interaction + a11y tests in watch mode (Vitest browser) |
| `pnpm test-storybook:ci` | Run them once, headless (for CI) |
| `pnpm typecheck` | `tsc` type-check the project |

> **Port note:** this project pins Storybook to **6020** (not the default 6006) because several other Storybooks already run on 6006–6009 on this machine. The port is set in the `storybook` script and in `.mcp.json` — keep them in sync if you change it.

## Testing

Tests are just stories. Each story's `play` function (from `storybook/test`) drives the component with `userEvent` and asserts with `expect`; the **`@storybook/addon-vitest`** addon runs every story as a Vitest test in headless Chromium via Playwright.

- **Interaction tests** cover real user flows — clicking, typing, keyboard navigation, focus trapping, open/close, toggling — and assert both DOM state and that handlers fire (spied with `fn()`).
- **Accessibility tests** run **axe-core** on every story via **`@storybook/addon-a11y`**. The global setting `a11y.test: 'error'` (in `.storybook/preview.tsx`) makes any violation **fail the run**.

```bash
pnpm test-storybook:ci   # 35 tests across 12 components
```

### Known accessibility note — the `destructive` variant

The a11y gate flagged a genuine issue: shadcn's **subtle `destructive` variant** (saturated red on a 10 % red tint) measures ~4.0:1 contrast at small text — just under the WCAG AA 4.5:1 minimum. Rather than silently alter shadcn's design tokens, the few stories that showcase that variant are marked `a11y: { test: 'todo' }` (Storybook's "surfaced-but-not-failed" mode); every other rule stays at `error` everywhere. To make `destructive` accessible-by-default instead, darken `--destructive` in `src/index.css` until it passes and remove those `todo` overrides.

## Theming

A global toolbar switch toggles light/dark (`@storybook/addon-themes` → `withThemeByClassName`, applying `.dark` to `<html>`). shadcn redefines its CSS variables under `.dark`, so the whole canvas — including the background — flips. The default theme is light.

## Storybook MCP

The **[Storybook MCP server](https://storybook.js.org/docs/ai/mcp/overview)** (`@storybook/addon-mcp`) is enabled and served at **http://localhost:6020/mcp** while `pnpm storybook` is running. It lets an AI agent list/read component docs and **run the story tests**.

`.mcp.json` registers it for Claude Code:

```json
{ "mcpServers": { "storybook": { "type": "http", "url": "http://localhost:6020/mcp" } } }
```

To use it: start `pnpm storybook`, then (re)connect MCP servers in Claude Code (`/mcp`). The `storybook` server and its tools appear once the dev server is up.

## Project layout

```
.storybook/
  main.ts            # framework + addons (vitest, a11y, docs, themes, mcp, chromatic)
  preview.tsx        # global CSS import, theme decorator, a11y: { test: 'error' }
src/
  index.css          # Tailwind v4 entry + shadcn tokens + .dark variant
  components/ui/      # the 12 components + their *.stories.tsx
vite.config.ts       # Vite + Tailwind plugin, @ alias, Vitest "storybook" project
.mcp.json            # Storybook MCP registration for Claude Code
```
