<script lang="ts">
  import { SearchX } from 'lucide-svelte';
  import { TOOLS } from '../tools';

  let { query, onOpen }: { query: string; onOpen: (id: string) => void } = $props();

  const q = $derived(query.trim().toLowerCase());
  const filtered = $derived(
    q ? TOOLS.filter((t) => `${t.name} ${t.desc}`.toLowerCase().includes(q)) : TOOLS,
  );
</script>

<div class="content-inner">
  <div class="page-head home-head fade-up">
    <h1 class="page-title">Simple tools, <b>done well.</b></h1>
  </div>

  {#if q}
    <div class="section-label">Results for “{query}”</div>
  {/if}

  {#if filtered.length === 0}
    <div class="home-empty">
      <SearchX size={20} />
      <span>Nothing matches “{query}”. Try another word.</span>
    </div>
  {:else}
    <div class="tool-list stagger">
      {#each filtered as t (t.id)}
        <button class="tool-row" onclick={() => onOpen(t.id)}>
          <span class="tool-row-name">{t.name}</span>
          <span class="tool-row-desc">{t.desc}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>
