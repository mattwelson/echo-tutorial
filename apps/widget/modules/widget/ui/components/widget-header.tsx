"use client";

import { cn } from "@workspace/ui/lib/utils";
import { ReactNode } from "react";

export function WidgetHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    // TODO: gradient is not working on safari and is ticking me off
    <header className={cn("bg-primary p-4 text-primary-foreground", className)}>
      {children}
    </header>
  );
}
