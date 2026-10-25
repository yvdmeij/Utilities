<script lang="ts">
  import { ChevronRight, Dot, LayoutGrid, Plus, Shapes } from 'lucide-svelte';
  import { type MessageKey, t } from '../i18n.svelte';
  import { TOOLS, toolName } from '../tools';

  let {
    active,
    convCat,
    onNavigate,
  }: {
    active: string;
    convCat: string;
    onNavigate: (id: string, extra?: { cat?: string }) => void;
  } = $props();

  let open = $state(false);
  let expanded = $state(false);

  $effect(() => {
    if (!open) expanded = false;
  });
  const cats = ['Length', 'Weight', 'Volume', 'Data'];

  function go(id: string, extra?: { cat?: string }) {
    onNavigate(id, extra);
    open = false;
  }
</script>

<div class="menu">
  <button
    class="menu-trigger {open ? 'open' : ''}"
    onclick={() => (open = !open)}
    aria-label={t('menu.menu')}
  >
    <span class="plus"><Plus size={28} strokeWidth={1.5} /></span>
  </button>

  {#if open}
    <button class="menu-scrim" aria-label={t('menu.close')} onclick={() => (open = false)}></button>

    <div class="menu-pop">
      <div class="menu-head">
        <div class="brand-mark"><Shapes size={15} /></div>
        <div>
          <div class="mh-title">Quietkit</div>
          <div class="mh-sub">{t('app.tagline')}</div>
        </div>
      </div>

      <button class="nav-item" onclick={() => go('home')}>
        <LayoutGrid size={18} /><span class="ni-label">{t('menu.allTools')}</span>
      </button>

      <div class="menu-sec">
        <span class="ms-label">{t('menu.tools')}</span>
        <span class="ms-label ms-count">{TOOLS.length}</span>
      </div>

      <div class="nav">
        {#each TOOLS as tool (tool.id)}
          {@const Icon = tool.icon}
          {#if tool.id === 'converter'}
            <button
              class="nav-item {active === 'converter' ? 'active' : ''} {expanded ? 'expanded' : ''}"
              onclick={() => go('converter')}
            >
              <Icon size={18} /><span class="ni-label">{toolName(tool.id)}</span>
              <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
              <span
                class="nav-toggle"
                role="button"
                tabindex="-1"
                aria-label={t('menu.toggleCategories')}
                onclick={(e) => {
                  e.stopPropagation();
                  expanded = !expanded;
                }}
              >
                <ChevronRight size={15} />
              </span>
            </button>
            {#if expanded}
              <div class="nav-tree">
                {#each cats as c (c)}
                  <button
                    class="nav-subitem {active === 'converter' && convCat === c ? 'active' : ''}"
                    onclick={() => go('converter', { cat: c })}
                  >
                    <Dot size={14} />{t(`cat.${c}` as MessageKey)}
                  </button>
                {/each}
              </div>
            {/if}
          {:else}
            <button
              class="nav-item {active === tool.id ? 'active' : ''}"
              onclick={() => go(tool.id)}
            >
              <Icon size={18} /><span class="ni-label">{toolName(tool.id)}</span>
              {#if tool.badge}<span class="nav-badge">{t('badge.new')}</span>{/if}
            </button>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</div>
