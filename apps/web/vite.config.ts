import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'
import path from 'node:path'

export default defineConfig({
  plugins: [
    tanstackStart(),
    netlify(),
    solid({ ssr: true }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 4173,
  },
})