import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { betterAuth } from "better-auth"; // Changed from better-auth/minimal
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL!;

// Export the auth component client
export const authComponent = createClient<DataModel>(components.betterAuth);

// Create and export the auth handler
export const auth = betterAuth({
  baseURL: siteUrl,
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ],
  // Use the Convex adapter directly
  database: authComponent.adapter,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [
    convex({ authConfig }),
  ],
});