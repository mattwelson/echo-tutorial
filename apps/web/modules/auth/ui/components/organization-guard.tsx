"use client";

import { useOrganization } from "@clerk/nextjs";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";
import { OrganizationSelectionView } from "@/modules/auth/ui/views/organization-selection-view";

export function OrganizationGuard({ children }: { children: React.ReactNode }) {
  const { organization } = useOrganization();

  if (!organization) {
    return (
      <AuthLayout>
        <OrganizationSelectionView />
      </AuthLayout>
    );
  }

  return <>{children}</>;
}
