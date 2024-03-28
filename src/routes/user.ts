import { DELETE, GET, POST, PUT } from "../types";

export const GetUserById = new GET("/user/:uid", async (req, res, knex) => {
    res.send(500);
});
export const CreateUser = new POST("/user/:uid", async (req, res, knex) => {
    res.send(500);
});
export const UpdateUser = new PUT("/user/:uid", async (req, res, knex) => {
    res.send(500);
});
export const DeleteUser = new DELETE("/user/:uid", async (req, res, knex) => {
    res.send(500);
});
