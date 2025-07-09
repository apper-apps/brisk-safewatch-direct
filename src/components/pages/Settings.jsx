import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getCameras, updateCamera } from "@/services/api/cameraService";
import { getPPEConfig, updatePPEConfig } from "@/services/api/settingsService";

const Settings = () => {
  const [cameras, setCameras] = useState([]);
  const [ppeConfig, setPPEConfig] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("cameras");

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const [camerasData, ppeConfigData] = await Promise.all([
        getCameras(),
        getPPEConfig()
      ]);
      setCameras(camerasData);
      setPPEConfig(ppeConfigData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleCameraToggle = async (cameraId) => {
    try {
      const camera = cameras.find(c => c.Id === cameraId);
      const updatedCamera = { ...camera, isActive: !camera.isActive };
      await updateCamera(cameraId, updatedCamera);
      setCameras(prev => prev.map(c => 
        c.Id === cameraId ? updatedCamera : c
      ));
      toast.success(`Camera ${updatedCamera.isActive ? 'enabled' : 'disabled'} successfully`);
    } catch (err) {
      toast.error("Failed to update camera status");
    }
  };

  const handlePPEConfigUpdate = async (ppeType, field, value) => {
    try {
      const updatedConfig = ppeConfig.map(config =>
        config.type === ppeType ? { ...config, [field]: value } : config
      );
      await updatePPEConfig(ppeType, { [field]: value });
      setPPEConfig(updatedConfig);
      toast.success("PPE configuration updated successfully");
    } catch (err) {
      toast.error("Failed to update PPE configuration");
    }
  };

  const tabs = [
    { id: "cameras", label: "Cameras", icon: "Camera" },
    { id: "ppe", label: "PPE Settings", icon: "Shield" },
    { id: "system", label: "System", icon: "Settings" }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSettings} />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Configure system settings and monitoring parameters</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            <ApperIcon name={tab.icon} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Camera Settings */}
      {activeTab === "cameras" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Camera" size={20} />
                Camera Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cameras.map((camera) => (
                  <div key={camera.Id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${camera.isActive ? 'bg-success' : 'bg-error'}`}></div>
                      <div>
                        <h3 className="font-semibold text-white">{camera.name}</h3>
                        <p className="text-sm text-gray-400">{camera.zone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={camera.isActive ? "success" : "error"}>
                        {camera.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button
                        variant={camera.isActive ? "danger" : "success"}
                        size="sm"
                        onClick={() => handleCameraToggle(camera.Id)}
                      >
                        {camera.isActive ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Plus" size={20} />
                Add New Camera
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Camera Name"
                  placeholder="Enter camera name"
                />
                <FormField
                  label="Zone"
                  placeholder="Enter zone name"
                />
                <FormField
                  label="Stream URL"
                  placeholder="Enter stream URL"
                  className="md:col-span-2"
                />
              </div>
              <div className="mt-4">
                <Button variant="primary">
                  <ApperIcon name="Plus" size={16} />
                  Add Camera
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PPE Settings */}
      {activeTab === "ppe" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Shield" size={20} />
                PPE Detection Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {ppeConfig.map((config) => (
                  <div key={config.type} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white capitalize">{config.type}</h3>
                      <Badge variant={config.isMandatory ? "success" : "warning"}>
                        {config.isMandatory ? "Mandatory" : "Optional"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        label="Fine Amount ($)"
                        type="number"
                        value={config.fineAmount}
                        onChange={(e) => handlePPEConfigUpdate(config.type, "fineAmount", Number(e.target.value))}
                      />
                      <FormField
                        label="Detection Threshold (%)"
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(config.detectionThreshold * 100)}
                        onChange={(e) => handlePPEConfigUpdate(config.type, "detectionThreshold", Number(e.target.value) / 100)}
                      />
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 block">Enforcement</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={config.isMandatory}
                            onChange={(e) => handlePPEConfigUpdate(config.type, "isMandatory", e.target.checked)}
                            className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary"
                          />
                          <span className="text-sm text-gray-300">Mandatory</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Settings */}
      {activeTab === "system" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Settings" size={20} />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Detection Interval (seconds)"
                    type="number"
                    defaultValue="5"
                    min="1"
                    max="60"
                  />
                  <FormField
                    label="Alert Timeout (seconds)"
                    type="number"
                    defaultValue="30"
                    min="10"
                    max="300"
                  />
                  <FormField
                    label="Video Quality"
                    type="select"
                    defaultValue="high"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </FormField>
                  <FormField
                    label="Storage Retention (days)"
                    type="number"
                    defaultValue="30"
                    min="1"
                    max="365"
                  />
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Notification Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-300">Email notifications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-300">SMS alerts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-300">Push notifications</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Database" size={20} />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-white">Export Data</h4>
                    <p className="text-sm text-gray-400">Export all violation data and reports</p>
                  </div>
                  <Button variant="outline">
                    <ApperIcon name="Download" size={16} />
                    Export
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-white">Backup Database</h4>
                    <p className="text-sm text-gray-400">Create a backup of all system data</p>
                  </div>
                  <Button variant="outline">
                    <ApperIcon name="Archive" size={16} />
                    Backup
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-800">
                  <div>
                    <h4 className="font-semibold text-white">Clear All Data</h4>
                    <p className="text-sm text-gray-400">Permanently delete all violation records</p>
                  </div>
                  <Button variant="danger">
                    <ApperIcon name="Trash2" size={16} />
                    Clear Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Settings;