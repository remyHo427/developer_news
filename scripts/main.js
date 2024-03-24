import * as esb from "esbuild";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { sassPlugin } from "esbuild-sass-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async function main() {
    // build client.js
    await esb.build({
        plugins: [sassPlugin()],
        entryPoints: [join(__dirname, "../src/client.tsx")],
        outfile: join(__dirname, "../dist/public/client.js"),
        bundle: true,
        minify: true,
        sourcemap: true,
        platform: "browser",
        format: "cjs",
        loader: {
            ".jpg": "file",
            ".ttf": "file"
        }
    });

    // build server side bundle
    await esb.build({
        entryPoints: [join(__dirname, "../src/main.tsx")],
        bundle: true,
        outfile: join(__dirname, "../dist/out.cjs"),
        platform: "node",
        minify: true,
        sourcemap: true,
        format: "cjs",
    });
})();
