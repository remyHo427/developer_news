import { Errno } from "./types";

const ROOT = "https://localhost:3000";

interface Options {
    method: "POST" | "GET" | "PUT" | "DELETE";
    body?: Record<string, unknown>;
}
const req = async (path: string, opts?: Options) => {
    const init: Record<string, unknown> = {
        method: opts?.method || "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    if (opts && opts.body) {
        init.body = JSON.stringify(opts.body);
    }

    const res = await fetch(`${ROOT}${path}`, init);

    if (res.status === 200) {
        return { data: await res.json(), errno: Errno.CLEAR, status: 200 };
    } else {
        const errno = Number.parseInt(await res.text());
        console.error(Errno[errno]);
        return { data: {}, errno, status: res.status };
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
export const GetUserInfo = async () => req("/api/user/info", { method: "GET" });
