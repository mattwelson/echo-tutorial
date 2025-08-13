"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useQueryState } from "nuqs";
import type { Doc } from "@workspace/backend/_generated/dataModel";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Invalid email").trim().toLowerCase(),
});

export function WidgetAuthScreen() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const createContactSession = useMutation(api.public.contactSessions.create);
  const [organizationId] = useQueryState("organizationId");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!organizationId) {
      return;
    }

    const metadata = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages as string[],
      platform: navigator.platform,
      vendor: navigator.vendor,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      cookieEnabled: navigator.cookieEnabled,
      referrer: document.referrer,
      currentUrl: window.location.href,
    } satisfies Doc<"contactSessions">["metadata"];

    const contactSessionId = await createContactSession({
      organizationId,
      name: values.name,
      email: values.email,
      metadata,
    });

    console.log({ contactSessionId });
  }

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col items-center justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there! 👋</p>
          <p className="text-lg">Let&apos;s get started</p>
        </div>
      </WidgetHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4 p-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="h-10 bg-background"
                    placeholder="John Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="h-10 bg-background"
                    placeholder="john.doe@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
