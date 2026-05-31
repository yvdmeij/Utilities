<script lang="ts">
  import { Search } from 'lucide-svelte';
  import type { Snippet } from 'svelte';

  let {
    query,
    onQuery,
    left,
  }: {
    query: string;
    onQuery: (q: string) => void;
    left?: Snippet;
  } = $props();
</script>

<header class="topbar">
  {@render left?.()}
  <div class="search">
    <Search size={16} />
    <input
      value={query}
      oninput={(e) => onQuery(e.currentTarget.value)}
      placeholder="Search tools…"
    />
  </div>
  <div class="topbar-spacer"></div>
</header>
