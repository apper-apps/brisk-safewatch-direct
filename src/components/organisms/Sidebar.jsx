import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import NavItem from "@/components/molecules/NavItem";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose, className }) => {
  const navigation = [
    { to: "/", icon: "Monitor", label: "Live Monitor" },
    { to: "/violations", icon: "AlertTriangle", label: "Violations", count: 12 },
    { to: "/workers", icon: "Users", label: "Workers" },
    { to: "/analytics", icon: "BarChart3", label: "Analytics" },
    { to: "/settings", icon: "Settings", label: "Settings" }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn("hidden lg:block w-64 bg-secondary border-r border-gray-700", className)}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <ApperIcon name="Shield" className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white">SafeWatch</h2>
              <p className="text-sm text-gray-400">AI Safety Monitor</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                count={item.count}
              />
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="w-64 h-full bg-secondary border-r border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Shield" className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-white">SafeWatch</h2>
                    <p className="text-sm text-gray-400">AI Safety Monitor</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    count={item.count}
                    onClick={onClose}
                  />
                ))}
              </nav>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </>
  );
};

export default Sidebar;