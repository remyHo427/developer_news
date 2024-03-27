export default function required(value, msg) {
    if (value === null || value === undefined) {
        throw new Error(msg);
    }
}
