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

import {existsSync, renameSync} from "node:fs";
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

