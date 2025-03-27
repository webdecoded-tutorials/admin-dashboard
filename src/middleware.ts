import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

const isMemberRoute = createRouteMatcher(['/admin(.*)']);
const isAdminRoute = createRouteMatcher(['/admin/users']);


export default clerkMiddleware(async (auth, req) => {
    const metadata = (await auth()).sessionClaims?.metadata;
    const role = metadata?.role;
    if (isMemberRoute(req) && role !== 'admin' && role !== 'member') {
        const url = new URL("/", req.url);
        return NextResponse.redirect(url);
    } else if (isAdminRoute(req) && role !== 'admin') {
        const url = new URL("/", req.url);
        return NextResponse.redirect(url);
    }
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};