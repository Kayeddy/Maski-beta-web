import { TbCardsFilled as cardsIcon } from "react-icons/tb";
import { AiFillMessage as messageIcon } from "react-icons/ai";
import { BsHearts as likeIcon } from "react-icons/bs";
import { GiStarMedal as medalIcon } from "react-icons/gi";
import { FaPeopleRoof as communityIcon } from "react-icons/fa6";
import { CgFeed as socialFeedIcon } from "react-icons/cg";
import { FaPeopleGroup as socialIcon } from "react-icons/fa6";
import { FaUserAstronaut as userIcon } from "react-icons/fa";
import { DashboardIcon as dashboardIcon } from "@radix-ui/react-icons";

export const adopterLeftSidebarItems = [
  {
    name: "Adopt",
    icon: cardsIcon,
    link: "hub/adopter/adopt",
  },
  {
    name: "Messages",
    icon: messageIcon,
    link: "hub/chat",
  },

  {
    name: "Hall of fame",
    icon: medalIcon,
    link: "hub/hall-of-fame",
  },
];

export const explorerLeftSidebarItems = [
  {
    name: "Explore",
    icon: cardsIcon,
    link: "hub/explorer/explore",
  },

  {
    name: "Hall of fame",
    icon: medalIcon,
    link: "/hub/hall-of-fame",
  },
];

export const holderLeftSidebarItems = [
  {
    name: "Dashboard",
    icon: dashboardIcon,
    link: "hub/holder/dashboard",
  },
  {
    name: "Messages",
    icon: messageIcon,
    link: "hub/chat",
  },
  {
    name: "Hall of fame",
    icon: medalIcon,
    link: "hub/hall-of-fame",
  },
];

// {
//   name: "Social",
//   icon: socialIcon,
//   children: [
//     {
//       name: "Comunidad",
//       Icon: communityIcon,
//       link: "/hub/community",
//     },
//     {
//       name: "Feed",
//       Icon: socialFeedIcon,
//       link: "hub/social-feed",
//     },
//   ],
// },

export const mobileNavbarItems = [
  {
    name: "adopt",
    icon: cardsIcon,
    link: "/hub/adopter/adopt",
  },
  {
    name: "Messages",
    icon: messageIcon,
    link: "/hub/chat",
  },

  {
    name: "Hall of fame",
    icon: medalIcon,
    link: "/hub/hall-of-fame",
  },

  {
    name: "Profile",
    icon: userIcon,
    link: "/hub/profile",
  },
];

export const adopterMobileNavigationItems = [
  {
    name: "adopt",
    icon: cardsIcon,
    link: "/hub/adopter/adopt",
  },
  {
    name: "Messages",
    icon: messageIcon,
    link: "/hub/chat",
  },

  {
    name: "Hall of fame",
    icon: medalIcon,
    link: "/hub/hall-of-fame",
  },

  {
    name: "Profile",
    icon: userIcon,
    link: "/hub/profile",
  },
];

export const explorerMobileNavigationItems = [
  {
    name: "explore",
    icon: cardsIcon,
    link: "/hub/explorer/explore",
  },
  {
    name: "Hall of fame",
    icon: medalIcon,
    link: "/hub/hall-of-fame",
  },

  {
    name: "Profile",
    icon: userIcon,
    link: "/hub/profile",
  },
];

export const holderMobileNavigationItems = [
  {
    name: "dashboard",
    icon: dashboardIcon,
    link: "/hub/holder/dashboard",
  },
  {
    name: "Messages",
    icon: messageIcon,
    link: "/hub/chat",
  },

  {
    name: "Hall of fame",
    icon: medalIcon,
    link: "/hub/hall-of-fame",
  },

  {
    name: "Profile",
    icon: userIcon,
    link: "/hub/profile",
  },
];
