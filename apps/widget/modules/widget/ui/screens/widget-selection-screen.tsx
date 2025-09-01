"use client";

import { Button } from "@workspace/ui/components/button";
import { WidgetHeader } from "../components/widget-header";
import { ChevronRight, MessageSquareText } from "lucide-react";
import { useSelector } from "@xstate/store/react";
import { routerStore } from "../../atoms/widget-atoms";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { createAtom } from "@xstate/store";
import { useAtom } from "@xstate/store/react";

const pendingAtom = createAtom<boolean>(false);

export function WidgetSelectionScreen() {
  const contactSessionId = useSelector(
    routerStore,
    (state) => state.context.contactSessionId
  );
  const organizationId = useSelector(
    routerStore,
    (state) => state.context.organizationId
  );
  const createConversation = useMutation(api.public.conversations.create);
  const isPending = useAtom(pendingAtom);

  async function handleNewConversation() {
    pendingAtom.set(true);
    if (!contactSessionId) {
      routerStore.trigger.navigate({
        to: "auth",
      });
      return;
    }

    if (!organizationId) {
      routerStore.trigger.navigate({
        to: "error",
        error: "Organization ID is required",
      });
      return;
    }

    try {
      const conversationId = await createConversation({
        contactSessionId,
        organizationId,
      });

      routerStore.trigger.setConversationId({
        conversationId,
      });
      routerStore.trigger.navigate({
        to: "chat",
      });
    } catch {
      routerStore.trigger.navigate({
        to: "auth",
      });
    } finally {
      pendingAtom.set(false);
    }
  }

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col items-center justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there! 👋</p>
          <p className="text-lg">Let&apos;s get started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto">
        <Button
          className="flex items-center justify-between h-16"
          variant="outline"
          onClick={handleNewConversation}
          disabled={isPending}
        >
          <div className="flex items-center gap-2">
            <MessageSquareText className="size-4" />
            <span>Start chat</span>
          </div>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </>
  );
}
