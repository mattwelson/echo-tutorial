"use client";

import { WidgetView } from "@/modules/widget/ui/views/widget-view";
import { useQueryState } from "nuqs";

export default function Page() {
  const [organizationId] = useQueryState("organizationId", {
    defaultValue: "",
  });

  return <WidgetView organizationId={organizationId} />;
}
