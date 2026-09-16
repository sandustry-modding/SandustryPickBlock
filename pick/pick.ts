type MouseState = {
  clicked?: boolean;
};

type SessionInput = {
  mouse?: MouseState;
};

type GameState = {
  session?: {
    input?: SessionInput;
  };
};

export type PickerHandlers = {
  down?: (state?: unknown) => void;
  pressed?: (state?: unknown) => void;
  released?: (state?: unknown) => void;
};

export function mouseFromState(state: unknown): MouseState | null {
  if (!state || typeof state !== "object") return null;
  const mouse = (state as GameState).session?.input?.mouse;
  if (!mouse || typeof mouse !== "object") return null;
  return mouse;
}

/**
 * Run vanilla Picker `pressed` as the old bundle patch did:
 * fake a left click, call `pressed`, then clear `clicked`.
 */
export function runVanillaInstantPick(
  state: unknown,
  pressed: ((state?: unknown) => void) | undefined,
): boolean {
  if (typeof pressed !== "function") return false;
  const mouse = mouseFromState(state);
  if (!mouse) return false;
  mouse.clicked = true;
  try {
    pressed(state);
  } finally {
    mouse.clicked = false;
  }
  return true;
}
