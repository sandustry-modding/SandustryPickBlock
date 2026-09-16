import assert from "node:assert/strict";
import test from "node:test";
import { mouseFromState, runVanillaInstantPick } from "./pick.ts";

function gameState(clicked = false) {
  return {
    session: {
      input: {
        mouse: { clicked },
      },
    },
  };
}

test("mouseFromState reads session.input.mouse", () => {
  const state = gameState(true);
  assert.equal(mouseFromState(state)?.clicked, true);
  assert.equal(mouseFromState(null), null);
  assert.equal(mouseFromState({}), null);
});

test("runVanillaInstantPick fakes a click then runs pressed", () => {
  const state = gameState(false);
  const clicks: boolean[] = [];
  const ok = runVanillaInstantPick(state, (passed) => {
    assert.equal(passed, state);
    clicks.push(state.session.input.mouse.clicked);
  });
  assert.equal(ok, true);
  assert.deepEqual(clicks, [true]);
  assert.equal(state.session.input.mouse.clicked, false);
});

test("runVanillaInstantPick clears clicked after an early pressed return", () => {
  const state = gameState(false);
  runVanillaInstantPick(state, () => {
    return;
  });
  assert.equal(state.session.input.mouse.clicked, false);
});

test("runVanillaInstantPick returns false without pressed or mouse", () => {
  assert.equal(runVanillaInstantPick(gameState(), undefined), false);
  assert.equal(
    runVanillaInstantPick({}, () => {}),
    false,
  );
});
