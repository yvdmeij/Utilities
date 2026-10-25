<script lang="ts">
  import { SearchX } from 'lucide-svelte';
  import { design } from '../design.svelte';
  import { t } from '../i18n.svelte';
  import { TOOLS, toolDesc, toolName } from '../tools';

  let { query, onOpen }: { query: string; onOpen: (id: string) => void } = $props();

  const q = $derived(query.trim().toLowerCase());
  const filtered = $derived(
    q ? TOOLS.filter((tool) =>
          `${toolName(tool.id)} ${toolDesc(tool.id)}`.toLowerCase().includes(q),
        ) : TOOLS,
  );
</script>

{#if design.current === 'glass'}
  <div class="qk-home">
    <div class="qk-home-head">
      <h1 class="qk-title">{t('home.title')}<span class="qk-title-b">{t('home.titleBold')}</span></h1>
    </div>
    {#if q}
      <div class="qk-label qk-results">{t('home.results', { query })}</div>
    {/if}
    {#if filtered.length === 0}
      <div class="qk-empty">{t('home.empty', { query })}</div>
    {:else}
      <div class="qk-tile-grid">
        {#each filtered as tool, i (tool.id)}
          {@const Icon = tool.glassIcon}
          <button class="qk-tile" style:animation-delay="{i * 40}ms" onclick={() => onOpen(tool.id)}>
            <span class="qk-ico"><Icon size={21} strokeWidth={1.75} /></span>
            <span class="qk-tile-name">{toolName(tool.id)}</span>
            <span class="qk-tile-desc">{toolDesc(tool.id)}</span>
          </button>
        {/each}
      </div>
    {/if}
  </div>
{:else}

  <div class="content-inner">
    <div class="page-head home-head fade-up">
      <h1 class="page-title">{t('home.title')}<b>{t('home.titleBold')}</b></h1>
    </div>

    {#if q}
      <div class="section-label">{t('home.results', { query })}</div>
    {/if}

    {#if filtered.length === 0}
      <div class="home-empty">
        <SearchX size={20} />
        <span>{t('home.empty', { query })}</span>
      </div>
    {:else}
      <div class="tool-list stagger">
        {#each filtered as tool (tool.id)}
          <button class="tool-row" onclick={() => onOpen(tool.id)}>
            <span class="tool-row-name">{toolName(tool.id)}</span>
            <span class="tool-row-desc">{toolDesc(tool.id)}</span>
          </button>
        {/each}
      </div>
    {/if}
  </div>
{/if}
