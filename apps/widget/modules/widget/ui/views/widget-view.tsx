"use client";

import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

export function WidgetView({ organizationId }: { organizationId: string }) {
  return (
    <main className="flex min-h-screen size-full flex-col overflow-hidden rounded-xl border bg-muted">
      <WidgetHeader>
        <div className="flex flex-col items-center justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there! 👋</p>
          <p className="text-lg">How can I help you today?</p>
        </div>
      </WidgetHeader>
      <div className="flex-1 overflow-y-auto">Body for {organizationId}</div>
      <WidgetFooter />
    </main>
  );
}
