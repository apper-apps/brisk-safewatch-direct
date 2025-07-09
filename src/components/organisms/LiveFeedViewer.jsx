import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import PPEStatusIndicator from "@/components/molecules/PPEStatusIndicator";
import { cn } from "@/utils/cn";

const LiveFeedViewer = ({ camera, detections, className }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className={cn("relative", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">{camera.name}</CardTitle>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-success">LIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isRecording ? "danger" : "outline"}
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
              className="flex items-center gap-2"
            >
              <ApperIcon name={isRecording ? "Square" : "Circle"} size={16} />
              {isRecording ? formatTime(recordingTime) : "Record"}
            </Button>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Maximize" size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          {/* Simulated video feed */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="Camera" size={48} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500">Camera Feed: {camera.zone}</p>
            </div>
          </div>
          
          {/* Detection overlays */}
          {detections.map((detection, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute border-2 border-error rounded-lg bg-error/20 backdrop-blur-sm"
              style={{
                left: `${detection.x}%`,
                top: `${detection.y}%`,
                width: `${detection.width}%`,
                height: `${detection.height}%`
              }}
            >
              <div className="absolute -top-8 left-0 bg-error text-white px-2 py-1 rounded text-xs font-medium">
                {detection.worker.fullName}
              </div>
              <div className="absolute -bottom-10 left-0 flex gap-1">
                {detection.missingPPE.map((ppe) => (
                  <div
                    key={ppe}
                    className="bg-error text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                  >
                    <ApperIcon name="AlertTriangle" size={12} />
                    {ppe}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
          
          {/* PPE Status Panel */}
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3">
            <div className="text-xs text-gray-300 mb-2">PPE Detection Status</div>
            <div className="space-y-1">
              <PPEStatusIndicator ppeType="helmet" isDetected={true} />
              <PPEStatusIndicator ppeType="jacket" isDetected={false} />
              <PPEStatusIndicator ppeType="shoes" isDetected={true} />
            </div>
          </div>
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 right-4 bg-error/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">REC {formatTime(recordingTime)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveFeedViewer;