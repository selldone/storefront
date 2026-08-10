#!/usr/bin/env node

import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const OFFICIAL_STOREFRONT = "https://github.com/selldone/storefront";
const MAX_PACKAGE_BYTES = 50 * 1024 * 1024;
const TESTED_SELLDONE_CLI_VERSION = "1.0.16";
const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);
const command = process.argv[2] || "doctor";
const flags = new Set(process.argv.slice(3));

const allowedFlags = {
  doctor: new Set(),
  verify: new Set(),
  "verify-zip": new Set(),
  "verify-remote": new Set(),
  prepare: new Set(["--setup", "--install"]),
  "release-check": new Set(),
  deploy: new Set(["--confirm"]),
  help: new Set(),
  "--help": new Set(),
  "-h": new Set(),
};

function createChildEnvironment() {
  const environment = { ...process.env };
  const nodeDirectory = path.dirname(process.execPath);
  environment.PATH = [nodeDirectory, environment.PATH || ""].join(path.delimiter);
  if (process.platform !== "win32") return environment;

  const gitProbe = spawnSync("where.exe", ["git"], {
    encoding: "utf8",
    shell: false,
  });
  const gitExecutable = (gitProbe.stdout || "")
    .split(/\r?\n/)
    .find((entry) => /[\\/]cmd[\\/]git\.exe$/i.test(entry.trim()))
    ?.trim();
  if (!gitExecutable) return environment;

  const gitRoot = path.dirname(path.dirname(gitExecutable));
  const helpers = [
    path.join(gitRoot, "usr", "bin"),
    path.join(gitRoot, "mingw64", "bin"),
    path.join(gitRoot, "bin"),
  ].filter(existsSync);
  environment.PATH = [...helpers, environment.PATH || ""].join(path.delimiter);
  return environment;
}

const childEnvironment = createChildEnvironment();

let errors = 0;
let warnings = 0;

function line(kind, message) {
  const labels = {
    pass: "PASS",
    warn: "WARN",
    fail: "FAIL",
    info: "INFO",
  };
  console.log(`[${labels[kind]}] ${message}`);
}

function pass(message) {
  line("pass", message);
}

function warn(message) {
  warnings += 1;
  line("warn", message);
}

function fail(message) {
  errors += 1;
  line("fail", message);
}

function info(message) {
  line("info", message);
}

function capture(executable, args, options = {}) {
  const result = spawnSync(executable, args, {
    cwd: projectRoot,
    encoding: "utf8",
    env: childEnvironment,
    shell: false,
    ...options,
  });

  return {
    status: result.status ?? 1,
    stdout: (result.stdout || "").trimEnd(),
    stderr: (result.stderr || "").trim(),
    error: result.error,
  };
}

function run(executable, args) {
  info(`Running ${executable} ${args.join(" ")}`);
  const result = spawnSync(executable, args, {
    cwd: projectRoot,
    stdio: "inherit",
    env: childEnvironment,
    shell: false,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (typeof result.status === "number" && result.status !== 0) {
    process.exit(result.status);
  }
}

function runWithStatus(executable, args) {
  info(`Running ${executable} ${args.join(" ")}`);
  const result = spawnSync(executable, args, {
    cwd: projectRoot,
    stdio: "inherit",
    env: childEnvironment,
    shell: false,
  });

  if (result.error) {
    console.error(result.error.message);
    return 1;
  }

  return result.status ?? 1;
}

function npmInvocation(args) {
  const npmExecPath = process.env.npm_execpath;
  if (
    npmExecPath &&
    existsSync(npmExecPath) &&
    /(?:npm-cli\.js|npm\.js)$/i.test(npmExecPath)
  ) {
    return { executable: process.execPath, args: [npmExecPath, ...args] };
  }

  const bundledNpm = path.join(
    path.dirname(process.execPath),
    "node_modules",
    "npm",
    "bin",
    "npm-cli.js",
  );
  if (existsSync(bundledNpm)) {
    return { executable: process.execPath, args: [bundledNpm, ...args] };
  }

  if (process.platform === "win32") {
    return {
      executable: process.env.ComSpec || "C:\\Windows\\System32\\cmd.exe",
      args: ["/d", "/s", "/c", `npm.cmd ${args.join(" ")}`],
    };
  }

  return { executable: "npm", args };
}

function runNpm(args) {
  const invocation = npmInvocation(args);
  run(invocation.executable, invocation.args);
}

function runNpmWithStatus(args) {
  const invocation = npmInvocation(args);
  return runWithStatus(invocation.executable, invocation.args);
}

function captureNpm(args) {
  const invocation = npmInvocation(args);
  return capture(invocation.executable, invocation.args);
}

function readJson(relativePath) {
  const absolutePath = path.resolve(projectRoot, relativePath);
  if (!existsSync(absolutePath)) {
    fail(`${relativePath} is missing.`);
    return null;
  }

  try {
    return JSON.parse(readFileSync(absolutePath, "utf8"));
  } catch (error) {
    fail(`${relativePath} is not valid JSON: ${error.message}`);
    return null;
  }
}

function normalizeGitUrl(value) {
  const raw = (value || "").trim();
  const sshMatch = raw.match(/^git@github\.com:([^/]+\/[^/]+?)(?:\.git)?$/i);
  if (sshMatch) return `https://github.com/${sshMatch[1]}`.toLowerCase();

  try {
    const parsed = new URL(raw);
    if (parsed.hostname.toLowerCase() === "github.com") {
      const repositoryPath = parsed.pathname
        .replace(/^\/+|\/+$/g, "")
        .replace(/\.git$/i, "");
      return `https://github.com/${repositoryPath}`.toLowerCase();
    }
  } catch {
    // Non-URL sentinels such as DISABLED are handled by the caller.
  }

  return raw.replace(/\.git$/i, "").replace(/\/$/, "").toLowerCase();
}

function isGitHubRepository(value) {
  const raw = (value || "").trim();
  if (/^git@github\.com:[^/]+\/[^/]+?(?:\.git)?$/i.test(raw)) return true;

  try {
    const parsed = new URL(raw);
    if (
      parsed.username ||
      parsed.password ||
      parsed.search ||
      parsed.hash ||
      parsed.hostname.toLowerCase() !== "github.com"
    ) {
      return false;
    }
  } catch {
    return false;
  }

  return /^https:\/\/github\.com\/[^/]+\/[^/]+$/i.test(normalizeGitUrl(raw));
}

function git(...args) {
  return capture("git", args);
}

function remoteUrls(name, { push = false } = {}) {
  const args = ["remote", "get-url"];
  if (push) args.push("--push");
  args.push("--all", name);
  const result = git(...args);
  return {
    ...result,
    urls: result.stdout.split(/\r?\n/).filter(Boolean),
  };
}

function globalSelldoneCliVersion() {
  const result = captureNpm([
    "list",
    "-g",
    "selldone-cli",
    "--depth=0",
    "--json",
  ]);
  try {
    return JSON.parse(result.stdout).dependencies?.["selldone-cli"]?.version || null;
  } catch {
    return null;
  }
}

function checkNode() {
  const [major, minor] = process.versions.node.split(".").map(Number);
  const supported =
    (major === 20 && minor >= 19) ||
    (major === 22 && minor >= 12) ||
    major > 22;

  if (supported) {
    pass(`Node.js ${process.versions.node} satisfies the Vite runtime floor.`);
  } else {
    fail(
      `Node.js ${process.versions.node} is unsupported; use ^20.19.0 or >=22.12.0.`,
    );
  }
}

function checkTools() {
  pass(`node is available (${process.version}).`);

  const gitVersion = capture("git", ["--version"]);
  if (gitVersion.status === 0) pass(`${gitVersion.stdout} is available.`);
  else fail("git is required but was not executable.");

  const npmVersion = captureNpm(["--version"]);
  if (npmVersion.status === 0) pass(`npm ${npmVersion.stdout} is available.`);
  else fail("npm is required but was not executable.");

  const ghVersion = capture("gh", ["--version"]);
  if (ghVersion.status === 0) {
    pass("GitHub CLI is available and executable.");
    const ghAuth = capture("gh", ["auth", "status"]);
    if (ghAuth.status === 0) pass("GitHub CLI has an authenticated account.");
    else warn("GitHub CLI is installed but has no usable authenticated session.");
  } else {
    warn("GitHub CLI is not available; GitHub creation/push needs gh or Git credentials.");
  }

  const viteList = captureNpm(["list", "vite", "--depth=0", "--json"]);
  try {
    const viteVersion = JSON.parse(viteList.stdout).dependencies?.vite?.version;
    if (viteVersion) pass(`Vite ${viteVersion} is installed locally.`);
    else warn("The local Vite version could not be identified; install dependencies.");
  } catch {
    warn("The local Vite version could not be identified; install dependencies.");
  }

  const cliVersion = globalSelldoneCliVersion();
  if (cliVersion) {
    if (cliVersion === TESTED_SELLDONE_CLI_VERSION) {
      pass(`Tested Selldone CLI ${cliVersion} is installed for the guarded wrapper.`);
    } else {
      warn(
        `Selldone CLI ${cliVersion} differs from the reviewed ${TESTED_SELLDONE_CLI_VERSION}; review the CLI before deployment.`,
      );
    }
  } else {
    warn("Selldone CLI is not installed or callable; install the reviewed version before deployment.");
  }
}

function requireSelldoneCli() {
  const cliVersion = globalSelldoneCliVersion();
  if (cliVersion === TESTED_SELLDONE_CLI_VERSION) return;

  console.error(
    `Deployment requires the callable, reviewed selldone-cli@${TESTED_SELLDONE_CLI_VERSION}. Install or explicitly review and update the workflow pin first.`,
  );
  process.exit(1);
}

function submodulePaths() {
  const gitmodulesPath = path.join(projectRoot, ".gitmodules");
  if (!existsSync(gitmodulesPath)) return [];

  return [...readFileSync(gitmodulesPath, "utf8").matchAll(/^\s*path\s*=\s*(.+)$/gm)]
    .map((match) => match[1].trim())
    .filter(Boolean);
}

function checkSubmodules(strict) {
  const modules = submodulePaths();
  if (!modules.length) {
    warn("No Git submodules are declared.");
    return;
  }

  for (const modulePath of modules) {
    const stage = git("ls-files", "--stage", "--", modulePath);
    const gitlink = stage.stdout.match(/^160000\s+([0-9a-f]{40})\s+\d+\s+/m)?.[1];
    if (!gitlink) {
      fail(`Submodule ${modulePath} has no pinned gitlink in the parent repository.`);
      continue;
    }

    const head = git("-C", modulePath, "rev-parse", "HEAD");
    if (head.status !== 0) {
      fail(`Submodule ${modulePath} is not initialized.`);
      continue;
    }

    if (head.stdout !== gitlink) {
      fail(`Submodule ${modulePath} HEAD does not match its pinned gitlink.`);
      continue;
    }

    const moduleStatus = git(
      "-C",
      modulePath,
      "status",
      "--porcelain",
      "--untracked-files=all",
    );
    if (moduleStatus.status !== 0) {
      fail(`Unable to inspect submodule ${modulePath}.`);
      continue;
    }

    if (!moduleStatus.stdout) {
      pass(`Submodule ${modulePath} matches its pinned commit and is clean.`);
      continue;
    }

    const message = `Submodule ${modulePath} contains uncommitted changes.`;
    if (strict) fail(message);
    else warn(message);
  }
}

function checkRepository(strict) {
  const inside = git("rev-parse", "--is-inside-work-tree");
  if (inside.status !== 0 || inside.stdout !== "true") {
    fail("The project directory is not a Git worktree.");
    return;
  }
  pass("Project directory is a Git worktree.");

  const upstream = remoteUrls("upstream");
  const origin = remoteUrls("origin");
  const expected = normalizeGitUrl(OFFICIAL_STOREFRONT);

  if (
    upstream.status === 0 &&
    upstream.urls.length === 1 &&
    isGitHubRepository(upstream.urls[0]) &&
    normalizeGitUrl(upstream.urls[0]) === expected
  ) {
    pass("upstream fetches from the official Selldone storefront.");
  } else {
    fail("upstream must have exactly one fetch URL: https://github.com/selldone/storefront.git.");
  }

  if (origin.status !== 0 || origin.urls.length !== 1) {
    fail("origin is missing; it must point to the project owner's repository.");
  } else if (!isGitHubRepository(origin.urls[0])) {
    fail("origin must be a GitHub OWNER/REPOSITORY URL without embedded credentials.");
  } else if (normalizeGitUrl(origin.urls[0]) === expected) {
    fail("origin still points to Selldone; rename it to upstream and add the owner's origin.");
  } else {
    pass("origin is a separate GitHub project repository.");
  }

  if (origin.status === 0 && origin.urls.length === 1) {
    const originPush = remoteUrls("origin", { push: true });
    if (
      originPush.status === 0 &&
      originPush.urls.length === 1 &&
      isGitHubRepository(originPush.urls[0]) &&
      normalizeGitUrl(originPush.urls[0]) === normalizeGitUrl(origin.urls[0])
    ) {
      pass("origin fetch and push target the same project repository.");
    } else {
      fail("origin must have exactly one safe push URL matching its fetch URL.");
    }
  }

  const upstreamPush = remoteUrls("upstream", { push: true });
  if (
    upstreamPush.status === 0 &&
    upstreamPush.urls.length === 1 &&
    upstreamPush.urls[0].toUpperCase() === "DISABLED"
  ) {
    pass("upstream push is disabled.");
  } else {
    const message =
      "upstream has a usable push URL; run 'git remote set-url --push upstream DISABLED'.";
    if (strict) fail(message);
    else warn(message);
  }

  const upstreamMain = git("rev-parse", "--verify", "upstream/main");
  if (upstreamMain.status === 0) {
    const mergeBase = git("merge-base", "HEAD", "upstream/main");
    if (mergeBase.status === 0 && mergeBase.stdout) {
      pass("HEAD and upstream/main have a merge base.");
    } else {
      warn(
        "HEAD and upstream/main have unrelated histories; use a reviewed migration, never --allow-unrelated-histories.",
      );
    }
  } else {
    warn("upstream/main is not available locally; fetch it before planning a sync.");
  }

  const status = git("status", "--porcelain", "--untracked-files=all");
  if (status.status !== 0) {
    fail("Unable to inspect the Git worktree status.");
  } else if (!status.stdout) {
    pass("Git worktree is clean.");
  } else if (strict) {
    fail("Strict release check requires a clean Git worktree.");
  } else {
    warn("Git worktree contains uncommitted changes.");
  }

  checkSubmodules(strict);

  if (!strict) return;

  const tracking = git(
    "rev-parse",
    "--abbrev-ref",
    "--symbolic-full-name",
    "@{upstream}",
  );
  if (tracking.status !== 0 || !tracking.stdout) {
    fail("Current branch has no upstream tracking branch.");
    return;
  }

  if (!tracking.stdout.startsWith("origin/")) {
    fail(`Current branch tracks ${tracking.stdout}; release branches must track origin/*.`);
    return;
  }

  const divergence = git(
    "rev-list",
    "--left-right",
    "--count",
    `HEAD...${tracking.stdout}`,
  );
  const [ahead, behind] = divergence.stdout.split(/\s+/).map(Number);
  if (divergence.status !== 0 || !Number.isFinite(ahead + behind)) {
    fail("Unable to compare the current branch with its tracking branch.");
  } else if (ahead === 0 && behind === 0) {
    pass(`HEAD matches ${tracking.stdout}.`);
  } else {
    fail(`HEAD differs from ${tracking.stdout} (ahead ${ahead}, behind ${behind}).`);
  }
}

function checkCredentials() {
  const ignored = git("check-ignore", "--quiet", "--", ".selldone.env");
  if (ignored.status === 0) pass(".selldone.env is ignored by Git.");
  else fail(".selldone.env must be ignored by Git.");

  const tracked = git("ls-files", "--error-unmatch", "--", ".selldone.env");
  if (tracked.status !== 0) pass(".selldone.env is not tracked.");
  else fail(".selldone.env is tracked; remove it from the index before continuing.");

  const staged = git("diff", "--cached", "--name-only", "--", ".selldone.env");
  if (!staged.stdout) pass(".selldone.env is not staged.");
  else fail(".selldone.env is staged and must be removed before continuing.");

  const trackedPrivateFiles = git("ls-files");
  const unsafeNames = trackedPrivateFiles.stdout
    .split(/\r?\n/)
    .filter((entry) =>
      /(^|\/)(?:id_rsa|id_ed25519|\.selldone\.env)$|\.(?:pem|key|p12|pfx)$/i.test(
        entry,
      ),
    );
  if (unsafeNames.length) {
    fail(`Potential credential file(s) are tracked: ${unsafeNames.join(", ")}`);
  } else {
    pass("No obvious private-key or Selldone credential file is tracked.");
  }

  const publicEnvPath = path.join(projectRoot, ".env");
  if (
    existsSync(publicEnvPath) &&
    /^\s*SELLDONE_ACCESS_TOKEN\s*=/m.test(readFileSync(publicEnvPath, "utf8"))
  ) {
    fail("Tracked .env must never contain a Selldone access token key.");
  } else {
    pass("Public storefront .env does not contain a Selldone access token key.");
  }
}

function historicalJson(relativePath) {
  const commits = git("log", "--format=%H", "--", relativePath);
  if (commits.status !== 0 || !commits.stdout) return [];

  const values = [];
  for (const commit of commits.stdout.split(/\r?\n/).filter(Boolean)) {
    const content = git("show", `${commit}:${relativePath}`);
    if (content.status !== 0) continue;
    try {
      values.push(JSON.parse(content.stdout));
    } catch {
      warn(`Unable to parse historical ${relativePath} at ${commit.slice(0, 12)}.`);
    }
  }
  return values;
}

function checkManifest(manifest, identity, strict) {
  if (!manifest) return;

  if (manifest.deploy_server === "https://layouts.selldone.com") {
    pass("Manifest deploy server is the Selldone Layout CDN.");
  } else {
    fail("manifest.deploy_server must be https://layouts.selldone.com.");
  }

  if (
    typeof manifest.deploy_path === "string" &&
    !manifest.deploy_path.includes("..") &&
    !manifest.deploy_path.includes(":") &&
    !manifest.deploy_path.includes("\\")
  ) {
    pass("Manifest deploy path is safe.");
  } else {
    fail("Manifest deploy_path must be a safe relative URL path or an empty string.");
  }

  const packageName = manifest.package;
  const packagePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (
    typeof packageName === "string" &&
    packageName.length >= 12 &&
    packageName.length <= 64 &&
    packagePattern.test(packageName) &&
    packageName !== "sample-custom-storefront"
  ) {
    pass(`Manifest package is a valid non-template slug (${packageName}).`);
  } else {
    fail("Manifest package must be a unique 12–64 character lowercase hyphenated slug.");
  }

  const numericIdentifier = "(?:0|[1-9]\\d*)";
  const versionPattern = new RegExp(
    `^${numericIdentifier}\\.${numericIdentifier}\\.${numericIdentifier}(?:-[a-z0-9]+(?:[.-][a-z0-9]+)*)?$`,
  );
  if (
    typeof manifest.version === "string" &&
    manifest.version.length <= 64 &&
    versionPattern.test(manifest.version)
  ) {
    pass(`Manifest version is valid (${manifest.version}).`);
  } else {
    fail("Manifest version must be a lowercase SemVer value such as 1.0.0.");
  }

  if (
    typeof manifest.name === "string" &&
    manifest.name.length >= 8 &&
    manifest.name.length <= 255
  ) {
    pass("Manifest name length is valid.");
  } else {
    fail("Manifest name must contain 8–255 characters.");
  }

  if (manifest.storefront === true) pass("Manifest enables the storefront layout.");
  else fail("Manifest must set storefront to true.");

  if (typeof manifest.backoffice === "boolean") {
    pass("Manifest backoffice flag is explicit.");
  } else {
    fail("Manifest backoffice must be a boolean.");
  }

  if (
    manifest.description === null ||
    typeof manifest.description === "string"
  ) {
    pass("Manifest description type is valid.");
  } else {
    fail("Manifest description must be a string or null.");
  }

  const historicalPackages = new Set(
    historicalJson("manifest.json")
      .map((value) => value?.package)
      .filter((value) => value && value !== "sample-custom-storefront"),
  );
  if (!historicalPackages.size || [...historicalPackages].every((value) => value === manifest.package)) {
    pass("Manifest package identity matches the committed project history.");
  } else {
    fail("Manifest package differs from an established package in Git history.");
  }

  if (!git("rev-parse", "--verify", "HEAD").stdout) {
    warn("No committed manifest is available for package-identity comparison.");
  }

  if (!identity) {
    const message =
      "layout.identity.json is missing; record the permanent package and Selldone layout ID.";
    if (strict) fail(message);
    else warn(message);
  } else if (identity.package !== manifest.package) {
    fail("Manifest package differs from the permanent identity lock.");
  } else {
    pass("Manifest package matches layout.identity.json.");
    if (
      identity.layout_id === null ||
      (Number.isInteger(identity.layout_id) && identity.layout_id > 0)
    ) {
      pass("Permanent layout ID is valid or awaiting the first deployment.");
    } else {
      fail("layout.identity.json layout_id must be a positive integer or null.");
    }

    const historicalIdentities = historicalJson("layout.identity.json");
    const historicalIdentityPackages = new Set(
      historicalIdentities.map((value) => value?.package).filter(Boolean),
    );
    const historicalLayoutIds = new Set(
      historicalIdentities
        .map((value) => value?.layout_id)
        .filter((value) => Number.isInteger(value) && value > 0),
    );
    if (
      [...historicalIdentityPackages].some((value) => value !== identity.package) ||
      [...historicalLayoutIds].some((value) => value !== identity.layout_id) ||
      (historicalLayoutIds.size > 0 && identity.layout_id === null)
    ) {
      fail("layout.identity.json conflicts with its immutable Git history.");
    } else {
      pass("Permanent layout identity matches its committed history.");
    }
  }
}

function checkPackageScripts(packageJson) {
  if (!packageJson) return;
  const required = [
    "setup",
    "serve",
    "build-production",
    "deploy",
    "deploy:selldone",
    "workflow",
  ];

  for (const script of required) {
    if (packageJson.scripts?.[script]) pass(`npm script '${script}' is defined.`);
    else fail(`npm script '${script}' is missing.`);
  }
}

function walkFiles(directory, relativeRoot = "") {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const relative = path.posix.join(relativeRoot, entry.name);
    const absolute = path.join(directory, entry.name);
    const stats = lstatSync(absolute);

    if (stats.isSymbolicLink()) {
      fail(`Production artifact contains a symbolic link: ${relative}`);
      continue;
    }

    if (entry.isDirectory()) files.push(...walkFiles(absolute, relative));
    else files.push({ relative, absolute, size: stats.size });
  }
  return files;
}

function buildBaseUrl(manifest) {
  const server = String(manifest.deploy_server || "").replace(/\/+$/, "");
  const deployPath = String(manifest.deploy_path || "").replace(/^\/+|\/+$/g, "");
  return [server, deployPath, manifest.package, manifest.version]
    .filter(Boolean)
    .join("/");
}

function checkDist(manifest) {
  const dist = path.resolve(projectRoot, "dist");
  if (!existsSync(dist) || !statSync(dist).isDirectory()) {
    fail("dist/ is missing; run the production build after bumping manifest.version.");
    return;
  }

  const appDirectory = path.join(dist, "app");
  if (existsSync(appDirectory) && statSync(appDirectory).isDirectory()) {
    pass("dist/app is a directory.");
  } else {
    fail("Required artifact directory dist/app is missing.");
  }

  const shopJs = path.join(appDirectory, "shop.js");
  if (
    existsSync(shopJs) &&
    statSync(shopJs).isFile() &&
    statSync(shopJs).size > 0
  ) {
    pass("dist/app/shop.js exists as a nonempty file.");
  } else {
    fail("Required artifact dist/app/shop.js is missing, empty, or not a file.");
  }

  const shopCss = path.join(appDirectory, "shop.css");
  if (existsSync(shopCss) && statSync(shopCss).isFile()) {
    pass("dist/app/shop.css exists as a file (empty CSS is contract-valid).");
  } else {
    fail("Required artifact dist/app/shop.css is missing or not a file.");
  }

  if (existsSync(path.join(dist, "dist"))) {
    fail("dist/dist exists; the archive must not contain a dist/ wrapper.");
  }

  const files = walkFiles(dist);
  const forbidden = files.filter(({ relative }) =>
    /(^|\/)(?:\.git|node_modules)(?:\/|$)|(^|\/)(?:\.env(?:\..+)?|\.selldone\.env|\.npmrc|id_rsa|id_ed25519)$|\.(?:pem|key|p12|pfx)$/i.test(
      relative,
    ),
  );
  for (const { relative } of forbidden) {
    fail(`Forbidden file is present in dist/: ${relative}`);
  }

  const sourceMaps = files.filter(({ relative }) => relative.endsWith(".map"));
  if (sourceMaps.length) {
    fail(`dist/ contains ${sourceMaps.length} source map file(s); remove them from the release.`);
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > MAX_PACKAGE_BYTES) {
    warn(
      `dist/ is ${(totalBytes / 1024 / 1024).toFixed(1)} MiB before compression; confirm the ZIP stays below 50 MiB.`,
    );
  } else {
    pass(`dist/ contains ${files.length} files (${(totalBytes / 1024 / 1024).toFixed(1)} MiB).`);
  }

  const indexPath = path.join(dist, "index.html");
  if (!existsSync(indexPath)) {
    info("dist/index.html is not required by the Layout host and was not emitted.");
    return;
  }

  pass("dist/index.html exists as a local Vite entry document.");
  if (!manifest) return;

  const index = readFileSync(indexPath, "utf8");
  const base = buildBaseUrl(manifest);
  for (const entry of ["app/shop.js", "app/shop.css"]) {
    if (index.includes(`${base}/${entry}`)) {
      pass(`dist/index.html references ${base}/${entry}.`);
    } else {
      fail(`dist/index.html does not reference the current manifest URL for ${entry}.`);
    }
  }

  info(`Post-deploy JS: ${base}/app/shop.js`);
  info(`Post-deploy CSS: ${base}/app/shop.css`);
}

function parseZipCentralDirectory(zipBytes) {
  const minimumEocdSize = 22;
  const maximumCommentSize = 0xffff;
  const searchStart = Math.max(0, zipBytes.length - minimumEocdSize - maximumCommentSize);
  let eocdOffset = -1;

  for (let offset = zipBytes.length - minimumEocdSize; offset >= searchStart; offset -= 1) {
    if (zipBytes.readUInt32LE(offset) === 0x06054b50) {
      eocdOffset = offset;
      break;
    }
  }

  if (eocdOffset < 0) throw new Error("ZIP end-of-central-directory record is missing.");

  const entryCount = zipBytes.readUInt16LE(eocdOffset + 10);
  const centralSize = zipBytes.readUInt32LE(eocdOffset + 12);
  const centralOffset = zipBytes.readUInt32LE(eocdOffset + 16);
  if (entryCount === 0xffff || centralSize === 0xffffffff || centralOffset === 0xffffffff) {
    throw new Error("ZIP64 archives are not accepted by this release workflow.");
  }
  if (centralOffset + centralSize > eocdOffset) {
    throw new Error("ZIP central directory points outside the archive.");
  }

  const entries = [];
  let offset = centralOffset;
  for (let index = 0; index < entryCount; index += 1) {
    if (offset + 46 > zipBytes.length || zipBytes.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error(`Invalid central-directory entry at index ${index}.`);
    }

    const flags = zipBytes.readUInt16LE(offset + 8);
    const compressedSize = zipBytes.readUInt32LE(offset + 20);
    const uncompressedSize = zipBytes.readUInt32LE(offset + 24);
    const nameLength = zipBytes.readUInt16LE(offset + 28);
    const extraLength = zipBytes.readUInt16LE(offset + 30);
    const commentLength = zipBytes.readUInt16LE(offset + 32);
    const externalAttributes = zipBytes.readUInt32LE(offset + 38);
    const localHeaderOffset = zipBytes.readUInt32LE(offset + 42);
    const end = offset + 46 + nameLength + extraLength + commentLength;
    if (end > zipBytes.length) throw new Error(`Truncated ZIP entry at index ${index}.`);

    const rawName = zipBytes.subarray(offset + 46, offset + 46 + nameLength);
    const name = rawName.toString("utf8");
    if (
      localHeaderOffset + 30 > zipBytes.length ||
      zipBytes.readUInt32LE(localHeaderOffset) !== 0x04034b50
    ) {
      throw new Error(`Invalid local header for ZIP member ${name || index}.`);
    }
    const localNameLength = zipBytes.readUInt16LE(localHeaderOffset + 26);
    const localExtraLength = zipBytes.readUInt16LE(localHeaderOffset + 28);
    const localNameEnd = localHeaderOffset + 30 + localNameLength;
    if (localNameEnd + localExtraLength > zipBytes.length) {
      throw new Error(`Truncated local header for ZIP member ${name || index}.`);
    }
    const localName = zipBytes
      .subarray(localHeaderOffset + 30, localNameEnd)
      .toString("utf8");
    if (localName !== name) {
      throw new Error(`Central/local filename mismatch for ZIP member ${name || index}.`);
    }

    entries.push({
      name,
      flags,
      compressedSize,
      uncompressedSize,
      externalAttributes,
    });
    offset = end;
  }

  if (offset !== centralOffset + centralSize) {
    throw new Error("ZIP central-directory size does not match its entries.");
  }
  return entries;
}

function unsafeZipEntryReason(entry, seenNames, seenCanonicalNames) {
  const name = entry.name;
  const segments = name.split("/");
  const isDirectory = name.endsWith("/");
  const canonical = segments
    .filter((segment, index) => segment || (isDirectory && index === segments.length - 1))
    .join("/");

  if (!name || name.includes("\0") || name.includes("\ufffd")) return "invalid filename encoding";
  if (name.includes("\\")) return "backslash path";
  if (name.startsWith("/") || /^[a-z]:\//i.test(name)) return "absolute path";
  if (segments.includes("..") || segments.includes(".")) return "path traversal";
  if (name.includes("//") || canonical !== name) return "non-canonical path";
  if (seenNames.has(name)) return "duplicate member name";
  if (seenCanonicalNames.has(canonical)) return "colliding normalized member name";
  if ((entry.flags & 0x1) !== 0) return "encrypted member";

  const unixMode = (entry.externalAttributes >>> 16) & 0xffff;
  if ((unixMode & 0o170000) === 0o120000) return "symbolic link";
  if (
    name === "dist/" ||
    name.startsWith("dist/") ||
    /(^|\/)(?:\.git|node_modules)(?:\/|$)|(^|\/)(?:\.env(?:\..+)?|\.selldone\.env|\.npmrc|id_rsa|id_ed25519)$|\.(?:pem|key|p12|pfx)$/i.test(
      name,
    )
  ) {
    return "forbidden generated or credential path";
  }

  seenNames.add(name);
  seenCanonicalNames.add(canonical);
  return null;
}

async function checkZip() {
  const zipPath = path.join(projectRoot, "dist.zip");
  if (!existsSync(zipPath) || !statSync(zipPath).isFile()) {
    fail("dist.zip is missing; the official CLI must create it from dist/.");
    return false;
  }

  const zipSize = statSync(zipPath).size;
  if (zipSize <= MAX_PACKAGE_BYTES) {
    pass(`dist.zip is ${(zipSize / 1024 / 1024).toFixed(1)} MiB.`);
  } else {
    fail("dist.zip exceeds the 50 MiB Selldone Layout limit.");
    return false;
  }

  const zipBytes = readFileSync(zipPath);
  let centralEntries;
  try {
    centralEntries = parseZipCentralDirectory(zipBytes);
    pass(`ZIP central directory contains ${centralEntries.length} explicit entries.`);
  } catch (error) {
    fail(`dist.zip central-directory validation failed: ${error.message}`);
    return false;
  }

  const seenNames = new Set();
  const seenCanonicalNames = new Set();
  for (const entry of centralEntries) {
    const reason = unsafeZipEntryReason(entry, seenNames, seenCanonicalNames);
    if (reason) fail(`Unsafe ZIP member (${reason}): ${entry.name || "<empty>"}`);
  }

  let archive;
  try {
    const { default: JSZip } = await import("jszip");
    archive = await JSZip.loadAsync(zipBytes, { checkCRC32: true });
    pass("dist.zip opened successfully and passed CRC checks.");
  } catch (error) {
    fail(`dist.zip is invalid or failed CRC validation: ${error.message}`);
    return false;
  }

  const entries = Object.values(archive.files);
  const names = centralEntries.map((entry) => entry.name);
  const appEntry = centralEntries.find((entry) => entry.name === "app/");
  if (appEntry) pass("dist.zip contains the explicit app/ directory member.");
  else fail("dist.zip must contain an explicit app/ directory member.");

  for (const entry of entries) {
    if (entry.unsafeOriginalName && entry.unsafeOriginalName !== entry.name) {
      fail(`JSZip sanitized an unsafe member name: ${entry.unsafeOriginalName}`);
    }
  }

  const distPath = path.join(projectRoot, "dist");
  const localFiles = walkFiles(distPath);
  const localByName = new Map(localFiles.map((file) => [file.relative, file]));
  const archiveFileNames = names.filter((name) => !name.endsWith("/"));
  const archiveFileSet = new Set(archiveFileNames);

  for (const name of archiveFileNames) {
    if (!localByName.has(name)) fail(`dist.zip contains an extra file: ${name}`);
  }
  for (const name of localByName.keys()) {
    if (!archiveFileSet.has(name)) fail(`dist.zip is missing dist file: ${name}`);
  }

  let matchedFiles = 0;
  for (const [relative, local] of localByName) {
    const entry = archive.file(relative);
    if (!entry || entry.dir) continue;
    const archivedBytes = Buffer.from(await entry.async("uint8array"));
    const localBytes = readFileSync(local.absolute);
    if (archivedBytes.length !== localBytes.length || sha256(archivedBytes) !== sha256(localBytes)) {
      fail(`${relative} in dist.zip does not match dist/.`);
    } else {
      matchedFiles += 1;
    }
  }

  const shopJsEntry = archive.file("app/shop.js");
  if (!shopJsEntry || shopJsEntry.dir) fail("dist.zip is missing file app/shop.js.");
  else if ((await shopJsEntry.async("uint8array")).length === 0) fail("app/shop.js is empty in dist.zip.");

  if (matchedFiles === localFiles.length && archiveFileNames.length === localFiles.length) {
    pass(`All ${matchedFiles} files in dist.zip match dist/ byte-for-byte.`);
  }

  if (!names.length) fail("dist.zip contains no entries.");
  return errors === 0;
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function remoteTargets() {
  const dist = path.join(projectRoot, "dist");
  const targets = ["app/shop.js", "app/shop.css"];
  const chunksDirectory = path.join(dist, "app", "js");

  if (existsSync(chunksDirectory)) {
    const chunk = readdirSync(chunksDirectory)
      .filter((name) => name.endsWith(".js"))
      .sort()[0];
    if (chunk) targets.push(`app/js/${chunk}`);
  }

  return targets;
}

async function fetchAndCompare(base, relative, attempts = 8) {
  const localPath = path.join(projectRoot, "dist", ...relative.split("/"));
  const localBytes = readFileSync(localPath);
  const expectedHash = sha256(localBytes);
  const expectedMime = relative.endsWith(".css")
    ? /^text\/css(?:;|$)/i
    : /^(?:application|text)\/(?:javascript|ecmascript)(?:;|$)/i;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const url = `${base}/${relative}?verify=${Date.now()}-${attempt}`;
    try {
      const response = await fetch(url, {
        headers: { "cache-control": "no-cache" },
        signal: AbortSignal.timeout(15_000),
      });
      const contentType = response.headers.get("content-type") || "";
      const remoteBytes = Buffer.from(await response.arrayBuffer());
      const matches =
        response.ok &&
        expectedMime.test(contentType) &&
        remoteBytes.length === localBytes.length &&
        sha256(remoteBytes) === expectedHash;

      if (matches) {
        pass(
          `Remote ${relative} is HTTP ${response.status}, ${contentType}, and matches local SHA-256 ${expectedHash}.`,
        );
        return true;
      }

      warn(
        `Remote ${relative} is not ready or does not match (attempt ${attempt}/${attempts}, HTTP ${response.status}, MIME ${contentType || "missing"}).`,
      );
    } catch (error) {
      warn(
        `Remote ${relative} check failed (attempt ${attempt}/${attempts}): ${error.message}`,
      );
    }

    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, 3_000));
    }
  }

  fail(`Remote ${relative} did not become a verified copy of the local artifact.`);
  return false;
}

async function verifyRemote(manifest) {
  if (!manifest) return false;
  const base = buildBaseUrl(manifest);
  info(`Verifying deployed assets at ${base}/app/.`);

  const results = [];
  for (const relative of remoteTargets()) {
    results.push(await fetchAndCompare(base, relative));
  }
  return results.every(Boolean);
}

async function checkRemoteVersionState(manifest) {
  if (!manifest) process.exit(1);
  const base = buildBaseUrl(manifest);
  const url = `${base}/app/shop.js?predeploy=${Date.now()}`;

  try {
    const response = await fetch(url, {
      headers: { "cache-control": "no-cache" },
      signal: AbortSignal.timeout(15_000),
    });
    await response.arrayBuffer();

    if (response.status === 404) {
      pass(`Layout version ${manifest.version} is not present on the public CDN.`);
      return "unused";
    }

    if (response.ok) {
      info(`Layout version ${manifest.version} already exists; verifying it before any upload.`);
      const matches = await verifyRemote(manifest);
      if (matches) {
        pass(`Layout version ${manifest.version} already matches the local release; upload will be skipped.`);
        return "matching";
      }
      console.error(`Layout version ${manifest.version} exists but does not match the local release.`);
    } else {
      console.error(
        `Unable to prove that layout version ${manifest.version} is unused (HTTP ${response.status}). Do not deploy under uncertainty.`,
      );
    }
  } catch (error) {
    console.error(
      `Unable to check whether layout version ${manifest.version} is unused: ${error.message}`,
    );
  }

  process.exit(1);
}

function runLiveReleaseCheck() {
  // Validate local remotes, credentials, source state, and artifacts before any
  // network access. Only then refresh origin and compare the live tracking ref.
  runChecks({ strict: true, requireDist: true });
  run("git", ["fetch", "origin", "--prune"]);
  runChecks({ strict: true, requireDist: true });
}

function runChecks({ strict = false, requireDist = false } = {}) {
  errors = 0;
  warnings = 0;

  console.log("\nSelldone storefront workflow check\n");
  checkNode();
  checkTools();
  checkRepository(strict);
  checkCredentials();

  const packageJson = readJson("package.json");
  const manifest = readJson("manifest.json");
  const identity = readJson("layout.identity.json");
  checkPackageScripts(packageJson);
  checkManifest(manifest, identity, strict);

  if (requireDist) checkDist(manifest);

  console.log(`\nResult: ${errors} error(s), ${warnings} warning(s).`);
  if (errors) process.exit(1);
}

function printHelp() {
  console.log(`
Selldone storefront workflow helper

Usage:
  npm run workflow -- doctor
  npm run workflow -- verify
  npm run workflow -- verify-zip
  npm run workflow -- verify-remote
  npm run workflow -- prepare [--setup] [--install]
  npm run workflow -- release-check
  npm run workflow -- deploy --confirm

Commands:
  doctor        Read-only tool, Git, credential, script, and manifest checks.
  verify        Run doctor and validate the existing dist/ artifact.
  verify-zip    Validate the CLI-generated dist.zip structure, CRC, and entries.
  verify-remote Validate local dist/, then compare CDN bytes and MIME types.
  prepare       Optionally set up/install, then build and verify local output.
  release-check Require a clean branch synced with origin and a valid dist/.
  deploy        Run release-check, then delegate to the official deploy wrapper.

The helper never creates a GitHub repository, changes remotes, bumps a version,
or authenticates silently. Follow ".ai-agent/AI_WORKFLOW.md" for those approval-gated steps.
`);
}

function validateCommandFlags() {
  const accepted = allowedFlags[command];
  if (!accepted) return;
  const unexpected = [...flags].filter((flag) => !accepted.has(flag));
  if (!unexpected.length) return;
  console.error(`Unexpected option(s) for ${command}: ${unexpected.join(", ")}`);
  process.exit(2);
}

validateCommandFlags();

switch (command) {
  case "doctor":
    runChecks();
    break;

  case "verify":
    runChecks({ requireDist: true });
    break;

  case "verify-zip": {
    runChecks({ requireDist: true });
    const verified = await checkZip();
    if (!verified) process.exit(1);
    break;
  }

  case "verify-remote": {
    runChecks({ requireDist: true });
    const verified = await verifyRemote(readJson("manifest.json"));
    if (!verified) process.exit(1);
    break;
  }

  case "prepare":
    if (flags.has("--setup")) runNpm(["run", "setup"]);
    runChecks();
    if (flags.has("--install")) {
      const installArgs = existsSync(path.join(projectRoot, "package-lock.json"))
        ? ["ci", "--force"]
        : ["install", "--force"];
      runNpm(installArgs);
    }
    runNpm(["run", "build-production"]);
    runChecks({ requireDist: true });
    break;

  case "release-check":
    runLiveReleaseCheck();
    break;

  case "deploy": {
    if (!flags.has("--confirm")) {
      console.error(
        "Deployment requires --confirm after the user approves the exact package and version.",
      );
      process.exit(2);
    }
    runLiveReleaseCheck();
    const remoteState = await checkRemoteVersionState(readJson("manifest.json"));
    if (remoteState === "matching") {
      console.log(
        "The versioned CDN already matches this release. No upload was attempted; verify its beta/stable state in the Selldone developer panel.",
      );
      break;
    }
    requireSelldoneCli();
    const deployStatus = runNpmWithStatus(["run", "deploy:selldone"]);
    const zipVerified = await checkZip();
    const remoteVerified = await verifyRemote(readJson("manifest.json"));
    console.log(
      "\nCDN verification is required in addition to checking the beta/stable state in the Selldone developer panel.",
    );
    if (!zipVerified || !remoteVerified) process.exit(deployStatus || 1);
    if (deployStatus !== 0) {
      warn(
        `The CLI exited with ${deployStatus}, but the versioned CDN assets match the local release. Do not retry this version.`,
      );
    }
    break;
  }

  case "help":
  case "--help":
  case "-h":
    printHelp();
    break;

  default:
    console.error(`Unknown workflow command: ${command}`);
    printHelp();
    process.exit(2);
}
