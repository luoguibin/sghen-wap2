import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  base: './',

  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts'],
    alias: {
      '@': path.resolve(__dirname, "./src")
    }
  },

  server: {
    port: 3000,
    open: false,
    proxy: {
      '/sapi/': {
        target: 'https://www.sghen.cn',
        ws: false,
        secure: true,
        changeOrigin: true
      },
      '/napi/': {
        target: 'https://www.sghen.cn',
        ws: false,
        secure: true,
        changeOrigin: true
      }
    }
  }
})
