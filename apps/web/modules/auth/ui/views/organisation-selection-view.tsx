import { OrganizationList } from "@clerk/nextjs";

export function OrganisationSelectionView() {
  return (
    <OrganizationList
      afterCreateOrganizationUrl="/"
      afterSelectOrganizationUrl="/"
      hidePersonal
      skipInvitationScreen
    />
  );
}
