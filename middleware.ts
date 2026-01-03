export { auth as middleware } from "./auth";

export const config = {
  matcher: [
    "/((?!api/auth|api/webhooks|landing|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};
