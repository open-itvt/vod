import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api/v1/proxy': {
        target: 'https://api.lbry.tv',
        changeOrigin: true,
      },
    },
  },
})
