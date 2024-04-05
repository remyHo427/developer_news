import { FastifyInstance } from "fastify";
import { Knex } from "knex";
import routes from "./routes/index";
import { Method } from "./types";

export default function attach<T extends FastifyInstance>(
    fastify: T,
    knex: Knex,
) {
    const map = [
        fastify.get,
        fastify.post,
        fastify.put,
        fastify.delete,
    ] as const;

    for (const [_, r] of Object.entries(routes)) {
        for (const [_, { method, route, handler, options }] of Object.entries(
            r,
        )) {
            console.log(`\tadding ${Method[method]}:/api${route}"...`);
            if (options !== undefined) {
                map[method].bind(fastify)(`/api${route}`, options, (req, res) =>
                    handler(req, res, knex),
                );
            } else {
                map[method].bind(fastify)(`/api${route}`, (req, res) =>
                    handler(req, res, knex),
                );
            }
        }
    }
}
