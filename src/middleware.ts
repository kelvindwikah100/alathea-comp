import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Update Supabase session cookies if configured
  const res = await updateSession(request);

  const isDemoAdmin = request.cookies.get("alathea_demo_admin")?.value === "true";
  // Supabase may split the session cookie into chunks: sb-<ref>-auth-token.0, .1, ...
  const hasSupabaseAuth = request.cookies
    .getAll()
    .some((c) => /^sb-.+-auth-token(\.\d+)?$/.test(c.name));

  const isAuthenticated = isDemoAdmin || hasSupabaseAuth;

  // Protect /admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in with Supabase, skip the login page.
  // Demo Mode users can still open it to log in with a real Supabase account.
  if (pathname === "/admin/login" && hasSupabaseAuth) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
