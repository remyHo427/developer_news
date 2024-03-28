import { FastifyReply, FastifyRequest } from "fastify";
import { Knex } from "knex";
// helpers
export enum Method {
    GET,
    POST,
    PUT,
    DELETE,
}
export type RouteHandler = (
    req: FastifyRequest,
    res: FastifyReply,
    knex: Knex,
) => void;
export class Route {
    readonly method: Method;
    readonly handler: RouteHandler;
    readonly route: string;

    constructor(method: Method, route: string, handler: RouteHandler) {
        this.method = method;
        this.route = route;
        this.handler = handler;
    }
}
export class GET extends Route {
    constructor(route: string, handler: RouteHandler) {
        super(Method.GET, route, handler);
    }
}
export class POST extends Route {
    constructor(route: string, handler: RouteHandler) {
        super(Method.POST, route, handler);
    }
}
export class PUT extends Route {
    constructor(route: string, handler: RouteHandler) {
        super(Method.PUT, route, handler);
    }
}
export class DELETE extends Route {
    constructor(route: string, handler: RouteHandler) {
        super(Method.DELETE, route, handler);
    }
}

// models
