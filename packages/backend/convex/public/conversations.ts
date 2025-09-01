import { mutation, query } from "../_generated/server.js";
import { ConvexError, v } from "convex/values";

export const getOne = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    const contactSession = await ctx.db.get(conversation.contactSessionId);

    // TODO: switch to Effect
    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Contact session invalid",
      });
    }

    return {
      _id: conversation._id,
      threadId: conversation.threadId,
      status: conversation.status,
    };
  },
});

export const create = mutation({
  args: {
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);

    // TODO: switch to Effect
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Contact session invalid",
      });
    }

    if (session.organizationId !== args.organizationId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Contact session does not belong to organization",
      });
    }

    // TODO: Replace once thread creation is complete
    const threadId = "123";

    const conversationId = await ctx.db.insert("conversations", {
      organizationId: args.organizationId,
      contactSessionId: session._id,
      threadId,
      status: "unresolved",
    });

    return conversationId;
  },
});
