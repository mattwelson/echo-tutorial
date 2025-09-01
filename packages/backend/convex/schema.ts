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

  conversations: defineTable({
    threadId: v.string(),
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
    status: v.union(
      v.literal("unresolved"),
      v.literal("resolved"),
      v.literal("escalated")
    ),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_contact_session_id", ["contactSessionId"])
    .index("by_thread_id", ["threadId"])
    .index("by_status_and_organization_id", ["status", "organizationId"]),

  users: defineTable({
    name: v.string(),
  }),
});
