import { isEnabled } from "@modkit/utils";
import { instantPickFromState, pickerDefaultKeys, wrapPickerDown } from "./binding.ts";

export function registerMod(): void {
  const enabled = () => isEnabled(sandkit.api);
  const keyBindings = sandkit.state?.sandkit?.keyBindings;
  if (wrapPickerDown(keyBindings, enabled)) return;
  sandkit.api.input.registerBinding("InstantPickBlock", pickerDefaultKeys(), {
    displayName: "Instant pick block",
    category: "Mods",
    subsection: {
      title: "Instant Pick Block",
      description: "Pick the structure under the cursor on key press.",
    },
    handlers: {
      down: () => {
        if (!enabled()) return;
        instantPickFromState();
      },
    },
  });
}
