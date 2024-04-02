import { POST, GET, User } from "../types";
import crypto from "crypto";

export const CreateUser = new POST(
    "/user",
    async (req, res, knex) => {
        const salt = crypto.randomBytes(16).toString("hex");
        const { PEPPER } = process.env;
        const { email, password, name } = req.body as {
            name: string;
            email: string;
            password: string;
        };

        const table = knex<User>("User");
        const duplicateUser = await table.select().where("name", name).first();
        const duplicateEmail = await table
            .select()
            .where("email", email)
            .first();

        // check
        if (duplicateUser) {
            return res.status(409).send("Username already exists");
        } else if (duplicateEmail) {
            return res.status(409).send("Email already registered");
        }

        // TODO: email verification

        // insert
        const hashedPassword = crypto
            .createHash("sha256")
            .update(password + PEPPER + salt)
            .digest("hex");
        await table.insert({
            uuid: knex.raw("UUID_TO_BIN(UUID())"),
            name,
            email,
            salt,
            password: hashedPassword,
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
export const UserLogin = new POST(
    "/login",
    async (req, res, knex) => {
        const { PEPPER } = process.env;
        const { login, password } = req.body as {
            login: string; // login is either email or username
            password: string;
        };

        const table = knex<User>("User");
        const user = await table
            .select()
            .where("name", login)
            .orWhere("email", login)
            .first();

        if (!user) {
            res.status(400).send("Invalid username/email or password");
            return;
        }

        const hashedPassword = crypto
            .createHash("sha256")
            .update(password + PEPPER + user.salt)
            .digest("hex");

        if (hashedPassword !== user.password) {
            res.status(400).send("Invalid username/email or password");
            return;
        }

        // issue token
        res.send(200);
    },
    {
        schema: {
            body: {
                type: "object",
                properties: {
                    login: { type: "string" },
                    password: { type: "string" },
                },
                required: ["login", "password"],
            },
        },
    },
);

// TODO
export const GetUserInfo = new GET("/user/:name", async (req, res, knex) => {
    // TODO: set up this API to return public user info
    // for display in /user page in frontend
    res.send(404);
});

// GET example
// export const GetUserById = new GET("/user/:name", async (req, res, knex) => {
//     const { name } = req.params as { name: string };

//     const table = knex<User>("User");
//     const usr = await table.select().where("name", name).first();

//     if (!usr) {
//         res.status(404).send("User not found");
//         return;
//     }

//     res.status(200).send({
//         name: usr.name,
//         email: usr.email,
//         createdAt: usr.createdAt,
//     });
// });
