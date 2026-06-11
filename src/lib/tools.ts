import {
  Binary,
  CaseSensitive,
  Fingerprint,
  Palette,
  Pilcrow,
  Ruler,
  Timer,
} from 'lucide-svelte';
import type { IconComponent } from './types';

export interface Tool {
  id: string;
  name: string;
  icon: IconComponent;
  desc: string;
  badge?: string;
}

export const TOOLS: Tool[] = [
  {
    id: 'converter',
    name: 'Unit converter',
    icon: Ruler,
    desc: 'Length · Weight · Volume',
  },
  {
    id: 'timer',
    name: 'Timer',
    icon: Timer,
    desc: 'Focus · Countdown',
  },
  {
    id: 'color',
    name: 'Color picker',
    icon: Palette,
    desc: 'HEX · RGB · HSL',
  },
  {
    id: 'counter',
    name: 'Word counter',
    icon: Pilcrow,
    desc: 'Words · Characters',
  },
  {
    id: 'case',
    name: 'Case converter',
    icon: CaseSensitive,
    desc: 'Upper · Lower · Title',
  },
  {
    id: 'base64',
    name: 'Base64',
    icon: Binary,
    desc: 'Encode · Decode',
  },
  {
    id: 'guid',
    name: 'GUID generator',
    icon: Fingerprint,
    desc: 'UUID v4',
    badge: 'New',
  },
];
