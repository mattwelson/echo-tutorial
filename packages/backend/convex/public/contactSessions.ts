import { mutation, type MutationCtx } from "../_generated/server.js";
import { v } from "convex/values";
import { DateTime, Duration, Effect, pipe } from "effect";
import { metadata } from "../validators.js";
import { Doc, Id } from "../_generated/dataModel.js";

export const expiresInMs = (duration: Duration.DurationInput = "1 day") =>
  pipe(
    DateTime.now,
    Effect.map(DateTime.addDuration(duration)),
    Effect.map(DateTime.toEpochMillis)
  );

// Custom errors for Effect
class DatabaseError {
  readonly _tag = "DatabaseError";
  constructor() {}
}

class SessionNotFoundError {
  readonly _tag = "SessionNotFoundError";
  constructor(public readonly contactSessionId: string) {}
}

class SessionExpiredError {
  readonly _tag = "SessionExpiredError";
  constructor(public readonly contactSessionId: string) {}
}

const getContactSession = (
  ctx: MutationCtx,
  contactSessionId: Id<"contactSessions">
) =>
  Effect.tryPromise({
    try: () => ctx.db.get(contactSessionId),
    catch: () => new DatabaseError(),
  });

export const sessionIsExpired = (
  ctx: MutationCtx,
  contactSessionId: Id<"contactSessions">
) => {
  return pipe(
    getContactSession(ctx, contactSessionId),
    // check it exists
    Effect.andThen((session) =>
      session
        ? Effect.succeed(session)
        : Effect.fail(new SessionNotFoundError(contactSessionId))
    ),
    // check it has not expired
    Effect.andThen((session) =>
      pipe(
        session.expiresAt,
        DateTime.unsafeMake,
        DateTime.isPast,
        Effect.andThen(
          (isPast) =>
            isPast
              ? Effect.fail(new SessionExpiredError(contactSessionId)) // Session IS expired
              : Effect.succeed(session) // Session is still valid
        )
      )
    )
  );
};

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    organizationId: v.string(),
    metadata,
  },
  handler: async (ctx, args) => {
    const expiresAt = Effect.runSync(expiresInMs());

    const contactSessionId = await ctx.db.insert("contactSessions", {
      name: args.name,
      email: args.email,
      organizationId: args.organizationId,
      expiresAt,
      metadata: args.metadata,
    });

    return contactSessionId;
  },
});

// TODO: check this works with the same approach as Antonio, I have not tested
export const validate = mutation({
  args: {
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const program = pipe(
      sessionIsExpired(ctx, args.contactSessionId),
      Effect.match({
        onFailure: (error): { valid: false; reason: string } => ({
          valid: false,
          reason: error._tag,
        }),
        onSuccess: (
          session
        ): { valid: true; contactSession: Doc<"contactSessions"> } => ({
          valid: true,
          contactSession: session,
        }),
      })
    );

    return Effect.runPromise(program);
  },
});
