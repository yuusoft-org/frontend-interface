import { watch } from "fs";
import { esbuildBuild, yamlToJs } from './framework-build.js';
import path from "path";
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const setupWatcher = (directory) => {
  watch(
    directory,
    { recursive: true },
    async (event, filename) => {
      console.log(`Detected ${event} in ${directory}/${filename}`);
      if (filename) {
        try {
          if (filename.endsWith('.view.yaml')) {
            await yamlToJs(path.join(directory, filename));
          } else if (filename.endsWith('.js')) {
            await esbuildBuild();
          }
        } catch (error) {
          console.error(`Error processing ${filename}:`, error);
          // Keep the watcher running
        }
      }
    },
  );
};

// Set up watchers for multiple directories
setupWatcher('./pages');
setupWatcher('./components');

async function startViteServer() {
  try {
    const server = await createServer({
      // any valid user config options, plus `mode` and `configFile`
      configFile: false,
      root: __dirname,
      server: {
        port: 3001,
      },
    });
    await server.listen();

    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  } catch (error) {
    console.error("Error during Vite server startup:", error);
    // Optionally, you might want to exit the process if Vite can't start
    // process.exit(1);
  }
}

startViteServer();

