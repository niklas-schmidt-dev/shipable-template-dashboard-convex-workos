# Convex + WorkOS Dashboard

This template is a B2B operations dashboard built with React, Convex, WorkOS AuthKit, and the Convex WorkOS provider.

## Local Development

```bash
npm install
npx convex dev
```

Copy `.env.example` to `.env.local`, then set `VITE_CONVEX_URL`, `VITE_WORKOS_CLIENT_ID`, and `VITE_WORKOS_REDIRECT_URI`.

For an existing WorkOS team, set the backend values on your Convex deployment:

```bash
npx convex env set WORKOS_CLIENT_ID client_...
npx convex env set WORKOS_API_KEY sk_test_...
```

Then run:

```bash
npm run dev
```

Configure the WorkOS Dashboard with `http://localhost:5173/callback` as the redirect URI and `http://localhost:5173` as an allowed origin.
