import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRouter = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

const isOrgSelectionRouter = createRouteMatcher([
  "/organization-selection(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();
  if (!isPublicRouter(req)) {
    await auth.protect();
  }

  if (userId && !orgId && !isOrgSelectionRouter(req)) {
    const searchParams = new URLSearchParams({ redirectUrl: req.url });
    const orgSelectionUrl = new URL(
      `/organization-selection?${searchParams.toString()}`,
      req.url
    );
    return Response.redirect(orgSelectionUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
