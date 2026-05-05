import { spawnSync } from "child_process";

process.env.DATABASE_URL ||= "file:./dev.db";
process.env.JWT_SECRET ||= "change-this-secret-before-production";

const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const nodeCommand = process.platform === "win32" ? "node" : process.execPath;

const run = (command, args) => {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });

  if (result.error) {
    console.error(`Failed to run ${command}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

run(npxCommand, ["prisma", "generate"]);
run(nodeCommand, ["scripts/init-sqlite.mjs"]);
