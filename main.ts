import { isEnabled } from "@modkit/utils";
import { installPickTrigger, type PickBindingApi } from "./pick/binding";

const api = sandkit.api;

installPickTrigger(api as PickBindingApi, {
  useInstantPick: () => isEnabled(api),
});

console.log("loaded");
