import {describe, expect, it} from "vitest";
import * as P from "../../src/PC"

describe("parser-combinator", () => {
    describe("sequenceOf", () => {
        it("should return an empty array with no parsers", () => {
            const result = P.run(P.sequenceOf([]), "HelloWorld")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toEqual([])
            }
        })

        it("should return a single-element array with a single succeeding parser", () => {
            const result = P.run(P.sequenceOf([P.str("Hello")]), "HelloWorld")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toHaveLength(1)
                expect(result.match[0]!).toBe("Hello")
            }
        })

        it("should return one element per parser for two succeeding parsers", () => {
            const result = P.run(P.sequenceOf([P.str("Hello"), P.str("World")]), "HelloWorld")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toHaveLength(2)
                expect(result.match[0]!).toBe("Hello")
                expect(result.match[1]!).toBe("World")
            }
        })

        it("should return a failure when one parser in the sequence fails", () => {
            const result = P.run(P.sequenceOf([P.str("Hello"), P.str("World")]), "HelloMars")
            expect(result.tag).toBe("failure")
        })

        it("should return an EOF failure when parsers read past the end of the input", () => {
            const result = P.run(P.sequenceOf([P.str("Hello"), P.str("World")]), "Hello")
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                expect(result.reason).toBe("EOF")
            }
        })

        it("should return one match value per parser", () => {
            const result = P.run(P.sequenceOf([P.str("Francis is"), P.whitespace(), P.integer()]), "Francis is 42")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toHaveLength(3)
                expect(result.match[0]!).toBe("Francis is")
                expect(result.match[1]!).toBe(" ")
                expect(result.match[2]!).toBe("42")
                expect(result.index).toBe(13)
            }
        })

        it("should advance index and return one element per parser", () => {
            const result = P.run(P.sequenceOf([P.alphanumeric(), P.str("-")]), "1c620A89-d5e2-4d29-9c84-f9ea04d6f4b6")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toHaveLength(2)
                expect(result.match[0]!).toBe("1c620A89")
                expect(result.match[1]!).toBe("-")
            }
        })
    })

    describe("map", () => {
        it("should transform a string match", () => {
            const result = P.run(P.map(P.str("hello"), s => s.toUpperCase()), "hello world")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("HELLO")
            }
        })

        it("should transform a string match to a number", () => {
            const result = P.run(P.map(P.integer(), s => parseInt(s, 10)), "42 remaining")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe(42)
            }
        })

        it("should propagate a failure without calling the transform", () => {
            let called = false
            const result = P.run(P.map(P.str("hello"), s => { called = true; return s }), "world")
            expect(result.tag).toBe("failure")
            expect(called).toBe(false)
        })

        it("should preserve index and line position after transformation", () => {
            const result = P.run(P.map(P.integer(), s => parseInt(s, 10)), "42 remaining")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.index).toBe(2)
                expect(result.lineNumber).toBe(1)
            }
        })

        it("should compose with sequenceOf to extract a typed value", () => {
            const parser = P.map(
                P.sequenceOf([P.str("count"), P.whitespace(), P.integer()]),
                matches => parseInt(matches[2]!, 10)
            )
            const result = P.run(parser, "count 42")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe(42)
            }
        })

        it("should compose map with map", () => {
            const parser = P.map(P.map(P.integer(), s => parseInt(s, 10)), n => n * 2)
            const result = P.run(parser, "21")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe(42)
            }
        })
    })

    describe("choice", () => {
        it("should succeed with the first alternative when it matches", () => {
            const result = P.run(P.choice([P.str("cat"), P.str("dog"), P.str("fish")]), "cat")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("cat")
            }
        })

        it("should skip failing alternatives and return the first success", () => {
            const result = P.run(P.choice([P.str("cat"), P.str("dog"), P.str("fish")]), "dog")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("dog")
            }
        })

        it("should return the last alternative when only it matches", () => {
            const result = P.run(P.choice([P.str("cat"), P.str("dog"), P.str("fish")]), "fish")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("fish")
            }
        })

        it("should return a failure when no alternative matches", () => {
            const result = P.run(P.choice([P.str("cat"), P.str("dog")]), "fish")
            expect(result.tag).toBe("failure")
        })

        it("should return a failure with reason 'no alternatives provided' for an empty array", () => {
            const result = P.run(P.choice([]), "anything")
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                expect(result.reason).toBe("no alternatives provided")
            }
        })

        it("should not advance position when all alternatives fail", () => {
            const result = P.run(P.choice([P.str("cat"), P.str("dog")]), "fish soup")
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                expect(result.index).toBe(0)
            }
        })

        it("should try all alternatives from the same starting position", () => {
            const result = P.run(
                P.sequenceOf([P.str("The "), P.choice([P.str("cat"), P.str("dog"), P.str("fish")])]),
                "The dog sat"
            )
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match[1]!).toBe("dog")
                expect(result.index).toBe(7)
            }
        })

        it("should return the deepest failure when alternatives fail at different positions", () => {
            // str("Xyz") fails at index 0; sequenceOf gets to index 5 before failing
            const result = P.run(
                P.choice([
                    P.str("Xyz"),
                    P.sequenceOf([P.str("Hello"), P.str("World")]),
                ]),
                "HelloMars"
            )
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                // The sequenceOf got furthest (index 5), so its reason wins
                expect(result.index).toBe(5)
            }
        })

        it("should report the deepest failure reason when all alternatives fail at different depths", () => {
            // str("Hi") fails at 0; sequenceOf([str("Hello"), str("World")]) fails at 5
            // "HelloMars"[5:] === "Mars" which is shorter than "World" → reason is "EOF"
            const result = P.run(
                P.choice([
                    P.str("Hi"),
                    P.sequenceOf([P.str("Hello"), P.str("World")]),
                ]),
                "HelloMars"
            )
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                expect(result.reason).toBe("EOF")
                expect(result.index).toBe(5)
            }
        })

        it("should work with regex alternatives", () => {
            const result = P.run(P.choice([P.regex(/^[a-z]+/), P.regex(/^\d+/)]), "42abc")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("42")
            }
        })

        it("should propagate an existing failure without trying any alternative", () => {
            let callCount = 0
            const counting = P.map(P.str("x"), m => { callCount++; return m })
            P.run(P.sequenceOf([P.str("fail"), P.choice([counting])]), "hello")
            expect(callCount).toBe(0)
        })

        it("should compose with map to normalise matched tokens", () => {
            const keyword = P.map(
                P.choice([P.str("true"), P.str("false")]),
                s => s === "true"
            )
            const t = P.run(keyword, "true")
            const f = P.run(keyword, "false")
            expect(t.tag).toBe("success")
            if (t.tag === "success") expect(t.match).toBe(true)
            expect(f.tag).toBe("success")
            if (f.tag === "success") expect(f.match).toBe(false)
        })
    })

    describe("optional", () => {
        it("should return the match when the parser succeeds", () => {
            const result = P.run(P.optional(P.str("Hello")), "Hello World")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("Hello")
            }
        })

        it("should return null when the parser fails", () => {
            const result = P.run(P.optional(P.str("Hello")), "World Hello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("")
            }
        })

        it("should not advance position when the parser fails", () => {
            const result = P.run(P.optional(P.str("Hello")), "World Hello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.index).toBe(0)
            }
        })

        it("should advance position when the parser succeeds", () => {
            const result = P.run(P.optional(P.str("Hello")), "Hello World")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.index).toBe(5)
            }
        })

        it("should preserve lineNumber when the parser fails", () => {
            const result = P.run(P.optional(P.str("missing")), "Hello")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.lineNumber).toBe(1)
            }
        })

        it("should work in sequenceOf when the optional content is absent", () => {
            const parser = P.sequenceOf([P.str("Hello"), P.optional(P.str(",")), P.str(" World")])
            const result = P.run(parser, "Hello World")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match[0]!).toBe("Hello")
                expect(result.match[1]!).toBe("")
                expect(result.match[2]!).toBe(" World")
            }
        })

        it("should work in sequenceOf when the optional content is present", () => {
            const parser = P.sequenceOf([P.str("Hello"), P.optional(P.str(",")), P.str(" World")])
            const result = P.run(parser, "Hello, World")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match[0]!).toBe("Hello")
                expect(result.match[1]!).toBe(",")
                expect(result.match[2]!).toBe(" World")
            }
        })

        it("should propagate an existing failure without running the parser", () => {
            let called = false
            const spy = P.map(P.str("x"), m => { called = true; return m })
            P.run(P.sequenceOf([P.str("fail"), P.optional(spy)]), "hello")
            expect(called).toBe(false)
        })

        it("should compose with map to produce a default value", () => {
            const withDefault = P.map(P.optional(P.integer()), s => s !== "" ? parseInt(s, 10) : 0)
            const present = P.run(withDefault, "42")
            const absent  = P.run(withDefault, "no number here")
            expect(present.tag).toBe("success")
            if (present.tag === "success") expect(present.match).toBe(42)
            expect(absent.tag).toBe("success")
            if (absent.tag === "success") expect(absent.match).toBe(0)
        })
    })

    describe("lazy", () => {
        it("should defer parser construction until parse time", () => {
            let constructed = false
            const p = P.lazy(() => { constructed = true; return P.str("hello") })
            expect(constructed).toBe(false)
            P.run(p, "hello")
            expect(constructed).toBe(true)
        })

        it("should succeed when the deferred parser matches", () => {
            const result = P.run(P.lazy(() => P.str("hello")), "hello world")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("hello")
            }
        })

        it("should fail when the deferred parser does not match", () => {
            const result = P.run(P.lazy(() => P.str("hello")), "world")
            expect(result.tag).toBe("failure")
        })

        it("should propagate an existing failure without calling the factory", () => {
            let called = false
            const p = P.lazy(() => { called = true; return P.str("x") })
            P.run(P.sequenceOf([P.str("fail"), p]), "hello")
            expect(called).toBe(false)
        })

        it("should enable mutually recursive parsers", () => {
            // Parses nested brackets: (), (()), ((())), ...
            const inner: P.Parser<string> = P.lazy(() => nested)
            const nested: P.Parser<string> = P.map(
                P.sequenceOf([P.str("("), P.many(inner), P.str(")")]),
                ([_open, inners, _close]) => `(${inners.join("")})`
            )
            expect(P.run(nested, "()").tag).toBe("success")
            expect(P.run(nested, "(())").tag).toBe("success")
            expect(P.run(nested, "((()))").tag).toBe("success")
            const deep = P.run(nested, "((()))")
            if (deep.tag === "success") expect(deep.match).toBe("((()))")
        })
    })
})
