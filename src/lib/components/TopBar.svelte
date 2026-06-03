<script lang="ts">
  import type { Snippet } from 'svelte';
  import logo from '../../assets/images/QuietKit-Mono-Tight-transparent.svg';

  let {
    query,
    onQuery,
    left,
    onHome,
  }: {
    query: string;
    onQuery: (q: string) => void;
    left?: Snippet;
    onHome?: () => void;
  } = $props();
</script>

<header class="topbar">
  <div class="topbar-side">
    <button class="brand" onclick={() => onHome?.()} aria-label="Quietkit — home">
      <img class="brand-logo" src={logo} alt="Quietkit" />
    </button>
  </div>
  <div class="search">
    <input
      value={query}
      oninput={(e) => onQuery(e.currentTarget.value)}
      placeholder="Search tools…"
    />
  </div>
  <div class="topbar-side topbar-side-end">
    {@render left?.()}
  </div>
</header>
