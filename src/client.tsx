/** @jsx h */
import { h } from "preact";
import { hydrate } from "preact";
import { Router } from "wouter-preact";
import App from "./app";

const ClientApp = () => {
    return (
        <Router>
            <App />
        </Router>
    );
};

hydrate(<ClientApp />, document.getElementById("root")!);
