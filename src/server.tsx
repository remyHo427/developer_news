/** @jsx h */
import { h } from "preact";
import { render } from "preact-render-to-string";
import { Router } from "wouter-preact";
import Fastify from "fastify";
import fastify_static from "@fastify/static";
import fastify_compress from "@fastify/compress";
import fastify_cookie from "@fastify/cookie";
import path, { resolve } from "node:path";
import process from "node:process";
import * as ws from "ws";
import knex_init from "knex";
import chokidar from "chokidar";
import App from "./app";
import prerender, { html } from "./prerender";
import attach from "./attach";
import "dotenv/config";

const wss = new ws.WebSocketServer({ noServer: true });
const watcher = chokidar.watch(resolve(__dirname, "./dist/public"));
const pages_map = prerender("/", "/login");
const fastify = Fastify({
    logger: false,
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

// attach api routes (has higher precedence than ssr)
attach(fastify, knex);

// ssr
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
        await fastify.listen({ port: 3000 });
    } catch (e) {
        fastify.log.error(e);
        process.exit(1);
    }
})();
