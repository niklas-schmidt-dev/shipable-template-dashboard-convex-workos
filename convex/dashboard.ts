import { query } from "./_generated/server";

const fallbackMetrics = [
  { label: "MRR", value: "$84.2k", delta: "+12.8%" },
  { label: "Active accounts", value: "1,284", delta: "+4.1%" },
  { label: "Open incidents", value: "3", delta: "-2" },
  { label: "Queue time", value: "14m", delta: "-8m" },
];

const fallbackAccounts = [
  {
    name: "Northstar Labs",
    health: "Strong" as const,
    value: "$18.4k",
    owner: "Mina",
  },
  {
    name: "Copper Works",
    health: "Watch" as const,
    value: "$9.8k",
    owner: "Jonas",
  },
  {
    name: "Evergreen Market",
    health: "Strong" as const,
    value: "$13.1k",
    owner: "Ada",
  },
];

const FALLBACK_TIMESTAMP = 1680000000000;

export const overview = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const [storedMetrics, storedAccounts, storedIncidents] = await Promise.all([
      ctx.db.query("metrics").withIndex("by_order").collect(),
      ctx.db.query("accounts").collect(),
      ctx.db.query("incidents").withIndex("by_status").collect(),
    ]);

    return {
      metrics:
        storedMetrics.length > 0
          ? storedMetrics.map(({ _id, _createdTime, ...metric }) => metric)
          : fallbackMetrics,
      accounts:
        storedAccounts.length > 0
          ? storedAccounts.map(({ _id, _createdTime, ...account }) => account)
          : fallbackAccounts,
      incidents:
        storedIncidents.length > 0
          ? storedIncidents.map(({ _id, _createdTime, ...incident }) => incident)
          : [
              {
                title: "Checkout latency is elevated for EU customers.",
                status: "monitoring" as const,
                severity: "medium" as const,
                createdAt: FALLBACK_TIMESTAMP,
              },
            ],
      user: {
        subject: identity.subject,
        email: identity.email,
        name: identity.name,
      },
    };
  },
});
