import { FastifyInstance } from "fastify";
import { Knex } from "knex";
import routes from "./routes/index";

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

    for (const [k, r] of Object.entries(routes)) {
        console.log(`adding ${k} routes:`);
        for (const [k, { method, route, handler, options }] of Object.entries(
            r,
        )) {
            console.log(`\tadding ${k}...`);
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
