import { Errno } from "./types";

const ROOT = "http://localhost:3000";

interface Options {
    method: "POST" | "GET" | "PUT" | "DELETE";
    body?: Record<string, unknown>;
}
const req = async (path: string, opts: Options) => {
    const res = await fetch(`${ROOT}${path}`, {
        method: opts.method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(opts.body),
    });

    if (res.status === 200) {
        return res.json();
    } else {
        const errno = await res.text();
        console.error(Errno[Number.parseInt(errno)]);
        return errno;
    }
};

export const UserLogin = async (login: string, password: string) =>
    req("/api/user/login", {
        method: "POST",
        body: {
            login,
            password,
        },
    });
export const GetUserHeader = async () =>
    req("/api/user/header", { method: "GET" });
