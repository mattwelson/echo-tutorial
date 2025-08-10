import { useMachine } from "@xstate/react";
import { vapiMachine } from "@/modules/widget/machines/vapi-machine";

export function useVapi() {
  const [state, send] = useMachine(vapiMachine);

  return {
    // Computed state values - using state.matches() for XState v5
    isConnected: state.matches("connected"),
    isConnecting: state.matches("connecting"),
    isSpeaking: state.matches({ connected: "speaking" }),
    transcript: state.context.transcript,
    error: state.context.error,

    // Actions
    startCall: () => send({ type: "START_CALL" }),
    stopCall: () => send({ type: "STOP_CALL" }),
  };
}
