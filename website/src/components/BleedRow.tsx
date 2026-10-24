import React from "react";

interface BleedRowProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared card-row wrapper that bleeds to the right edge of the screen.
 * Aligns the first item with the 1530px container's left edge on large monitors,
 * while allowing the row to scroll/bleed all the way to the right screen edge.
 */
export default function BleedRow({ children, className = "" }: BleedRowProps) {
  return (
    <div
      className={`flex gap-3 overflow-x-auto pr-4 pl-4 md:pl-8 xl:pl-14 min-[1530px]:pl-[calc((100vw-1530px)/2)] [scrollbar-width:none] ${className}`}
    >
      {children}
    </div>
  );
}
