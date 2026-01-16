import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function middleware(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/obras-sociales/:path*"],
};
