"use client";

import * as React from "react";
import { motion } from "framer-motion";

const MotionButton = motion.button;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const baseClasses =
  "flex justify-center items-center bg-slate-900 shadow-[0_14px_30px_rgba(15,23,42,0.35)] px-4 py-2.75 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-slate-900/80 ring-offset-2 ring-offset-slate-50 w-full font-medium text-white text-sm transition";

export function Button({ className, children, ...props }: ButtonProps) {
  const classes = className ? `${baseClasses} ${className}` : baseClasses;

  return (
    <MotionButton
      whileHover={{
        y: -1,
        boxShadow: "0 18px 40px rgba(15,23,42,0.28)",
      }}
      whileTap={{
        y: 0,
        scale: 0.98,
        boxShadow: "0 10px 26px rgba(15,23,42,0.22)",
      }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className={classes}
      {...props}
    >
      {children}
    </MotionButton>
  );
}

