import { Outlet, useLocation } from "react-router-dom";
import { Suspense } from "react";
import { Spinner } from "@telegram-apps/telegram-ui";
import { Navigation } from "@/widgets/navigation";
import { Animated } from "@/widgets/animated";

const PageLoader = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
    }}
  >
    <Spinner size="m" />
  </div>
);

export const PageLayout = ({ navbar = false }: { navbar?: boolean }) => {
  const location = useLocation();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "100%",
      }}
    >
      <div
        style={{
          flexGrow: 1,
          paddingBottom: navbar ? "80px" : "0",
        }}
      >
        <Suspense fallback={<PageLoader />}>
          <Animated key={location.pathname}>
            <Outlet />
          </Animated>
        </Suspense>
      </div>
      {navbar && <Navigation />}
    </div>
  );
};
