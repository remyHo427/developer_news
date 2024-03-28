/** @jsx h */
import { h } from "preact";
import { render } from "preact-render-to-string";
import { Router } from "wouter-preact";
import process from "node:process";
import Fastify from "fastify";
import App from "./app";
import fastify_static from "@fastify/static";
import fastify_compress from "@fastify/compress";
import path from "node:path";
import prerender, { html } from "./prerender";

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
