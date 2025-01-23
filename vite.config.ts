/// <reference types="vite" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import type { UserConfig } from 'vite'

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
} as UserConfig) 