import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No data available", 
  description = "There's nothing to show here yet.", 
  icon = "Database", 
  actionLabel, 
  onAction,
  className 
}) => {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="max-w-md mx-auto">
        <ApperIcon name={icon} size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-6">{description}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;