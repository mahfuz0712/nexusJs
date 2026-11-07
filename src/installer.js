import { execa } from "execa";

export function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent || "";
  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("yarn")) return "yarn";
  if (userAgent.startsWith("bun")) return "bun";
  return "npm";
}

export async function installDependencies(packageManager, cwd) {
  const commands = {
    npm: ["install"],
    pnpm: ["install"],
    yarn: ["install"],
    bun: ["install"]
  };

  if (!commands[packageManager]) {
    throw new Error(`Unsupported package manager: ${packageManager}`);
  }

  await execa(packageManager, commands[packageManager], {
    cwd,
    stdio: "inherit"
  });
}
