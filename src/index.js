import * as p from "@clack/prompts";
import pc from "picocolors";
import path from "node:path";
import process from "node:process";
import validatePackageName from "validate-npm-package-name";
import { generateProject } from "./generator.js";
import { detectPackageManager, installDependencies } from "./installer.js";

const cancel = (message = "Operation cancelled.") => {
  p.cancel(message);
  process.exit(0);
};

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = { projectName: null, skipInstall: false, packageManager: null };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--version" || arg === "-v") options.version = true;
    else if (arg === "--skip-install") options.skipInstall = true;
    else if (arg === "--pm" && args[i + 1]) options.packageManager = args[++i];
    else if (!arg.startsWith("-") && !options.projectName) options.projectName = arg;
  }
  return options;
}

function showHelp() {
  console.log(`
${pc.cyan(pc.bold("NEXUS"))} — Express backend project generator

Usage:
  npm create nexus@latest [project-name]
  pnpm create nexus@latest [project-name]
  yarn create nexus [project-name]
  bun create nexus@latest [project-name]

Options:
  --skip-install       Generate files without installing dependencies
  --pm <manager>       Choose npm, pnpm, yarn, or bun
  -h, --help           Show help
  -v, --version        Show version

Examples:
  npm create nexus@latest my-api
  pnpm create nexus@latest
`);
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.help) return showHelp();
  if (args.version) {
    console.log("create-nexus 1.0.0");
    return;
  }

  p.intro(pc.bgCyan(pc.black(" NEXUS ")) + " " + pc.dim("Express backend scaffolding"));

  let projectName = args.projectName;
  if (!projectName) {
    projectName = await p.text({
      message: "What is your project name?",
      placeholder: "my-api",
      defaultValue: "my-api",
      validate(value) {
        if (!value?.trim()) return "Project name is required.";
        const result = validatePackageName(value.trim());
        if (!result.validForNewPackages) return result.errors?.[0] || "Invalid package name.";
      }
    });
    if (p.isCancel(projectName)) cancel();
  } else {
    const validation = validatePackageName(projectName);
    if (!validation.validForNewPackages) {
      p.log.error(validation.errors?.join("\n") || "Invalid project name.");
      process.exit(1);
    }
  }

  const language = await p.select({
    message: "Choose your language",
    options: [
      { value: "javascript", label: "JavaScript", hint: "Fast setup, no compilation" },
      { value: "typescript", label: "TypeScript", hint: "Types and compile-time checks" }
    ],
    initialValue: "typescript"
  });
  if (p.isCancel(language)) cancel();

  const architecture = await p.select({
    message: "Choose your architecture",
    options: [
      { value: "basic", label: "Basic Express", hint: "Minimal, simple structure" },
      { value: "mvc", label: "MVC", hint: "Controllers, routes and models" },
      { value: "modular", label: "Modular", hint: "Feature-based modules" }
    ],
    initialValue: "mvc"
  });
  if (p.isCancel(architecture)) cancel();

  const packageManager = args.packageManager || detectPackageManager();
  const manager = ["npm", "pnpm", "yarn"].includes(packageManager)
    ? packageManager
    : "npm";

  const install = args.skipInstall ? false : await p.confirm({
    message: `Install dependencies with ${manager}?`,
    initialValue: true
  });
  if (p.isCancel(install)) cancel();

  const targetDir = path.resolve(process.cwd(), projectName);
  const s = p.spinner();

  s.start("Creating your Nexus project");
  try {
    await generateProject({
      projectName,
      targetDir,
      language,
      architecture
    });
    s.stop("Project files created");
  } catch (error) {
    s.stop("Project generation failed");
    p.log.error(error.message);
    process.exit(1);
  }

  if (install) {
    s.start(`Installing dependencies with ${manager}`);
    try {
      await installDependencies(manager, targetDir);
      s.stop("Dependencies installed");
    } catch (error) {
      s.stop("Dependency installation failed");
      p.log.error(error.message);
      p.log.warn("Your project files are still available. Run the install command manually.");
    }
  }

  p.note(
    [
      `cd ${projectName}`,
      install ? `${manager} run dev` : `${manager === "yarn" ? "yarn" : `${manager} install`}`,
      "",
      "Happy building!"
    ].join("\n"),
    "Next steps"
  );
  p.outro(pc.green("Your backend is ready."));
}

main().catch((error) => {
  console.error(pc.red(error.stack || error.message));
  process.exit(1);
});
