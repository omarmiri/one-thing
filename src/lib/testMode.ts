"use client";

import { useSyncExternalStore } from "react";

// Test mode: a per-browser switch (footer of the home page, gallery and shops, or ?test=1 / ?test=0
// on any link) that shows the Test Panel and records the page's API calls for its API log. It's on
// by default, with the panel closed, so judges find the panel without looking for the switch.

const KEY = "onething-test-mode";
const CHANGED = "onething-test-mode";
/** Asks the Test Panel to open, e.g. right after test mode is switched on. */
export const OPEN_PANEL = "onething-test-panel:open";

const read = () => {
  try {
    return localStorage.getItem(KEY) !== "0";
  } catch {
    return true;
  }
};

const subscribe = (cb: () => void) => {
  window.addEventListener(CHANGED, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGED, cb);
    window.removeEventListener("storage", cb);
  };
};

export const isTestMode = read;

export function setTestMode(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {}
  window.dispatchEvent(new Event(CHANGED));
  if (on) window.dispatchEvent(new Event(OPEN_PANEL));
}

export const useTestMode = () => useSyncExternalStore(subscribe, read, () => false);
