"use client";

import { useEffect } from "react";
import { useQueryState } from "nuqs";
import { WidgetHeader } from "../components/widget-header";
import { Loader2 } from "lucide-react";
import { routerStore } from "../../atoms/widget-atoms";
import { createAtom } from "@xstate/store";
import { useAtom, useSelector } from "@xstate/store/react";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";

// TODO: make into a local store or state machine?
type InitStep = "organization" | "session" | "settings" | "vapi" | "done";

const stepAtom = createAtom<InitStep>("organization");
const sessionValidAtom = createAtom<boolean>(false);
const loadingMessageAtom = createAtom<string[]>(["Starting up..."]);

export function WidgetLoadingScreen() {
  const [organizationId] = useQueryState("organizationId");
  const step = useAtom(stepAtom);
  const sessionValid = useAtom(sessionValidAtom);
  const loadingMessage = useAtom(loadingMessageAtom);
  const contactSessionId = useSelector(
    routerStore,
    (state) => state.context.contactSessionId
  );

  function setStep(step: InitStep) {
    stepAtom.set(step);
  }

  function setSessionValid(valid: boolean) {
    sessionValidAtom.set(valid);
  }

  function setLoadingMessage(message: string) {
    loadingMessageAtom.set((prev) => [...prev, message]);
  }

  // TODO: improve this from this weird use effect design
  const validateOrganization = useAction(api.public.organizations.validate);
  const validateContactSession = useMutation(
    api.public.contactSessions.validate
  );

  useEffect(() => {
    if (step !== "organization") return;
    if (!organizationId) {
      routerStore.trigger.setError({ message: "Organization ID is required" });
      routerStore.trigger.navigate({ to: "error" });
      return;
    }

    setLoadingMessage("Finding organization...");
    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          routerStore.trigger.setOrganizationId({ organizationId });
          setStep("session");
        } else {
          routerStore.trigger.setError({
            message: result.reason ?? "Something went wrong",
          });
          routerStore.trigger.navigate({ to: "error" });
        }
      })
      .catch((err) => {
        routerStore.trigger.setError({
          message:
            err instanceof Error
              ? err.message
              : "Organization validation failed",
        });
        routerStore.trigger.navigate({ to: "error" });
      });
  }, [step, organizationId, routerStore.trigger]);

  // validate session if it exists
  useEffect(() => {
    if (step !== "session" || !organizationId) return;

    if (typeof localStorage === "undefined") return;

    if (!contactSessionId) {
      setStep("done");
      setSessionValid(false);
      return;
    }

    setLoadingMessage("Validating session...");
    validateContactSession({
      contactSessionId: contactSessionId as Id<"contactSessions">,
    })
      .then((result) => {
        if (result.valid) {
          setStep("done");
          setSessionValid(true);
          routerStore.trigger.setContactSessionId({
            contactSessionId: contactSessionId,
          });
        } else {
          routerStore.trigger.setError({
            message: result.reason ?? "Something went wrong",
          });
          routerStore.trigger.navigate({ to: "error" });
        }
      })
      .catch((err) => {
        routerStore.trigger.setError({
          message:
            err instanceof Error
              ? err.message
              : "Contact session validation failed",
        });
        routerStore.trigger.navigate({ to: "error" });
      });
  }, [step, organizationId, contactSessionId, routerStore.trigger]);

  useEffect(() => {
    if (step !== "done") return;
    if (!sessionValid) {
      routerStore.trigger.navigate({ to: "auth" });
    } else {
      routerStore.trigger.navigate({ to: "selection" });
    }
  }, [step, sessionValid, routerStore.trigger]);

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col items-center justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there! 👋</p>
          <p className="text-lg">Let&apos;s get started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-muted-foreground">
        <Loader2 className="size-12 animate-spin" />
        <p className="text-sm relative">{loadingMessage.at(-1)}</p>
      </div>
    </>
  );
}
