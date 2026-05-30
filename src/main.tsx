import React from "react";
import { createRoot } from "react-dom/client";
import { AuthKitProvider, useAuth } from "@workos-inc/authkit-react";
import { ConvexProviderWithAuthKit } from "@convex-dev/workos";
import { ConvexReactClient } from "convex/react";
import App from "./App";
import "./styles.css";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const workosClientId = import.meta.env.VITE_WORKOS_CLIENT_ID;
const workosRedirectUri = import.meta.env.VITE_WORKOS_REDIRECT_URI;

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found");
}

if (!convexUrl || !workosClientId || !workosRedirectUri) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <main className="boot-error">
        <div>
          <p className="boot-error__eyebrow">Runtime not configured</p>
          <h1>Add Convex and WorkOS values to .env.local</h1>
          <p>
            Run <code>npx convex dev</code> from this directory to provision a
            deployment, then set <code>VITE_CONVEX_URL</code>,{" "}
            <code>VITE_WORKOS_CLIENT_ID</code>, and{" "}
            <code>VITE_WORKOS_REDIRECT_URI</code>.
          </p>
        </div>
      </main>
    </React.StrictMode>,
  );
} else {
  const convex = new ConvexReactClient(convexUrl);
  createRoot(rootElement).render(
    <React.StrictMode>
      <AuthKitProvider clientId={workosClientId} redirectUri={workosRedirectUri}>
        <ConvexProviderWithAuthKit client={convex} useAuth={useAuth}>
          <App />
        </ConvexProviderWithAuthKit>
      </AuthKitProvider>
    </React.StrictMode>,
  );
}
