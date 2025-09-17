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
    host: '0.0.0.0', // 允许外部访问
    open: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5001/demo-project-id/us-central1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api")
      }
    }
  },
  preview: {
    allowedHosts: ['t-3886287752---project-project-team-8-w4cn3q3iaq-as.a.run.app'],
  },
  build: {
    target: "esnext"
  }
});
