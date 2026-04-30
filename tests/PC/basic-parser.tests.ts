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
                expect(result.match[0]!).toBe("Hello World")
                expect(result.match[2]!).toBe("Goodbye World")
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

    describe("inlineWhitespace", () => {
        it("should match a single space", () => {
            const result = P.run(P.inlineWhitespace(), " hello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe(" ")
                expect(result.index).toBe(1)
            }
        })

        it("should match a tab character", () => {
            const result = P.run(P.inlineWhitespace(), "\thello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("\t")
            }
        })

        it("should match multiple spaces and tabs", () => {
            const result = P.run(P.inlineWhitespace(), "   \t  hello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("   \t  ")
                expect(result.index).toBe(6)
            }
        })

        it("should stop before a newline", () => {
            const result = P.run(P.inlineWhitespace(), "  \nhello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("  ")
                expect(result.index).toBe(2)
            }
        })

        it("should not match a newline at the start", () => {
            const result = P.run(P.inlineWhitespace(), "\nhello")
            expect(result.tag).toBe("failure")
        })

        it("should not match a carriage return at the start", () => {
            const result = P.run(P.inlineWhitespace(), "\rhello")
            expect(result.tag).toBe("failure")
        })

        it("should fail when input starts with a non-whitespace character", () => {
            const result = P.run(P.inlineWhitespace(), "hello")
            expect(result.tag).toBe("failure")
        })

        it("should not update lineNumber", () => {
            const result = P.run(P.inlineWhitespace(), "   hello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.lineNumber).toBe(1)
            }
        })
    })

    describe("whitespace", () => {
        it("should match a single space", () => {
            const result = P.run(P.whitespace(), " hello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe(" ")
                expect(result.index).toBe(1)
            }
        })

        it("should match multiple spaces", () => {
            const result = P.run(P.whitespace(), "   hello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("   ")
            }
        })

        it("should match a newline", () => {
            const result = P.run(P.whitespace(), "\nhello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("\n")
                expect(result.index).toBe(1)
            }
        })

        it("should increment lineNumber when it matches a newline", () => {
            const result = P.run(P.whitespace(), "\nhello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.lineNumber).toBe(2)
            }
        })

        it("should match mixed inline whitespace and newlines", () => {
            const result = P.run(P.whitespace(), "  \n  hello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("  \n  ")
                expect(result.index).toBe(5)
            }
        })

        it("should count each newline when matching multiple newlines", () => {
            const result = P.run(P.whitespace(), "\n\n\nhello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.lineNumber).toBe(4)
            }
        })

        it("should fail when input starts with a non-whitespace character", () => {
            const result = P.run(P.whitespace(), "hello")
            expect(result.tag).toBe("failure")
        })

        it("should correctly advance lineNumber across spaces, newlines, and tabs", () => {
            const p = P.sequenceOf([P.str("a"), P.whitespace(), P.str("b")])
            const result = P.run(p, "a  \n  \n  b")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match[1]!).toBe("  \n  \n  ")
                expect(result.lineNumber).toBe(3)
            }
        })
    })

    describe("anyChar", () => {
        it("should match any single character", () => {
            const result = P.run(P.anyChar(), "hello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("h")
                expect(result.index).toBe(1)
            }
        })

        it("should match a single digit", () => {
            const result = P.run(P.anyChar(), "42")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("4")
            }
        })

        it("should match a punctuation character", () => {
            const result = P.run(P.anyChar(), "}")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("}")
            }
        })

        it("should fail at EOF", () => {
            const result = P.run(P.anyChar(), "")
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                expect(result.reason).toBe("EOF")
            }
        })

        it("should match a LF newline and increment lineNumber", () => {
            const result = P.run(P.anyChar(), "\nhello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("\n")
                expect(result.index).toBe(1)
                expect(result.lineNumber).toBe(2)
                expect(result.lineIndex).toBe(0)
            }
        })

        it("should match a CR newline and increment lineNumber", () => {
            const result = P.run(P.anyChar(), "\rhello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("\r")
                expect(result.lineNumber).toBe(2)
            }
        })

        it("should match CRLF as a single character and advance index by 2", () => {
            const result = P.run(P.anyChar(), "\r\nhello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("\r\n")
                expect(result.index).toBe(2)
                expect(result.lineNumber).toBe(2)
                expect(result.lineIndex).toBe(0)
            }
        })

        it("should not increment lineNumber for a regular character", () => {
            const result = P.run(P.anyChar(), "abc")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.lineNumber).toBe(1)
            }
        })

        it("should propagate an existing failure", () => {
            let called = false
            const spy = P.map(P.anyChar(), m => { called = true; return m })
            P.run(P.sequenceOf([P.str("fail"), spy]), "hello")
            expect(called).toBe(false)
        })

        it("should compose with manyTill to parse until a terminator", () => {
            const result = P.run(P.manyTill(P.anyChar(), P.str("}")), "hello}")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["h", "e", "l", "l", "o"])
            }
        })

        it("should compose with many to collect characters until EOF", () => {
            const result = P.run(P.many(P.anyChar()), "abc")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["a", "b", "c"])
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
