import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import { resolve } from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],

  base: './',
  // esbuild: false,

  // build: {
  //   rollupOptions: {
  //     input: {
  //       main: resolve(__dirname, 'index.html'),
  //       nested: resolve(__dirname, 'nested/index.html')
  //     }
  //   },
  // },


  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts'],
    alias: {
      '@': resolve(__dirname, "./src")
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
