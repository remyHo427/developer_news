import { DELETE, GET, POST, PUT, User } from "../types";

export const GetUserById = new GET("/user/:name", async (req, res, knex) => {
    res.send(408);
});
export const CreateUser = new POST(
    "/user",
    async (req, res, knex) => {
        const { email, password, name } = req.body as {
            name: string;
            email: string;
            password: string;
        };

        const table = knex<User>(`User`);
        const names = await table.select().where("name", name);
        const emails = await table.select().where("email", email);

        // check
        if (names.length) {
            res.status(409).send("Username already exists");
        } else if (emails.length) {
            res.status(409).send("Email already registered");
        }

        // insert
        await table.insert({
            uuid: knex.raw("UUID_TO_BIN(UUID())"),
            name,
            email,
            password: knex.raw('SHA2("?", 256)', [password]),
        });

        res.send(200);
    },
    {
        schema: {
            body: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" },
                },
                required: ["name", "email", "password"],
            },
        },
    },
);
export const UpdateUser = new PUT("/user/:name", async (req, res, knex) => {
    res.send(404);
});
export const DeleteUser = new DELETE("/user/:name", async (req, res, knex) => {
    res.send(404);
});
