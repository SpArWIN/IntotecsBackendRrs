import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigpath from "vite-tsconfig-paths";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigpath()],
  server: {
    proxy: {
      "/api": {
        target: "http://backend:80",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
