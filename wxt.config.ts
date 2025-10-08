import { defineConfig } from 'wxt';
import vue from '@vitejs/plugin-vue';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'RemMe',
    description: 'Remember which email you used on each website',
    version: '1.0.0',
    permissions: ['storage', 'tabs', 'activeTab'],
    host_permissions: ['<all_urls>'],
    action: {
      default_title: 'RemMe - Remember Your Email',
    },
  },
  vite: () => ({
    plugins: [vue()],
  }),
});

