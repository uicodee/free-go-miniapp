import HomeIcon from "@/assets/navbar/marketplace.svg?react";
import HomeActiveIcon from "@/assets/navbar/marketplace-active.svg?react";
import LeaderboardIcon from "@/assets/navbar/cup.svg?react";
import LeaderboardActiveIcon from "@/assets/navbar/cup-active.svg?react";
import ProfileIcon from "@/assets/navbar/profile.svg?react";
import ProfileActiveIcon from "@/assets/navbar/profile-active.svg?react";

export const navigationItems = [
  {
    id: "home",
    title: "Bosh sahifa",
    icon: HomeIcon,
    activeIcon: HomeActiveIcon,
    href: "/",
  },
  {
    id: "leaderboard",
    title: "Reyting",
    icon: LeaderboardIcon,
    activeIcon: LeaderboardActiveIcon,
    href: "/leaderboard",
  },
  {
    id: "profile",
    title: "Profil",
    icon: ProfileIcon,
    activeIcon: ProfileActiveIcon,
    href: "/profile",
  },
];
