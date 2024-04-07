import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import jwt from "jsonwebtoken";
import { Errno } from "./types";

const read = (path: string) => readFileSync(resolve(__dirname, path));
// RSA
const private_key = read("../crypt/private.pem");
const public_key = read("../crypt/public.pem");

export function verify(toks?: string) {
    if (!toks) {
        throw [401];
    }
    const { uuid, name, iat, exp } = jwt.verify(toks, public_key) as {
        uuid: string;
        name: string;
        iat: number;
        exp: number;
    };
    const now = Date.now();
    if (iat * 1000 >= now || now >= exp * 1000) {
        throw [401];
    }

    return { uuid, name };
}

export function sign(uuid: string, name: string) {
    return jwt.sign({ uuid, name }, private_key, {
        algorithm: "RS256",
        expiresIn: "15m",
        issuer: "developer news api",
        subject: name,
        audience: "https://developernews.net", // change to owned domain name
    });
}
