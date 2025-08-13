"use client";

import { WidgetAuthScreen } from "../screens/widget-auth-screen";

export function WidgetView({ organizationId }: { organizationId: string }) {
  return (
    <main className="flex min-h-screen size-full flex-col overflow-hidden rounded-xl border bg-muted">
      <WidgetAuthScreen />
    </main>
  );
}
