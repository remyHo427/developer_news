import { POST, GET, User } from "../types";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const hpass = (pass: string, salt: string) =>
    crypto
        .createHash("sha256")
        .update(pass + process.env.PEPPER + salt)
        .digest("hex");

export const CreateUser = new POST(
    "/user",
    async (req, res, knex) => {
        const { email, password, name } = req.body as {
            name: string;
            email: string;
            password: string;
        };

        const duplicateUser = await knex<User>("User")
            .select()
            .where("name", name)
            .first();
        const duplicateEmail = await knex<User>("User")
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
        const salt = crypto.randomBytes(16).toString("hex");
        const hashedPassword = hpass(password, salt);
        await knex<User>("User").insert({
            uuid: crypto.randomUUID(),
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
        const { NODE_ENV, TOKEN_SECRET } = process.env as {
            PEPPER: string;
            NODE_ENV: string;
            TOKEN_SECRET: string;
        };
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

        // verify
        if (!user) {
            res.status(400).send("Invalid username/email or password");
            return;
        }
        if (hpass(password, user.salt) !== user.password) {
            res.status(400).send("Invalid username/email or password");
            return;
        }

        // issue token
        const token = jwt.sign({ uuid: user.uuid }, TOKEN_SECRET, {
            expiresIn: "1h",
        });
        res.setCookie("token", token, {
            httpOnly: true,
            maxAge: 3600,
            path: "/",
            secure: NODE_ENV === "production",
        });

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
export const ChangePasswordViaEmail = new POST(
    "/change_password_email",
    async (req, res, knex) => {
        // TODO: implement after email services are set up
    },
);
export const ChangePasswordWhenLoggedIn = new POST(
    "/change_password",
    async (req, res, knex) => {
        const toks = req.cookies.token;
        if (!toks) {
            return res.status(400).send("Invalid request, contact developer.");
        }

        const { uuid, iat, exp } = jwt.decode(toks) as {
            uuid: string;
            iat: number;
            exp: number;
        };

        // check date
        const now = Date.now();
        if (iat * 1000 >= now || now >= exp * 1000) {
            return res.status(400).send("Invalid token");
        }

        // check if user exists by uuid
        const user = await knex<User>("User")
            .select()
            .where("uuid", uuid)
            .first();
        if (!user) {
            return res.status(400).send("Invalid token");
        }

        // check old password
        const { old_password, new_password } = req.body as {
            old_password: string;
            new_password: string;
        };
        const { password, salt } = user;
        if (hpass(old_password, salt) !== password) {
            return res.status(400).send("Old password is incorrect");
        }

        // update
        await knex<User>("User")
            .where("uuid", uuid)
            .update({ password: hpass(new_password, salt) });

        return res.send(200);
    },
    {
        schema: {
            body: {
                type: "object",
                properties: {
                    old_password: { type: "string" },
                    new_password: { type: "string" },
                },
                required: ["old_password", "new_password"],
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
