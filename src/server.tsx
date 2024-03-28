/** @jsx h */
import { h } from "preact";
import { render } from "preact-render-to-string";
import { Router } from "wouter-preact";
import Fastify from "fastify";
import fastify_static from "@fastify/static";
import fastify_compress from "@fastify/compress";
import path from "node:path";
import process from "node:process";
import knex_init from "knex";
import App from "./app";
import prerender, { html } from "./prerender";
import attach from "./attach";

const pages_map = prerender("/", "/login");
const fastify = Fastify({
    logger: false,
});

fastify.register(fastify_compress);
fastify.register(fastify_static, {
    root: path.join(__dirname, "public"),
    prefix: "/",
    wildcard: false,
});
const knex = knex_init({
    client: "mysql2",
    connection: {
        host: "localhost",
        port: 3306,
        user: "crocs",
        password: "guibt427",
        database: "developer_news_db",
    },
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

(async function main() {
    try {
        await fastify.listen({ port: 3000 });
    } catch (e) {
        fastify.log.error(e);
        process.exit(1);
    }
})();
