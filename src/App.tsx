import { useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowUpRight, Clock3 } from "lucide-react";
import { useAuth } from "@workos-inc/authkit-react";
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

type AccountHealth = "Strong" | "Watch" | "Risk";
type AccountFilter = "all" | "attention";
type Metric = { label: string; value: string; delta: string };
type Account = {
  name: string;
  health: AccountHealth;
  value: string;
  owner: string;
};
type Incident = {
  title: string;
  severity: "low" | "medium" | "high";
  status: "open" | "monitoring" | "resolved";
};
type Overview = {
  metrics: Metric[];
  accounts: Account[];
  incidents: Incident[];
};

const fallbackMetrics = [
  { label: "Pipeline value", value: "$84.2k", delta: "+12.8%" },
  { label: "Active accounts", value: "1,284", delta: "+4.1%" },
  { label: "Needs review", value: "7", delta: "-2" },
  { label: "Median response", value: "14m", delta: "-8m" },
];

const fallbackAccounts = [
  { name: "Northstar Labs", health: "Strong" as const, value: "$18.4k", owner: "Mina" },
  { name: "Copper Works", health: "Watch" as const, value: "$9.8k", owner: "Jonas" },
  { name: "Evergreen Market", health: "Strong" as const, value: "$13.1k", owner: "Ada" },
  { name: "Atlas Finance", health: "Risk" as const, value: "$22.6k", owner: "Priya" },
];

const nextSteps: Record<AccountHealth, string> = {
  Strong: "Expansion brief ready",
  Watch: "Confirm usage change",
  Risk: "Escalate support SLA",
};

export default function App() {
  const { isLoading, user, signIn, signOut } = useAuth();

  if (isLoading) {
    return <LoadingScreen label="Checking WorkOS session" />;
  }

  return (
    <>
      <Unauthenticated>
        <AuthCard onSignIn={() => void signIn()} />
      </Unauthenticated>
      <Authenticated>
        <DashboardContent
          userLabel={user?.firstName ?? user?.email ?? "Operator"}
          onSignOut={() => signOut()}
        />
      </Authenticated>
      <AuthLoading>
        <LoadingScreen label="Syncing Convex token" />
      </AuthLoading>
    </>
  );
}

function DashboardContent({
  userLabel,
  onSignOut,
}: {
  userLabel: string;
  onSignOut: () => void;
}) {
  const [filter, setFilter] = useState<AccountFilter>("all");
  const overview = useQuery(api.dashboard.overview, {}) as Overview | undefined;
  const visibleMetrics = overview?.metrics ?? fallbackMetrics;
  const accounts = overview?.accounts ?? fallbackAccounts;
  const incidents =
    overview?.incidents ??
    [
      {
        title: "Checkout latency is elevated for EU customers.",
        severity: "medium" as const,
        status: "monitoring" as const,
      },
      {
        title: "Two accounts missed the weekly sync.",
        severity: "low" as const,
        status: "open" as const,
      },
    ];
  const visibleAccounts = useMemo(
    () =>
      accounts.filter((account) =>
        filter === "all" ? true : account.health !== "Strong",
      ),
    [accounts, filter],
  );
  const attentionCount = accounts.filter(
    (account) => account.health !== "Strong",
  ).length;

  return (
    <main className="dashboard">
      <aside className="rail" aria-label="Workspace">
        <div>
          <p className="eyebrow">Ops console</p>
          <h1>Revenue desk</h1>
        </div>
        <div className="rail__meta">
          <span>Signed in</span>
          <strong>{userLabel}</strong>
        </div>
        <button type="button" className="rail__button" onClick={onSignOut}>
          Sign out
        </button>
        <div className="rail__meta">
          <span>Reviews</span>
          <strong>
            {overview === undefined ? "Syncing" : `${attentionCount} active`}
          </strong>
        </div>
      </aside>

      <section className="workspace" aria-label="Revenue operations">
        <header className="topbar" id="top">
          <div>
            <p className="eyebrow">Today</p>
            <h2>Account review queue</h2>
          </div>
          <div className="actions" role="group" aria-label="Account filters">
            <button
              type="button"
              className={filter === "all" ? "is-active" : ""}
              onClick={() => setFilter("all")}
            >
              All accounts
            </button>
            <button
              type="button"
              className={filter === "attention" ? "is-active" : ""}
              onClick={() => setFilter("attention")}
            >
              Needs attention
            </button>
          </div>
        </header>

        <section className="metric-grid" aria-label="Key metrics">
          {visibleMetrics.map((metric) => (
            <article key={metric.label} className="metric-card">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.delta}</small>
            </article>
          ))}
        </section>

        <div className="content-grid">
          <section className="panel panel--large">
            <div className="panel__header">
              <div>
                <p className="eyebrow">Accounts</p>
                <h3>Priority book</h3>
              </div>
              <Activity size={18} aria-hidden="true" />
            </div>
            <div className="account-table">
              {visibleAccounts.map((account) => (
                <article key={account.name} className="account-row">
                  <div className="account-row__main">
                    <strong>{account.name}</strong>
                    <span>{nextSteps[account.health]}</span>
                  </div>
                  <span className={`health health--${account.health.toLowerCase()}`}>
                    {account.health}
                  </span>
                  <span>{account.owner}</span>
                  <strong>{account.value}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel__header">
              <div>
                <p className="eyebrow">Incidents</p>
                <h3>Open signals</h3>
              </div>
              <AlertTriangle size={18} aria-hidden="true" />
            </div>
            <div className="signal-list">
              {incidents.map((incident) => (
                <article key={incident.title} className="signal">
                  <strong>{incident.title}</strong>
                  <span>
                    {incident.severity} severity · {incident.status}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel panel--action">
            <div className="panel__header">
              <div>
                <p className="eyebrow">Next</p>
                <h3>Review rhythm</h3>
              </div>
              <Clock3 size={18} aria-hidden="true" />
            </div>
            <p className="callout">Enterprise pipeline sync</p>
            <p className="muted">Today · 14:30 · 8 follow-ups</p>
            <a href="#top">
              Open queue
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </section>
        </div>
      </section>
    </main>
  );
}

function AuthCard({ onSignIn }: { onSignIn: () => void }) {
  return (
    <main className="auth-screen">
      <section className="auth-card">
        <p className="eyebrow">WorkOS AuthKit</p>
        <h1>Sign in to the revenue desk</h1>
        <p>
          This template pairs AuthKit sessions with Convex auth so dashboard
          queries run only after Convex validates the WorkOS token.
        </p>
        <button type="button" onClick={onSignIn}>
          Sign in with WorkOS
        </button>
      </section>
    </main>
  );
}

function LoadingScreen({ label }: { label: string }) {
  return (
    <main className="auth-screen">
      <section className="auth-card">
        <p className="eyebrow">Loading</p>
        <h1>{label}</h1>
      </section>
    </main>
  );
}
