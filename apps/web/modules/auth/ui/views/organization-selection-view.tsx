import { OrganizationList } from "@clerk/nextjs";

export function OrganizationSelectionView() {
  return (
    <OrganizationList
      afterCreateOrganizationUrl="/"
      afterSelectOrganizationUrl="/"
      hidePersonal
      skipInvitationScreen
    />
  );
}
