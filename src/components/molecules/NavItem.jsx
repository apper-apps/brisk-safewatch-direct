import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavItem = ({ to, icon, label, count, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 hover:bg-surface/50 group",
          isActive ? "bg-primary/10 text-primary border-l-4 border-primary" : "text-gray-300 hover:text-white",
          className
        )
      }
    >
      <div className="flex items-center gap-3">
        <ApperIcon name={icon} size={20} />
        <span className="font-medium">{label}</span>
      </div>
      {count && (
        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </NavLink>
  );
};

export default NavItem;