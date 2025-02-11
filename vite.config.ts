import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/auth": {
        target: "https://front-mission.bigs.or.kr",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth/, "/auth"),
      },
    "/api": {
      target: "https://front-mission.bigs.or.kr",
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  },
},
  plugins: [react()],
});
