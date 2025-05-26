import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';



import { load as loadYaml } from "js-yaml";
import esbuild from "esbuild";


/**
 * Get all files from a directory recursively
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = join(dirPath, file);
    if (statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

export const yamlToJs = (file) => {
  const jsPath = file.replace('.yaml', '.js');
  const yaml = loadYaml(readFileSync(file, 'utf8'));
  writeFileSync(jsPath, `export default ${JSON.stringify(yaml, null, 2)};`);
  console.log(`${file} converted to ${jsPath}`);
}

export const yamlToJsAllFiles = () => {
  const files = getAllFiles('./pages').filter((path) => path.endsWith('view.yaml'));
  files.forEach((file) => {
    yamlToJs(file);
  });
}

export const esbuildBuild = async () => {
  try {
    await esbuild.build({
      entryPoints: ["./main.js"],
      // plugins: [npm2jsdelivrPlugin],
      bundle: true,
      // splitting: true, // Enable code splitting
      // minify: true,
      minify: false,
      sourcemap: false,
      outfile: "./public/main.js",
      format: "esm",
      loader: {
        '.wasm': 'binary',
      },
      // target: 'es2020',
    });
  } catch (error) {
    console.error('esbuild error:', error);
    // Don't throw the error, just log it
  }
}
