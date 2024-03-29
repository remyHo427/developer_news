/** @jsx h */
import { h } from "preact";
import { render } from "preact-render-to-string";
import { Router } from "wouter-preact";
import App from "./app";

const prerender = (...routes: string[]) => {
    const map = new Map<string, string>();

    for (const r of routes) {
        const rend = html(
            render(
                <Router ssrPath={r} ssrSearch="">
                    <App />
                </Router>,
            ),
        );
        map.set(r, rend);
    }

    return map;
};

export default prerender;
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
        <script>
            const ws = new WebSocket('ws://localhost:3000');
            ws.addEventListener('message', (event) => {
                if (event.data === 'reload') {
                    window.location.reload();
                }
            });
        </script>
    </body>
    </html>
`;
