import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import ViolationsList from "@/components/organisms/ViolationsList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { getAllViolations } from "@/services/api/violationService";

const Violations = () => {
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPPE, setSelectedPPE] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateRange, setDateRange] = useState("all");

  const loadViolations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllViolations();
      setViolations(data);
      setFilteredViolations(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load violations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadViolations();
  }, []);

  useEffect(() => {
    let filtered = violations;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(violation =>
        violation.worker.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        violation.worker.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // PPE filter
    if (selectedPPE) {
      filtered = filtered.filter(violation =>
        violation.missingPPE.includes(selectedPPE)
      );
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(violation =>
        violation.status === selectedStatus
      );
    }

    // Date range filter
    if (dateRange !== "all") {
      const now = new Date();
      const cutoff = new Date();
      
      switch (dateRange) {
        case "today":
          cutoff.setHours(0, 0, 0, 0);
          break;
        case "week":
          cutoff.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoff.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(violation =>
        new Date(violation.timestamp) >= cutoff
      );
    }

    setFilteredViolations(filtered);
  }, [violations, searchQuery, selectedPPE, selectedStatus, dateRange]);

  const handleViewDetails = (violation) => {
    toast.info(`Viewing details for violation by ${violation.worker.fullName}`);
  };

  const handleExport = () => {
    toast.success("Violations exported successfully");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPPE("");
    setSelectedStatus("");
    setDateRange("all");
  };

  const ppeOptions = [
    { value: "helmet", label: "Helmet" },
    { value: "jacket", label: "Safety Jacket" },
    { value: "shoes", label: "Safety Shoes" }
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "resolved", label: "Resolved" }
  ];

  const dateOptions = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" }
  ];

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadViolations} />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Violations</h1>
          <p className="text-gray-400">
            Showing {filteredViolations.length} of {violations.length} violations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <ApperIcon name="Download" size={16} />
            Export
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            <ApperIcon name="X" size={16} />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Filter" size={20} />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by worker name or ID..."
              className="lg:col-span-2"
            />
            <FilterDropdown
              label="PPE Type"
              options={ppeOptions}
              value={selectedPPE}
              onChange={setSelectedPPE}
            />
            <FilterDropdown
              label="Status"
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
            />
            <FilterDropdown
              label="Date Range"
              options={dateOptions}
              value={dateRange}
              onChange={setDateRange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-error/10 to-error/5 border-error/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Violations</p>
                <p className="text-xl font-bold text-white">{violations.length}</p>
              </div>
              <ApperIcon name="AlertTriangle" className="text-error" size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-xl font-bold text-white">
                  {violations.filter(v => v.status === "pending").length}
                </p>
              </div>
              <ApperIcon name="Clock" className="text-warning" size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Resolved</p>
                <p className="text-xl font-bold text-white">
                  {violations.filter(v => v.status === "resolved").length}
                </p>
              </div>
              <ApperIcon name="CheckCircle" className="text-success" size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Fines</p>
                <p className="text-xl font-bold text-white">
                  ${violations.reduce((sum, v) => sum + v.fineAmount, 0)}
                </p>
              </div>
              <ApperIcon name="DollarSign" className="text-info" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Violations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="List" size={20} />
            Violations List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredViolations.length === 0 ? (
            violations.length === 0 ? (
              <Empty
                title="No violations found"
                description="Great! All workers are compliant with PPE requirements."
                icon="CheckCircle"
              />
            ) : (
              <Empty
                title="No violations match your filters"
                description="Try adjusting your search criteria or clearing filters."
                icon="Search"
                actionLabel="Clear Filters"
                onAction={clearFilters}
              />
            )
          ) : (
            <ViolationsList
              violations={filteredViolations}
              onViewDetails={handleViewDetails}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Violations;