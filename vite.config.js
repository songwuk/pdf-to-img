
import { defineConfig } from 'vite'
// import topLevelAwait from "vite-plugin-top-level-await";
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
  },
  plugins: [
    // topLevelAwait({
    //   // The export name of top-level await promise for each chunk module
    //   promiseExportName: "__tla",
    //   // The function to generate import names of top-level await promise in each chunk module
    //   promiseImportName: i => `__tla_${i}`
    // })
  ]
})
