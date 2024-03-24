/** @jsx h */
import { h } from "preact";
import { hydrate } from "preact";
import App from "./app";

//
import "./styles/reset.scss";
import "./styles/global.scss";
import "./styles/font.scss";
import "./styles/app.scss";
import "./styles/homepage.scss";

hydrate(<App />, document.getElementById("root")!);
