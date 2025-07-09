import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import LiveFeedViewer from "@/components/organisms/LiveFeedViewer";
import ViolationAlert from "@/components/molecules/ViolationAlert";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getCameras, getRecentViolations } from "@/services/api/monitoringService";

const LiveMonitor = () => {
  const [cameras, setCameras] = useState([]);
  const [violations, setViolations] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalWorkers: 0,
    activeViolations: 0,
    complianceRate: 0,
    activeCameras: 0
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [camerasData, violationsData] = await Promise.all([
        getCameras(),
        getRecentViolations()
      ]);
      
      setCameras(camerasData);
      setViolations(violationsData);
      
      if (camerasData.length > 0) {
        setSelectedCamera(camerasData[0]);
      }
      
      // Calculate stats
      const activeCameras = camerasData.filter(c => c.isActive).length;
      const activeViolations = violationsData.filter(v => v.status === "pending").length;
      const totalWorkers = new Set(violationsData.map(v => v.workerId)).size;
      const complianceRate = totalWorkers > 0 ? Math.round(((totalWorkers - activeViolations) / totalWorkers) * 100) : 100;
      
      setStats({
        totalWorkers,
        activeViolations,
        complianceRate,
        activeCameras
      });
      
      // Show new violation alerts
      const newViolations = violationsData.filter(v => 
        new Date(v.timestamp) > new Date(Date.now() - 30000) && v.status === "pending"
      );
      setActiveAlerts(newViolations);
      
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load monitoring data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleCloseAlert = (violationId) => {
    setActiveAlerts(prev => prev.filter(alert => alert.Id !== violationId));
  };

  const handleViewViolationDetails = (violation) => {
    // Would navigate to violation details in a real app
    toast.info(`Viewing details for violation by ${violation.worker.fullName}`);
  };

  // Simulate detection data for the selected camera
  const simulateDetections = () => {
    if (!selectedCamera) return [];
    
    const recentViolations = violations.filter(v => 
      v.cameraId === selectedCamera.Id && 
      new Date(v.timestamp) > new Date(Date.now() - 60000)
    );
    
    return recentViolations.map((violation, index) => ({
      x: 20 + (index * 30),
      y: 30 + (index * 20),
      width: 15,
      height: 25,
      worker: violation.worker,
      missingPPE: violation.missingPPE
    }));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Workers</p>
                <p className="text-2xl font-bold text-white">{stats.totalWorkers}</p>
              </div>
              <ApperIcon name="Users" className="text-success" size={32} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-error/10 to-error/5 border-error/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Violations</p>
                <p className="text-2xl font-bold text-white">{stats.activeViolations}</p>
              </div>
              <ApperIcon name="AlertTriangle" className="text-error" size={32} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Compliance Rate</p>
                <p className="text-2xl font-bold text-white">{stats.complianceRate}%</p>
              </div>
              <ApperIcon name="Shield" className="text-primary" size={32} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Cameras</p>
                <p className="text-2xl font-bold text-white">{stats.activeCameras}</p>
              </div>
              <ApperIcon name="Camera" className="text-info" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Feed */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ApperIcon name="Monitor" size={24} />
                  Live Camera Feed
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="success">LIVE</Badge>
                  <Button variant="outline" size="sm">
                    <ApperIcon name="Settings" size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedCamera ? (
                <LiveFeedViewer
                  camera={selectedCamera}
                  detections={simulateDetections()}
                />
              ) : (
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <ApperIcon name="CameraOff" size={48} className="text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500">No camera selected</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Camera List & Recent Violations */}
        <div className="space-y-6">
          {/* Camera List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Camera" size={20} />
                Camera Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {cameras.map((camera) => (
                <motion.div
                  key={camera.Id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={selectedCamera?.Id === camera.Id ? "primary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCamera(camera)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${camera.isActive ? 'bg-success' : 'bg-error'}`}></div>
                      <div className="text-left">
                        <div className="font-medium">{camera.name}</div>
                        <div className="text-xs text-gray-400">{camera.zone}</div>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Violations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="AlertTriangle" size={20} />
                Recent Violations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {violations.slice(0, 5).map((violation) => (
                  <div
                    key={violation.Id}
                    className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg"
                  >
                    <img
                      src={violation.worker.profilePicture}
                      alt={violation.worker.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white text-sm">
                        {violation.worker.fullName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {violation.missingPPE.join(", ")}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(violation.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Violation Alerts */}
      <AnimatePresence>
        {activeAlerts.map((alert) => (
          <ViolationAlert
            key={alert.Id}
            violation={alert}
            onClose={() => handleCloseAlert(alert.Id)}
            onViewDetails={() => handleViewViolationDetails(alert)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default LiveMonitor;