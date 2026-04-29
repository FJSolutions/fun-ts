import {describe, expect, it} from "vitest"
import * as P from "../../src/PC"

describe("basic parser", () => {
    describe("str", () => {
        it("should match a string", () => {
            const p = P.str("Hello World")
            const result = P.run(p, "Hello World")
            expect(result.match).toBe("Hello World")
            expect(result.isError).toBe(false)
            expect(result.reason).toBe(null)
            expect(result.index).toBe(11)
        })

        it("should not match a string", () => {
            const p = P.str("Hello World")
            const result = P.run(p, "Hello!")
            expect(result.match).toBe("")
        })

        it("should not match an empty string", () => {
            const p = P.str("Hello World")
            // @ts-ignore
            const result = P.run(p)
            expect(result.match).toBe("")
        })
    })

    describe("regex", () => {
        it("should match a pattern", () => {
            const p = P.regex(/^\d\d/)
            const result = P.run(p, "42 years")
            expect(result.match).toBe("42")
            expect(result.index).toBe(2)
        })

        it("should match a float", () => {
            const p = P.float()
            const result = P.run(p, "3.14159")
            expect(result.match).toBe("3.14159")
            expect(result.index).toBe(7)
        })

        it("should match an int as a float", () => {
            const p = P.float()
            const result = P.run(p, "42")
            expect(result.match).toBe("42")
            expect(result.index).toBe(2)
        })
    })

    describe("eof", () => {
        it("should not match EOF", () => {
            const p = P.eof()
            const result = P.run(p, "42")
            expect(result.isError).toBeTruthy()
            expect(result.index).toBe(0)
        })

        it("should match EOF", () => {
            const p = P.eof()
            const result = P.run(p, "")
            expect(result.isError).toBeFalsy()
            expect(result.index).toBe(0)
        })
    })

    describe("end of line", () => {
        it("should match end of line", () => {
            const p = P.sequenceOf([
                P.str("Hello World"),
                P.lineEnding(),
                P.str("Goodbye World"),
            ])
            const text = "Hello World\nGoodbye World"
            const result = P.run(p, text)
            expect(result.match).toBe(text)
            expect(result.isError).toBeFalsy()
        })

        it("should match no end of line", () => {
            const p = P.sequenceOf([
                P.lineEnding(),
                P.str("Hello World"),
                P.lineEnding(),
                P.str("Goodbye World"),
            ])
            const text = "Hello World\nGoodbye World"
            const result = P.run(p, text)
            expect(result.isError).toBeTruthy()
            expect(result.index).toBe(0)
            expect(result.line).toBe(1)
        })

        it("should match missing end of line", () => {
            const p = P.sequenceOf([
                P.str("Hello World"),
                P.lineEnding(),
            ])
            const text = "Hello World\nGoodbye World"
            const result = P.run(p, text)
            expect(result.isError).toBeFalsy()
            expect(result.line).toBe(2)
            expect(result.index).toBe(12)
        })
    })
})