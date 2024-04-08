import { GET, POST, Thread } from "../types";
import { verify } from "../util";

export const CreatePost = new POST(
    "/thread/create",
    async (req, res, knex) => {
        const { uuid } = verify(req.cookies.token);
        const { title, url, text } = req.body as {
            title: string;
            url: string;
            text: string;
        };

        await knex<Thread>("Thread").insert({
            uuid: crypto.randomUUID(),
            title,
            url,
            text,
            author: uuid,
        });

        return res.status(200).send();
    },
    {
        schema: {
            body: {
                type: "object",
                properties: {
                    titie: { type: "string" },
                    url: { type: "string", format: "url" },
                    text: { type: "string" },
                },
                required: ["title", "url", "text"],
            },
        },
    },
);

export const GetPostByDate = new GET(
    "/thread/date",
    async (req, res, knex) => {
        const { start, end, perPage, page, ascending } = req.query as {
            start: number;
            end: number;
            page: number;
            perPage: number;
            ascending: boolean;
        };
        const threads = await knex
            .select(
                "Thread.title",
                "Thread.url",
                "Thread.text",
                "Thread.createdAt",
                "Thread.uuid",
                "User.name as author",
                "Thread.votes",
            )
            .from("Thread")
            .join("User", "Thread.author", "User.uuid");
        // .whereBetween("Thread.createdAt", [new Date(start), new Date(end)]);

        res.status(200).send(threads);
    },
    {
        schema: {
            query: {
                type: "object",
                properties: {
                    start: { type: "integer" },
                    end: { type: "integer" },
                    page: { type: "integer" },
                    perPage: { type: "integer" },
                    ascending: { type: "boolean" },
                },
                required: ["start", "end", "page", "perPage", "ascending"],
            },
        },
    },
);
