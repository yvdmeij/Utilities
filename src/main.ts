// Injects the active design's stylesheet before the app mounts.
import './lib/design.svelte';
import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, {
  // biome-ignore lint/style/noNonNullAssertion: #app is guaranteed in index.html
  target: document.getElementById('app')!,
});

export default app;
