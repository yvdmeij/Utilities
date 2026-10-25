<script lang="ts">
  import { ChevronLeft } from 'lucide-svelte';
  import type { Snippet } from 'svelte';
  import { t } from '../../i18n.svelte';

  let {
    onBack,
    eyebrow,
    title,
    children,
  }: { onBack: () => void; eyebrow: string; title: string; children: Snippet } = $props();
</script>

<div class="qk-col">
  <button class="qk-back" onclick={onBack}>
    <ChevronLeft size={16} strokeWidth={1.75} />{t('menu.allTools')}
  </button>
  <div class="qk-tool-head">
    <div class="qk-eyebrow">{eyebrow}</div>
    <h1 class="qk-h1">{title}</h1>
  </div>
  <div class="qk-stack">
    {@render children()}
  </div>
</div>
