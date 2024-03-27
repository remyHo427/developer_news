import esb from "esbuild";
import required from "../required.mjs";
import { sassPlugin } from "esbuild-sass-plugin";

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
