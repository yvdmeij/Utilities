<script lang="ts">
  import { Moon, Search, Sun, X } from 'lucide-svelte';
  import type { Snippet } from 'svelte';

  let {
    query,
    onQuery,
    left,
    onHome,
    dark = false,
    onToggleDark,
  }: {
    query: string;
    onQuery: (q: string) => void;
    left?: Snippet;
    onHome?: () => void;
    dark?: boolean;
    onToggleDark?: () => void;
  } = $props();

  let searchOpen = $state(false);
  let searchEl: HTMLInputElement | undefined;

  function closeSearch() {
    searchOpen = false;
  }

  $effect(() => {
    if (searchOpen) searchEl?.focus();
  });
</script>

<header class="topbar">
  <div class="topbar-side">
    <button class="brand" onclick={() => onHome?.()} aria-label="Quietkit — home">
      <svg
        class="brand-logo"
        xmlns="http://www.w3.org/2000/svg"
        width="1872"
        height="528"
        viewBox="-129 -348 1872 528"
        aria-hidden="true"
      >
        <path
          class="logo-quiet"
          d="M161.70 54L123.60 54L90.90 0L96.60 2.70Q95.40 2.70 93.75 2.85Q92.10 3 90 3L90 3Q69.30 3 53.85-5.10Q38.40-13.20 29.85-27.90Q21.30-42.60 21.30-62.10L21.30-62.10L21.30-156.90Q21.30-176.70 29.85-191.25Q38.40-205.80 53.85-213.90Q69.30-222 90-222L90-222Q111-222 126.30-213.90Q141.60-205.80 150.15-191.25Q158.70-176.70 158.70-156.90L158.70-156.90L158.70-62.10Q158.70-42.30 150.15-27.45Q141.60-12.60 126-4.80L126-4.80L161.70 54ZM90-27.90L90-27.90Q106.20-27.90 114.90-37.05Q123.60-46.20 123.60-62.10L123.60-62.10L123.60-156.90Q123.60-173.10 114.60-182.25Q105.60-191.40 90-191.40L90-191.40Q74.40-191.40 65.40-182.25Q56.40-173.10 56.40-156.90L56.40-156.90L56.40-62.10Q56.40-46.20 65.25-37.05Q74.10-27.90 90-27.90Z M294 3L294 3Q262.20 3 244.65-14.40Q227.10-31.80 227.10-61.80L227.10-61.80L227.10-219L261.90-219L261.90-62.10Q261.90-45.90 270-36.75Q278.10-27.60 294-27.60L294-27.60Q309.60-27.60 317.85-36.75Q326.10-45.90 326.10-62.10L326.10-62.10L326.10-219L360.90-219L360.90-61.80Q360.90-31.80 343.50-14.40Q326.10 3 294 3Z M559.80 0L436.20 0L436.20-30.90L480.30-30.90L480.30-188.10L436.20-188.10L436.20-219L559.80-219L559.80-188.10L515.70-188.10L515.70-30.90L559.80-30.90L559.80 0Z M769.20 0L639.30 0L639.30-219L769.20-219L769.20-188.40L673.80-188.40L673.80-128.70L758.70-128.70L758.70-98.10L673.80-98.10L673.80-30.60L769.20-30.60L769.20 0Z M923.40 0L888.60 0L888.60-186.90L830.40-186.90L830.40-219.30L981.60-219.30L981.60-186.90L923.40-186.90L923.40 0Z"
        />
        <path
          class="logo-kit"
          d="M1079.10 0L1044 0L1044-219L1079.10-219L1079.10-129L1106.40-129L1149.60-219L1187.40-219L1137.30-114L1190.10 0L1150.80 0L1106.10-97.50L1079.10-97.50L1079.10 0Z M1375.80 0L1252.20 0L1252.20-30.90L1296.30-30.90L1296.30-188.10L1252.20-188.10L1252.20-219L1375.80-219L1375.80-188.10L1331.70-188.10L1331.70-30.90L1375.80-30.90L1375.80 0Z M1535.40 0L1500.60 0L1500.60-186.90L1442.40-186.90L1442.40-219.30L1593.60-219.30L1593.60-186.90L1535.40-186.90L1535.40 0Z"
        />
      </svg>
    </button>
  </div>
  <div class="search {searchOpen ? 'search-open' : ''}">
    <input
      bind:this={searchEl}
      value={query}
      oninput={(e) => onQuery(e.currentTarget.value)}
      onblur={closeSearch}
      onkeydown={(e) => e.key === 'Escape' && closeSearch()}
      placeholder="Search tools…"
    />
  </div>
  <div class="topbar-side topbar-side-end">
    <button
      class="search-toggle"
      onmousedown={(e) => e.preventDefault()}
      onclick={() => (searchOpen = !searchOpen)}
      aria-label={searchOpen ? 'Close search' : 'Search tools'}
    >
      {#if searchOpen}
        <X size={17} strokeWidth={1.75} />
      {:else}
        <Search size={17} strokeWidth={1.75} />
      {/if}
    </button>
    <button
      class="theme-toggle"
      onclick={() => onToggleDark?.()}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {#if dark}
        <Sun size={17} strokeWidth={1.75} />
      {:else}
        <Moon size={17} strokeWidth={1.75} />
      {/if}
    </button>
    {@render left?.()}
  </div>
</header>
