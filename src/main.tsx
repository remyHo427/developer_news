/** @jsx h */
import { h } from "preact";
import { render } from "preact-render-to-string";
import { Router } from "wouter-preact";
import process from "node:process";
import Fastify from "fastify";
import App from "./app";

const fastify = Fastify({
    logger: true,
});

const ServerApp = ({ req, res }) => {
    return (
        <Router ssrPath={req.path} ssrSearch={req.search}>
            <App />
        </Router>
    );
};

fastify.get("*", (req, res) => {
    const rend = render(<ServerApp req={req} res={res} />);

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
