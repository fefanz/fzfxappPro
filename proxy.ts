export { default as proxy } from "next-auth/middleware";

export const config = {
  matcher: [
    "/((?!api/auth|api/webhooks|landing|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};

