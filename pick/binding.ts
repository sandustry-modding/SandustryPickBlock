import { runVanillaInstantPick, type PickerHandlers } from "./pick.ts";

type PickerBinding = {
  handlers?: PickerHandlers;
};

export function pickerHandlers(keyBindings: unknown): PickerHandlers | null {
  if (!keyBindings || typeof keyBindings !== "object") return null;
  const handlers = (keyBindings as { Picker?: PickerBinding }).Picker?.handlers;
  if (!handlers || typeof handlers !== "object") return null;
  return handlers;
}

export function wrapPickerDown(keyBindings: unknown, enabled: () => boolean): boolean {
  const handlers = pickerHandlers(keyBindings);
  if (typeof handlers?.down !== "function" || typeof handlers.pressed !== "function") {
    return false;
  }

  const originalDown = handlers.down;
  const pressed = handlers.pressed;
  handlers.down = (state?: unknown) => {
    if (!enabled()) {
      originalDown(state);
      return;
    }
    runVanillaInstantPick(state, pressed);
  };
  return true;
}

export function pickerDefaultKeys(
  getBoundKeys: (id: string) => string[] = (id) => sandkit.api.input.getBoundKeys(id),
): string[] {
  try {
    const keys = getBoundKeys("Picker");
    if (keys.length > 0) return keys;
  } catch {
    // Vanilla Picker id is not on the public KeyBinding enum.
  }
  return ["KeyF"];
}

export function instantPickFromState(): boolean {
  const handlers = pickerHandlers(sandkit.state?.sandkit?.keyBindings);
  return runVanillaInstantPick(sandkit.state, handlers?.pressed);
}
