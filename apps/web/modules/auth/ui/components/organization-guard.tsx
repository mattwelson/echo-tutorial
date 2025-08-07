"use client";

import { useOrganization } from "@clerk/nextjs";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";
import { OrganisationSelectionView } from "@/modules/auth/ui/views/organisation-selection-view";

export function OrganizationGuard({ children }: { children: React.ReactNode }) {
  const { organization } = useOrganization();

  if (!organization) {
    return (
      <AuthLayout>
        <OrganisationSelectionView />
      </AuthLayout>
    );
  }

  return <>{children}</>;
}
