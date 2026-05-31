import {
  Binary,
  CaseSensitive,
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
    desc: 'Length, weight, volume & data.',
  },
  {
    id: 'timer',
    name: 'Timer',
    icon: Timer,
    desc: 'Focus sessions & countdowns.',
  },
  {
    id: 'color',
    name: 'Color picker',
    icon: Palette,
    desc: 'Hex, RGB & HSL — copy any.',
  },
  {
    id: 'counter',
    name: 'Word counter',
    icon: Pilcrow,
    desc: 'Words, characters & read time.',
  },
  {
    id: 'case',
    name: 'Case converter',
    icon: CaseSensitive,
    desc: 'Upper, lower, title & sentence.',
  },
  {
    id: 'base64',
    name: 'Base64',
    icon: Binary,
    desc: 'Encode & decode text.',
    badge: 'New',
  },
];
