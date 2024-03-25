/** @jsx h */
import { h, hydrate } from "preact";
import App from "./app";
import "tachyons/css/tachyons.min.css";

hydrate(<App />, document.getElementById("root")!);
