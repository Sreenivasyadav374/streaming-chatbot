// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Safely refresh token session state
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentPath = request.nextUrl.pathname;

  // 📋 AC #3 Check: Prevent unauthenticated traffic from entering private workspaces
  // Exception: Let them hit the login page, signup page, or the auth sync callback endpoint
  if (!user) {
    const isPublicRoute =
      currentPath === "/login" ||
      currentPath === "/signup" ||
      currentPath.startsWith("/api/auth");

    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Bounce authenticated users out of the login sandbox back to the dashboard core
  if (user && currentPath === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public assets like SVG icons, PNG graphics, or web manifests (.webmanifest)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
