import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const WorkerProfiles = ({ workers, onEditWorker, onDeleteWorker, className }) => {
  const [viewMode, setViewMode] = useState("grid");
  const [imageErrors, setImageErrors] = useState({});
  const [imageLoading, setImageLoading] = useState({});

  // Generate fallback avatar with user initials
  const generateFallbackAvatar = (fullName) => {
    const initials = fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return (
      <div className="w-full h-full bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center text-white font-semibold">
        {initials}
      </div>
    );
  };

  // Handle image loading errors
  const handleImageError = (workerId, workerName) => {
    console.warn(`Failed to load profile image for worker: ${workerName} (ID: ${workerId})`);
    setImageErrors(prev => ({ ...prev, [workerId]: true }));
    setImageLoading(prev => ({ ...prev, [workerId]: false }));
  };

  // Handle image loading start
  const handleImageLoad = (workerId) => {
    setImageLoading(prev => ({ ...prev, [workerId]: false }));
  };

  // Handle image loading start
  const handleImageLoadStart = (workerId) => {
    setImageLoading(prev => ({ ...prev, [workerId]: true }));
  };
  if (workers.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <ApperIcon name="Users" size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Workers</h3>
        <p className="text-gray-400">Add workers to start monitoring their safety compliance</p>
      </div>
    );
  }

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {workers.map((worker) => (
        <motion.div
          key={worker.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="group"
        >
<Card className="hover:border-primary/50 transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full mx-auto border-2 border-gray-600 group-hover:border-primary/50 transition-colors duration-200 overflow-hidden">
                  {imageErrors[worker.Id] ? (
                    generateFallbackAvatar(worker.fullName)
                  ) : (
                    <img
                      src={worker.profilePicture}
                      alt={`${worker.fullName}'s profile picture`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(worker.Id, worker.fullName)}
                      onLoad={() => handleImageLoad(worker.Id)}
                      onLoadStart={() => handleImageLoadStart(worker.Id)}
                    />
                  )}
                  {imageLoading[worker.Id] && (
                    <div className="absolute inset-0 bg-gray-600 animate-pulse flex items-center justify-center">
                      <ApperIcon name="User" size={24} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-success rounded-full border-2 border-surface flex items-center justify-center">
                  <ApperIcon name="Check" size={12} className="text-white" />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-1">{worker.fullName}</h3>
              <p className="text-sm text-gray-400 mb-2">@{worker.username}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">ID:</span>
                  <span className="text-white">{worker.employeeId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Department:</span>
                  <span className="text-white">{worker.department}</span>
                </div>
              </div>
              
              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditWorker(worker)}
                  className="flex-1"
                >
                  <ApperIcon name="Edit" size={16} />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDeleteWorker(worker.Id)}
                  className="flex-1"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {workers.map((worker) => (
        <Card key={worker.Id} className="hover:border-primary/50 transition-all duration-200">
<CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-gray-600 overflow-hidden flex-shrink-0">
                {imageErrors[worker.Id] ? (
                  generateFallbackAvatar(worker.fullName)
                ) : (
                  <img
                    src={worker.profilePicture}
                    alt={`${worker.fullName}'s profile picture`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(worker.Id, worker.fullName)}
                    onLoad={() => handleImageLoad(worker.Id)}
                    onLoadStart={() => handleImageLoadStart(worker.Id)}
                  />
                )}
                {imageLoading[worker.Id] && (
                  <div className="absolute inset-0 bg-gray-600 animate-pulse flex items-center justify-center">
                    <ApperIcon name="User" size={20} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{worker.fullName}</h3>
                  <Badge variant="success">Active</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Username:</span>
                    <span className="text-white ml-2">@{worker.username}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Employee ID:</span>
                    <span className="text-white ml-2">{worker.employeeId}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Department:</span>
                    <span className="text-white ml-2">{worker.department}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditWorker(worker)}
                >
                  <ApperIcon name="Edit" size={16} />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDeleteWorker(worker.Id)}
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Workers ({workers.length})</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <ApperIcon name="Grid3X3" size={16} />
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <ApperIcon name="List" size={16} />
          </Button>
        </div>
      </div>
      
      {viewMode === "grid" ? <GridView /> : <ListView />}
    </div>
  );
};

export default WorkerProfiles;