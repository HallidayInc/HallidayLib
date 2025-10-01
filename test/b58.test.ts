import { assertEquals } from "@asserts";
import { base58ToBigInt, bigIntToBase58 } from "@halliday";

Deno.test("base58 decoding / encoding", async () => {
    const d1 = 6785n;
    const e1 = "11111111111111111111111111111131z";
    const e2 = "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH";
    assertEquals(base58ToBigInt(e1), d1);
    assertEquals(bigIntToBase58(d1), e1);
    assertEquals(bigIntToBase58(base58ToBigInt(e2)), e2);
});
