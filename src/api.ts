const ROOT = "http://localhost:3000";

export const UserLogin = async (login: string, password: string) =>
    fetch(`${ROOT}/api/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            login,
            password,
        }),
    }).then((res) => res.json());
export const GetUserHeader = async () =>
    fetch(`${ROOT}/api/user/header`).then((res) => res.json());
