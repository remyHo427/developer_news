import * as esb from "esbuild";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async function main() {
    await esb.build({
        entryPoints: [ join(__dirname, "../src/main.ts") ],
        bundle: true,
        outfile: join(__dirname, "../dist/out.js"), 
        platform: "node",
        minify: true,
        sourcemap: true
    });
})();