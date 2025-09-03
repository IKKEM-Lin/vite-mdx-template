import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // 或 vue()，按你的项目替换
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    target: 'es2018',
    cssCodeSplit: false,
    assetsInlineLimit: Infinity, // 内联所有静态资源为 data:URI
    sourcemap: false,
    rollupOptions: {
      output: { manualChunks: undefined }, // 禁用代码分块
    },
  },
});
