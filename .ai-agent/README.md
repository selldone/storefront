# Selldone Storefront AI Agent Kit

This hidden directory contains a general, design-agnostic workflow for adapting
the standard Selldone Vue 3/Vite Storefront to any merchant brief. It is not a
fixed theme, vertical-specific template, greenfield starter, or an
alternate-framework specification. The current canonical bundle is:

- `AGENTS.md` — non-negotiable repository, security, and release rules
- `AI_WORKFLOW.md` — the English end-to-end GitHub, build, authentication,
  packaging, deployment, and verification runbook
- `SKILL.md` — the complete Selldone storefront functionality contract
- `scripts/storefront-workflow.mjs` — the cross-platform doctor, build,
  package, release, deploy, and CDN verification helper

[`../AGENTS.md`](../AGENTS.md) is intentionally only a discovery shim. The old
root `SKILL.md` has moved here so this file is the single source of truth.

## Official Storefront and owner-customized copies

The official Storefront is the working codebase to customize. Perform
business-specific design, build, and publication work in an owner-controlled clone,
fork, or branch of this same Vue application. Do not replace it with a parallel
app or alter the official upstream remotes merely because this kit exists.
Keep the flat `.ai-agent/` structure and adapt the helper together with the
project-owned prerequisites it validates:

- package scripts for `workflow`, `doctor`, release preparation, verification,
  and guarded deployment
- `layout.identity.json`, credential ignore rules, and public `.env` examples
- a reviewed Selldone CLI wrapper and the current `dist/app/` artifact output
- reproducible submodule setup with no silent dependency upgrades

The helper should fail until those safeguards are deliberately integrated.
Future independent skills can be grouped under
`.ai-agent/skills/<domain>/<skill-name>/`; shared references and design assets
can live under `.ai-agent/references/` and `.ai-agent/assets/` as they are added.
