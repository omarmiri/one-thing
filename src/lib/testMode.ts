"use client";

import { useSyncExternalStore } from "react";

// Test mode: a per-browser switch (footer of the home page, gallery and shops, or ?test=1 on any
// link) that shows the Test Panel and records the page's API calls for its API log.

const KEY = "onething-test-mode";
const CHANGED = "onething-test-mode";
/** Asks the Test Panel to open, e.g. right after test mode is switched on. */
export const OPEN_PANEL = "onething-test-panel:open";

const read = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
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
    if (on) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(CHANGED));
  if (on) window.dispatchEvent(new Event(OPEN_PANEL));
}

export const useTestMode = () => useSyncExternalStore(subscribe, read, () => false);
