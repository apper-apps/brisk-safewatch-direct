import camerasData from "@/services/mockData/cameras.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let cameras = [...camerasData];

export const getCameras = async () => {
  await delay(300);
  return [...cameras];
};

export const getCameraById = async (id) => {
  await delay(200);
  const camera = cameras.find(c => c.Id === id);
  if (!camera) throw new Error("Camera not found");
  return camera;
};

export const createCamera = async (data) => {
  await delay(300);
  const newCamera = {
    ...data,
    Id: Math.max(...cameras.map(c => c.Id)) + 1,
    isActive: true
  };
  
  cameras.push(newCamera);
  return newCamera;
};

export const updateCamera = async (id, data) => {
  await delay(250);
  const index = cameras.findIndex(c => c.Id === id);
  if (index === -1) throw new Error("Camera not found");
  
  cameras[index] = { ...cameras[index], ...data };
  return cameras[index];
};

export const deleteCamera = async (id) => {
  await delay(200);
  const index = cameras.findIndex(c => c.Id === id);
  if (index === -1) throw new Error("Camera not found");
  
  cameras.splice(index, 1);
  return true;
};