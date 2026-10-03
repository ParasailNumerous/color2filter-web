// wrapper around wasm-pack generated bindings
// regenerate with `pnpm run build:wasm`

import init, { wasm_color_to_filter } from "../generated/color2filter/color2filter.js";

let ready: Promise<unknown> | null = null;

function initOnce(): Promise<unknown> {
  if (!ready) {
    ready = init();
  }
  return ready;
}

export async function getCssFilter(colorStr: string): Promise<{ filter: string; error?: string }> {
  const input = colorStr.trim();
  if (!input) {
    return { filter: "", error: "Enter a CSS color" };
  }

  try {
    await initOnce();
    return { filter: wasm_color_to_filter(input) };
  } catch (e) {
    return { filter: "", error: e instanceof Error ? e.message : String(e) };
  }
}
