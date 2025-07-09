import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import PPEStatusIndicator from "@/components/molecules/PPEStatusIndicator";
import { cn } from "@/utils/cn";

const ViolationsList = ({ violations, onViewDetails, className }) => {
  if (violations.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <ApperIcon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Violations</h3>
        <p className="text-gray-400">All workers are compliant with PPE requirements</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {violations.map((violation) => (
        <Card key={violation.Id} className="border-l-4 border-error">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <img
                src={violation.worker.profilePicture}
                alt={violation.worker.fullName}
                className="w-16 h-16 rounded-full border-2 border-error object-cover"
              />
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {violation.worker.fullName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      ID: {violation.worker.employeeId} | {violation.worker.department}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">
                      {format(new Date(violation.timestamp), "MMM dd, yyyy")}
                    </p>
                    <p className="text-sm text-gray-300">
                      {format(new Date(violation.timestamp), "HH:mm:ss")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="MapPin" size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-300">{violation.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="DollarSign" size={16} className="text-warning" />
                    <span className="text-sm text-warning font-medium">
                      ${violation.fineAmount}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-400 mb-2">Missing PPE:</p>
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
                
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    violation.status === "pending" ? "bg-warning/20 text-warning" : "bg-success/20 text-success"
                  )}>
                    {violation.status}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(violation)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ViolationsList;