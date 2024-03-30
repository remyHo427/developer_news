import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import esb from "esbuild";
import required from "../required.mjs";
import { sassPlugin } from "esbuild-sass-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function build(cfg) {
    const { entryPoint, minify, outfile, sourcemap, watch, db } = {
        ...{
            minify: true,
            sourcemap: true,
            watch: false,
        },
        ...cfg,
    };

    required(entryPoint, "an entry point is required");
    required(outfile, "an output file is required");
    required(db.host, "a database host is required");
    required(db.port, "a database port is required");
    required(db.user, "a database user is required");
    required(db.password, "a database password is required");
    required(db.database, "a database is required");

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
        define: {
            "process.env.DB_HOST": db.host,
            "process.env.DB_PORT": db.port,
            "process.env.DB_USER": db.user,
            "process.env.DB_PASSWORD": db.password,
            "process.env.DB_DATABASE": db.database,
        },
    });

    if (watch) {
        const ctx = await esb.context({
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
        await ctx.watch();
        console.log("watching...");
    } else {
        await esb.build({
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
}
