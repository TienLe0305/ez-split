"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isDense?: boolean;
}

const Input = React.memo(React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isDense, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          // Enhanced height and padding for mobile touchpoints
          isDense 
            ? "h-9 px-3 py-1" 
            : "h-10 px-3 py-2 md:h-10 md:py-2",
          // Make input elements larger on small screens for better touch targets
          "text-base md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
))
Input.displayName = "Input"

export { Input }
