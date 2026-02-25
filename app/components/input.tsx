"use client";

import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const baseClasses =
  "block bg-slate-50/70 focus:bg-white shadow-sm px-3 py-2.5 border border-slate-200 focus:border-sky-300 rounded-2xl outline-none focus:ring-2 focus:ring-sky-100 w-full text-slate-900 placeholder:text-slate-400 text-sm transition duration-200";

export function Input({ className, ...props }: InputProps) {
  const classes = className ? `${baseClasses} ${className}` : baseClasses;

  return <input className={classes} {...props} />;
}

