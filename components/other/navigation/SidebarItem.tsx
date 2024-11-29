"use client";

// Global imports
import React, { useState, useEffect } from "react";

// Animation imports
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown as SubMenuExpansionIcon } from "react-icons/io";
import CustomAccordion from "../../customUI/CustomAccordion";
import { IconType } from "react-icons/lib";
import {
  sidebarItemVariants,
  sidebarSubmenuItemVariants,
} from "@/config/motion/sidebar";

interface SidebarItemProps {
  Icon: IconType;
  title: string;
  children?: {
    name: string;
    Icon: React.FC;
    link: string;
  }[];
  isSidebarExpanded?: boolean;
}

export default function SidebarItem({
  title,
  Icon,
  children,
  isSidebarExpanded = false,
}: SidebarItemProps) {
  const [isSubMenuExpanded, setSubMenuExpanded] = useState(false);

  const toggleSubMenu = () => {
    setSubMenuExpanded(!isSubMenuExpanded);
  };

  useEffect(() => {
    if (!isSidebarExpanded) {
      setSubMenuExpanded(false);
    }
  }, [isSidebarExpanded]);

  return (
    <div>
      <div
        className="flex flex-row items-center justify-center w-full text-white transition-all duration-200 ease-in-out cursor-pointer hover:scale-110 brightness-125"
        onClick={children && toggleSubMenu}
      >
        <motion.span
          className={`transition-all duration-75 ease-in-out text-heading4-medium`}
        >
          <Icon />
        </motion.span>
        <motion.p
          className="relative flex-shrink-0 w-full overflow-hidden whitespace-nowrap text-heading4-medium"
          variants={sidebarItemVariants}
          initial={"collapsed"}
          animate={isSidebarExpanded ? "expanded" : "collapsed"}
        >
          {title}
        </motion.p>
        <motion.div
          className={`translate-x-[10px] text-[18px] transition-all duration-100 ease-in-out ${
            isSubMenuExpanded && "rotate-180"
          }`}
        >
          {children && isSidebarExpanded && (
            <span>
              <SubMenuExpansionIcon />
            </span>
          )}
        </motion.div>
      </div>
      <AnimatePresence>
        {isSubMenuExpanded && children && isSidebarExpanded && (
          <motion.div
            variants={sidebarSubmenuItemVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex flex-row gap-4 h-max"
          >
            <motion.section className="h-auto w-[0.2px] translate-x-[13px] bg-slate-100 pt-6" />
            <motion.section className="flex h-full translate-x-[10px] cursor-pointer flex-col items-start justify-center gap-6 text-sm pt-12 text-white">
              {children.map((child) => (
                <motion.div
                  key={child.name}
                  className="flex flex-row items-center justify-start gap-2"
                >
                  <child.Icon /> {child.name}
                </motion.div>
              ))}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
