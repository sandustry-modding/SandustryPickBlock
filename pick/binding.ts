import { runVanillaInstantPick, type PickerHandlers } from "./pick.ts";

type PickerBinding = {
  handlers?: PickerHandlers;
};

export type PickBindingApi = {
  input: {
    registerBinding: typeof sandkit.api.input.registerBinding;
    getBoundKeys: typeof sandkit.api.input.getBoundKeys;
  };
};

export function pickerHandlers(keyBindings: unknown): PickerHandlers | null {
  if (!keyBindings || typeof keyBindings !== "object") return null;
  const handlers = (keyBindings as { Picker?: PickerBinding }).Picker?.handlers;
  if (!handlers || typeof handlers !== "object") return null;
  return handlers;
}

export function wrapPickerDown(
  keyBindings: unknown,
  options: { useInstantPick: () => boolean },
): boolean {
  const handlers = pickerHandlers(keyBindings);
  if (typeof handlers?.down !== "function" || typeof handlers.pressed !== "function") {
    return false;
  }

  const originalDown = handlers.down;
  const pressed = handlers.pressed;
  handlers.down = (state?: unknown) => {
    if (!options.useInstantPick()) {
      originalDown(state);
      return;
    }
    runVanillaInstantPick(state, pressed);
  };
  return true;
}

export function pickerDefaultKeys(
  api: PickBindingApi,
): Parameters<PickBindingApi["input"]["registerBinding"]>[1] {
  try {
    const keys = api.input.getBoundKeys("Picker");
    if (keys.length > 0) return keys;
  } catch {
    // Vanilla Picker id is not on the public KeyBinding enum.
  }
  return ["MouseMiddle"];
}

export function registerPickBinding(api: PickBindingApi, onDown: () => void): void {
  api.input.registerBinding("InstantPickBlock", pickerDefaultKeys(api), {
    displayName: "Instant pick block",
    category: "Mods",
    subsection: {
      title: "Instant Pick Block",
      description: "Pick the structure under the cursor on key press.",
    },
    handlers: { down: onDown },
  });
}

export function instantPickFromState(): boolean {
  const handlers = pickerHandlers(sandkit.state?.sandkit?.keyBindings);
  return runVanillaInstantPick(sandkit.state, handlers?.pressed);
}

export function installPickTrigger(
  api: PickBindingApi,
  options: { useInstantPick: () => boolean },
): void {
  const keyBindings = sandkit.state?.sandkit?.keyBindings;
  if (wrapPickerDown(keyBindings, options)) return;
  registerPickBinding(api, () => {
    if (!options.useInstantPick()) return;
    instantPickFromState();
  });
}
