import process from "node:process";
import Fastify from "fastify";

const fastify = Fastify({
    logger: true,
});

fastify.get("/", async (req, rep) => ({
    hello: "world",
}));

(async function main() {
    try {
        await fastify.listen({ port: 3000 });
    } catch (e) {
        fastify.log.error(e);
        process.exit(1);
    }
})();
