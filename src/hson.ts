export class HSON {
    static replacer = (_: any, value: any) => {
        if (typeof value === "bigint") {
            return { "#": value.toString() };
        }
        return value;
    };

    static reviver = (_: any, value: any) => {
        if (value && typeof value === "object" && "#" in value && Object.keys(value).length === 1) {
            return BigInt(value["#"]);
        }
        return value;
    };

    static stringify(obj: any, space?: number | string): string {
        return JSON.stringify(obj, (this ?? HSON).replacer, space);
    }

    static parse(str: string): any {
        return JSON.parse(str, (this ?? HSON).reviver);
    }
}
