import { FastifyInstance } from "fastify";
import { Knex } from "knex";
import routes from "./routes/index";

export default function attach(fastify: FastifyInstance, knex: Knex) {
    const map = [
        fastify.get,
        fastify.delete,
        fastify.put,
        fastify.post,
    ] as const;

    for (const [k, r] of Object.entries(routes)) {
        console.log(`adding ${k} routes:`);
        for (const [k, { method, route, handler }] of Object.entries(r)) {
            console.log(`\tadding ${k}...`);
            map[method].bind(fastify)(`/api${route}`, (req, res) =>
                handler(req, res, knex),
            );
        }
    }
}
