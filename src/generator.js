import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.resolve(__dirname, "../templates");

export async function generateProject({ projectName, targetDir, language, architecture }) {
  if (await fs.pathExists(targetDir)) {
    const entries = await fs.readdir(targetDir);
    if (entries.length > 0) {
      throw new Error(`Directory "${projectName}" already exists and is not empty.`);
    }
  } else {
    await fs.ensureDir(targetDir);
  }

  const templateName = `${architecture}-${language === "typescript" ? "ts" : "js"}`;
  const source = path.join(templatesDir, templateName);
  if (!(await fs.pathExists(source))) {
    throw new Error(`Template "${templateName}" was not found.`);
  }

  await fs.copy(source, targetDir, {
    filter: (src) => !src.endsWith(".DS_Store")
  });

  const packageJsonPath = path.join(targetDir, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);
  packageJson.name = projectName;
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  await fs.writeJson(
    path.join(targetDir, "nexus.config.json"),
    { generatedBy: "create-nexus", language, architecture },
    { spaces: 2 }
  );
}
