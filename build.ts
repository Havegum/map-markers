export {};
import { rm } from "node:fs/promises";

const outdir = "dist";

async function buildProject() {
  await Bun.build({
    entrypoints: ["./src/main.ts"],
    outdir,
    external: ["lib-wrapper"],
    minify: true,
  });

  await Bun.write(
    `${outdir}/main.js`,
    await Bun.file(`${outdir}/main.js`)
      .text()
      .then((txt) =>
        txt.replace("lib-wrapper/shim/shim.js", "./lib-wrapper/shim.js")
      )
  );
}

async function includeLibWrapperShim() {
  await Bun.build({
    entrypoints: [`${import.meta.dir}/node_modules/lib-wrapper/shim/shim.js`],
    outdir: `${outdir}/lib-wrapper`,
    minify: true,
  });
}

async function createModuleJson() {
  const file = Bun.file(`${import.meta.dir}/package.json`);

  const pkg = await file.json();

  const moduleJson = {
    id: pkg.name,
    title: pkg.title,
    description: pkg.description,
    authors: [{ name: pkg.author }],
    version: pkg.version,
    ...pkg.foundryvtt,
  };

  const moduleJsonFile = `${import.meta.dir}/${outdir}/module.json`;

  await Bun.write(moduleJsonFile, JSON.stringify(moduleJson, null, 2), {
    createPath: true,
  });
}

await rm(`./${outdir}`, { recursive: true });
await buildProject();
await Promise.all([includeLibWrapperShim(), createModuleJson()]);
