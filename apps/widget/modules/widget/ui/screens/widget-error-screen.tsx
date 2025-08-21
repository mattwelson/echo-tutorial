"use client";

import { useSelector } from "@xstate/store/react";
import { routerStore } from "@/modules/widget/atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { AlertTriangle } from "lucide-react";

export function WidgetErrorScreen() {
  const errorMessage = useSelector(
    routerStore,
    (state) => state.context.errorMessage
  );
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col items-center justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there! 👋</p>
          <p className="text-lg">Let&apos;s get started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-muted-foreground">
        <AlertTriangle className="size-12" />
        <p className="text-sm">{errorMessage ?? "Invalid configuration"}</p>
      </div>
    </>
  );
}
