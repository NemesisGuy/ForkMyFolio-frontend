import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../utils/cn"; // Updated path

/**
 * Root component for tabs.
 * @param {React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>} props - Props for the Tabs root.
 * @returns {JSX.Element} The Tabs root component.
 */
const Tabs = React.forwardRef((props, ref) => (
  <TabsPrimitive.Root
    data-slot="tabs"
    ref={ref}
    className={cn("flex flex-col gap-2", props.className)}
    {...props}
  />
));
Tabs.displayName = TabsPrimitive.Root.displayName;

/**
 * List component for tab triggers.
 * @param {React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>} props - Props for the Tabs list.
 * @returns {JSX.Element} The Tabs list component.
 */
const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    data-slot="tabs-list"
    ref={ref}
    className={cn(
      "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

/**
 * Trigger component for a tab.
 * @param {React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>} props - Props for the Tabs trigger.
 * @returns {JSX.Element} The Tabs trigger component.
 */
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    data-slot="tabs-trigger"
    ref={ref}
    className={cn(
      "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/**
 * Content component for a tab.
 * @param {React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>} props - Props for the Tabs content.
 * @returns {JSX.Element} The Tabs content component.
 */
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    data-slot="tabs-content"
    ref={ref}
    className={cn("flex-1 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
