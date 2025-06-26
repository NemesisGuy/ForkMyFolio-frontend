import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/utils";

/**
 * @typedef {object} LabelProps
 * @property {string} [className] - Additional class names for the label.
 */

/**
 * A React label component.
 * Extends Radix UI Label primitive with styling.
 * @param {LabelProps & React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>} props - The props for the label.
 * @param {React.Ref<React.ElementRef<typeof LabelPrimitive.Root>>} ref - The ref for the label element.
 * @returns {JSX.Element} The Label component.
 */
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    data-slot="label"
    ref={ref}
    className={cn(
      "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
