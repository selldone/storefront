#!/usr/bin/env node

/*
 * Copyright (c) 2026. Selldone® Business OS™
 *
 * Author: M.Pajuhaan
 * Web: https://selldone.com
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * All rights reserved. In the weave of time, where traditions and innovations intermingle, this content was crafted.
 * From the essence of thought, through the corridors of creativity, each word, and sentiment has been molded.
 * Not just to exist, but to inspire. Like an artist's stroke or a sculptor's chisel, every nuance is deliberate.
 * Our journey is not just about reaching a destination, but about creating a masterpiece.
 * Tread carefully, for you're treading on dreams.
 */

import {existsSync, readFileSync, renameSync} from "node:fs";
import path from "node:path";
import process from "node:process";
import {spawnSync} from "node:child_process";

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (typeof result.status === "number" && result.status !== 0) {
    process.exit(result.status);
  }
}

function runCapture(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  return {
    status: result.status ?? 1,
    stdout: (result.stdout || "").trim(),
    stderr: (result.stderr || "").trim(),
  };
}

function parseGitmodules(filePath) {
  if (!existsSync(filePath)) {
    return [];
  }

  const text = readFileSync(filePath, "utf8");
  const blocks = text
    .split(/\n(?=\[submodule ")/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const name = block.match(/\[submodule "([^"]+)"\]/)?.[1];
      const modulePath = block.match(/^\s*path\s*=\s*(.+)$/m)?.[1]?.trim();
      const url = block.match(/^\s*url\s*=\s*(.+)$/m)?.[1]?.trim();
      const branch = block.match(/^\s*branch\s*=\s*(.+)$/m)?.[1]?.trim() || "main";

      if (!name || !modulePath || !url) {
        return null;
      }

      return {name, path: modulePath, url, branch};
    })
    .filter(Boolean);
}

function isSubmoduleRegistered(modulePath) {
  const probe = runCapture("git", ["ls-files", "--stage", "--", modulePath]);
  if (probe.status !== 0 || !probe.stdout) {
    return false;
  }

  return probe.stdout.split("\n").some((line) => line.startsWith("160000 "));
}

console.log("");
console.log("███████╗███████╗██╗     ██╗     ██████╗  ██████╗ ███╗   ██╗███████╗");
console.log("██╔════╝██╔════╝██║     ██║     ██╔══██╗██╔═══██╗████╗  ██║██╔════╝");
console.log("███████╗█████╗  ██║     ██║     ██║  ██║██║   ██║██╔██╗ ██║█████╗  ");
console.log("╚════██║██╔══╝  ██║     ██║     ██║  ██║██║   ██║██║╚██╗██║██╔══╝  ");
console.log("███████║███████╗███████╗███████╗██████╔╝╚██████╔╝██║ ╚████║███████╗");
console.log("╚══════╝╚══════╝╚══════╝╚══════╝╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝");
console.log("");

console.log("▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆");
console.log("⬤ Setup Selldone® Business OS™ Storefront Project ⬤ ");
console.log("The #1 operating system for fast-growing companies.");
console.log("▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆");
console.log("");

console.log("Checking and adding submodules...");

const repoProbe = runCapture("git", ["rev-parse", "--is-inside-work-tree"]);
if (repoProbe.status !== 0 || repoProbe.stdout !== "true") {
  console.error("This directory is not a git repository. Clone with git (not zip download).");
  process.exit(1);
}

const modules = parseGitmodules(path.resolve(process.cwd(), ".gitmodules"));
for (const moduleInfo of modules) {
  if (isSubmoduleRegistered(moduleInfo.path)) {
    continue;
  }

  console.log(`Registering missing submodule: ${moduleInfo.path}`);
  run("git", [
    "submodule",
    "add",
    "--force",
    "-b",
    moduleInfo.branch,
    moduleInfo.url,
    moduleInfo.path,
  ]);
}

run("git", ["submodule", "sync", "--recursive"]);
run("git", ["submodule", "update", "--init", "--recursive", "--remote"]);

console.log("");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("Displaying submodule status...");
run("git", ["submodule", "status"]);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

const cwd = process.cwd();
const tsconfig = path.resolve(cwd, "tsconfig.json");
const tsconfigTemplate = path.resolve(cwd, "_tsconfig.json");

if (!existsSync(tsconfig)) {
  if (existsSync(tsconfigTemplate)) {
    renameSync(tsconfigTemplate, tsconfig);
    console.log("File [_tsconfig.json -> tsconfig.json] renamed successfully.");
  } else {
    console.log("_tsconfig.json does not exist.");
  }
} else {
  console.log("tsconfig.json already exists.");
}

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

