"use client";

// Next
import Image from "next/image";

// Framer motion
import { motion as m } from "framer-motion";
import {
  stepperContainerMotionVariants,
  stepperItemMotionVariants,
} from "@/config/motion/stepper";

export default function DynamicFormStepper({ step }: { step: number }) {
  return (
    <m.div
      className="absolute z-20 flex lg:flex-col flex-row lg:items-start items-center justify-center gap-4 top-[4rem] lg:top-14 lg:left-4"
      variants={stepperContainerMotionVariants}
      initial="hidden"
      animate="show"
    >
      <m.div
        className="p-2 px-4 rounded-full border-1 lg:border-0 text-light-1 "
        variants={stepperItemMotionVariants}
      >
        <div className={`lg:hidden ${step === 0 ? "current" : ""}`}>1</div>
        <div className="flex-col hidden lg:flex">
          <small>STEP 1</small>
          <strong>YOUR INFO</strong>
        </div>
      </m.div>
      <m.div
        className="p-2 px-4 rounded-full text-light-1 border-1 lg:border-0"
        variants={stepperItemMotionVariants}
      >
        <div className={` lg:hidden ${step === 1 ? "current" : ""}`}>2</div>
        <div className="flex-col hidden lg:flex">
          <small>STEP 2</small>
          <strong>SELECT PLAN</strong>
        </div>
      </m.div>
      <m.div
        className="p-2 px-4 rounded-full text-light-1 border-1 lg:border-0"
        variants={stepperItemMotionVariants}
      >
        <div className={` lg:hidden ${step === 2 ? "current" : ""}`}>3</div>
        <div className="flex-col hidden lg:flex">
          <small>STEP 3</small>
          <strong>ADD-ONS</strong>
        </div>
      </m.div>
      <m.div
        className="p-2 px-4 rounded-full text-light-1 border-1 lg:border-0"
        variants={stepperItemMotionVariants}
      >
        <div className={` lg:hidden ${step === 3 ? "current" : ""}`}>4</div>
        <div className="flex-col hidden lg:flex">
          <small>STEP 4</small>
          <strong>SUMMARY</strong>
        </div>
      </m.div>
    </m.div>
  );
}
