"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Home, Inbox } from "lucide-react";

export function WidgetFooter() {
  const screen: "selection" | "inbox" = "selection";
  return (
    <footer className="flex items-center justify-between border-t bg-background">
      <Button
        className="h-14 flex-1 rounded-none"
        onClick={() => {}}
        size="icon"
        variant="ghost"
      >
        <Home
          className={cn("size-5", {
            "text-primary": screen === "selection",
          })}
        />
      </Button>
      <Button
        className="h-14 flex-1 rounded-none"
        onClick={() => {}}
        size="icon"
        variant="ghost"
      >
        <Inbox
          className={cn("size-5", {
            "text-primary": screen === "inbox",
          })}
        />
      </Button>
    </footer>
  );
}
