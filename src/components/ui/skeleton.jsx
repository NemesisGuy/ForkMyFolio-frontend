import React from 'react'; // Import React for JSX
import { cn } from "@/utils";

/**
 * @typedef {object} SkeletonProps
 * @property {string} [className] - Additional class names for the skeleton.
 */

/**
 * A skeleton component for loading states.
 * Displays a pulsing placeholder.
 * @param {SkeletonProps & React.HTMLAttributes<HTMLDivElement>} props - The props for the skeleton.
 * @returns {JSX.Element} The Skeleton component.
 */
const Skeleton = ({ className, ...props }) => {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted animate-pulse rounded-md", className)} // Changed to bg-muted for better contrast with accent
      {...props}
    />
  );
};

export { Skeleton };
