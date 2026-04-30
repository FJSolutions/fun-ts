import {describe, expect, it} from "vitest";
import {jsonParser} from "./json-parser";
import {formatError, run} from "../../src/PC";

describe("JSON", () => {
    describe("root parsing", () => {
        it("parses an empty root object", () => {
            const source = "{\n}"
            const result = run(jsonParser, source)
            if (result.tag === "success") {
                expect(result.match).toBe("{}")
            } else {
                throw formatError(result)
            }
        })

        it("parses an empty root array", () => {
            const source = "[\n]"
            const result = run(jsonParser, source)
            if (result.tag === "success") {
                expect(result.match).toBe("[]")
            } else {
                throw formatError(result)
            }
        })

        it("parses a root array with a single empty object", () => {
            const source = "[\n{}\n]"
            const result = run(jsonParser, source)
            if (result.tag === "success") {
                expect(result.match).toBe("[{}]")
            } else {
                throw formatError(result)
            }
        })

        it("parses a root array with multiple empty object and tailing comma", () => {
            const source = "[\n{}, \n{} ,\n]"
            const result = run(jsonParser, source)
            if (result.tag === "success") {
                expect(result.match).toBe("[{},{}]")
            } else {
                throw formatError(result)
            }
        })
    })

    describe("root array of values", () => {
        it("parses a root array of numbers", () => {
            const source = "[1,2 , 3, 4, 5  ]"
            const result = run(jsonParser, source)
            if (result.tag === "success") {
                expect(result.match).toBe("[1,2,3,4,5]")
            } else {
                throw formatError(result)
            }
        })

        it("parses a root array of strings", () => {
            const source = `["FBJ", "NJ" ,"ZCJ" , ]`
            const result = run(jsonParser, source)
            if (result.tag === "success") {
                expect(result.match).toBe(`[FBJ,NJ,ZCJ]`)
            } else {
                throw formatError(result)
            }
        })

        it("parses a root array of booleans", () => {
            const source = `[true, true, false]`
            const result = run(jsonParser, source)
            if (result.tag === "success") {
                expect(result.match).toBe(`[true,true,false]`)
            } else {
                throw formatError(result)
            }
        })

        it("parses a root array of nulls", () => {
            const source = `[ null, null]`
            const result = run(jsonParser, source)
            if (result.tag === "success") {
                expect(result.match).toBe(`[null,null]`)
            } else {
                throw formatError(result)
            }
        })
    })
})