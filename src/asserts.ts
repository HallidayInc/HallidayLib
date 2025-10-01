import { assertEquals, AssertionError } from "jsr:@std/assert";
import { z } from "zod";
import { HSON } from "./hson.ts";

export * from "jsr:@std/assert";

export interface SchemaError {
    code: string;
    message: string;
    path: string[];
}

export async function assertSchemaError(fn: () => any, props: Partial<SchemaError> | Partial<SchemaError>[]) {
    try {
        await fn();
        throw new AssertionError(`Expected schema error`);
    } catch (e: any) {
        if (e instanceof z.ZodError) {
            const issues = JSON.parse(e.message) as any[];
            for (const p of ([] as any).concat(props)) {
                if (!issues.some((issue) => Object.keys(p).every((k) => issue[k] == p[k]))) {
                    throw new AssertionError(`Expected ${JSON.stringify(p)}, but not found in ${e.message}`);
                }
            }
        } else {
            throw e;
        }
    }
}

export function assertError(actual: any, expected: Error): void {
    // Compare the error types and the error messages
    if (actual.constructor !== expected.constructor) {
        throw new AssertionError(
            `Expected error of type "${expected.constructor.name}", but got "${actual.constructor.name}"`,
        );
    }

    if (actual.message !== expected.message) {
        throw new AssertionError(`Expected error message "${expected.message}", but got "${actual.message}"`);
    }
}

export function assertHSONEquals(a: object, b: object) {
    assertEquals(HSON.stringify(a), HSON.stringify(b));
}
