"use client";

import { WidgetAuthScreen } from "../screens/widget-auth-screen";
import { screenAtom } from "@/modules/widget/atoms/widget-atoms";
import { useAtom } from "@xstate/store/react";

export function WidgetView() {
  const screen = useAtom(screenAtom);

  const screenComponents = {
    error: <p>TODO</p>,
    auth: <WidgetAuthScreen />,
    loading: <p>TODO</p>,
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
