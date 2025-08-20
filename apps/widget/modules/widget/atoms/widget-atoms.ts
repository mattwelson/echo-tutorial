import { WidgetScreen } from "@/modules/widget/types";
import { createAtom } from "@xstate/store";

// TODO: look into moving this into a store, or a machine
export const screenAtom = createAtom<WidgetScreen>("auth");
