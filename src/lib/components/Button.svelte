<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { IconComponent } from '../types';

  let {
    variant = 'secondary',
    icon: Icon,
    children,
    onclick,
    disabled = false,
    title,
  }: {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    icon?: IconComponent;
    children?: Snippet;
    onclick?: () => void;
    disabled?: boolean;
    title?: string;
  } = $props();
</script>

<button class="btn btn-{variant}" {onclick} {disabled} {title}>
  {#if Icon}<Icon size={16} />{/if}
  {@render children?.()}
</button>
