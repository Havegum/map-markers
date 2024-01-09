// @ts-expect-error this module has no types
import { libWrapper } from "lib-wrapper/shim/shim.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const log = (...args: any[]) => console.log("[map-markers]", ...args);

log("Hello, world!"); // never displays
Hooks.on("init", () => {
  log("[init]", "Hello, world!");
  log(libWrapper);
});
Hooks.on("ready", () => log("[ready]", "Hello, world!"));
