import { POST } from "../types";

export const CreatePost = new POST(
    "/thread/create",
    async (req, res, knex) => {},
    {
        schema: {
            body: {
                type: "object",
                properties: {
                    titie: { type: "string" },
                    url: { type: "string" },
                    text: { type: "string" },
                },
            },
        },
    },
);
