// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
//   Button,
//   User,
// } from "@nextui-org/react";
// import { motion } from "framer-motion";
// import Link from "next/link";

// import { mobileNavbarItems } from "@/constants/navigation";
// import { useSession } from "@clerk/nextjs";

// import { useLocale } from "next-intl";
// import HubThemeSwitcher from "@/components/other/navigation/HubThemeSwitcher";
// import { usePathname } from "next/navigation";
// import Image from "next/image";
// import { useUserStore } from "@/store/shared/useUser.store";
// import { useUserProfileStore } from "@/store/shared/useUserProfile.store";

// export default function MobileNavbar() {
//   const currentPath = usePathname();

//   const currentLocale = useLocale();

//   const { session } = useSession();

//   // Zustand stores

//   const userData = useUserStore((state) => state.user);

//   const userProfileData = useUserProfileStore((state) => state.profile);

//   const normalizePathname = (path: string, locale: string) => {
//     const regex = new RegExp(`^/${locale}`);
//     return path.replace(regex, "") || "/";
//   };

//   const [activeItem, setActiveItem] = useState(() => {
//     const pathWithoutLocale = normalizePathname(currentPath, currentLocale);
//     return (
//       mobileNavbarItems.find((item) => item.link === pathWithoutLocale) ||
//       mobileNavbarItems[0]
//     );
//   });

//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     const pathWithoutLocale = normalizePathname(currentPath, currentLocale);
//     const newActiveItem =
//       mobileNavbarItems.find((item) => item.link === pathWithoutLocale) ||
//       mobileNavbarItems[0];
//     setActiveItem(newActiveItem);
//   }, [currentPath, currentLocale]);

//   return (
//     <nav>
//       <Popover
//         placement="top"
//         showArrow={true}
//         offset={20}
//         backdrop="blur"
//         isOpen={isOpen}
//         onOpenChange={(open) => setIsOpen(open)}
//       >
//         <PopoverTrigger className="backdrop-blur-[20px] filter fixed inset-x-0 bottom-8 flex items-center justify-center p-10 mx-auto border-white rounded-full lg:hidden border-1 w-[40px] h-[40px] z-50">
//           <Button className="flex flex-col items-center justify-center p-2 text-white bg-glass-3-dark dark:bg-glass-2">
//             <span>{React.createElement(activeItem.icon)}</span>
//             <span className="text-base-regular">{activeItem.name}</span>
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="relative p-0 bg-transparent">
//           <section className="absolute top-0 left-0 z-50 flex items-center justify-center pt-4 pl-4">
//             <Link href={`/${currentLocale}`} className="">
//               <Image
//                 src={"/assets/core/logo_sm_dark.webp"}
//                 alt="Mobile-navbar-logo"
//                 width={50}
//                 height={50}
//               />
//             </Link>
//           </section>
//           <motion.div
//             initial={{ backdropFilter: "blur(0px)", opacity: 0, y: 10 }}
//             animate={{ backdropFilter: "blur(40px)", opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, ease: "easeInOut" }}
//             className="w-full h-full rounded-[10px] navContent py-10 px-10 relative"
//           >
//             <section className="flex flex-col items-center justify-center w-full gap-4">
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1, duration: 0.5 }}
//               >
//                 <Link href={`/${currentLocale}/hub/profile`}>
//                   <User
//                     name={
//                       <p className="text-base-regular">{userData?.firstName}</p>
//                     }
//                     description={
//                       <p className="text-sm text-white">
//                         {userProfileData?.type}
//                       </p>
//                     }
//                     avatarProps={{
//                       src: session?.publicUserData.imageUrl,
//                       size: "md",
//                     }}
//                     className="object-cover text-white capitalize transition-all duration-200 ease-in-out"
//                   />
//                 </Link>
//               </motion.div>
//               <div className="flex flex-row items-center justify-center w-full gap-1 text-white">
//                 <HubThemeSwitcher />
//                 <motion.p
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.2, ease: "easeInOut" }}
//                 >
//                   Theme
//                 </motion.p>
//               </div>
//             </section>

//             <div className="flex-grow w-full contentSeparator" />

//             <section className="flex flex-col items-center justify-center gap-4">
//               {mobileNavbarItems
//                 .filter(
//                   (item) => item !== activeItem && item.name !== "Profile"
//                 )
//                 .map((item, index) => (
//                   <motion.button
//                     key={item.name}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.1 * index, duration: 0.5 }}
//                     className=" w-full p-4 text-white rounded-[10px] bg-black bg-opacity-20 text-heading4-medium"
//                   >
//                     <Link
//                       href={`/${currentLocale}/${item.link}`}
//                       className="flex flex-col items-center justify-center gap-2 text-center"
//                     >
//                       <span>{React.createElement(item.icon)}</span>
//                       <span>{item.name}</span>
//                     </Link>
//                   </motion.button>
//                 ))}
//             </section>
//           </motion.div>
//         </PopoverContent>
//       </Popover>
//     </nav>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  User,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import Link from "next/link";

import {
  adopterMobileNavigationItems,
  explorerMobileNavigationItems,
  holderMobileNavigationItems,
} from "@/constants/navigation";
import { useSession } from "@clerk/nextjs";

import { useLocale } from "next-intl";
import HubThemeSwitcher from "@/components/other/navigation/HubThemeSwitcher";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useUserStore } from "@/store/shared/useUser.store";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";

export default function MobileNavbar() {
  const currentPath = usePathname();
  const currentLocale = useLocale();
  const { session } = useSession();

  // Zustand stores
  const userData = useUserStore((state) => state.user);
  const userProfileData = useUserProfileStore((state) => state.profile);

  const getNavigationItems = () => {
    switch (userProfileData?.type) {
      case "adopter":
        return adopterMobileNavigationItems;
      case "explorer":
        return explorerMobileNavigationItems;
      case "holder":
        return holderMobileNavigationItems;
      default:
        return [];
    }
  };

  const mobileNavbarItems = getNavigationItems();

  const normalizePathname = (path: string, locale: string) => {
    const regex = new RegExp(`^/${locale}`);
    return path.replace(regex, "") || "/";
  };

  const [activeItem, setActiveItem] = useState(() => {
    const pathWithoutLocale = normalizePathname(currentPath, currentLocale);
    return (
      mobileNavbarItems.find((item) => item.link === pathWithoutLocale) ||
      mobileNavbarItems[0]
    );
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const pathWithoutLocale = normalizePathname(currentPath, currentLocale);
    const newActiveItem =
      mobileNavbarItems.find((item) => item.link === pathWithoutLocale) ||
      mobileNavbarItems[0];
    setActiveItem(newActiveItem);
  }, [currentPath, currentLocale, mobileNavbarItems]);

  return (
    <nav>
      <Popover
        placement="top"
        showArrow={true}
        offset={20}
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
      >
        <PopoverTrigger className="backdrop-blur-[20px] filter fixed inset-x-0 bottom-14 flex items-center justify-center p-10 mx-auto border-white rounded-full lg:hidden border-1 w-[120px] h-[60px] z-50">
          <Button className="flex flex-col items-center justify-center p-2 text-white bg-glass-3-dark dark:bg-glass-2">
            <span>{React.createElement(activeItem.icon)}</span>
            <span className="text-base-regular">{activeItem.name}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="relative p-0 bg-transparent">
          <section className="absolute top-0 left-0 z-50 flex items-center justify-center pt-4 pl-4">
            <Link href={`/${currentLocale}`} className="">
              <Image
                src={"/assets/core/logo_sm_dark.webp"}
                alt="Mobile-navbar-logo"
                width={50}
                height={50}
              />
            </Link>
          </section>
          <motion.div
            initial={{ backdropFilter: "blur(0px)", opacity: 0, y: 10 }}
            animate={{ backdropFilter: "blur(40px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full h-[350px] rounded-[10px] navContent py-10 px-10 relative"
          >
            <section className="flex flex-col items-center justify-center w-full gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Link href={`/${currentLocale}/hub/profile`}>
                  <User
                    name={
                      <p className="text-base-regular">{userData?.firstName}</p>
                    }
                    description={
                      <p className="text-sm text-white">
                        {userProfileData?.type}
                      </p>
                    }
                    avatarProps={{
                      src: session?.publicUserData.imageUrl,
                      size: "md",
                    }}
                    className="object-cover text-white capitalize transition-all duration-200 ease-in-out"
                  />
                </Link>
              </motion.div>
              <div className="flex flex-row items-center justify-center w-full gap-1 text-white">
                <HubThemeSwitcher />
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  Theme
                </motion.p>
              </div>
            </section>

            <div className="flex-grow w-full contentSeparator" />

            <section className="flex flex-col items-center justify-center gap-4">
              {mobileNavbarItems
                .filter(
                  (item) => item !== activeItem && item.name !== "Profile"
                )
                .map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className=" w-full p-4 text-white rounded-[10px] bg-black bg-opacity-20 text-heading4-medium"
                  >
                    <Link
                      href={`/${currentLocale}/${item.link}`}
                      className="flex flex-col items-center justify-center gap-2 text-center"
                    >
                      <span>{React.createElement(item.icon)}</span>
                      <span>{item.name}</span>
                    </Link>
                  </motion.button>
                ))}
            </section>
          </motion.div>
        </PopoverContent>
      </Popover>
    </nav>
  );
}
