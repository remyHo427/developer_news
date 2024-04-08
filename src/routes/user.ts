import crypto from "crypto";
import { POST, GET, User, Errno } from "../types";
import { sign, verify } from "../util";

const hpass = (pass: string, salt: string) =>
    crypto
        .createHash("sha256")
        .update(pass + process.env.PEPPER + salt)
        .digest("hex");

export const CreateUser = new POST(
    "/user/register",
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
            throw [409, Errno.USER_ALREADY_EXIST];
        } else if (duplicateEmail) {
            throw [409, Errno.USER_EMAIL_REGISTERED];
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

        return res.status(200).send();
    },
    {
        schema: {
            body: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                },
                required: ["name", "email", "password"],
            },
        },
    },
);
export const UserLogin = new POST(
    "/user/login",
    async (req, res, knex) => {
        const { NODE_ENV } = process.env as {
            PEPPER: string;
            NODE_ENV: string;
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
        if (!user || hpass(password, user.salt) !== user.password) {
            throw [400, Errno.USER_INVALID_LOGIN_OR_PASS];
        }

        res.setCookie("token", sign(user.uuid, user.name), {
            httpOnly: true,
            maxAge: 1800,
            path: "/",
            secure: NODE_ENV === "production",
        });

        return res.status(200).send({});
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
    "/user/change_password_email",
    async (req, res, knex) => {
        // TODO: implement after email servicCes are set up
        return res.status(403).send();
    },
);
export const ChangePasswordWhenLoggedIn = new POST(
    "/user/change_password",
    async (req, res, knex) => {
        const { uuid } = verify(req.cookies.token);
        const { old_password, new_password } = req.body as {
            old_password: string;
            new_password: string;
        };
        const user = await knex<User>("User")
            .select()
            .where("uuid", uuid)
            .first();
        if (!user) {
            throw [400];
        }

        const { password, salt } = user;
        if (hpass(old_password, salt) !== password) {
            throw [400, Errno.USER_INCORRECT_OLD_PASS];
        }

        await knex<User>("User")
            .where("uuid", uuid)
            .update({ password: hpass(new_password, salt) });

        return res.status(200).send();
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

export const GetUserHeaderInfo = new GET(
    "/user/info",
    async (req, res, knex) => {
        const { uuid } = verify(req.cookies.token);

        const user = await knex<User>("User")
            .columns("name", "karma")
            .where("uuid", uuid)
            .first();
        if (!user) {
            throw [404];
        }

        return res.status(200).send(user);
    },
);
