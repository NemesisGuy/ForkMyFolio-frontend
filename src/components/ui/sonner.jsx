import { Toaster as Sonner } from "sonner";
import React from 'react';

/**
 * @typedef {object} ToasterProps
 * @property {("light"|"dark"|"system")} [theme] - The theme for the toaster. Defaults to "system".
 * @property {string} [className] - Additional class names.
 * @property {object} [toastOptions] - Toast options.
 * Refer to Sonner documentation for more properties.
 */

/**
 * Toaster component for displaying notifications.
 * This is a wrapper around the Sonner component.
 * @param {ToasterProps & React.ComponentProps<typeof Sonner>} props - Props for the Toaster.
 * @returns {JSX.Element} The Toaster component.
 */
const Toaster = ({ theme: themeProp = "system", ...props }) => {
  // Simplified theme handling without next-themes.
  // TODO: Integrate with actual app theme context if available, or enhance theme detection.
  let currentTheme = themeProp;
  if (themeProp === "system") {
    // Basic system theme detection, can be improved.
    currentTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
  }

  return (
    <Sonner
      theme={currentTheme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      // The style prop with CSS variables seems to be for overriding internal Sonner styles,
      // but shadcn/ui typically relies on Tailwind classes. The toastOptions.classNames should be preferred.
      // Keeping the original style approach commented out for reference if needed.
      // style={
      //   {
      //     "--normal-bg": "var(--popover)", // These are likely for default sonner styling
      //     "--normal-text": "var(--popover-foreground)",
      //     "--normal-border": "var(--border)"
      //   }
      // }
      {...props}
    />
  );
};

export { Toaster };
