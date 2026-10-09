import { toNextJsHandler } from "better-auth/next-js";
import { authConfigured, getAuth } from "@/lib/auth";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
async function handle(request: Request) {
  if (!authConfigured()) {
    if (request.method === "GET" && new URL(request.url).pathname.endsWith("/get-session")) return Response.json(null);
    return Response.json({ code: "AUTH_NOT_CONFIGURED", message: "অ্যাকাউন্ট সেবা এখন চালু নেই। পরে আবার চেষ্টা করুন।" }, { status: 503 });
  }
  try {
    const handlers = toNextJsHandler(getAuth());
    return request.method === "GET" ? await handlers.GET(request) : await handlers.POST(request);
  } catch {
    return Response.json({ code: "AUTH_UNAVAILABLE", message: "অ্যাকাউন্ট সেবায় সংযোগ হচ্ছে না। পরে আবার চেষ্টা করুন।" }, { status: 503 });
  }
}
export const GET = handle;
export const POST = handle;
