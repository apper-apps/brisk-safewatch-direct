import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Header = ({ title, onMenuClick, className }) => {
  return (
    <header className={cn("bg-secondary border-b border-gray-700 px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <ApperIcon name="Clock" size={16} />
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-success">
            <ApperIcon name="Wifi" size={16} />
            <span>Connected</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;