import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full bg-surface border-2 border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:outline-none transition-colors duration-200",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;