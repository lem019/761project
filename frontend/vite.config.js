import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        // Global variables/mixins (optional configuration)
        additionalData: `@import "@/assets/variables.less";`,
        javascriptEnabled: true // Support JavaScript expressions in Less
      }
    }
  },
  resolve: {
    // https://cn.vitejs.dev/config/#resolve-alias
    alias: {
      // config path
      "~": path.resolve(__dirname, "./"),
      // config another name
      "@": path.resolve(__dirname, "./src")
    },
    // https://cn.vitejs.dev/config/#resolve-extensions
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"]
  },
  assetsInclude: ["**/*.svg", "**/*.eot", "**/*.woff", "**/*.woff2", "**/*.ttf"],
  server: {
    port: 90,
    host: true,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000", //http://192.168.1.111:7878？
        changeOrigin: true
      }
    }
  },
  build: {
    target: "esnext"
  }
});
