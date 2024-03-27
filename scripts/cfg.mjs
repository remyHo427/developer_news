import fs from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

export default async function readConfig(path) {
    const rootDir = dirname(fileURLToPath(import.meta.url));
    const configPath = path || resolve(rootDir, "../config.json");
    const { readFile } = fs.promises;
    const { existsSync } = fs;

    if (existsSync(configPath)) {
        return JSON.parse(
            await readFile(configPath, { encoding: "utf-8", flag: "r" }),
        );
    } else {
        return {};
    }
}
