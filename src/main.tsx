/** @jsx h */
import { h } from "preact";
import { render } from "preact-render-to-string";
import { Router } from "wouter-preact";
import process from "node:process";
import Fastify from "fastify";
import App from "./app";
import fastify_static from "@fastify/static";
import path from "node:path";

const fastify = Fastify({
    logger: true,
});

const ServerApp = ({ req, res }) => {
    const [path, query] = req.url.split("?");
    return (
        <Router ssrPath={path} ssrSearch={query}>
            <App />
        </Router>
    );
};

fastify.register(fastify_static, {
    root: path.join(__dirname, "public"),
});

fastify.get("/", (req, res) => {
    const rend = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Page</title>
            <script defer type="module" src="/client.js"></script>
        </head>
        <body>
            <div id="root">${render(<ServerApp req={req} res={res} />)}</div>
        </body>
        </html>
    `;

    res.code(200).type("text/html").send(rend);
});

(async function main() {
    try {
        await fastify.listen({ port: 3000 });
    } catch (e) {
        fastify.log.error(e);
        process.exit(1);
    }
})();
