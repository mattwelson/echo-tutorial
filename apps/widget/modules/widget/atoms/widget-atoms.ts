"use client";

import { WidgetScreen } from "@/modules/widget/types";
import { createStore } from "@xstate/store";
import { getContactSessionKey } from "@/modules/widget/constants";

export const routerStore = createStore({
  context: {
    screen: "loading" as WidgetScreen,
    errorMessage: undefined as string | undefined,
    organizationId: undefined as string | undefined,
    contactSessionId: undefined as string | undefined,
  },
  emits: {
    updateContactSessionId(payload: {
      contactSessionId: string;
      organizationId: string;
    }) {
      localStorage.setItem(
        getContactSessionKey(payload.organizationId),
        payload.contactSessionId
      );
    },
  },
  on: {
    navigate: (context, event: { to: WidgetScreen }) => ({
      ...context,
      screen: event.to,
    }),
    setError: (context, event: { message: string }) => ({
      ...context,
      errorMessage: event.message,
    }),
    clearError: (context) => ({
      ...context,
      errorMessage: undefined,
    }),
    setOrganizationId: (context, event: { organizationId: string }) => ({
      ...context,
      organizationId: event.organizationId,
      contactSessionId:
        localStorage.getItem(getContactSessionKey(event.organizationId)) ??
        undefined,
    }),
    setContactSessionId(context, event: { contactSessionId: string }, enq) {
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
  },
});
