import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import FormField from "@/components/molecules/FormField";
import WorkerProfiles from "@/components/organisms/WorkerProfiles";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { getAllWorkers, createWorker, updateWorker, deleteWorker } from "@/services/api/workerService";

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    employeeId: "",
    department: "",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  });

  const loadWorkers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllWorkers();
      setWorkers(data);
      setFilteredWorkers(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load workers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = workers.filter(worker =>
        worker.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWorkers(filtered);
    } else {
      setFilteredWorkers(workers);
    }
  }, [workers, searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWorker) {
        await updateWorker(editingWorker.Id, formData);
        setWorkers(prev => prev.map(worker => 
          worker.Id === editingWorker.Id ? { ...worker, ...formData } : worker
        ));
        toast.success("Worker updated successfully");
        setEditingWorker(null);
      } else {
        const newWorker = await createWorker(formData);
        setWorkers(prev => [...prev, newWorker]);
        toast.success("Worker added successfully");
      }
      
      setFormData({
        fullName: "",
        username: "",
        employeeId: "",
        department: "",
        profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      });
      setShowAddForm(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (worker) => {
    setEditingWorker(worker);
    setFormData({
      fullName: worker.fullName,
      username: worker.username,
      employeeId: worker.employeeId,
      department: worker.department,
      profilePicture: worker.profilePicture
    });
    setShowAddForm(true);
  };

  const handleDelete = async (workerId) => {
    if (window.confirm("Are you sure you want to delete this worker?")) {
      try {
        await deleteWorker(workerId);
        setWorkers(prev => prev.filter(worker => worker.Id !== workerId));
        toast.success("Worker deleted successfully");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingWorker(null);
    setFormData({
      fullName: "",
      username: "",
      employeeId: "",
      department: "",
      profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    });
  };

  if (loading) return <Loading variant="cards" />;
  if (error) return <Error message={error} onRetry={loadWorkers} />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Workers</h1>
          <p className="text-gray-400">
            Manage worker profiles and safety compliance
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
        >
          <ApperIcon name="Plus" size={16} />
          Add Worker
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workers by name, username, ID, or department..."
          />
        </div>
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Workers</p>
                <p className="text-2xl font-bold text-white">{workers.length}</p>
              </div>
              <ApperIcon name="Users" className="text-primary" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Worker Form */}
      {showAddForm && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name={editingWorker ? "Edit" : "Plus"} size={20} />
              {editingWorker ? "Edit Worker" : "Add New Worker"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
                <FormField
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
                <FormField
                  label="Employee ID"
                  value={formData.employeeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                  required
                />
                <FormField
                  label="Department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  required
                />
              </div>
              <FormField
                label="Profile Picture URL"
                value={formData.profilePicture}
                onChange={(e) => setFormData(prev => ({ ...prev, profilePicture: e.target.value }))}
                placeholder="https://example.com/photo.jpg"
              />
              <div className="flex items-center gap-2">
                <Button type="submit" variant="primary">
                  {editingWorker ? "Update Worker" : "Add Worker"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Workers List */}
      <Card>
        <CardContent className="p-6">
          {filteredWorkers.length === 0 ? (
            workers.length === 0 ? (
              <Empty
                title="No workers found"
                description="Start by adding worker profiles to monitor their safety compliance."
                icon="Users"
                actionLabel="Add Worker"
                onAction={() => setShowAddForm(true)}
              />
            ) : (
              <Empty
                title="No workers match your search"
                description="Try adjusting your search criteria."
                icon="Search"
                actionLabel="Clear Search"
                onAction={() => setSearchQuery("")}
              />
            )
          ) : (
            <WorkerProfiles
              workers={filteredWorkers}
              onEditWorker={handleEdit}
              onDeleteWorker={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Workers;