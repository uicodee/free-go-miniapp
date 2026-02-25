import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import { loadEnv } from "vite";

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, new URL(".", import.meta.url).pathname, "");

  return {
    plugins: [
      react(),
      tsconfigPaths({ projects: ["./tsconfig.app.json"] }),
      tailwindcss(),
      svgr({
        include: "**/*.svg?react",
        svgrOptions: {
          exportType: "default",
          ref: true,
          svgo: false,
          titleProp: true,
        },
      }),
    ],
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    envDir: ".",
    server: { allowedHosts: true, port: 5173 },
  };
};
