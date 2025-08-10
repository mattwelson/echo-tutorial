import { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";

interface TranscriptMessage {
  role: "user" | "assistant";
  text: string;
}

// TODO: look at using XState here, it would be perfect
export function useVapi() {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  useEffect(() => {
    // TODO: only for testing Vapi API, otherwise provided by customer
    const vapi = new Vapi("");
    setVapi(vapi);

    vapi.on("call-start", () => {
      setIsConnected(true);
      setIsConnecting(false);
      setTranscript([]);
    });

    vapi.on("call-end", () => {
      setIsConnected(false);
      setIsConnecting(false);
      setIsSpeaking(false);
    });

    vapi.on("speech-start", () => {
      setIsSpeaking(true);
    });

    vapi.on("speech-end", () => {
      setIsSpeaking(false);
    });

    vapi.on("error", (error: Error) => {
      console.error("VAPI_ERROR", error);
    });

    vapi.on("message", (message) => {
      // TODO: parse message better
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role === "user" ? "user" : "assistant",
            text: message.transcript,
          },
        ]);
      }
    });

    return () => vapi?.stop();
  }, []);

  function startCall() {
    // TODO: get ai assistant ID from user configuration
    vapi?.start("");
    setIsConnecting(true);
  }

  function stopCall() {
    vapi?.stop();
  }

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    stopCall,
  };
}
