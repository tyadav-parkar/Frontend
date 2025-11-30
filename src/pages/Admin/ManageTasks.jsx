import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import TaskStatusTabs from "../../components/layouts/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // FIXED: Convert to lowercase for backend
      let statusParam = "";
      if (filterStatus !== "All") {
        statusParam = filterStatus.toLowerCase();
      }

      console.log("Fetching tasks with status:", statusParam); // DEBUG

      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: statusParam,
        },
      });

      console.log("Tasks response:", response.data); // DEBUG

      setAllTasks(response.data?.tasks || []);

      const statusSummary = response.data?.statusSummary || {};
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];

      console.log("Status tabs:", statusArray); // DEBUG
      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError(error?.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, [filterStatus]);

  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-2xl font-medium">Manage Tasks</h2>
          </div>

          {/* Show tabs if there are any tasks */}
          {tabs.length > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-500">Loading tasks...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg my-4">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && allTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-lg mb-2">
                {filterStatus === "All"
                  ? "No tasks found"
                  : `No ${filterStatus.toLowerCase()} tasks`}
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Get started by creating your first task
              </p>
              <button
                onClick={() => navigate("/admin/create-task")}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Create Task
              </button>
            </div>
          </div>
        )}

        {/* Tasks Grid */}
        {!loading && !error && allTasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {allTasks.map((item) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map((user) => user.profileImageUrl)}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoChecklist={item.todoChecklist || []}
                onClick={() => handleClick(item)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;