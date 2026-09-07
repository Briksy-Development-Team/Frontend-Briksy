import { createServer, defineConfig, type ViteDevServer } from "vite";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

const adminConfigPath = fileURLToPath(
  new URL("../admin/vite.config.ts", import.meta.url),
);

const adminMiddleware = {
  name: "admin-vite-middleware",
  async configureServer(websiteServer: ViteDevServer) {
    const adminServer = await createServer({
      configFile: adminConfigPath,
      server: {
        middlewareMode: true,
        hmr: { server: websiteServer.httpServer ?? undefined },
      },
      appType: "spa",
    });

    websiteServer.middlewares.use((request, response, next) => {
      if (
        request.url === "/admin" ||
        request.url?.startsWith("/admin/")
      ) {
        adminServer.middlewares.handle(request, response, next);
        return;
      }

      next();
    });
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr(), adminMiddleware],
  envDir: "..",
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
