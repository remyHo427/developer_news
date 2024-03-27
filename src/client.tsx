/** @jsx h */
import { h, hydrate } from "preact";
import App from "./app";
import "./styles/main.scss";

hydrate(<App />, document.getElementById("root")!);
