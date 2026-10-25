import {
  Banknote,
  Binary,
  CaseSensitive,
  Fingerprint,
  Palette,
  Pilcrow,
  Ruler,
  Timer,
} from 'lucide-svelte';
import { type MessageKey, t } from './i18n.svelte';
import type { IconComponent } from './types';

export interface Tool {
  id: string;
  icon: IconComponent;
}

export const TOOLS: Tool[] = [
  {
    id: 'currency',
    icon: Banknote,
  },
  {
    id: 'color',
    icon: Palette,
  },
  {
    id: 'converter',
    icon: Ruler,
  },
  {
    id: 'guid',
    icon: Fingerprint,
  },
  {
    id: 'timer',
    icon: Timer,
  },
  {
    id: 'counter',
    icon: Pilcrow,
  },
  {
    id: 'case',
    icon: CaseSensitive,
  },
  {
    id: 'base64',
    icon: Binary,
  },
];

export const toolName = (id: string) => t(`tool.${id}.name` as MessageKey);
export const toolDesc = (id: string) => t(`tool.${id}.desc` as MessageKey);
