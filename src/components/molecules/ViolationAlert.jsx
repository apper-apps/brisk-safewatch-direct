import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import PPEStatusIndicator from "@/components/molecules/PPEStatusIndicator";
import { format } from "date-fns";

const ViolationAlert = ({ violation, onClose, onViewDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed top-4 right-4 z-50 w-96"
    >
      <Card className="border-2 border-error bg-error/10 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <ApperIcon name="AlertTriangle" className="text-error" size={24} />
              <div>
                <h3 className="text-lg font-bold text-white">PPE Violation Detected</h3>
                <p className="text-sm text-gray-300">
                  {format(new Date(violation.timestamp), "HH:mm:ss")}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <ApperIcon name="X" size={18} />
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={violation.worker.profilePicture}
              alt={violation.worker.fullName}
              className="w-12 h-12 rounded-full border-2 border-error"
            />
            <div>
              <h4 className="font-semibold text-white">{violation.worker.fullName}</h4>
              <p className="text-sm text-gray-300">ID: {violation.worker.employeeId}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-300">Missing PPE:</p>
            <div className="flex flex-wrap gap-2">
              {violation.missingPPE.map((ppe) => (
                <PPEStatusIndicator
                  key={ppe}
                  ppeType={ppe}
                  isDetected={false}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">
              Camera: {violation.location}
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={onViewDetails}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ViolationAlert;