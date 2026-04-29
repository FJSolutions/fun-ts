import {describe, expect, it} from "vitest";
import * as P from "../../src/PC"

describe("parser-combinator", () => {
    describe("sequenceOf", () => {
        it("should return an empty array with no parsers", () => {
            const p = P.sequenceOf([])
            const result = P.run(p, "HelloWorld")
            expect(result.match).toBe("")
        })

        it("should return an single item array with a single succeeding parser", () => {
            const p = P.sequenceOf([
                P.str("Hello")
            ])
            const result = P.run(p, "HelloWorld")
            expect(result.match).toBe("Hello")
        })

        it("should return an single item array with multiple succeeding parser", () => {
            const p = P.sequenceOf([
                P.str("Hello"),
                P.str("World")
            ])
            const result = P.run(p, "HelloWorld")
            expect(result.match).toBe("HelloWorld")
        })

        it("should return a failure with multiple parsers one of which fails", () => {
            const p = P.sequenceOf([
                P.str("Hello"),
                P.str("World")
            ])
            const result = P.run(p, "HelloMars")
            expect(result.isError).toBe(true)
            expect(result.index).toBe(0)
        })

        it("should return an end-of-input failure with multiple parsers which read past the end of the input", () => {
            const p = P.sequenceOf([
                P.str("Hello"),
                P.str("World")
            ])
            const result = P.run(p, "Hello")
            expect(result.isError).toBe(true)
            expect(result.reason).toBe("EOF")
            expect(result.index).toBe(0)
        })

        it("should parse with multiple kinds of Parser", ()=>{
            const p = P.sequenceOf([
                P.str("Francis is"),
                P.whitespace(),
                P.integer()
            ])
            const result = P.run(p, "Francis is 42")
            expect(result.isError).toBeFalsy()
            expect(result.match).toBe("Francis is 42")
        })

        it("should alphanumeric with a GUID", ()=>{
            const p = P.sequenceOf([
                P.alphanumeric(),
                P.str("-"),
            ])
            const result = P.run(p, "1c620A89-d5e2-4d29-9c84-f9ea04d6f4b6")
            expect(result.isError).toBeFalsy()
            expect(result.match).toBe("1c620A89-")
        })
    })
})