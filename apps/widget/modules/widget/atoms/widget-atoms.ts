"use client";

import { WidgetScreen } from "@/modules/widget/types";
import { createStore } from "@xstate/store";
import { getContactSessionKey } from "@/modules/widget/constants";
import { Id } from "@workspace/backend/_generated/dataModel";

export const routerStore = createStore({
  context: {
    screen: "loading" as WidgetScreen,
    errorMessage: undefined as string | undefined,
    organizationId: undefined as string | undefined,
    contactSessionId: undefined as Id<"contactSessions"> | undefined,
    conversationId: undefined as Id<"conversations"> | undefined,
  },
  emits: {
    updateContactSessionId(payload: {
      contactSessionId: Id<"contactSessions">;
      organizationId: string;
    }) {
      localStorage.setItem(
        getContactSessionKey(payload.organizationId),
        payload.contactSessionId
      );
    },
  },
  on: {
    navigate: (context, event: { to: WidgetScreen; error?: string }) => ({
      ...context,
      screen: event.to,
      errorMessage: event.error,
    }),
    clearError: (context) => ({
      ...context,
      errorMessage: undefined,
    }),
    setOrganizationId: (context, event: { organizationId: string }) => ({
      ...context,
      organizationId: event.organizationId,
      contactSessionId:
        (localStorage.getItem(
          getContactSessionKey(event.organizationId)
        ) as Id<"contactSessions">) ?? undefined,
    }),
    setContactSessionId(
      context,
      event: { contactSessionId: Id<"contactSessions"> },
      enq
    ) {
      if (!context.organizationId) return;

      enq.emit.updateContactSessionId({
        contactSessionId: event.contactSessionId,
        organizationId: context.organizationId,
      });

      return {
        ...context,
        contactSessionId: event.contactSessionId,
      };
    },
    setConversationId: (
      context,
      event: { conversationId: Id<"conversations"> }
    ) => ({
      ...context,
      conversationId: event.conversationId,
    }),
  },
});

routerStore.inspect((inspectionEvent) => {
  // type: '@xstate.snapshot' or
  // type: '@xstate.event'
  console.log(inspectionEvent);
});
