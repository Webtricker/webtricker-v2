import { TAccessTokenData } from "@/types/authToken";
import { isTokenExpired } from "@/utils/validator";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/login"];
const protectedPrefix = "/settings";
const excludedPaths = ["/_next/static", "/_next/image", "/favicon.ico"];
const staticFileExtensions =
  /\.(svg|jpg|jpeg|png|gif|webp|css|js|json|ico|woff|woff2|ttf|eot)$/;

// Check if it's a static or excluded path
const isExcluded = (pathname: string) =>
  excludedPaths.some((path) => pathname.startsWith(path)) ||
  staticFileExtensions.test(pathname);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip excluded/static files
  if (isExcluded(pathname)) return NextResponse.next();

  // Only protect `/settings` and anything that starts with `/settings/`
  const isProtected =
    pathname === protectedPrefix || pathname.startsWith(protectedPrefix + "/");

  // If route is not protected and not /login, allow access
  if (!isProtected && !authRoutes.includes(pathname))
    return NextResponse.next();

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  console.log(accessToken, " accessToken from middleware");

  const loginURL = request.nextUrl.clone();
  loginURL.pathname = "/login";
  loginURL.searchParams.set("redirect-to", pathname);

  // Allow access to /login
  if (!accessToken && authRoutes.includes(pathname)) return NextResponse.next();

  // Redirect unauthenticated users trying to access protected pages
  if (!accessToken) return NextResponse.redirect(loginURL);

  // Token exists, check expiration
  if (isTokenExpired(accessToken)) {
    return NextResponse.redirect(loginURL);
  }

  try {
    const decoded = jwtDecode(accessToken) as TAccessTokenData;
    const role = decoded?.role;

    // Redirect logged-in users away from /login
    if (authRoutes.includes(pathname)) {
      const redirectURL = request.nextUrl.clone();
      redirectURL.pathname = "/settings";
      return NextResponse.redirect(redirectURL);
    }

    // Block non-admins from accessing /settings and /settings/*
    if (isProtected && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error decoding access token:", error);
    return NextResponse.redirect(loginURL);
  }
}

export const config = {
  matcher: [
    "/settings",
    "/settings/:path*",
    "/login",
    "/((?!api|_next/static|_next/image|favicon.ico|excluded-path-1|excluded-path-2).*)",
  ],
};
