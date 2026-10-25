import {
  Banknote,
  Binary,
  CaseSensitive,
  Coins,
  Fingerprint,
  Hash,
  Palette,
  Pilcrow,
  Pipette,
  Ruler,
  TextAlignStart,
  Timer,
} from 'lucide-svelte';
import { type MessageKey, t } from './i18n.svelte';
import type { IconComponent } from './types';

export interface Tool {
  id: string;
  icon: IconComponent;
  /** Icon used by the Glass design. */
  glassIcon: IconComponent;
}

export const TOOLS: Tool[] = [
  {
    id: 'currency',
    icon: Banknote,
    glassIcon: Coins,
  },
  {
    id: 'color',
    icon: Palette,
    glassIcon: Pipette,
  },
  {
    id: 'converter',
    icon: Ruler,
    glassIcon: Ruler,
  },
  {
    id: 'guid',
    icon: Fingerprint,
    glassIcon: Hash,
  },
  {
    id: 'timer',
    icon: Timer,
    glassIcon: Timer,
  },
  {
    id: 'counter',
    icon: Pilcrow,
    glassIcon: TextAlignStart,
  },
  {
    id: 'case',
    icon: CaseSensitive,
    glassIcon: CaseSensitive,
  },
  {
    id: 'base64',
    icon: Binary,
    glassIcon: Binary,
  },
];

export const toolName = (id: string) => t(`tool.${id}.name` as MessageKey);
export const toolDesc = (id: string) => t(`tool.${id}.desc` as MessageKey);
