import assert from "node:assert/strict";
import test from "node:test";
import { pickerDefaultKeys, wrapPickerDown, type PickBindingApi } from "./binding.ts";
import type { PickerHandlers } from "./pick.ts";

test("wrapPickerDown runs vanilla pressed with a faked click", () => {
  const calls: string[] = [];
  const state = { session: { input: { mouse: { clicked: false } } } };
  const handlers: PickerHandlers = {
    down: () => {
      calls.push("vanilla-down");
    },
    pressed: (passed?: unknown) => {
      calls.push("vanilla-pressed");
      assert.equal(passed, state);
      assert.equal(state.session.input.mouse.clicked, true);
    },
  };
  const keyBindings = { Picker: { handlers } };
  assert.equal(wrapPickerDown(keyBindings, { useInstantPick: () => true }), true);
  keyBindings.Picker.handlers.down?.(state);
  assert.deepEqual(calls, ["vanilla-pressed"]);
  assert.equal(state.session.input.mouse.clicked, false);
});

test("wrapPickerDown keeps vanilla down when instant pick is off", () => {
  const calls: string[] = [];
  const keyBindings = {
    Picker: {
      handlers: {
        down: () => {
          calls.push("vanilla-down");
        },
        pressed: () => {
          calls.push("vanilla-pressed");
        },
      },
    },
  };
  wrapPickerDown(keyBindings, { useInstantPick: () => false });
  keyBindings.Picker.handlers.down();
  assert.deepEqual(calls, ["vanilla-down"]);
});

test("wrapPickerDown returns false when Picker pressed is missing", () => {
  assert.equal(
    wrapPickerDown({ Picker: { handlers: { down: () => {} } } }, { useInstantPick: () => true }),
    false,
  );
});

test("pickerDefaultKeys uses vanilla Picker keys when present", () => {
  const api = {
    input: {
      getBoundKeys: (id: string) => {
        assert.equal(id, "Picker");
        return ["KeyG"];
      },
    },
  } as unknown as PickBindingApi;
  assert.deepEqual(pickerDefaultKeys(api), ["KeyG"]);
});

test("pickerDefaultKeys falls back to MouseMiddle", () => {
  const api = {
    input: {
      getBoundKeys: () => {
        throw new Error("missing");
      },
    },
  } as unknown as PickBindingApi;
  assert.deepEqual(pickerDefaultKeys(api), ["MouseMiddle"]);
});
