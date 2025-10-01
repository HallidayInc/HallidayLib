import { assertEquals } from "@asserts";
import { HSON } from "@halliday";

Deno.test("stringify and parse", () => {
    const obj = {
        id: 1n,
        name: "Test",
        value: 100n,
    };

    const serialized = HSON.stringify(obj);
    assertEquals(serialized, '{"id":{"#":"1"},"name":"Test","value":{"#":"100"}}');

    const parsed = HSON.parse(serialized);
    assertEquals(parsed, obj);
});

Deno.test("arrays with bigint values", () => {
    const arr = [1n, 2n, 3n];
    const serialized = HSON.stringify(arr);
    assertEquals(serialized, '[{"#":"1"},{"#":"2"},{"#":"3"}]');

    const parsed = HSON.parse(serialized);
    assertEquals(parsed, arr);
});

Deno.test("should parse correct types", () => {
    const obj = {
        value1: 1n,
        value2: "string",
        value3: true,
    };

    const serialized = HSON.stringify(obj);
    assertEquals(serialized, '{"value1":{"#":"1"},"value2":"string","value3":true}');

    const parsed = HSON.parse(serialized);
    assertEquals(parsed, obj);

    assertEquals(typeof parsed.value1, "bigint");
    assertEquals(typeof parsed.value2, "string");
    assertEquals(typeof parsed.value3, "boolean");
});

Deno.test("should handle nested objects", () => {
    const obj = {
        nested: {
            value1: 1n,
            value2: "string",
            value3: true,
        },
    };

    const serialized = HSON.stringify(obj);
    assertEquals(serialized, '{"nested":{"value1":{"#":"1"},"value2":"string","value3":true}}');

    const parsed = HSON.parse(serialized);
    assertEquals(parsed, obj);
});

Deno.test("should handle large bigint values", () => {
    const big_number = BigInt("1" + "0".repeat(100));
    const obj = {
        large_number: big_number,
    };

    const serialized = HSON.stringify(obj);
    const parsed = HSON.parse(serialized);

    assertEquals(parsed.large_number, big_number);
    assertEquals(typeof parsed.large_number, "bigint");
});

Deno.test("should handle deeply nested big int values", () => {
    const inner_obj = {
        value1: 1n,
        value2: 2n,
        value3: 3n,
    };

    const outer_obj = {
        nested: {
            nested2: {
                nested3: inner_obj,
            },
        },
    };

    const serialized = HSON.stringify(outer_obj);
    const parsed = HSON.parse(serialized);

    assertEquals(parsed, outer_obj);
    assertEquals(typeof parsed.nested.nested2.nested3.value1, "bigint");
    assertEquals(typeof parsed.nested.nested2.nested3.value2, "bigint");
    assertEquals(typeof parsed.nested.nested2.nested3.value3, "bigint");
});

Deno.test("should handle negative bigint values", () => {
    const obj = { value: -9007199254740993n };
    const serialized = HSON.stringify(obj);
    const parsed = HSON.parse(serialized);
    assertEquals(typeof parsed.value, "bigint");
    assertEquals(parsed.value, -9007199254740993n);
});

Deno.test("should handle zero as bigint", () => {
    const obj = { value: 0n };
    const serialized = HSON.stringify(obj);
    const parsed = HSON.parse(serialized);
    assertEquals(typeof parsed.value, "bigint");
    assertEquals(parsed.value, 0n);
});

Deno.test("should handle bigint at numeric limits", () => {
    const max_safe = BigInt(Number.MAX_SAFE_INTEGER);
    const obj = {
        at_limit: max_safe,
        beyond_limit: max_safe + 1n,
    };
    const serialized = HSON.stringify(obj);
    const parsed = HSON.parse(serialized);
    assertEquals(typeof parsed.at_limit, "bigint");
    assertEquals(typeof parsed.beyond_limit, "bigint");
    assertEquals(parsed.at_limit, max_safe);
    assertEquals(parsed.beyond_limit, max_safe + 1n);
});
