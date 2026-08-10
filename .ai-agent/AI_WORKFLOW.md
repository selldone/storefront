# AI Workflow: Selldone Storefront Setup, GitHub, Build, and Layout Deployment

This document is the operational script for an AI coding agent. It covers a new
owner-controlled copy of the official Selldone Storefront, an existing
customized copy, GitHub publication, safe upstream updates, production builds, package
validation, Selldone authentication, deployment, and post-deploy verification.
The expected implementation is an owner-controlled clone, fork, or branch of
the same official Vue 3/Vite Storefront customized in place. This is not a
greenfield application or alternate-framework workflow.

The authoritative sources are:

- Storefront: <https://github.com/selldone/storefront> (`main`)
- Layout CLI: <https://github.com/selldone/cli> (`master`)
- Current layout artifact contract: <https://github.com/selldone/cli/blob/master/.agents/skills/package-selldone-storefront-layout/references/artifact-contract.md>
- Official artifact validator: <https://github.com/selldone/cli/blob/master/.agents/skills/package-selldone-storefront-layout/scripts/validate_layout_package.py>
- GitHub CLI repository creation: <https://cli.github.com/manual/gh_repo_create>

Recheck those official sources before changing the toolchain. Do not silently
upgrade Selldone CLI and storefront dependencies in the same release.

## How to give this workflow to an AI

Give the AI access to this repository and use this instruction:

> Read `AGENTS.md`, `.ai-agent/AGENTS.md`, and `.ai-agent/AI_WORKFLOW.md`
> completely. Follow the applicable path
> for a new or existing Selldone storefront. Start with read-only diagnostics.
> Ask only for missing identifiers or approvals. Preserve all Selldone commerce
> behavior. Never expose credentials. Build and validate locally, publish the
> exact source commit to my GitHub repository, deploy a new manifest version
> through the official Selldone CLI, and verify the resulting CDN assets before
> reporting success.

The AI must obtain or discover these values before external writes:

| Value | Example | Rule |
| --- | --- | --- |
| Project directory | `my-storefront` | Must not overwrite a non-empty directory |
| GitHub owner/repository | `owner/my-storefront` | Must not silently attach to an existing repository |
| GitHub visibility | `private` or `public` | Public requires explicit user approval |
| Layout package | `owner-brand-storefront` | Globally unique, 12–64 lowercase slug characters |
| Layout name | `Brand Storefront` | 8–255 characters |
| Initial layout version | `1.0.0` | New and immutable after successful upload |
| Development shop name | `myshop` | Public storefront configuration, not a credential |

Installing or updating a system-global CLI, opening a new authentication
session, creating a GitHub repository, making it public, pushing commits,
entering 2FA, and deploying a Selldone layout are explicit checkpoints. The AI
may prepare everything else first, but it must not guess approval for them.

## Toolchain

Use these tools:

- Git with submodule support
- Node.js `^20.19.0` or `>=22.12.0`; Node 22 LTS is recommended
- npm and the project's locked Vite toolchain
- GitHub CLI (`gh`) for GitHub authentication and repository creation
- Official Selldone CLI (`selldone-cli`) for browser authentication, build,
  ZIP creation, and upload
- Python 3.8+ only when running the optional official artifact validator

After this operational kit and all prerequisites are deliberately integrated
into a custom Layout project, run the local diagnostic first:

```shell
npm run doctor
```

The official Storefront repository stores this helper as reusable material but
does not wire it into `package.json`. Do not run it in the official base or
change that repository's remotes to make its custom-project checks pass. Use
the raw Git commands in Path A while creating the owner's project. Then keep the
flat `.ai-agent/` directory, add the minimal root `AGENTS.md` discovery shim,
and deliberately integrate `.selldone.env.example`, credential ignore rules,
`layout.identity.json`, a reviewed `scripts/selldone-deploy.mjs`, matching
package scripts, and the current `app/` Vite output contract. Review all of
those additions before committing them.

The generic helper requires clean, pinned submodules and contains no
project-specific overlay exception. If a custom project needs a dependency
overlay, keep it as a reviewed patch and extend validation with an exact-diff
policy rather than silently accepting arbitrary submodule changes.

On Windows PowerShell, use `npm.cmd` and `npx.cmd` if script execution policy
blocks the PowerShell shims. Do not work around authentication by placing GitHub
or Selldone tokens on a command line.

## Path A — create an owner-controlled customization from the official base

Start by cloning the official Storefront codebase. This preserves its complete
commerce implementation, Git ancestry, and reviewable upstream update path.
Clone it into a new owner-designated project directory; do not repurpose a
working copy used to maintain the official Storefront repository.

```shell
git clone --recurse-submodules https://github.com/selldone/storefront.git my-storefront
cd my-storefront
git remote rename origin upstream
git remote set-url --push upstream DISABLED
git branch -M main
```

Verify before continuing:

```shell
git remote -v
git status --short
```

`upstream` must fetch from `https://github.com/selldone/storefront.git` and must
not be usable as a push destination.

Initialize the official dependencies:

```shell
npm run setup
```

The current official setup may register Selldone submodules and rename the
TypeScript config. Review every resulting Git change. For a reproducible custom
repository, commit the resulting submodule pointers instead of silently moving
them during each build.

Install dependencies. Prefer a lockfile when the project has one:

```shell
# With package-lock.json:
npm ci --force

# Without package-lock.json:
npm install --force
```

Authenticate GitHub and verify the active account:

```shell
gh auth status
# If needed:
gh auth login
```

Before creation, check whether the requested name already exists. Do not delete
or overwrite a repository to resolve a collision. A failed `gh repo view` may
also mean an authentication, network, or permission failure; proceed only when
the response is positively identified as repository-not-found.

```shell
gh repo view OWNER/REPOSITORY
```

Before the first push, review and commit any setup-generated submodule pointers,
configuration, and project-owned workflow files. Stage explicit paths only:

```shell
git status --short
git diff --check
git add .gitmodules modules path/to/reviewed-project-files
# Only when git status shows reviewed staged changes:
git commit -m "Initialize storefront from the official Selldone base"
```

After explicit confirmation of owner, name, and visibility, create the new
repository from the current directory. Select exactly one visibility flag, then
push once:

```shell
gh repo create OWNER/REPOSITORY --private --source=. --remote=origin
# or, only when explicitly requested:
gh repo create OWNER/REPOSITORY --public --source=. --remote=origin

git push -u origin main
```

Update `package.json.repository`, README links, and project badges to the new
`OWNER/REPOSITORY` before the release commit. Keep the official Selldone URL as
`upstream` and preserve its attribution and license; do not leave the official
repository configured as the custom project's publish destination.

Never store `GH_TOKEN` in this project. Use GitHub CLI's system credential
storage. Never push to `upstream`, and never force-push the initial repository.

## Path B — operate an existing customized project

Start with read-only discovery:

```shell
git status --short
git branch --show-current
git remote -v
git log -5 --oneline --decorate
git submodule status
npm run doctor
```

Before editing an existing project, update its own tracked branch only with a
fast-forward. Fetch first, require a clean worktree, and stop if the branch has
local commits or divergence; never auto-stash or force the update:

```shell
git fetch origin --prune
git pull --ff-only
```

The intended remote model is:

```text
origin    -> the project owner's GitHub repository (fetch and push)
upstream  -> https://github.com/selldone/storefront.git (fetch only)
```

If `upstream` is missing, add it. If the official repository is still named
`origin`, rename it before adding the owner's origin. Never replace a remote
whose current destination is unknown without user approval.

```shell
git remote add upstream https://github.com/selldone/storefront.git
git remote set-url --push upstream DISABLED
```

### Important ancestry check

Before any merge or pull from Selldone, run:

```shell
git fetch upstream main --tags --prune
git merge-base HEAD upstream/main
```

If this prints no commit, the histories are unrelated. Stop. Do not use
`--allow-unrelated-histories`, reset, rebase, or force-push. Create a migration
branch rooted at `upstream/main` and deliberately port the custom code, assets,
patches, and configuration with review and full regression testing.

If a real merge base exists, synchronize on a new branch:

```shell
git status --short
git switch -c codex/sync-selldone-YYYYMMDD
git fetch upstream main --tags --prune
git merge --no-ff upstream/main
git submodule update --init --recursive
```

Stop before creating the branch unless the root worktree and every submodule are
clean. Never auto-stash a user's work.

Resolve conflicts without deleting local layout behavior or Selldone commerce
logic. Abort and report if a project-owned dependency patch no longer applies.

## Dependency policy

A custom project must keep official Selldone dependencies under `modules/`
pinned to reviewed gitlinks. For a fresh clone or a normal release, restore the
committed revisions without advancing them:

```shell
git submodule update --init --recursive
```

Review the project's `setup` script before using it. The official base setup may
use `git submodule update --remote`, which is appropriate only during initial
project creation or an explicit dependency upgrade. Never run it as part of a
normal install or release. Advancing official dependency heads requires a clean
worktree, review of every gitlink, patch revalidation where applicable, a full
build and browser regression test, a dedicated commit, and user approval.

Do not commit directly inside `modules/*`. If a dependency customization is
unavoidable, prefer a project-owned override. Otherwise preserve it as a
reviewable tracked patch or a deliberate fork plus updated gitlink.

## Configure the storefront

Use `.env` only for public client configuration such as the development shop,
language, currency, country, custom home, and theme colors. Every `VITE_*`
value is bundled into browser code and is public.

Never place any access token, password, private key, 2FA code, or server secret
in `.env` or a `VITE_*` variable.

Configure `manifest.json` before the first deployment:

```json
{
  "deploy_server": "https://layouts.selldone.com",
  "deploy_path": "",
  "package": "owner-brand-storefront",
  "name": "Brand Storefront",
  "version": "1.0.0",
  "storefront": true,
  "backoffice": false,
  "description": "A custom Selldone storefront."
}
```

Create `layout.identity.json` beside the manifest as the accidental-rename lock:

```json
{
  "package": "owner-brand-storefront",
  "layout_id": null
}
```

After the first verified upload, replace `null` with the numeric layout ID and
commit it. Do not change this file for a normal version release. Changing its
package is an explicit layout migration, not an update.

Manifest rules:

- `package` is the permanent layout identity. Choose it once before the first
  deployment and never change it afterward.
- Do not use template identifiers such as `sample-custom-storefront`.
- Use a unique version for every deployment. Bump `version` before the final
  build because Vite embeds it in CDN asset URLs.
- Do not confuse `package.json.version` with `manifest.version`; the manifest
  controls Selldone layout releases.
- Keep `storefront: true`, use an HTTPS deploy server, and keep the name and
  description meaningful.

## Preserve the complete storefront contract

Customization must keep the official Selldone state and API flows intact.
Never replace live values with duplicated display-only data. Test at minimum:

- Catalog, category, vendor, search, sort, filter, and pagination/loading
- Product galleries, videos, variants, vendor products, subscriptions, prices,
  discounts, tax, shipping, stock, wishlist, compare, and add-to-cart
- Physical, virtual, file, service, and subscription baskets
- Guest and authenticated checkout, payment, order history, and account routes
- Localization, RTL, currencies, responsive breakpoints, and accessibility

Read `.ai-agent/SKILL.md` for the full functionality acceptance contract.

## Local development and production build

Run locally:

```shell
npm run serve
```

For a release, update `manifest.version` first, then run:

```shell
npm run release:prepare
```

After a fresh clone, restore the committed submodules, then install. Add
`--install` to the release helper after a lockfile change:

```shell
git submodule update --init --recursive
npm run release:prepare -- --install
```

The command checks pinned submodule integrity, optionally installs packages,
builds with Vite, and validates the Selldone build output. It does not create a
GitHub repository, push, authenticate, create the final ZIP, or deploy. Enable
its optional `--setup` path only when the custom project's reviewed setup script
restores pinned dependencies without silently advancing them.

The current Selldone Layout host contract requires the `app/` entries below.
This Vite project also emits `index.html` for local development and build
inspection, but Selldone supplies the host HTML:

```text
dist/
├── index.html   # project build output; optional to the Layout host contract
└── app/         # required
    ├── shop.js
    ├── shop.css
    ├── js/       # optional hashed chunks
    └── assets/   # optional hashed assets
```

The ZIP root must contain explicit `app/`, `app/shop.js`, and `app/shop.css`
members. If `index.html` is emitted, it also stays at the ZIP root. The ZIP must
not contain a `dist/`, project-name, package-name, or version wrapper. The
official CLI archives the contents of `dist/`, not the directory itself. Do not
handcraft a different ZIP.

After the official CLI creates `dist.zip`, an integrated helper validates its
CRC, compressed size, explicit `app/` member, unsafe paths, credential
filenames, and entry-byte equality automatically. It can also be run separately:

```shell
npm run package:verify
```

The npm-published CLI may lag the validator in the CLI GitHub repository. For a
high-assurance release, fetch a reviewed CLI commit into a temporary directory
outside the project and run its official validator:

```shell
python /path/to/selldone-cli/.agents/skills/package-selldone-storefront-layout/scripts/validate_layout_package.py dist --manifest manifest.json
```

Do not commit the temporary CLI checkout or replace the project's build config
with an unreviewed upstream file. At the time this workflow was written, the
official storefront Vite output lagged the newer CLI `app/` artifact contract;
the local `vite.config.ts` intentionally implements the deployed contract.

## Commit and push the exact release source

Run credential and artifact checks before displaying patch contents. Inspect
names first, then display only reviewed non-secret paths; never print an unknown
`.env`, key, token, or credential diff to the console:

```shell
npm run doctor
npm run workflow -- verify
git diff --check
git status --short
git diff --name-only
git diff -- path/to/reviewed-non-secret-file
```

The strict release check requires a clean, pushed branch, so perform the final
commit and push before running it:

```shell
git add path/to/intentional-file another/intentional-file manifest.json
git commit -m "Release Selldone layout vX.Y.Z"
git push -u origin HEAD
npm run release:check
```

Stage explicit paths. Never use a broad stage operation until credential and
generated-file checks are complete. Confirm that `.selldone.env`, `dist/`,
`dist.zip`, `node_modules/`, private keys, and tokens are not tracked or staged.

## Authenticate and deploy to Selldone Layouts

Treat the pinned CLI below as the workflow's reviewed baseline, not as a claim
that it is always current. Recheck the official CLI and its compatibility, then
install the exact reviewed version. Updating it is a separate tool change:

```shell
npm install -g selldone-cli@1.0.16
# On a later maintenance day, after review:
npm update -g selldone-cli
```

Record the tested CLI version in the release report. Do not silently use a new
CLI version during the same release that changes storefront code.

Capture the auditable revisions without printing credentials:

```shell
git rev-parse upstream/main
git submodule status
npm --version
npm list vite --depth=0
npm list -g selldone-cli --depth=0
```

Deploy an integrated custom Layout project with:

```shell
npm run deploy -- --confirm
```

The guarded deploy command checks the public Layout CDN before uploading. If an
existing version matches every local release asset, it treats the operation as
already complete and skips the upload. If the existing bytes differ or cannot
be verified, it stops; never overwrite that version—choose a new
`manifest.version`, rebuild, commit, and push first.

For an owner-controlled customized copy that has not yet integrated the guarded
wrapper, use the official CLI only after all release checks and approvals:

```shell
selldone deploy
```

Authentication behavior:

1. The official CLI opens `https://selldone.com/developers/login` with a random
   state value and listens on `http://localhost:3777/callback`.
2. The user signs in through Selldone. Do not create an OAuth application, add
   a `scope` parameter, collect a password, or fabricate a token.
3. If Selldone asks for a six-digit 2FA code, the user enters it interactively.
4. The CLI checks account eligibility, validates the package/version, asks for
   confirmation, runs `build-production`, creates `dist.zip`, and uploads the
   ZIP plus `manifest.json`.

The official CLI stores its credential outside the repository at
`~/.selldone-dev/.persist`. A custom project may add a reviewed compatibility
wrapper that copies the token into an ignored local `.selldone.env` file so
later deploys can reuse it. That file is plaintext credential material: never
print, inspect, commit, share, upload, or pass it to Vite. Remove both credential
copies when a full local logout is required.

When a saved credential cannot be reused, login and 2FA remain interactive;
the final deployment confirmation is always interactive.
Do not deploy a personal long-lived Selldone token from GitHub Actions.

## Verify deployment before reporting success

The current CLI can print `body used already` after the server has accepted an
upload, and its exit status alone is not authoritative. Never blindly retry the
same version after an error-looking message.

Read the package and version from `manifest.json`, then verify:

1. The Selldone developer layout list/panel shows the expected package and
   `version_beta` or version.
2. Wait for asynchronous extraction, using bounded polling.
3. Fetch these cache-busted URLs and require HTTP 200:

```text
https://layouts.selldone.com/PACKAGE/VERSION/app/shop.js?verify=TIMESTAMP
https://layouts.selldone.com/PACKAGE/VERSION/app/shop.css?verify=TIMESTAMP
```

4. Require a JavaScript MIME type for `shop.js` and `text/css` for `shop.css`.
5. Verify at least one lazy JavaScript chunk when the build contains chunks.
6. Compare remote and local byte sizes or hashes where the server permits it.
7. After the beta layout is attached to a test shop or opened through Selldone's
   preview, smoke-test `/`, `/shop`, a category, a product, cart, and mobile
   behavior. CDN upload by itself does not activate a shop layout.

An upload is successful only after remote verification. If the expected version
already exists and the remote bytes match, treat the operation as successful
and do not upload again. If the version exists but content cannot be proven to
match, stop and prepare a new version after investigation.

Selldone upload normally creates or updates a beta layout. Do not call it
published, verified, or stable unless the platform explicitly reports that
state.

The guarded `npm run deploy -- --confirm` command performs the ZIP and public
CDN byte/MIME checks. The AI must still verify the authenticated developer-panel
record and accurately report whether the version is beta, stable, or published.

## Expected AI completion report

The AI's final report must state:

- Official upstream URL and revision used
- Custom GitHub origin, branch, commit, and visibility
- Node, npm, Vite, and Selldone CLI versions
- Permanent manifest package identifier and newly deployed manifest version
- Build and local package-validation results
- Whether browser login and 2FA were required, without exposing their values
- Selldone layout ID/panel link and beta/stable state
- CDN verification results for JavaScript, CSS, and one lazy chunk
- Any remaining conflicts, uncommitted changes, or manual publishing step

Never claim a GitHub push, Selldone upload, or stable publication unless it was
independently verified.
