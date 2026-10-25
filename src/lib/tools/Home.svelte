<script lang="ts">
  import { SearchX } from 'lucide-svelte';
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
