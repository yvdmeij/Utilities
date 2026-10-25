<script lang="ts">
  import { ChevronDown } from 'lucide-svelte';
  import type { Snippet } from 'svelte';

  let {
    value = $bindable(),
    children,
    label,
  }: { value: string; children: Snippet; label?: string } = $props();
</script>

<div class="qk-select">
  <select bind:value aria-label={label}>
    {@render children()}
  </select>
  <ChevronDown size={14} strokeWidth={1.75} />
</div>
