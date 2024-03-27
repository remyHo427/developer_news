export default function parse(argv, startFrom = 0) {
    const args = argv.slice(startFrom);
    return {
        verb: args[0],
        simples: getSimpleFlags(args),
        longs: getLongFlags(args),
        pairs: getPairFlags(args),
    };
}

function getSimpleFlags(args) {
    const a = getargs(args, "-", /^[a-zA-Z]+$/, 1)
        .map((a) => (a.length > 1 ? a.split("") : a))
        .flat();

    return dedup(a);
}
function getLongFlags(args) {
    const a = getargs(args, "--", /^[a-zA-Z]{2,}$/, 1);

    return Object.fromEntries(dedup(a).map((a) => [a, true]));
}
function getPairFlags(args) {
    const a = getargs(args, "--", /^[a-zA-Z]+=[a-zA-Z0-9\.]+$/, 1);

    return Object.fromEntries(dedup(a).map((p) => p.split("=")));
}

function getargs(args, prefix, regex, startFrom = 0) {
    return args
        .slice(startFrom)
        .filter((a) => a.startsWith(prefix))
        .map((a) => a.slice(prefix.length))
        .filter((a) => regex.test(a));
}
function dedup(str) {
    const map = new Map();

    for (const s of str) {
        if (!map.get(s)) {
            map.set(s, null);
        }
    }

    return Array.from(map.keys());
}
