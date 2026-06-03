<script lang="ts">
  import {
    ChevronRight,
    CircleHelp,
    Dot,
    LayoutGrid,
    Plus,
    Settings,
    Shapes,
    ShieldCheck,
  } from 'lucide-svelte';
  import { toast } from '../toast';
  import { TOOLS } from '../tools';

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
  let expanded = $state(true);
  const cats = ['Length', 'Weight', 'Volume', 'Data'];

  function go(id: string, extra?: { cat?: string }) {
    onNavigate(id, extra);
    open = false;
  }

  function showSettings() {
    toast('Everything runs locally', ShieldCheck);
    open = false;
  }
</script>

<div class="menu">
  <button
    class="menu-trigger {open ? 'open' : ''}"
    onclick={() => (open = !open)}
    aria-label="Menu"
  >
    <span class="plus"><Plus size={28} strokeWidth={1.5} /></span>
  </button>

  {#if open}
    <button class="menu-scrim" aria-label="Close menu" onclick={() => (open = false)}></button>

    {#if active === 'home'}
      <div class="menu-pill">
        <button class="pill-item" onclick={showSettings}>
          <span class="pill-label">Settings</span>
          <span class="pill-ico"><Settings size={18} /></span>
        </button>
        <button class="pill-item" onclick={() => (open = false)}>
          <span class="pill-label">About</span>
          <span class="pill-ico"><CircleHelp size={18} /></span>
        </button>
      </div>
    {:else}
      <div class="menu-pop">
        <div class="menu-head">
          <div class="brand-mark"><Shapes size={15} /></div>
          <div>
            <div class="mh-title">Quietkit</div>
            <div class="mh-sub">Everyday utilities</div>
          </div>
        </div>

        <button class="nav-item {active === 'home' ? 'active' : ''}" onclick={() => go('home')}>
          <LayoutGrid size={18} /><span class="ni-label">All tools</span>
        </button>

        <div class="menu-sec">
          <span class="ms-label">Tools</span>
          <span class="ms-label ms-count">{TOOLS.length}</span>
        </div>

        <div class="nav">
          {#each TOOLS as t (t.id)}
            {@const Icon = t.icon}
            {#if t.id === 'converter'}
              <button
                class="nav-item {active === 'converter' ? 'active' : ''} {expanded ? 'expanded' : ''}"
                onclick={() => go('converter')}
              >
                <Icon size={18} /><span class="ni-label">{t.name}</span>
                <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
                <span
                  class="nav-toggle"
                  role="button"
                  tabindex="-1"
                  aria-label="Toggle categories"
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
                      <Dot size={14} />{c}
                    </button>
                  {/each}
                </div>
              {/if}
            {:else}
              <button class="nav-item {active === t.id ? 'active' : ''}" onclick={() => go(t.id)}>
                <Icon size={18} /><span class="ni-label">{t.name}</span>
                {#if t.badge}<span class="nav-badge">{t.badge}</span>{/if}
              </button>
            {/if}
          {/each}
        </div>

        <div class="menu-foot">
          <button class="nav-item" onclick={showSettings}>
            <Settings size={18} /><span class="ni-label">Settings</span>
          </button>
          <button class="nav-item" onclick={() => (open = false)}>
            <CircleHelp size={18} /><span class="ni-label">About</span>
          </button>
        </div>
      </div>
    {/if}
  {/if}
</div>
