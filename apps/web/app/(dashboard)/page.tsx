"use client";

import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export default function Page() {
  const addUser = useMutation(api.users.add);

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <UserButton />
        <OrganizationSwitcher hidePersonal />
        <Button size="sm" onClick={() => addUser({ name: "John Doe" })}>
          Add
        </Button>
      </div>
    </div>
  );
}
