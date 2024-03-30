import crypto from "node:crypto";
import { DELETE, GET, POST, PUT } from "../types";

export const GetUserById = new GET("/user/:name", async (req, res, knex) => {
    res.send(408);
});
export const CreateUser = new POST("/user", async (req, res, knex) => {
    const { name, email, password } = req.body;

    await knex("User").insert({
        uuid: knex.raw("UUID_TO_BIN(UUID())"),
        name,
        email,
        password: knex.raw('SHA2("?", 256)', [password]),
    });

    res.send(200);
});
export const UpdateUser = new PUT("/user/:name", async (req, res, knex) => {
    res.send(404);
});
export const DeleteUser = new DELETE("/user/:name", async (req, res, knex) => {
    res.send(404);
});
