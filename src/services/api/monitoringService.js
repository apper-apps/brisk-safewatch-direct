import camerasData from "@/services/mockData/cameras.json";
import violationsData from "@/services/mockData/violations.json";
import workersData from "@/services/mockData/workers.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getCameras = async () => {
  await delay(300);
  return camerasData.map(camera => ({
    ...camera,
    isActive: Math.random() > 0.2 // 80% active cameras
  }));
};

export const getRecentViolations = async () => {
  await delay(250);
  
  // Add worker data to violations
  const violationsWithWorkers = violationsData.map(violation => ({
    ...violation,
    worker: workersData.find(worker => worker.Id === violation.workerId)
  }));

  // Sort by timestamp (most recent first)
  return violationsWithWorkers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const getLiveDetections = async (cameraId) => {
  await delay(200);
  
  // Simulate live detection data
  const recentViolations = violationsData.filter(v => 
    v.cameraId === cameraId && 
    new Date(v.timestamp) > new Date(Date.now() - 60000)
  );

  return recentViolations.map((violation, index) => ({
    x: 20 + (index * 30),
    y: 30 + (index * 20),
    width: 15,
    height: 25,
    worker: workersData.find(w => w.Id === violation.workerId),
    missingPPE: violation.missingPPE
  }));
};