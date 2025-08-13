import { mutation } from "../_generated/server.js";
import { v } from "convex/values";
import { DateTime, Duration, Effect, pipe } from "effect";
import { metadata } from "../validators.js";

export const expiresInMs = (duration: Duration.DurationInput = "1 day") =>
  pipe(
    DateTime.now,
    Effect.map(DateTime.addDuration(duration)),
    Effect.map(DateTime.toEpochMillis)
  );

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
