import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

export function authConfigured() {
  return Boolean(process.env.MONGODB_URI && process.env.BETTER_AUTH_SECRET && process.env.BETTER_AUTH_SECRET.length >= 32 && process.env.BETTER_AUTH_URL);
}
export function socialProviders() {
  return { google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET), github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) };
}
const globalForMongo = globalThis as typeof globalThis & { bazardorMongo?: MongoClient };
function createAuth() {
  const uri = process.env.MONGODB_URI!;
  const client = globalForMongo.bazardorMongo ?? new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  globalForMongo.bazardorMongo = client;
  const providers = socialProviders();
  return betterAuth({
    appName: "BazarDor",
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: mongodbAdapter(client.db(process.env.MONGODB_DB || "bazardor"), process.env.MONGODB_TRANSACTIONS === "true" ? { client } : {}),
    emailAndPassword: { enabled: true, requireEmailVerification: false, autoSignIn: false, minPasswordLength: 8 },
    socialProviders: {
      ...(providers.google ? { google: { clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! } } : {}),
      ...(providers.github ? { github: { clientId: process.env.GITHUB_CLIENT_ID!, clientSecret: process.env.GITHUB_CLIENT_SECRET! } } : {}),
    },
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  });
}
let instance: ReturnType<typeof createAuth> | undefined;
export function getAuth() {
  if (!authConfigured()) throw new Error("Authentication configuration is missing. See .env.example.");
  return instance ??= createAuth();
}
