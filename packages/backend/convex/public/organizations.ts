import { v } from "convex/values";
import { createClerkClient } from "@clerk/backend";
import { action } from "../_generated/server.js";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const validate = action({
  args: {
    // Organizations are not strongly typed in convex - they live in clerk
    organizationId: v.string(),
  },
  handler: async (_ctx, args) => {
    const organization = await clerkClient.organizations.getOrganization({
      organizationId: args.organizationId,
    });

    if (organization) return { valid: true };

    return { valid: false, reason: "Organization not found" };
  },
});
