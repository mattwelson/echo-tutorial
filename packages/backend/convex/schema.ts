import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { metadata } from "./validators.js";

export default defineSchema({
  contactSessions: defineTable({
    name: v.string(),
    email: v.string(),
    organizationId: v.string(),
    expiresAt: v.number(),
    metadata,
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_expires_at", ["expiresAt"])
    .index("by_org_expires_at", ["organizationId", "expiresAt"]),

  users: defineTable({
    name: v.string(),
  }),
});
