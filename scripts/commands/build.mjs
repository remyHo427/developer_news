import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import esb from "esbuild";
import required from "../required.mjs";
import { sassPlugin } from "esbuild-sass-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function build(cfg) {
    const { entryPoint, minify, outfile, sourcemap } = {
        ...{
            minify: true,
            sourcemap: true,
        },
        ...cfg,
    };

    required(entryPoint, "an entry point is required");
    required(outfile, "an output file is required");

    await esb.build({
        entryPoints: [resolve(__dirname, "../../src/server.tsx")],
        bundle: true,
        outfile: resolve(__dirname, "../../dist/out.cjs"),
        platform: "node",
        minify: true,
        sourcemap: true,
        format: "cjs",
    });

    return await esb.build({
        entryPoints: [entryPoint],
        minify,
        sourcemap,
        outfile,
        bundle: true,
        plugins: [sassPlugin()],
        jsxFactory: "h",
        jsxFragment: "fragment",
        metafile: true,
    });
}
