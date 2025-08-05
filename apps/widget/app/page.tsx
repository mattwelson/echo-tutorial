'use client'

import { Button } from "@workspace/ui/components/button"
import {useQuery} from "convex/react"
import { api } from "@workspace/backend/_generated/api"

export default function Page() {
  const users = useQuery(api.users.getMany);

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Widget</h1>
        <Button size="sm">Button</Button>
        <pre className="max-w-md w-full mx-auto">
          {JSON.stringify(users, null, 2)}
        </pre>
      </div>
    </div>
  )
}
