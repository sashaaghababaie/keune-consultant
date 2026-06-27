"use client";

import { ReactNode, useEffect, useRef } from "react";
// import clsx from "clsx";
import { createPortal } from "react-dom";
import { LuX } from "react-icons/lu";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
}

interface ModalHeaderProps {
  children: ReactNode;
  onClose?: () => void;
}

interface ModalContentProps {
  children: ReactNode;
  scrollable?: boolean;
  className?: string;
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

// ─── Width Map ────────────────────────────────────────────────────────────────

const sizeMap: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "w-[95vw] max-w-4xl",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

export function ModalHeader({ children, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
      <div className="text-base font-semibold tracking-tight">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="flex h-7 w-7 items-center justify-center text-zinc-400 transition-colors duration-150 hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <LuX />
        </button>
      )}
    </div>
  );
}

export function ModalContent({
  children,
  scrollable = false,
  className = "",
}: ModalContentProps) {
  return (
    <div
      className={cn(
        "px-6 py-5 text-sm leading-relaxed",
        scrollable ? "overflow-y-auto" : "",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ModalFooter({ children, className = "" }: ModalFooterProps) {
  return (
    <div
      className={cn("flex items-center justify-end gap-3 px-6 py-4", className)}
    >
      {children}
    </div>
  );
}

// ─── Root Modal ───────────────────────────────────────────────────────────────

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  size = "md",
  closeOnBackdrop = true,
  closeOnEsc = true,
}: ModalProps) {
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

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-9999 flex animate-[fade-in_0.15s_ease-out_forwards] items-center justify-center bg-black/10 p-4"
    >
      <div
        className={cn(
          "relative flex w-full flex-col shadow-sm",
          "bg-white",
          "animate-[modal-in_0.15s_ease-out_forwards]",
          size === "full" && "h-full",
          sizeMap[size],
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
