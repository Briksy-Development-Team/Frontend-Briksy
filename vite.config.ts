import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",

  css: {
    preprocessorOptions: {
      scss: {
        // api: "modern-compiler",
        silenceDeprecations: [
          "import",
          "global-builtin",
          "if-function",
          "color-functions",
        ],
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "vendor";
            }
            if (
              id.includes("@reduxjs") ||
              id.includes("react-redux") ||
              id.includes("react-query")
            ) {
              return "store";
            }
            if (id.includes("apexcharts") || id.includes("react-apexcharts")) {
              return "charts";
            }
            if (
              id.includes("react-table") ||
              id.includes("xlsx") ||
              id.includes("file-saver")
            ) {
              return "datatable";
            }
            if (
              id.includes("bootstrap") ||
              id.includes("formik") ||
              id.includes("yup") ||
              id.includes("react-select")
            ) {
              return "ui";
            }
          }
        },
      },
    },
  },
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
