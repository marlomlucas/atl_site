import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  devToolbar: { enabled: false },
  vite: {
    server: {
      proxy: {
        "/weather-api/locationforecast": {
          target: "https://api.met.no",
          changeOrigin: true,
          secure: true,
          rewrite: (path) =>
            path.replace(
              "/weather-api/locationforecast",
              "/weatherapi/locationforecast/2.0/compact",
            ),
          headers: {
            "User-Agent":
              "ATL-Solucoes-em-Tecnologia/0.1 (https://github.com/marlomlucas/atl_site)",
          },
        },
      },
    },
  },
});
