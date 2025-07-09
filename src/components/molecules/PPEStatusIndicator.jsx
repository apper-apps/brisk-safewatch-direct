import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const PPEStatusIndicator = ({ ppeType, isDetected, className }) => {
  const ppeIcons = {
    helmet: "HardHat",
    jacket: "Shirt",
    shoes: "Footprints"
  };

  const ppeLabels = {
    helmet: "Helmet",
    jacket: "Safety Jacket",
    shoes: "Safety Shoes"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ApperIcon
        name={ppeIcons[ppeType] || "Shield"}
        size={20}
        className={isDetected ? "text-success" : "text-error"}
      />
      <Badge variant={isDetected ? "success" : "error"}>
        {ppeLabels[ppeType]} {isDetected ? "✓" : "✗"}
      </Badge>
    </div>
  );
};

export default PPEStatusIndicator;