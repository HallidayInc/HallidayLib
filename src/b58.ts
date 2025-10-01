import { byteLen } from "./num.ts";

const B58_ALPHA = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const B58_CODES = Uint8Array.from(B58_ALPHA, (c) => c.charCodeAt(0));
const B58_TABLE = [...B58_ALPHA].reduce((m, l, i) => (m[B58_ALPHA.charCodeAt(i)] = i, m), new Uint8Array(128));
const B58_ZERO = "1".charCodeAt(0);
const decoder = new TextDecoder();

export function base58ToBigInt(s: string): bigint {
    let acc = 0n;
    for (let i = 0; i < s.length; i++) {
        acc = acc * 58n + BigInt(B58_TABLE[s.charCodeAt(i)]);
    }
    return acc;
}

export function bigIntToBase58(x: bigint, z = 32): string {
    const len = byteLen(x);
    const pad = z > len ? (z - len) : 0;
    const num = Math.max(z, len);
    const cap = Math.ceil(num * 1.37) + 2; // log₅₈(256)
    const out = new Uint8Array(cap + pad).fill(B58_ZERO);
    let i = out.length, n = x;
    while (n > 0n) {
        const d = Number(n % 58n);
        out[--i] = B58_CODES[d];
        n /= 58n;
    }
    return decoder.decode(out.subarray(i - pad));
}
