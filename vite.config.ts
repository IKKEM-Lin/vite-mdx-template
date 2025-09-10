import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // 或 vue()，按你的项目替换
import { viteSingleFile } from "vite-plugin-singlefile";
import { Plugin as importToCDN } from "vite-plugin-cdn-import";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    importToCDN({
      prodUrl: "https://cdn.staticfile.net/{name}/{version}/{path}",
      modules: [
        {
          name: "react",
          var: "React",
          path: "umd/react.production.min.js",
          prodUrl:
            "https://cdn.staticfile.net/react/18.3.1/umd/react.production.min.js",
        },
        {
          name: "react-dom",
          var: "ReactDOM",
          path: "umd/react-dom.production.min.js",
          prodUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js",
        },
        {
          name: "vega",
          var: "vega",
          path: "vega",
          prodUrl:
            "https://cdn.jsdelivr.net/npm/vega@6.1.2",
        },
        {
          name: "vega-lite",
          var: "vegaLite",
          path: "vega-lite",
          prodUrl:
            "https://cdn.jsdelivr.net/npm/vega-lite@6.2.0",
        },
        {
          name: "vega-embed",
          var: "vegaEmbed",
          path: "vega-embed",
          prodUrl:
            "https://cdn.jsdelivr.net/npm/vega-embed@7.0.2",
        },
      ],
    }),
    viteSingleFile(),
    visualizer({
      emitFile: true,
      filename: "report.html",
      title: "cc-home-app bundle report",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    target: "es2018",
    cssCodeSplit: false,
    assetsInlineLimit: Infinity, // 内联所有静态资源为 data:URI
    sourcemap: false,
    rollupOptions: {
      output: { manualChunks: undefined }, // 禁用代码分块
      external: ["react", "react-dom"],
    },
  },
});
