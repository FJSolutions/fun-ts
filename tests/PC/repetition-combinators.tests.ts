import {describe, expect, it} from "vitest";
import * as P from "../../src/PC"

describe("repetition combinators", () => {
    describe("many", () => {
        it("should return an empty array when the parser never matches", () => {
            const result = P.run(P.many(P.str("x")), "aaa")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual([])
                expect(result.index).toBe(0)
            }
        })

        it("should return a single-element array for one match", () => {
            const result = P.run(P.many(P.str("a")), "abc")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["a"])
                expect(result.index).toBe(1)
            }
        })

        it("should collect all consecutive matches", () => {
            const result = P.run(P.many(P.str("a")), "aaab")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["a", "a", "a"])
                expect(result.index).toBe(3)
            }
        })

        it("should consume the entire input when everything matches", () => {
            const result = P.run(P.many(P.regex(/^[a-z]/)), "hello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["h", "e", "l", "l", "o"])
                expect(result.index).toBe(5)
            }
        })

        it("should stop cleanly at a non-matching character", () => {
            const result = P.run(P.many(P.integer()), "123abc")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["123"])
                expect(result.index).toBe(3)
            }
        })

        it("should not infinite-loop when the parser matches zero-width", () => {
            const zeroWidth = P.optional(P.str("x"))
            const result = P.run(P.many(zeroWidth), "abc")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual([])
            }
        })

        it("should succeed with an empty array on an empty string", () => {
            const result = P.run(P.many(P.str("a")), "")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual([])
            }
        })

        it("should propagate an existing failure", () => {
            const result = P.run(P.sequenceOf([P.str("fail"), P.many(P.str("a"))]), "hello")
            expect(result.tag).toBe("failure")
        })

        it("should compose with map to count matches", () => {
            const count = P.map(P.many(P.str("a")), xs => xs.length)
            const result = P.run(count, "aaab")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe(3)
            }
        })
    })

    describe("many1", () => {
        it("should fail when the parser never matches", () => {
            const result = P.run(P.many1(P.str("x")), "aaa")
            expect(result.tag).toBe("failure")
        })

        it("should return a single-element array for exactly one match", () => {
            const result = P.run(P.many1(P.str("a")), "abc")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["a"])
                expect(result.index).toBe(1)
            }
        })

        it("should collect all consecutive matches", () => {
            const result = P.run(P.many1(P.str("a")), "aaab")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["a", "a", "a"])
                expect(result.index).toBe(3)
            }
        })

        it("should carry the first-parser failure reason when zero matches occur", () => {
            const result = P.run(P.many1(P.label(P.str("a"), "letter a")), "bbb")
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                expect(result.reason).toBe("expected letter a")
            }
        })

        it("should propagate an existing failure", () => {
            const result = P.run(P.sequenceOf([P.str("fail"), P.many1(P.str("a"))]), "hello")
            expect(result.tag).toBe("failure")
        })

        it("should compose with map to build a string from characters", () => {
            const word = P.map(P.many1(P.regex(/^[a-zA-Z]/)), chars => chars.join(""))
            const result = P.run(word, "Hello123")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("Hello")
            }
        })
    })

    describe("manyTill", () => {
        it("should return an empty array when the terminator matches immediately", () => {
            const result = P.run(P.manyTill(P.regex(/^./), P.str(";")), ";rest")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual([])
                expect(result.index).toBe(1) // terminator consumed
            }
        })

        it("should collect parser matches until the terminator", () => {
            const result = P.run(P.manyTill(P.regex(/^[^;]/), P.str(";")), "abc;rest")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["a", "b", "c"])
                expect(result.index).toBe(4) // past the semicolon
            }
        })

        it("should consume the terminator (position is after it)", () => {
            const result = P.run(P.manyTill(P.regex(/^./), P.str("END")), "abcEND")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.index).toBe(6)
            }
        })

        it("should fail when EOF is reached before the terminator", () => {
            const result = P.run(P.manyTill(P.regex(/^[^;]/), P.str(";")), "abc")
            expect(result.tag).toBe("failure")
        })

        it("should try the terminator first so it can match characters the parser also matches", () => {
            // regex /^./ matches any character including the quote, but we stop at the quote
            // because manyTill tries the terminator before the parser
            const result = P.run(P.manyTill(P.regex(/^./), P.str('"')), 'Hello"rest')
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["H", "e", "l", "l", "o"])
                expect(result.index).toBe(6)
            }
        })

        it("should discard the terminator match value", () => {
            // Terminator is str("-->") but result.match only contains content
            const result = P.run(P.manyTill(P.regex(/^./), P.str("-->")), "hi-->")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["h", "i"])
            }
        })

        it("should propagate an existing failure", () => {
            const result = P.run(
                P.sequenceOf([P.str("fail"), P.manyTill(P.regex(/^./), P.str(";"))]),
                "hello"
            )
            expect(result.tag).toBe("failure")
        })

        it("should compose with map to join matched characters into a string", () => {
            const lineContent = P.map(
                P.manyTill(P.regex(/^./), P.lineEnding()),
                chars => chars.join("")
            )
            const result = P.run(lineContent, "Hello\nWorld")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("Hello")
                expect(result.index).toBe(6)
            }
        })
    })
})
