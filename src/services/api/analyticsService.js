import violationsData from "@/services/mockData/violations.json";
import workersData from "@/services/mockData/workers.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAnalyticsData = async (period = "week") => {
  await delay(400);
  
  const now = new Date();
  let cutoffDate = new Date();
  
  switch (period) {
    case "day":
      cutoffDate.setHours(0, 0, 0, 0);
      break;
    case "week":
      cutoffDate.setDate(now.getDate() - 7);
      break;
    case "month":
      cutoffDate.setMonth(now.getMonth() - 1);
      break;
    case "year":
      cutoffDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      cutoffDate.setDate(now.getDate() - 7);
  }
  
  const filteredViolations = violationsData.filter(v => 
    new Date(v.timestamp) >= cutoffDate
  );
  
  const totalViolations = filteredViolations.length;
  const totalWorkers = workersData.length;
  const overallCompliance = Math.round(((totalWorkers - totalViolations) / totalWorkers) * 100);
  const avgResolutionTime = 4.2;
  const totalFines = filteredViolations.reduce((sum, v) => sum + v.fineAmount, 0);
  
  // PPE Breakdown
  const ppeBreakdown = [
    { type: "Safety Helmet", count: 45, percentage: 52, color: "bg-error" },
    { type: "Safety Jacket", count: 28, percentage: 32, color: "bg-warning" },
    { type: "Safety Shoes", count: 14, percentage: 16, color: "bg-info" }
  ];
  
  // Top Violators
  const violatorCounts = {};
  filteredViolations.forEach(v => {
    violatorCounts[v.workerId] = (violatorCounts[v.workerId] || 0) + 1;
  });
  
  const topViolators = Object.entries(violatorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([workerId, count]) => ({
      ...workersData.find(w => w.Id === parseInt(workerId)),
      violationCount: count
    }));
  
  // Department Compliance
  const departments = [...new Set(workersData.map(w => w.department))];
  const departmentCompliance = departments.map(dept => {
    const deptWorkers = workersData.filter(w => w.department === dept);
    const deptViolations = filteredViolations.filter(v => 
      deptWorkers.some(w => w.Id === v.workerId)
    );
    const compliance = Math.round(((deptWorkers.length - deptViolations.length) / deptWorkers.length) * 100);
    
    return {
      name: dept,
      totalWorkers: deptWorkers.length,
      violations: deptViolations.length,
      compliance: compliance
    };
  });
  
  return {
    overallCompliance,
    totalViolations,
    avgResolutionTime,
    totalFines,
    ppeBreakdown,
    topViolators,
    departmentCompliance,
    positiveTrends: [
      "Helmet compliance increased by 15% this month",
      "Average violation resolution time decreased by 30 minutes",
      "Construction department achieved 95% compliance rate"
    ],
    improvementAreas: [
      "Safety jacket violations increased by 8% in Zone A",
      "Weekend shifts showing lower compliance rates",
      "New employee orientation needs PPE emphasis"
    ]
  };
};