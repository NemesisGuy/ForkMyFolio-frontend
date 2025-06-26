import * as React from "react";
import { cn } from "../../utils/cn"; // Updated path

/**
 * @typedef {object} CardProps
 * @property {string} [className] - Additional class names for the card.
 * @property {React.ReactNode} children - Content of the card.
 */

/**
 * Card component.
 * A container for displaying content in a card format.
 * @param {CardProps & React.HTMLAttributes<HTMLDivElement>} props - Props for the Card.
 * @returns {JSX.Element} The Card component.
 */
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    data-slot="card"
    ref={ref}
    className={cn(
      "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

/**
 * CardHeader component.
 * Header section of a Card.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Props for the CardHeader.
 * @returns {JSX.Element} The CardHeader component.
 */
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    data-slot="card-header"
    ref={ref}
    className={cn(
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * CardTitle component.
 * Title within a CardHeader.
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props - Props for the CardTitle.
 * @returns {JSX.Element} The CardTitle component.
 */
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 // Changed from div to h3 for semantic correctness
    data-slot="card-title"
    ref={ref}
    className={cn("leading-none font-semibold", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * CardDescription component.
 * Description text within a CardHeader or CardContent.
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props - Props for the CardDescription.
 * @returns {JSX.Element} The CardDescription component.
 */
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p // Changed from div to p for semantic correctness
    data-slot="card-description"
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * CardAction component.
 * Used for placing actions (e.g., buttons, links) within a Card, typically in the CardHeader.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Props for the CardAction.
 * @returns {JSX.Element} The CardAction component.
 */
const CardAction = React.forwardRef(({ className, ...props }, ref) => (
  <div
    data-slot="card-action"
    ref={ref}
    className={cn(
      "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
      className
    )}
    {...props}
  />
));
CardAction.displayName = "CardAction";

/**
 * CardContent component.
 * Main content area of a Card.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Props for the CardContent.
 * @returns {JSX.Element} The CardContent component.
 */
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div data-slot="card-content" ref={ref} className={cn("px-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

/**
 * CardFooter component.
 * Footer section of a Card.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Props for the CardFooter.
 * @returns {JSX.Element} The CardFooter component.
 */
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    data-slot="card-footer"
    ref={ref}
    className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
