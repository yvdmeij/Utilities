<script lang="ts">
  import { ArrowRight, SearchX } from 'lucide-svelte';
  import { type Tool, TOOLS } from '../tools';

  let { query, onOpen }: { query: string; onOpen: (id: string) => void } = $props();

  const q = $derived(query.trim().toLowerCase());
  const filtered = $derived(
    q ? TOOLS.filter((t) => `${t.name} ${t.desc}`.toLowerCase().includes(q)) : TOOLS,
  );
  const recent = TOOLS.filter((t) => ['converter', 'timer', 'color'].includes(t.id));
</script>

<div class="content-inner fade-up">
  <div class="page-head">
    <div class="eyebrow">A quieter toolbox</div>
    <h1 class="page-title">Small tools,<br /><b>done well.</b></h1>
    <p class="page-sub">
      A calm collection of everyday utilities. Everything runs in your browser — nothing uploaded,
      nothing stored.
    </p>
  </div>

  {#if !q}
    <div class="section-label">Recently used</div>
    <div class="tool-grid stagger">
      {#each recent as t (t.id)}{@render tile(t)}{/each}
    </div>
  {/if}

  <div class="section-label">{q ? `Results for “${query}”` : 'All tools'}</div>
  {#if filtered.length === 0}
    <div class="panel" style="text-align:center;color:var(--ink-3)">
      <SearchX size={28} />
      <p style="margin-top:10px">Nothing matches that. Try another word.</p>
    </div>
  {:else}
    <div class="tool-grid stagger">
      {#each filtered as t (t.id)}{@render tile(t)}{/each}
    </div>
  {/if}
</div>

{#snippet tile(t: Tool)}
  {@const Icon = t.icon}
  <button class="tool-tile" onclick={() => onOpen(t.id)}>
    <div class="tool-ico"><Icon size={22} /></div>
    <div>
      <h3>{t.name}</h3>
      <p>{t.desc}</p>
    </div>
    <div class="tile-foot"><ArrowRight size={14} /> Open</div>
  </button>
{/snippet}
