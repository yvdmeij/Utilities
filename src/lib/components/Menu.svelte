<script lang="ts">
  import { ChevronRight, Dot, LayoutGrid, Plus } from 'lucide-svelte';
  import { DESIGNS, design, setDesign } from '../design.svelte';
  import { type MessageKey, t } from '../i18n.svelte';
  import { TOOLS, toolName } from '../tools';
  import Seg from './glass/Seg.svelte';
  import Segmented from './Segmented.svelte';

  let {
    active,
    convCat,
    onNavigate,
    dark,
    onSetDark,
  }: {
    active: string;
    convCat: string;
    onNavigate: (id: string, extra?: { cat?: string }) => void;
    dark: boolean;
    onSetDark: (dark: boolean) => void;
  } = $props();

  const themeOptions = $derived([
    { value: 'light', label: t('theme.light') },
    { value: 'dark', label: t('theme.dark') },
  ]);
  const designOptions = $derived(
    DESIGNS.map((d) => ({ value: d, label: t(`design.${d}` as MessageKey) }))
  );
  const setTheme = (v: string) => onSetDark(v === 'dark');

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

{#if design.current === 'glass'}
  <div class="qk-pop-anchor">
    <button
      class="qk-ibtn qk-plus {open ? 'open' : ''}"
      onclick={() => (open = !open)}
      aria-label={open ? t('menu.close') : t('menu.menu')}
      aria-expanded={open}
    >
      <Plus size={20} strokeWidth={1.75} />
    </button>
    {#if open}
      <button class="qk-scrim" aria-label={t('menu.close')} onclick={() => (open = false)}></button>
      <div class="qk-menu">
        <div class="qk-label qk-menu-label">{t('menu.tools')}</div>
        <button class="qk-nav-item {active === 'home' ? 'on' : ''}" onclick={() => go('home')}>
          <LayoutGrid size={17} strokeWidth={1.75} />{t('menu.allTools')}
        </button>
        {#each TOOLS as tool (tool.id)}
          {@const Icon = tool.glassIcon}
          <button class="qk-nav-item {active === tool.id ? 'on' : ''}" onclick={() => go(tool.id)}>
            <Icon size={17} strokeWidth={1.75} />{toolName(tool.id)}
          </button>
        {/each}
        <div class="qk-menu-foot">
          <span class="qk-label">{t('settings.appearance')}</span>
          <Seg options={themeOptions} value={dark ? 'dark' : 'light'} onChange={setTheme} />
        </div>
        <div class="qk-menu-foot">
          <span class="qk-label">{t('settings.design')}</span>
          <Seg options={designOptions} value={design.current} onChange={setDesign} />
        </div>
      </div>
    {/if}
  </div>
{:else}
  <div class="menu">
    <button
      class="menu-trigger {open ? 'open' : ''}"
      onclick={() => (open = !open)}
      aria-label={t('menu.menu')}
    >
      <span class="plus"><Plus size={28} strokeWidth={1.5} /></span>
    </button>

    {#if open}
      <button class="menu-scrim" aria-label={t('menu.close')} onclick={() => (open = false)}
      ></button>

      <div class="menu-pop">
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
                class="nav-item {active === 'converter' ? 'active' : ''} {expanded
                  ? 'expanded'
                  : ''}"
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
              </button>
            {/if}
          {/each}
        </div>

        <div class="menu-sec">
          <span class="ms-label">{t('settings.appearance')}</span>
        </div>
        <div class="menu-appearance">
          <Segmented options={themeOptions} value={dark ? 'dark' : 'light'} onChange={setTheme} />
          <Segmented options={designOptions} value={design.current} onChange={setDesign} />
        </div>
      </div>
    {/if}
  </div>
{/if}
