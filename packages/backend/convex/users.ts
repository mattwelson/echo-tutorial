import { v } from "convex/values";
import { query, mutation } from "./_generated/server.js";

export const getMany = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const add = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    console.log({ identity });
    const orgId = identity.organizationId;

    if (!orgId) {
      throw new Error("No organization id");
    }

    const userId = await ctx.db.insert("users", {
      name: args.name,
    });

    return userId;
  },
});

// This has been added to the jwt template from clerk
declare module "convex/server" {
  interface UserIdentity {
    organizationId?: string;
  }
}
