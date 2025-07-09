const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let ppeConfig = [
  {
    type: "helmet",
    fineAmount: 50,
    isMandatory: true,
    detectionThreshold: 0.85
  },
  {
    type: "jacket",
    fineAmount: 35,
    isMandatory: true,
    detectionThreshold: 0.80
  },
  {
    type: "shoes",
    fineAmount: 25,
    isMandatory: true,
    detectionThreshold: 0.75
  }
];

export const getPPEConfig = async () => {
  await delay(300);
  return [...ppeConfig];
};

export const updatePPEConfig = async (ppeType, updates) => {
  await delay(250);
  const index = ppeConfig.findIndex(config => config.type === ppeType);
  if (index === -1) throw new Error("PPE type not found");
  
  ppeConfig[index] = { ...ppeConfig[index], ...updates };
  return ppeConfig[index];
};

export const getSystemSettings = async () => {
  await delay(200);
  return {
    detectionInterval: 5,
    alertTimeout: 30,
    videoQuality: "high",
    storageRetention: 30,
    emailNotifications: true,
    smsAlerts: true,
    pushNotifications: true
  };
};

export const updateSystemSettings = async (settings) => {
  await delay(300);
  // In a real app, this would update the database
  return settings;
};