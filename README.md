# Nuxt Starters Workspace

Workspace containing two production-ready Nuxt 4 starters for agentic development.

## Starters

| Project | Stack | Best for |
|---|---|---|
| [`nuxt-minimal`](./nuxt-minimal) | Nuxt 4 + UnoCSS + Pinia 4 + Lucide | Lean dashboards, landing pages, minimal admin apps |
| [`ohnuxt`](./ohnuxt) | Nuxt 4 + ohno v4 + Pinia + VueUse + Lucide | Full app kits with ⌘K command palette, hardware notch, live theming |

## Install (any fresh machine / VM)

Requirements: `git`, `rsync`, and [`bun`](https://bun.sh) (installs dependencies unless you pass `--no-install`).

```bash
git clone https://github.com/AndrianBalanescu/nuxt-starters.git
cd nuxt-starters

# Scaffold from the repo, into any target directory:
cd ~/Projects                              # wherever the new app should live
/path/to/nuxt-starters/scaffold.sh my-app --lean      # -> my-app/nuxt-minimal
/path/to/nuxt-starters/scaffold.sh my-app --appkit    # -> my-app/ohnuxt
/path/to/nuxt-starters/scaffold.sh my-app             # -> both, side-by-side

cd my-app/nuxt-minimal && bun dev
```

Optional — same commands as a global alias (what this workspace uses):

```bash
echo 'alias nux-scaffold="bash /path/to/nuxt-starters/scaffold.sh"' >> ~/.zshrc
```

`scaffold.sh` resolves the starters from its own directory (so the clone can live anywhere; override with `NUX_STARTERS_ROOT=/path/to/starters`), excludes `node_modules`, `.nuxt`, `.output`, `dist`, and `.git` from the copy, and fails fast with a clear error if a requested starter is missing.

## Quick Scaffold (alias)

`nux-scaffold` is a global shell alias (defined in `~/.zshrc`) for `scaffold.sh`. Run it from **any** terminal — the new project is created in **your current directory**, and dependencies are installed automatically:

```bash
# From anywhere, e.g. ~/Projects/bunijs/laya:
nux-scaffold my-new-app --lean      # -> $PWD/my-new-app/nuxt-minimal
nux-scaffold my-new-app --appkit    # -> $PWD/my-new-app/ohnuxt
nux-scaffold my-new-app             # -> both starters side-by-side
nux-scaffold my-new-app --lean --no-install   # skip bun install

# Then:
cd my-new-app/nuxt-minimal && bun dev
```

Flags: `--lean` (UnoCSS + Pinia only), `--appkit` (ohno UI only), `--no-install` (skip `bun install`).

The script itself: [`scaffold.sh`](./scaffold.sh).

## Other Scripts

- [`create-clean-vue.sh`](./create-clean-vue.sh) — Standalone Vue 3 + Vite + TypeScript scaffolder (no Nuxt).

## Shared Conventions

Both starters follow identical agentic-dev rules:

- **`bun`** is the only supported package manager.
- **`AGENTS.md`** — binding rules for AI agents working in the repo.
- **`llms.txt`** — machine-facing contract for LLM-generated UI code.
- **TypeScript** everywhere (`lang="ts"` in all SFCs).
- No custom CSS in `nuxt-minimal` (UnoCSS utilities only). No rogue classes in `ohnuxt` (ohno tokens only).
