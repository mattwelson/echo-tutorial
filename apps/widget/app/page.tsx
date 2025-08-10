"use client";

import { Button } from "@workspace/ui/components/button";
import { useVapi } from "@/modules/widget/hooks/use-vapi";
import { Check, Loader2, Mic } from "lucide-react";

export default function Page() {
  const {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    stopCall,
  } = useVapi();

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Widget</h1>
        <Button
          size="sm"
          onClick={startCall}
          disabled={isConnecting || isConnected}
        >
          Start Call
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={stopCall}
          disabled={!isConnected}
        >
          Stop Call
        </Button>
        <div className="flex flex-col gap-2">
          {isConnecting && (
            <p>
              <Loader2 className="animate-spin mr-2" /> Connecting...
            </p>
          )}
          {isConnected && (
            <p>
              <Check className="mr-2" /> Connected
            </p>
          )}
          {isSpeaking && (
            <p>
              <Mic className="mr-2" /> Speaking
            </p>
          )}
        </div>
        <pre className="max-w-md w-full mx-auto">
          {JSON.stringify(transcript, null, 2)}
        </pre>
      </div>
    </div>
  );
}
