"use client";
import React from "react";
import { motion } from "framer-motion";

export default function ProfileLampDecoration() {
  return (
    <div className="relative z-0 flex items-center justify-center flex-1 w-full scale-y-125 isolate">
      <motion.div
        initial={{ opacity: 0.5, width: "15rem" }}
        animate={{ opacity: 1, width: "50%" }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        style={{
          backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
        }}
        className="absolute inset-auto right-1/2 h-56 overflow-visible w-[50%] bg-gradient-conic dark:from-cyan-500 dark:via-transparent dark:to-slate-950 text-white [--conic-position:from_70deg_at_center_top]"
      >
        <div className="absolute w-[100%] left-0 dark:bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        <div className="absolute w-40 h-[100%] left-0 dark:bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0.5, width: "15rem" }}
        animate={{ opacity: 1, width: "50%" }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        style={{
          backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
        }}
        className="absolute inset-auto left-1/2 h-56 w-[50%] bg-gradient-conic from-transparent via-transparent dark:to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]"
      >
        <div className="absolute w-40 h-[100%] right-0 dark:bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
        <div className="absolute w-[100%] right-0 dark:bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
      </motion.div>
      <div className="absolute w-full h-48 scale-x-150 translate-y-12 top-1/2 dark:bg-slate-950 blur-2xl"></div>
      <div className="absolute z-50 w-full h-48 bg-transparent top-1/2 opacity-10 backdrop-blur-md"></div>
      <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>
      <motion.div
        initial={{ width: "8rem" }}
        animate={{ width: "10%" }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full dark:bg-cyan-400 blur-2xl"
      ></motion.div>
      <motion.div
        initial={{ width: "15rem" }}
        animate={{ width: "50%" }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="absolute inset-auto z-40 h-0.5 w-[50%] -translate-y-[7rem] bg-cyan-400 "
      ></motion.div>

      <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] dark:bg-slate-950 "></div>
    </div>
  );
}
