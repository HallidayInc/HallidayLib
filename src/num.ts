export function byteLen(x: bigint): number {
    let len = 0;
    for (let tmp = x; tmp > 0n; tmp >>= 8n) {
        len++;
    }
    return len;
}
