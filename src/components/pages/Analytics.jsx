import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getAnalyticsData } from "@/services/api/analyticsService";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnalyticsData(selectedPeriod);
      setAnalyticsData(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const periodOptions = [
    { value: "day", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAnalytics} />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400">
            Safety compliance trends and violation statistics
          </p>
        </div>
        <FilterDropdown
          label="Period"
          options={periodOptions}
          value={selectedPeriod}
          onChange={setSelectedPeriod}
        />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Compliance Rate</p>
                <p className="text-3xl font-bold text-white">{analyticsData.overallCompliance}%</p>
                <p className="text-sm text-success">+2.3% from last period</p>
              </div>
              <ApperIcon name="TrendingUp" className="text-success" size={32} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-error/10 to-error/5 border-error/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Violations</p>
                <p className="text-3xl font-bold text-white">{analyticsData.totalViolations}</p>
                <p className="text-sm text-error">+5 from last period</p>
              </div>
              <ApperIcon name="AlertTriangle" className="text-error" size={32} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Resolution Time</p>
                <p className="text-3xl font-bold text-white">{analyticsData.avgResolutionTime}h</p>
                <p className="text-sm text-warning">-0.5h from last period</p>
              </div>
              <ApperIcon name="Clock" className="text-warning" size={32} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Fines</p>
                <p className="text-3xl font-bold text-white">${analyticsData.totalFines}</p>
                <p className="text-sm text-info">+$125 from last period</p>
              </div>
              <ApperIcon name="DollarSign" className="text-info" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PPE Violation Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="PieChart" size={20} />
              PPE Violation Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.ppeBreakdown.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                    <span className="text-white">{item.type}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-semibold">{item.count}</span>
                    <span className="text-gray-400 ml-2">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Violators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Users" size={20} />
              Top Violators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topViolators.map((worker, index) => (
                <div key={worker.Id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center">
                    <span className="text-error font-bold">{index + 1}</span>
                  </div>
                  <img
                    src={worker.profilePicture}
                    alt={worker.fullName}
                    className="w-10 h-10 rounded-full border-2 border-gray-600"
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium">{worker.fullName}</div>
                    <div className="text-sm text-gray-400">{worker.department}</div>
                  </div>
                  <Badge variant="error">{worker.violationCount} violations</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance by Department */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Building" size={20} />
            Compliance by Department
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.departmentCompliance.map((dept) => (
              <Card key={dept.name} className="bg-gray-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{dept.name}</h3>
                    <Badge variant={dept.compliance >= 90 ? "success" : dept.compliance >= 70 ? "warning" : "error"}>
                      {dept.compliance}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Workers:</span>
                      <span className="text-white">{dept.totalWorkers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Violations:</span>
                      <span className="text-white">{dept.violations}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          dept.compliance >= 90 ? "bg-success" : 
                          dept.compliance >= 70 ? "bg-warning" : "bg-error"
                        }`}
                        style={{ width: `${dept.compliance}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="TrendingUp" size={20} />
            Recent Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3">Positive Trends</h4>
              <div className="space-y-2">
                {analyticsData.positiveTrends.map((trend, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ApperIcon name="TrendingUp" size={16} className="text-success" />
                    <span className="text-sm text-gray-300">{trend}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Areas for Improvement</h4>
              <div className="space-y-2">
                {analyticsData.improvementAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ApperIcon name="TrendingDown" size={16} className="text-error" />
                    <span className="text-sm text-gray-300">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;