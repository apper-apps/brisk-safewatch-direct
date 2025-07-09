import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = ({ label, id, className, error, ...props }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input id={id} {...props} />
      {error && <p className="text-error text-sm">{error}</p>}
    </div>
  );
};

export default FormField;