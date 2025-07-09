import violationsData from "@/services/mockData/violations.json";
import workersData from "@/services/mockData/workers.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let violations = [...violationsData];

export const getAllViolations = async () => {
  await delay(300);
  
  // Add worker data to violations
  const violationsWithWorkers = violations.map(violation => ({
    ...violation,
    worker: workersData.find(worker => worker.Id === violation.workerId)
  }));

  // Sort by timestamp (most recent first)
  return violationsWithWorkers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const getViolationById = async (id) => {
  await delay(200);
  const violation = violations.find(v => v.Id === id);
  if (!violation) throw new Error("Violation not found");
  
  return {
    ...violation,
    worker: workersData.find(worker => worker.Id === violation.workerId)
  };
};

export const updateViolation = async (id, data) => {
  await delay(250);
  const index = violations.findIndex(v => v.Id === id);
  if (index === -1) throw new Error("Violation not found");
  
  violations[index] = { ...violations[index], ...data };
  return violations[index];
};

export const deleteViolation = async (id) => {
  await delay(200);
  const index = violations.findIndex(v => v.Id === id);
  if (index === -1) throw new Error("Violation not found");
  
  violations.splice(index, 1);
  return true;
};

export const createViolation = async (data) => {
  await delay(300);
  const newViolation = {
    ...data,
    Id: Math.max(...violations.map(v => v.Id)) + 1,
    timestamp: new Date().toISOString()
  };
  
  violations.push(newViolation);
  return newViolation;
};