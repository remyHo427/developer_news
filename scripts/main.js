import * as esb from "esbuild";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async function main() {
    // build client.js
    await esb.build({
        entryPoints: [ join(__dirname, "../src/client.tsx") ],
        bundle: true,
        outfile: join(__dirname, "../dist/public/client.js"),
        platform: "browser",
        minify: true,
        sourcemap: true,
        format: "cjs"
    });

    // build server side bundle
    await esb.build({
        entryPoints: [ join(__dirname, "../src/main.tsx") ],
        bundle: true,
        outfile: join(__dirname, "../dist/out.cjs"), 
        platform: "node",
        minify: true,
        sourcemap: true,
        format: "cjs"
    });
})();