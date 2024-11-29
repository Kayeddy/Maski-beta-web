// Global imports
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { sidebarImageVariants } from "@/config/motion/sidebar";

interface Props {
  src: string;
  alt: string;
  isExpanded: boolean;
  imgStyles?: string;
}

const SidebarImage = ({ src, alt, isExpanded, imgStyles }: Props) => {
  return (
    <motion.img
      src={src}
      alt={alt}
      variants={sidebarImageVariants}
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      className={`${imgStyles}  object-cover`}
    ></motion.img>
  );
};

export default SidebarImage;
