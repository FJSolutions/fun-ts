import {describe, expect, it} from "vitest";
import * as P from "../../src/PC"

describe("error combinators", () => {
    describe("label", () => {
        it("should return the match unchanged when the parser succeeds", () => {
            const result = P.run(P.label(P.str("Hello"), "greeting"), "Hello World")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("Hello")
            }
        })

        it("should preserve position when the parser succeeds", () => {
            const result = P.run(P.label(P.integer(), "number"), "42 rest")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.index).toBe(2)
            }
        })

        it("should replace the failure reason with 'expected <name>'", () => {
            const result = P.run(P.label(P.str("Hello"), "greeting"), "Goodbye")
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                expect(result.reason).toBe("expected greeting")
            }
        })

        it("should preserve the failure index", () => {
            const result = P.run(P.label(P.str("Hello"), "greeting"), "Goodbye")
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                expect(result.index).toBe(0)
            }
        })

        it("should preserve the failure lineNumber", () => {
            const result = P.run(P.label(P.str("Hello"), "greeting"), "Goodbye")
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                expect(result.lineNumber).toBe(1)
            }
        })

        it("should replace a nested failure reason from a complex parser", () => {
            const greeting = P.label(
                P.sequenceOf([P.str("Hello"), P.whitespace(), P.str("World")]),
                "greeting"
            )
            const result = P.run(greeting, "Hello Mars")
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                expect(result.reason).toBe("expected greeting")
            }
        })

        it("should produce a clean formatError output using the label", () => {
            const result = P.run(P.label(P.integer(), "integer"), "abc")
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                const msg = P.formatError(result)
                expect(msg).toContain("expected integer")
                expect(msg).toContain("^")
            }
        })

        it("should surface the label reason through choice when one alternative fails", () => {
            const parser = P.choice([
                P.label(P.str("true"), "boolean"),
                P.label(P.str("false"), "boolean"),
                P.label(P.integer(), "integer"),
            ])
            const result = P.run(parser, "hello")
            expect(result.tag).toBe("failure")
            if (result.tag === "failure") {
                expect(result.reason).toBe("expected integer")
            }
        })

        it("should not affect success path inside choice", () => {
            const parser = P.choice([
                P.label(P.str("true"), "boolean literal"),
                P.label(P.str("false"), "boolean literal"),
            ])
            const result = P.run(parser, "true")
            expect(result.tag).toBe("success")
            if (result.tag === "success") {
                expect(result.match).toBe("true")
            }
        })

        it("should propagate an existing failure without running the parser", () => {
            let called = false
            const spy = P.map(P.str("x"), m => { called = true; return m })
            P.run(P.sequenceOf([P.str("fail"), P.label(spy, "spy")]), "hello")
            expect(called).toBe(false)
        })
    })
})
