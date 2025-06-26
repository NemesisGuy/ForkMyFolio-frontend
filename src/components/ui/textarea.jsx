import * as React from "react";
import { cn } from "../../utils/cn"; // Updated path

/**
 * @typedef {object} TextareaProps
 * @property {string} [className] - Additional class names for the textarea.
 */

/**
 * A React textarea component.
 * @param {TextareaProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>} props - The props for the textarea.
 * @param {React.Ref<HTMLTextAreaElement>} ref - The ref for the textarea element.
 * @returns {JSX.Element} The Textarea component.
 */
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
