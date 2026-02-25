import "@telegram-apps/telegram-ui/dist/styles.css";

import ReactDOM from "react-dom/client";
import { retrieveLaunchParams } from "@tma.js/sdk-react";

import { init } from "@/init";

import "./index.css";

import "@/mockEnv";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { App } from "./app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root")!);

try {
  const launchParams = retrieveLaunchParams();
  const { tgWebAppPlatform: platform } = launchParams;
  const debug =
    (launchParams.tgWebAppStartParam || "").includes("debug") ||
    import.meta.env.DEV;

  await init({
    debug,
    eruda: debug && ["ios", "android"].includes(platform),
  }).then(() => {
    root.render(
      <QueryClientProvider client={queryClient}>
        <AppRoot platform="ios" appearance="dark">
          <App />
        </AppRoot>
      </QueryClientProvider>
    );
  });
} catch (e) {
  root.render(<h2>EnvUnsupported</h2>);
}
