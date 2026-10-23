// Runs a TypeScript script that imports from src/lib, outside Next.
//   node scripts/run-ts.mjs <script.mts> [args]
// "server-only" is aliased to its no-op stub: these scripts are server code, just not inside Next.
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { alias: { "server-only": resolve("node_modules/server-only/empty.js") } });
process.argv.splice(1, 1);
await jiti.import(pathToFileURL(resolve(process.argv[1])).href);
