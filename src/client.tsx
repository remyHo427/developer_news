/** @jsx h */
import { h } from "preact";
import { hydrate } from "preact";
import App from "./app";

hydrate(<App />, document.getElementById("root")!);
