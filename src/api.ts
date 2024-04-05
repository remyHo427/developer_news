// TODO: configure CORS and figure out a way to
// embed API root path during build
export const UserLogin = async (login: string, password: string) =>
    fetch(`http://localhost:3000/api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            login,
            password,
        }),
    }).then((res) => res.json());
