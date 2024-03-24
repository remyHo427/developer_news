/** @jsx h */
import { h } from "preact";
import { hydrate } from "preact";
import App from "./app";
import "./styles/main.scss";

hydrate(<App />, document.getElementById("root")!);
