# Custom Storefront AI Agent Rules

This directory is the reusable operating kit for adapting the standard Vue
Storefront to any business, brand, audience, and visual direction, then
optionally publishing that customized app as a Selldone Layout. The repository
containing the kit can be the official
[`selldone/storefront`](https://github.com/selldone/storefront) base or an
owner-controlled copy. Deployment uses the official
[`selldone/cli`](https://github.com/selldone/cli).

When reading these files in the official base repository, treat it as template
mode: do not rename remotes, create release identity, or run the guarded custom
project workflow merely to satisfy these instructions. Apply the origin,
upstream, identity, release, and deployment rules after creating or opening the
owner's customized Storefront copy.

Before changing Git remotes, dependencies, release metadata, or deployment
state, read and follow [`AI_WORKFLOW.md`](AI_WORKFLOW.md) completely.

## Non-negotiable rules

- In a custom project, treat `origin` as the project owner's GitHub repository
  and `upstream` as the official, fetch-only Selldone storefront source. Never
  push to `upstream`.
- Inspect `git status`, remotes, the current branch, and submodule state before
  editing. Preserve unrelated user changes.
- Never use `reset --hard`, `--allow-unrelated-histories`, a destructive clean,
  or a force push to synchronize Selldone updates.
- Allow any requested visual design, but adapt the existing Vue application.
  Visual work must not replace or bypass product, variant, inventory, tax,
  shipping, basket, checkout, account, localization, or payment state.
- Keep dependency commits reproducible. Review what `npm run setup` does before
  using it: normal installs and releases must not silently advance submodules
  with `--remote`. Do not commit directly inside a submodule.
- Never print, stage, commit, upload, or expose `.selldone.env`, access tokens,
  browser sessions, 2FA codes, private keys, or GitHub credentials. `VITE_*`
  values are public client configuration and must never contain secrets.
- Keep `manifest.package` unchanged after the first Selldone deployment. Give
  every release a new `manifest.version`, and bump it before the final build.
- In an integrated custom project, use `npm run release:prepare`, commit and
  push the exact release source, then use `npm run deploy -- --confirm`.
  Authentication must be completed through the official Selldone CLI
  `/developers/login` flow; do not invent an OAuth client or scope.
- A CLI exit code is not proof of deployment. Verify the package/version in the
  Selldone developer panel and poll the versioned CDN JavaScript and CSS before
  reporting success or retrying.

After a custom project has integrated the helper prerequisites documented in
[`README.md`](README.md), use `npm run doctor` for read-only diagnostics. The
official base repository intentionally does not wire this command into its
package scripts.
