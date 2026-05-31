import { Check } from 'lucide-svelte';
import { writable } from 'svelte/store';
import type { IconComponent } from './types';

export interface ToastItem {
  id: number;
  msg: string;
  icon: IconComponent;
}

export const toasts = writable<ToastItem[]>([]);
let nextId = 0;

/** Show a transient toast. Auto-dismisses after ~2.2s. */
export function toast(msg: string, icon: IconComponent = Check): void {
  const id = nextId++;
  toasts.update((items) => [...items, { id, msg, icon }]);
  setTimeout(() => {
    toasts.update((items) => items.filter((t) => t.id !== id));
  }, 2200);
}

/** Copy text to the clipboard and confirm with a toast. */
export function copy(text: string): void {
  navigator.clipboard?.writeText(text);
  toast('Copied to clipboard');
}
