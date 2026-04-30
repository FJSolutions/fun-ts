import {describe, expect, it} from "vitest"
import * as P from "../../src/PC"

describe("basic parser", () => {
    describe("str", () => {
        it("should match a string", () => {
            const p = P.str("Hello World")
            const result = P.run(p, "Hello World")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("Hello World")
                expect(result.index).toBe(11)
            }
        })

        it("should not match a string", () => {
            const p = P.str("Hello World")
            const result = P.run(p, "Hello!")
            expect(result.tag).toBe("failure")
        })

        it("should not match an empty string", () => {
            const p = P.str("Hello World")
            // @ts-ignore
            const result = P.run(p)
            expect(result.tag).toBe("failure")
        })
    })

    describe("regex", () => {
        it("should match a pattern", () => {
            const p = P.regex(/^\d\d/)
            const result = P.run(p, "42 years")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("42")
                expect(result.index).toBe(2)
            }
        })

        it("should match a float", () => {
            const p = P.float()
            const result = P.run(p, "3.14159")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("3.14159")
                expect(result.index).toBe(7)
            }
        })

        it("should match an int as a float", () => {
            const p = P.float()
            const result = P.run(p, "42")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("42")
                expect(result.index).toBe(2)
            }
        })
    })

    describe("eof", () => {
        it("should not match EOF", () => {
            const p = P.eof()
            const result = P.run(p, "42")
            expect(result.tag).toBe("failure")
        })

        it("should match EOF", () => {
            const p = P.eof()
            const result = P.run(p, "")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.index).toBe(0)
            }
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
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toHaveLength(3)
                expect(result.match[0]!.match).toBe("Hello World")
                expect(result.match[2]!.match).toBe("Goodbye World")
            }
        })

        it("should not match no end of line", () => {
            const p = P.sequenceOf([
                P.lineEnding(),
                P.str("Hello World"),
                P.lineEnding(),
                P.str("Goodbye World"),
            ])
            const text = "Hello World\nGoodbye World"
            const result = P.run(p, text)
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                expect(result.lineNumber).toBe(1)
            }
        })

        it("should advance line number after matching a line ending", () => {
            const p = P.sequenceOf([
                P.str("Hello World"),
                P.lineEnding(),
            ])
            const text = "Hello World\nGoodbye World"
            const result = P.run(p, text)
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.lineNumber).toBe(2)
                expect(result.index).toBe(12)
            }
        })
    })

    describe("formatError", () => {
        it("should point to the start of the line on a first-token failure", () => {
            const result = P.run(P.str("Hello"), "World")
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                expect(P.formatError(result)).toBe(
                    "Parse error on line 1, column 1: 'Hello' was not found at index 0\n" +
                    "  World\n" +
                    "  ^"
                )
            }
        })

        it("should point mid-line when failure occurs after a partial match", () => {
            const result = P.run(P.sequenceOf([P.str("Hello"), P.str("World")]), "HelloXarth")
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                expect(P.formatError(result)).toBe(
                    "Parse error on line 1, column 6: 'World' was not found at index 5\n" +
                    "  HelloXarth\n" +
                    "       ^"
                )
            }
        })

        it("should point to the correct line and column in multi-line input", () => {
            const p = P.sequenceOf([P.str("Hello"), P.lineEnding(), P.str("World")])
            const result = P.run(p, "Hello\nMarsXarth")
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                expect(P.formatError(result)).toBe(
                    "Parse error on line 2, column 1: 'World' was not found at index 6\n" +
                    "  MarsXarth\n" +
                    "  ^"
                )
            }
        })
    })
})
