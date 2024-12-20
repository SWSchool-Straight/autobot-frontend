import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()], 
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // JSX와 TSX 모두 지원
  },
})
