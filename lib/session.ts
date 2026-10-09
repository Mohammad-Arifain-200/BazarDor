import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionCookie } from "better-auth/cookies";
import { getAuth, authConfigured } from "./auth";
export async function requireSession() {
  const requestHeaders = await headers();
  if (!authConfigured() || !getSessionCookie(new Request("http://localhost", { headers: requestHeaders }))) redirect("/signin?reason=protected");
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  if (!session) redirect("/signin?reason=protected");
  return session;
}
