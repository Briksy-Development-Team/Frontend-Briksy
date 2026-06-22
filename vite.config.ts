import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    chunkSizeWarningLimit: 800,
    // ... your manualChunks config from earlier ...
  },
  // Add this block to speed up localhost significantly
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "apexcharts",
      "react-apexcharts",
      "bootstrap",
    ],
  },
});
