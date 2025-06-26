import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to merge Tailwind CSS classes.
 * @param {...(string|string[]|Object)} inputs - The class names to merge.
 * @returns {string} The merged class names.
 * @example
 * cn("text-red-500", "bg-blue-500") // => "text-red-500 bg-blue-500"
 * cn("text-red-500", { "bg-blue-500": true, "p-4": false }) // => "text-red-500 bg-blue-500"
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
