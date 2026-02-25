import { lazy } from "react";
import { PageLayout } from "@/shared/layouts";
import type { RouteObject } from "react-router-dom";

const Home = lazy(() =>
  import("@/pages/home").then((module) => ({
    default: module.Page,
  }))
);

const Leaderboard = lazy(() =>
  import("@/pages/leaderboard").then((module) => ({
    default: module.Page,
  }))
);

const Profile = lazy(() =>
  import("@/pages/profile").then((module) => ({
    default: module.Page,
  }))
);

export const paths: RouteObject[] = [
  {
    path: "/",
    element: <PageLayout navbar />,
    children: [
      { index: true, element: <Home /> },
      { path: "leaderboard", element: <Leaderboard /> },
      { path: "profile", element: <Profile /> },
    ],
  },
];
