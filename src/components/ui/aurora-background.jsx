"use client";
import React from "react";

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  // Simple class name concatenation without external dependency
  const combineClasses = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <main>
      <div
        className={combineClasses(
          "relative flex flex-col h-[100vh] items-center justify-center bg-zinc-50 text-slate-950 transition-bg aurora-container",
          className
        )}
        {...props}
      >
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </main>
  );
};