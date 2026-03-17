import { RouterProvider } from "react-router-dom";
import { router } from "@/shared/router";
import {
  closingBehavior,
  miniApp,
  retrieveLaunchParams,
  swipeBehavior,
  viewport,
} from "@tma.js/sdk-react";
import { useEffect } from "react";
import { ChannelsGate } from "@/widgets/channels-gate";

export const App = () => {
  const lp = retrieveLaunchParams();

  useEffect(() => {
    miniApp.setHeaderColor("#000000");
    miniApp.setBottomBarColor("#000000");

    swipeBehavior.mount();
    swipeBehavior.disableVertical();

    viewport?.expand();
    if (
      viewport.requestFullscreen.isAvailable() &&
      viewport.requestFullscreen.isSupported() &&
      ["android", "android_x", "ios"].includes(lp.tgWebAppPlatform)
    ) {
      viewport.requestFullscreen();
    }

    closingBehavior.mount();
    closingBehavior.enableConfirmation();
  }, []);

  return (
    <ChannelsGate>
      <RouterProvider router={router} />
    </ChannelsGate>
  );
};
