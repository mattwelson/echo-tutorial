import { createMachine, assign } from "xstate";
import Vapi from "@vapi-ai/web";

export interface TranscriptMessage {
  role: "user" | "assistant";
  text: string;
}

export interface VapiContext {
  vapi: Vapi | null;
  transcript: TranscriptMessage[];
  error: Error | null;
  eventHandlers: {
    handleCallStart?: () => void;
    handleCallEnd?: () => void;
    handleSpeechStart?: () => void;
    handleSpeechEnd?: () => void;
    handleError?: (error: Error) => void;
    handleMessage?: (message: any) => void;
  };
}

type VapiEvent =
  | { type: "START_CALL" }
  | { type: "STOP_CALL" }
  | { type: "CALL_STARTED" }
  | { type: "CALL_ENDED" }
  | { type: "SPEECH_STARTED" }
  | { type: "SPEECH_ENDED" }
  | { type: "TRANSCRIPT_RECEIVED"; message: TranscriptMessage }
  | { type: "ERROR_OCCURRED"; error: Error };

export const vapiMachine = createMachine(
  {
    id: "vapi",
    types: {
      context: {} as VapiContext,
      events: {} as VapiEvent,
    },
    initial: "initializing",
    context: {
      vapi: null,
      transcript: [],
      error: null,
      eventHandlers: {},
    },
    states: {
      initializing: {
        entry: "initializeVapi",
        // No exit action here - we want to keep the handlers!
        // Automatically transition once Vapi is set up
        always: {
          target: "idle",
          guard: ({ context }) => context.vapi !== null,
        },
      },
      idle: {
        exit: "cleanupVapi",
        on: {
          START_CALL: {
            target: "connecting",
            actions: "startCall",
          },
        },
      },
      connecting: {
        exit: "cleanupVapi",
        on: {
          CALL_STARTED: {
            target: "connected",
            actions: "clearTranscript",
          },
          CALL_ENDED: "idle",
          ERROR_OCCURRED: {
            target: "error",
            actions: "setError",
          },
          STOP_CALL: {
            target: "idle",
            actions: "stopCall",
          },
        },
      },
      connected: {
        initial: "listening",
        exit: "cleanupVapi",
        on: {
          CALL_ENDED: "idle",
          STOP_CALL: {
            target: "idle",
            actions: "stopCall",
          },
          ERROR_OCCURRED: {
            target: "error",
            actions: "setError",
          },
          TRANSCRIPT_RECEIVED: {
            actions: "addTranscriptMessage",
          },
        },
        states: {
          listening: {
            on: {
              SPEECH_STARTED: "speaking",
            },
          },
          speaking: {
            on: {
              SPEECH_ENDED: "listening",
            },
          },
        },
      },
      error: {
        exit: "cleanupVapi",
        on: {
          START_CALL: {
            target: "connecting",
            actions: ["clearError", "startCall"],
          },
        },
      },
    },
  },
  {
    actions: {
      initializeVapi: assign(({ self }) => {
        const vapi = new Vapi(""); // TODO: get from config

        // Create handler functions
        const handleCallStart = () => self.send({ type: "CALL_STARTED" });
        const handleCallEnd = () => self.send({ type: "CALL_ENDED" });
        const handleSpeechStart = () => self.send({ type: "SPEECH_STARTED" });
        const handleSpeechEnd = () => self.send({ type: "SPEECH_ENDED" });
        const handleError = (error: Error) =>
          self.send({ type: "ERROR_OCCURRED", error });
        const handleMessage = (message: any) => {
          if (
            message.type === "transcript" &&
            message.transcriptType === "final"
          ) {
            const transcriptMessage: TranscriptMessage = {
              role: message.role === "user" ? "user" : "assistant",
              text: message.transcript,
            };
            self.send({
              type: "TRANSCRIPT_RECEIVED",
              message: transcriptMessage,
            });
          }
        };

        // Set up event listeners
        vapi.on("call-start", handleCallStart);
        vapi.on("call-end", handleCallEnd);
        vapi.on("speech-start", handleSpeechStart);
        vapi.on("speech-end", handleSpeechEnd);
        vapi.on("error", handleError);
        vapi.on("message", handleMessage);

        // Return the updates to context
        return {
          vapi,
          eventHandlers: {
            handleCallStart,
            handleCallEnd,
            handleSpeechStart,
            handleSpeechEnd,
            handleError,
            handleMessage,
          },
        };
      }),

      startCall: ({ context }) => {
        context.vapi?.start(""); // TODO: get assistant ID from config
      },

      stopCall: ({ context }) => {
        context.vapi?.stop();
      },

      clearTranscript: assign({
        transcript: [],
      }),

      addTranscriptMessage: assign({
        transcript: ({ context, event }) => {
          if (event.type === "TRANSCRIPT_RECEIVED") {
            return [...context.transcript, event.message];
          }
          return context.transcript;
        },
      }),

      setError: assign({
        error: ({ event }) => {
          if (event.type === "ERROR_OCCURRED") {
            return event.error;
          }
          return null;
        },
      }),

      clearError: assign({
        error: null,
      }),

      cleanupVapi: ({ context }) => {
        const { vapi, eventHandlers } = context;

        if (vapi && eventHandlers) {
          // Remove all event listeners
          if (eventHandlers.handleCallStart) {
            vapi.off("call-start", eventHandlers.handleCallStart);
          }
          if (eventHandlers.handleCallEnd) {
            vapi.off("call-end", eventHandlers.handleCallEnd);
          }
          if (eventHandlers.handleSpeechStart) {
            vapi.off("speech-start", eventHandlers.handleSpeechStart);
          }
          if (eventHandlers.handleSpeechEnd) {
            vapi.off("speech-end", eventHandlers.handleSpeechEnd);
          }
          if (eventHandlers.handleError) {
            vapi.off("error", eventHandlers.handleError);
          }
          if (eventHandlers.handleMessage) {
            vapi.off("message", eventHandlers.handleMessage);
          }

          // Stop any ongoing call
          vapi.stop();
        }
      },
    },
  }
);
