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

    routes
        .map((d) => Object.values(d))
        .reduce((c, a) => a.concat(c), [])
        .forEach(({ method, route, handler, options }) =>
            map[method].bind(fastify)(
                "/api" + route,
                options || {},
                async (req, res) => {
                    try {
                        await handler(req, res, knex);
                    } catch (e) {
                        if (Array.isArray(e)) {
                            const [status, errno] = e;
                            return res.status(status).send(errno);
                        } else {
                            console.error(e);
                        }
                    }
                },
            ),
        );
}
