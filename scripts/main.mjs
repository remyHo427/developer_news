import process from "node:process";
import build from "./commands/build.mjs";
import watch from "./commands/watch.mjs";

(async function () {
    switch (process.argv[2]) {
        case "build":
            await build();
            break;
        case "watch":
            await watch();
            break;
    }
})();
