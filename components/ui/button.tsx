import { Slot } from "radix-ui";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const buttonVariants = cva("inline-flex min-h-11 items-center justify-center rounded-xl px-4 font-semibold transition-colors", {
  variants: {
    variant: {
      default: "bg-blue-700 text-white hover:bg-blue-800",
      ghost: "text-blue-800 hover:bg-blue-50",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Button({ className, variant, asChild = false, ...props }: ComponentProps<"button"> & {
  variant?: "default" | "ghost";
  asChild?: boolean;
}) {
  const Component = asChild ? Slot.Root : "button";
  return <Component className={cn(buttonVariants({ variant }), className)} {...props} />;
}
