"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { LuX } from "react-icons/lu";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DrawerSize = "sm" | "md" | "lg" | "xl";
export type DrawerPlacement = "left" | "right" | "top" | "bottom";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: DrawerSize;
  placement?: DrawerPlacement;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

interface DrawerHeaderProps {
  children: ReactNode;
  onClose?: () => void;
}

interface DrawerContentProps {
  children: ReactNode;
  scrollable?: boolean;
  className?: string;
}

interface DrawerFooterProps {
  children: ReactNode;
  className?: string;
}

// ─── Size Maps ────────────────────────────────────────────────────────────────

const sizeMap: Record<DrawerPlacement, Record<DrawerSize, string>> = {
  left: {
    sm: "w-64",
    md: "w-80",
    lg: "w-96",
    xl: "w-screen max-w-2xl",
  },
  right: {
    sm: "w-64",
    md: "w-80",
    lg: "w-96",
    xl: "w-screen max-w-2xl",
  },
  top: {
    sm: "h-48",
    md: "h-64",
    lg: "h-80",
    xl: "h-96",
  },
  bottom: {
    sm: "h-48",
    md: "h-64",
    lg: "h-80",
    xl: "h-96",
  },
};

const slideInAnimation: Record<DrawerPlacement, string> = {
  left: "animate-[slide-in-left_0.18s_ease-out_forwards]",
  right: "animate-[slide-in-right_0.18s_ease-out_forwards]",
  top: "animate-[slide-in-top_0.18s_ease-out_forwards]",
  bottom: "animate-[slide-in-bottom_0.18s_ease-out_forwards]",
};

const drawerPositioning: Record<DrawerPlacement, string> = {
  left: "fixed inset-y-0 left-0 flex flex-col h-screen",
  right: "fixed inset-y-0 right-0 flex flex-col h-screen",
  top: "fixed inset-x-0 top-0 flex flex-row w-screen",
  bottom: "fixed inset-x-0 bottom-0 flex flex-row w-screen",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

export function DrawerHeader({ children, onClose }: DrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
      <div className="text-base font-semibold tracking-tight">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close drawer"
          className="flex h-7 w-7 items-center justify-center text-zinc-400 transition-colors duration-150 hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <LuX />
        </button>
      )}
    </div>
  );
}

export function DrawerContent({
  children,
  scrollable = true,
  className = "",
}: DrawerContentProps) {
  return (
    <div
      className={cn(
        "flex-1 px-6 py-5 text-sm leading-relaxed",
        scrollable ? "overflow-y-auto" : "",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DrawerFooter({ children, className = "" }: DrawerFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 border-t border-black/10 px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── Root Drawer ──────────────────────────────────────────────────────────────

export function Drawer({
  isOpen,
  onClose,
  children,
  size = "md",
  placement = "right",
  closeOnBackdrop = true,
  closeOnEsc = true,
  className,
}: DrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // ESC key
  useEffect(() => {
    if (!closeOnEsc) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, closeOnEsc]);

  // Lock body scroll
  const isBodyAlreadyHasOverflowHidden = useRef(false);
  useEffect(() => {
    if (document.body.style.overflow === "hidden") {
      isBodyAlreadyHasOverflowHidden.current = true;
      return;
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      if (isBodyAlreadyHasOverflowHidden.current === true) {
        return;
      }
      document.body.style.overflow = "";
    }
    return () => {
      if (isBodyAlreadyHasOverflowHidden.current === true) {
        return;
      } else {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === overlayRef.current) {
      onClose();
    }
  };

  const isVertical = placement === "top" || placement === "bottom";

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-9999 animate-[fade-in_0.18s_ease-out_forwards] bg-black/10"
    >
      <div
        className={cn(
          "relative bg-white shadow-lg",
          drawerPositioning[placement],
          sizeMap[placement][size],
          slideInAnimation[placement],
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
