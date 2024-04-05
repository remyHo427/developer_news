import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import esb from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function build() {
    await esb.build({
        entryPoints: [resolve(__dirname, "../../src/server.tsx")],
        bundle: true,
        outfile: resolve(__dirname, "../../dist/out.cjs"),
        platform: "node",
        minify: false,
        sourcemap: true,
        format: "cjs",
        external: [
            "pg",
            "tedious",
            "oracledb",
            "better-sqlite3",
            "pg-query-stream",
            "mysql",
            "sqlite3",
        ],
    });
    const ctx = await esb.context({
        entryPoints: ["./src/client.tsx"],
        minify: true,
        sourcemap: true,
        outfile: resolve(__dirname, "../../dist/public/client.js"),
        bundle: true,
        plugins: [sassPlugin()],
        jsxFactory: "h",
        jsxFragment: "fragment",
        metafile: true,
    });

    await ctx.watch();
    console.log("watching...");
}
