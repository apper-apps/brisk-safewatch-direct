import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Error = ({ message, onRetry, className }) => {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="max-w-md mx-auto">
        <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
        <p className="text-gray-400 mb-6">
          {message || "We encountered an error while loading your data. Please try again."}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RefreshCw" size={16} />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default Error;