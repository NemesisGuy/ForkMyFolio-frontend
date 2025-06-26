import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/utils";

/**
 * Root component for a dialog.
 * @param {DialogPrimitive.DialogProps} props - Props for the Dialog root.
 * @returns {JSX.Element} The Dialog root component.
 */
const Dialog = React.forwardRef((props, ref) => (
  <DialogPrimitive.Root data-slot="dialog" ref={ref} {...props} />
));
Dialog.displayName = DialogPrimitive.Root.displayName;

/**
 * Trigger component for a dialog.
 * @param {DialogPrimitive.DialogTriggerProps} props - Props for the Dialog trigger.
 * @returns {JSX.Element} The Dialog trigger component.
 */
const DialogTrigger = React.forwardRef((props, ref) => (
  <DialogPrimitive.Trigger data-slot="dialog-trigger" ref={ref} {...props} />
));
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

/**
 * Portal component for a dialog.
 * @param {DialogPrimitive.DialogPortalProps} props - Props for the Dialog portal.
 * @returns {JSX.Element} The Dialog portal component.
 */
const DialogPortal = React.forwardRef((props, ref) => (
  <DialogPrimitive.Portal data-slot="dialog-portal" ref={ref} {...props} />
));
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

/**
 * Close button component for a dialog.
 * @param {DialogPrimitive.DialogCloseProps} props - Props for the Dialog close button.
 * @returns {JSX.Element} The Dialog close button component.
 */
const DialogClose = React.forwardRef((props, ref) => (
  <DialogPrimitive.Close data-slot="dialog-close" ref={ref} {...props} />
));
DialogClose.displayName = DialogPrimitive.Close.displayName;

/**
 * Overlay component for a dialog.
 * @param {DialogPrimitive.DialogOverlayProps & React.RefAttributes<HTMLDivElement>} props - Props for the Dialog overlay.
 * @returns {JSX.Element} The Dialog overlay component.
 */
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    data-slot="dialog-overlay"
    ref={ref}
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * Content component for a dialog.
 * @param {DialogPrimitive.DialogContentProps & React.RefAttributes<HTMLDivElement> & {showCloseButton?: boolean}} props - Props for the Dialog content.
 * @returns {JSX.Element} The Dialog content component.
 */
const DialogContent = React.forwardRef(({ className, children, showCloseButton = true, ...props }, ref) => (
  <DialogPortal data-slot="dialog-portal">
    <DialogOverlay />
    <DialogPrimitive.Content
      data-slot="dialog-content"
      ref={ref}
      className={cn(
        "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close
          data-slot="dialog-close-button"
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

/**
 * Header component for a dialog.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Props for the Dialog header.
 * @returns {JSX.Element} The Dialog header component.
 */
const DialogHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    data-slot="dialog-header"
    ref={ref}
    className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
    {...props}
  />
));
DialogHeader.displayName = "DialogHeader";

/**
 * Footer component for a dialog.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Props for the Dialog footer.
 * @returns {JSX.Element} The Dialog footer component.
 */
const DialogFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    data-slot="dialog-footer"
    ref={ref}
    className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
    {...props}
  />
));
DialogFooter.displayName = "DialogFooter";

/**
 * Title component for a dialog.
 * @param {DialogPrimitive.DialogTitleProps & React.RefAttributes<HTMLHeadingElement>} props - Props for the Dialog title.
 * @returns {JSX.Element} The Dialog title component.
 */
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    data-slot="dialog-title"
    ref={ref}
    className={cn("text-lg leading-none font-semibold", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

/**
 * Description component for a dialog.
 * @param {DialogPrimitive.DialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>} props - Props for the Dialog description.
 * @returns {JSX.Element} The Dialog description component.
 */
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    data-slot="dialog-description"
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
