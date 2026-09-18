import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // Refresh the auth session — updates cookie expiry
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users to login (skip public paths)
  const { pathname } = request.nextUrl;
  const PUBLIC_PATHS = ["/login", "/api", "/_next", "/favicon.ico"];
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!isPublic && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already authenticated users away from login page to dashboard
  if (pathname === "/login" && user) {
    const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
