"use client";

import { Button } from "@workspace/ui/components/button";
import { WidgetHeader } from "../components/widget-header";
import { ArrowLeft, Menu } from "lucide-react";
import { useSelector } from "@xstate/store/react";
import { routerStore } from "../../atoms/widget-atoms";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export function WidgetChatScreen() {
  const conversationId = useSelector(
    routerStore,
    (state) => state.context.conversationId
  );

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId
      ? {
          conversationId,
        }
      : "skip"
  );

  if (!conversationId) {
    routerStore.trigger.navigate({
      to: "selection",
    });
    return null;
  }

  return (
    <>
      <WidgetHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="transparent"
            onClick={() => routerStore.trigger.navigate({ to: "selection" })}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <p>Chat</p>
        </div>
        <Button size="icon" variant="transparent">
          <Menu className="size-4" />
        </Button>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto">
        <div className="text-sm">Chat screen</div>
      </div>
    </>
  );
}
