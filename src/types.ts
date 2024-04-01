import { FastifyReply, FastifyRequest } from "fastify";
import { Knex } from "knex";

type Obj = Record<string, unknown>;

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
    readonly options: Obj | undefined;

    constructor(
        method: Method,
        route: string,
        handler: RouteHandler,
        options?: Obj,
    ) {
        this.method = method;
        this.route = route;
        this.handler = handler;
        this.options = options;
    }
}
export class GET extends Route {
    constructor(route: string, handler: RouteHandler, options?: Obj) {
        super(Method.GET, route, handler, options);
    }
}
export class POST extends Route {
    constructor(route: string, handler: RouteHandler, options?: Obj) {
        super(Method.POST, route, handler, options);
    }
}
export class PUT extends Route {
    constructor(route: string, handler: RouteHandler, options?: Obj) {
        super(Method.PUT, route, handler, options);
    }
}
export class DELETE extends Route {
    constructor(route: string, handler: RouteHandler, options?: Obj) {
        super(Method.DELETE, route, handler, options);
    }
}

// models
export interface User {
    uuid: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}
