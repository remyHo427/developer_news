/** @jsx h */
import { h } from "preact";
import { render } from "preact-render-to-string";
import { Router } from "wouter-preact";
import Fastify from "fastify";
import fastify_static from "@fastify/static";
import fastify_compress from "@fastify/compress";
import fastify_cookie from "@fastify/cookie";
import fastify_cors from "@fastify/cors";
import path, { resolve } from "node:path";
import process from "node:process";
import { readFileSync } from "node:fs";
import https from "node:https";
import * as ws from "ws";
import knex_init from "knex";
import chokidar from "chokidar";
import App from "./app";
import prerender, { html } from "./prerender";
import attach from "./attach";
import "dotenv/config";

const file_path = (path: string) => resolve(__dirname, path);
const read = (path: string) => readFileSync(file_path(path));

// SSL
const cert = read("../crypt/localhost.crt");
const key = read("../crypt/localhost.key");

// auto reload
const server = https.createServer({ cert, key });
const wss = new ws.WebSocketServer({ server });
const watcher = chokidar.watch(file_path("./dist/public"));

// api
const fastify = Fastify({
    logger: false,
    https: { key, cert, passphrase: process.env.HTTPS_PASS },
});
const knex = knex_init({
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST,
        port: Number.parseInt(process.env.DB_PORT as string),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    },
});

// plugins
fastify.register(fastify_cookie, {
    secret: process.env.COOKIE_SECRET,
});
fastify.register(fastify_compress);
fastify.register(fastify_static, {
    root: path.join(__dirname, "public"),
    prefix: "/",
    wildcard: false,
});
fastify.register(fastify_cors, {
    origin: "*", // swap in production
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
});

// attach api routes (has higher precedence than ssr)
attach<typeof fastify>(fastify, knex);

// ssr
const pages_map = prerender("/", "/login");
fastify.get("*", (req, res) => {
    const [path, query] = req.url.split("?");
    const result =
        pages_map.get(path) ||
        html(
            render(
                <Router ssrPath={path} ssrSearch={query}>
                    <App />
                </Router>,
            ),
        );
    res.code(200).type("text/html").send(result);
});

// live reload (only in dev)
if (process.env.NODE_ENV !== "production") {
    wss.on("connection", () => {});
    watcher.on("change", () => {
        wss.clients.forEach((c) => {
            if (c.readyState === 1) {
                c.send("reload");
            }
        });
    });
    fastify.server.on("upgrade", (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request);
        });
    });
}

(async function main() {
    try {
        server.listen(8080, () => {
            console.log("wss server listening at 8080...");
        });
        await fastify.listen({ port: 3000 });
    } catch (e) {
        fastify.log.error(e);
        process.exit(1);
    }
})();
