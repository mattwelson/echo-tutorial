import { expiresInMs } from "./contactSessions.js";
import { describe, expect, it } from "vitest";
import { Duration, TestClock, Effect, pipe, TestContext } from "effect";

describe("contactSessions", () => {
  describe("expiresInMs", () => {
    const testProgram = (duration: Duration.DurationInput) =>
      pipe(
        Effect.gen(function* () {
          yield* TestClock.setTime("2025-08-13T13:00:00.000Z");
          const result = yield* expiresInMs(duration);
          return result;
        }),
        Effect.provide(TestContext.TestContext)
      );

    it.each`
      duration     | expiresAt
      ${"1 day"}   | ${1755176400000}
      ${"6 hours"} | ${1755111600000}
      ${"1 milli"} | ${1755090000001}
    `(
      "should return the current time plus $duration",
      async ({ duration, expiresAt }) => {
        const expiresAtResult = await Effect.runPromise(testProgram(duration));
        expect(expiresAtResult).toBe(expiresAt);
      }
    );
  });
});
