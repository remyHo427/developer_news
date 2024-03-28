/** @jsx h */
import { h } from "preact";
import { render } from "preact-render-to-string";
import { Router } from "wouter-preact";
import fs from "node:fs";
import App from "./app";
import { join } from "node:path";

export default async function prerender(routes: [string, string][]) {
    for (const [route, out] of routes) {
        const rend = html(
            render(
                <Router ssrPath={route} ssrSearch="">
                    <App />
                </Router>,
            ),
        );
        await fs.promises.writeFile(join(__dirname, "./public/", out), rend, {
            encoding: "utf-8",
        });
    }
}

export const html = (str: string) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Page</title>
        <script defer type="module" src="/client.js"></script>
        <link rel="stylesheet" href="/client.css">
    </head>
    <body>
        <div id="root">${str}</div>
    </body>
    </html>
`;
