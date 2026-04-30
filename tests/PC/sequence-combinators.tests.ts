import {describe, expect, it} from "vitest";
import * as P from "../../src/PC"

describe("sequence combinators", () => {
    describe("left", () => {
        it("should return the left match when both parsers succeed", () => {
            const result = P.run(P.left(P.str("Hello"), P.str("World")), "HelloWorld")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("Hello")
            }
        })

        it("should advance position past both parsers", () => {
            const result = P.run(P.left(P.str("Hello"), P.str("World")), "HelloWorld")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.index).toBe(10)
            }
        })

        it("should fail when the left parser fails", () => {
            const result = P.run(P.left(P.str("Hello"), P.str("World")), "Goodbye")
            expect(result.tag).toBe("failure")
        })

        it("should fail when the right parser fails", () => {
            const result = P.run(P.left(P.str("Hello"), P.str("World")), "HelloMarsXarth")
            expect(result.tag).toBe("failure")
        })

        it("should work with different parser types", () => {
            const result = P.run(P.left(P.integer(), P.str("px")), "42px")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("42")
                expect(result.index).toBe(4)
            }
        })

        it("should propagate an existing failure", () => {
            const result = P.run(
                P.sequenceOf([P.str("fail"), P.left(P.str("a"), P.str("b"))]),
                "hello"
            )
            expect(result.tag).toBe("failure")
        })
    })

    describe("right", () => {
        it("should return the right match when both parsers succeed", () => {
            const result = P.run(P.right(P.str("Hello"), P.str("World")), "HelloWorld")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("World")
            }
        })

        it("should advance position past both parsers", () => {
            const result = P.run(P.right(P.str("Hello"), P.str("World")), "HelloWorld")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.index).toBe(10)
            }
        })

        it("should fail when the left parser fails", () => {
            const result = P.run(P.right(P.str("Hello"), P.str("World")), "GoodbyeWorld")
            expect(result.tag).toBe("failure")
        })

        it("should fail when the right parser fails", () => {
            const result = P.run(P.right(P.str("Hello"), P.str("World")), "HelloMarsXarth")
            expect(result.tag).toBe("failure")
        })

        it("should work as a prefix skipper", () => {
            const result = P.run(P.right(P.str("count "), P.integer()), "count 42")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("42")
            }
        })

        it("should propagate an existing failure", () => {
            const result = P.run(
                P.sequenceOf([P.str("fail"), P.right(P.str("a"), P.str("b"))]),
                "hello"
            )
            expect(result.tag).toBe("failure")
        })
    })

    describe("between", () => {
        it("should return the middle match when all three parsers succeed", () => {
            const result = P.run(P.between(P.str("("), P.integer(), P.str(")")), "(42)")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("42")
            }
        })

        it("should advance position past all three parsers", () => {
            const result = P.run(P.between(P.str("("), P.integer(), P.str(")")), "(42)")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.index).toBe(4)
            }
        })

        it("should fail when the open parser fails", () => {
            const result = P.run(P.between(P.str("("), P.integer(), P.str(")")), "42)")
            expect(result.tag).toBe("failure")
        })

        it("should fail when the inner parser fails", () => {
            const result = P.run(P.between(P.str("("), P.integer(), P.str(")")), "(abc)")
            expect(result.tag).toBe("failure")
        })

        it("should fail when the close parser fails", () => {
            const result = P.run(P.between(P.str("("), P.integer(), P.str(")")), "(42]")
            expect(result.tag).toBe("failure")
        })

        it("should work with whitespace padding", () => {
            const padded = P.between(
                P.sequenceOf([P.str("["), P.optional(P.whitespace())]),
                P.integer(),
                P.sequenceOf([P.optional(P.whitespace()), P.str("]")]),
            )
            const tight   = P.run(padded, "[42]")
            const spaced  = P.run(padded, "[ 42 ]")
            expect(tight.tag).toBe("success")
            if (tight.tag === "success") expect(tight.match).toBe("42")
            expect(spaced.tag).toBe("success")
            if (spaced.tag === "success") expect(spaced.match).toBe("42")
        })

        it("should compose with sepBy to parse a comma-separated list in brackets", () => {
            const list = P.between(
                P.str("("),
                P.sepBy(P.integer(), P.str(",")),
                P.str(")"),
            )
            const result = P.run(list, "(1,2,3)")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["1", "2", "3"])
            }
        })

        it("should propagate an existing failure", () => {
            const result = P.run(
                P.sequenceOf([P.str("fail"), P.between(P.str("("), P.integer(), P.str(")"))]),
                "hello"
            )
            expect(result.tag).toBe("failure")
        })
    })

    describe("sepBy1", () => {
        it("should match a single value with no separator", () => {
            const result = P.run(P.sepBy1(P.integer(), P.str(",")), "42")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["42"])
            }
        })

        it("should match multiple comma-separated integers", () => {
            const result = P.run(P.sepBy1(P.integer(), P.str(",")), "1,2,3")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["1", "2", "3"])
            }
        })

        it("should fail when the parser matches zero times", () => {
            const result = P.run(P.sepBy1(P.integer(), P.str(",")), "abc")
            expect(result.tag).toBe("failure")
        })

        it("should not consume a trailing separator", () => {
            const result = P.run(P.sepBy1(P.integer(), P.str(",")), "1,2,")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["1", "2"])
                expect(result.index).toBe(3)
            }
        })

        it("should stop at the first separator that is not followed by a valid value", () => {
            const result = P.run(P.sepBy1(P.integer(), P.str(",")), "1,2,abc")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["1", "2"])
                expect(result.index).toBe(3)
            }
        })

        it("should work with whitespace as separator", () => {
            const result = P.run(P.sepBy1(P.alphanumeric(), P.whitespace()), "foo bar baz")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["foo", "bar", "baz"])
            }
        })

        it("should compose with map to produce typed values", () => {
            const numbers = P.map(
                P.sepBy1(P.integer(), P.str(",")),
                strs => strs.map(s => parseInt(s, 10))
            )
            const result = P.run(numbers, "10,20,30")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual([10, 20, 30])
            }
        })

        it("should propagate an existing failure", () => {
            const result = P.run(
                P.sequenceOf([P.str("fail"), P.sepBy1(P.integer(), P.str(","))]),
                "hello"
            )
            expect(result.tag).toBe("failure")
        })
    })

    describe("sepBy", () => {
        it("should return an empty array when nothing matches", () => {
            const result = P.run(P.sepBy(P.integer(), P.str(",")), "abc")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual([])
                expect(result.index).toBe(0)
            }
        })

        it("should match a single value", () => {
            const result = P.run(P.sepBy(P.integer(), P.str(",")), "42")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["42"])
            }
        })

        it("should match multiple comma-separated integers", () => {
            const result = P.run(P.sepBy(P.integer(), P.str(",")), "1,2,3")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["1", "2", "3"])
            }
        })

        it("should not consume a trailing separator", () => {
            const result = P.run(P.sepBy(P.integer(), P.str(",")), "1,2,")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual(["1", "2"])
                expect(result.index).toBe(3)
            }
        })

        it("should succeed with an empty array on an empty string", () => {
            const result = P.run(P.sepBy(P.integer(), P.str(",")), "")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual([])
            }
        })

        it("should compose with between to parse an optional list in brackets", () => {
            const list = P.between(P.str("["), P.sepBy(P.integer(), P.str(",")), P.str("]"))
            const populated = P.run(list, "[1,2,3]")
            const empty     = P.run(list, "[]")
            expect(populated.tag).toBe("success")
            if (populated.tag === "success") expect(populated.match).toEqual(["1", "2", "3"])
            expect(empty.tag).toBe("success")
            if (empty.tag === "success") expect(empty.match).toEqual([])
        })

        it("should propagate an existing failure", () => {
            const result = P.run(
                P.sequenceOf([P.str("fail"), P.sepBy(P.integer(), P.str(","))]),
                "hello"
            )
            expect(result.tag).toBe("failure")
        })
    })
})
