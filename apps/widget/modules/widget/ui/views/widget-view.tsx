"use client";

import { WidgetAuthScreen } from "@/modules/widget/ui/screens/widget-auth-screen";
import { WidgetErrorScreen } from "@/modules/widget/ui/screens/widget-error-screen";
import { WidgetLoadingScreen } from "@/modules/widget/ui/screens/widget-loading-screen";
import { routerStore } from "@/modules/widget/atoms/widget-atoms";
import { useSelector } from "@xstate/store/react";

export function WidgetView() {
  const screen = useSelector(routerStore, (state) => state.context.screen);

  const screenComponents = {
    error: <WidgetErrorScreen />,
    auth: <WidgetAuthScreen />,
    loading: <WidgetLoadingScreen />,
    selection: <p>TODO</p>,
    voice: <p>TODO</p>,
    inbox: <p>TODO</p>,
    chat: <p>TODO</p>,
    contact: <p>TODO</p>,
  };

  return (
    <main className="flex min-h-screen size-full flex-col overflow-hidden rounded-xl border bg-muted">
      {screenComponents[screen]}
    </main>
  );
}
