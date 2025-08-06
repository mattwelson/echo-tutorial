"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

import { Loader2 } from "lucide-react";
import { SignInView } from "../views/sign-in-view";
import { AuthLayout } from "../layouts/auth-layout";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <AuthLayout>
          <SignInView />
        </AuthLayout>
      </Unauthenticated>
      <AuthLoading>
        <AuthLayout>
          <div className="flex items-center justify-center">
            <Loader2
              strokeWidth={1}
              className="animate-spin size-14 text-muted-foreground"
            />
          </div>
          <p>Loading...</p>
        </AuthLayout>
      </AuthLoading>
    </>
  );
}
