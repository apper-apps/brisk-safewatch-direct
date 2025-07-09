import workersData from "@/services/mockData/workers.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let workers = [...workersData];

export const getAllWorkers = async () => {
  await delay(300);
  return [...workers];
};

export const getWorkerById = async (id) => {
  await delay(200);
  const worker = workers.find(w => w.Id === id);
  if (!worker) throw new Error("Worker not found");
  return worker;
};

export const createWorker = async (data) => {
  await delay(300);
  const newWorker = {
    ...data,
    Id: Math.max(...workers.map(w => w.Id)) + 1,
    createdAt: new Date().toISOString()
  };
  
  workers.push(newWorker);
  return newWorker;
};

export const updateWorker = async (id, data) => {
  await delay(250);
  const index = workers.findIndex(w => w.Id === id);
  if (index === -1) throw new Error("Worker not found");
  
  workers[index] = { ...workers[index], ...data };
  return workers[index];
};

export const deleteWorker = async (id) => {
  await delay(200);
  const index = workers.findIndex(w => w.Id === id);
  if (index === -1) throw new Error("Worker not found");
  
  workers.splice(index, 1);
  return true;
};