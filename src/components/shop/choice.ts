"use client";

import { useSyncExternalStore } from "react";
import type { Choice } from "@/lib/options";

// The buyer's size/color pick, shared by every picker and PayPal button on a shop page (the hero,
// the bottom buy box and the sticky bar all show one), so picking once counts everywhere.

const picks = new Map<string, Choice>();
const listeners = new Set<() => void>();
const EMPTY: Choice = {};

export const getChoice = (slug: string) => picks.get(slug) ?? EMPTY;

export function setChoice(slug: string, name: string, value: string) {
  picks.set(slug, { ...getChoice(slug), [name]: value });
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useChoice = (slug: string) =>
  useSyncExternalStore(subscribe, () => getChoice(slug), () => EMPTY);
