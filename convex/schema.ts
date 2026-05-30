import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  metrics: defineTable({
    label: v.string(),
    value: v.string(),
    delta: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),
  accounts: defineTable({
    name: v.string(),
    health: v.union(v.literal("Strong"), v.literal("Watch"), v.literal("Risk")),
    value: v.string(),
    owner: v.string(),
  }).index("by_health", ["health"]),
  incidents: defineTable({
    title: v.string(),
    status: v.union(v.literal("open"), v.literal("monitoring"), v.literal("resolved")),
    severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    createdAt: v.number(),
  }).index("by_status", ["status"]),
});
