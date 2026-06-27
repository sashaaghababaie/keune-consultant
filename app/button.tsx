import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<"button"> & {
  loading?: boolean;
  variant?: "ghost";
};

const variants = {
  ghost: "px-4 py-2 h-fit",
};
// [&_svg]:pointer-events-none
//
// group/button
// bg-clip-padding
//select-none
const baseClass =
  "hover:opacity-80 cursor-pointer inline-flex shrink-0 items-center justify-center rounded-4xl text-sm font-medium active:not-aria-[haspopup]:translate-y-px whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 border border-transparent aria-invalid:border-rose-500 aria-invalid:ring-[3px] aria-invalid:ring-rose-500/20 dark:aria-invalid:border-rose-500/50 dark:aria-invalid:ring-rose-500 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";
export default function Button({
  className,
  loading,
  variant = "ghost",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        baseClass,
        variants[variant],
        className,
        "disabled:opacity-50 disabled:hover:none disabled:pointer-none",
      )}
      {...props}
    >
      {/* {loading && <>O</>} */}
      {children}
    </button>
  );
}
