import process from "node:process";
import parse from "./args.mjs";
import build from "./commands/build.mjs";
import readConfig from "./cfg.mjs";

const commands = { build };

(async function () {
    const { verb, simples, longs, pairs } = parse(process.argv, 2);
    const json = await readConfig(pairs.config);
    const command = commands[verb];

    const cfg = { ...json, ...pairs, ...longs };

    if (command) {
        command(cfg);
    } else {
        if (verb.length === 0 || !verb) console.log("no verb is given");
        else console.log(`unknown verb "${verb}"`);
        process.exit(1);
    }
})();
