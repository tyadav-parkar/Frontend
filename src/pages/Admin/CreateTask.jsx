import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import SelectUsers from "../../components/Inputs/SelectUsers";
import Modal from "../../components/layouts/Modal";
import DeleteAlert from "../../components/Cards/DeleteAlert";
const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  const createTask = async () => {
    setLoading(true);

    try {
      const todoList = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });

      toast.success("Task Created Successfully");
      clearData();
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Error Creating task:", error);
      toast.error(error?.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  // Update Task
  const updateTask = async () => {
    setLoading(true);

    try {
      // Build todo list payload using current task's checklist to retain `completed` flags
      const todolist =
        taskData.todoChecklist?.map((item) => {
          const prevTodoChecklist = currentTask?.todoChecklist || [];
          const matchedTask = prevTodoChecklist.find(
            (task) => task.text === item
          );
          return {
            text: item,
            completed: matchedTask ? matchedTask.completed : false,
          };
        }) || [];

      const payload = {
        ...taskData,
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString()
          : null,
        todoChecklist: todolist,
      };

      // API call
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        payload
      );

      // Success toast
      toast.success("Task Updated Successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!taskData.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!taskData.description.trim()) {
      setError("Description is required.");
      return;
    }

    if (!taskData.dueDate) {
      setError("Due date is required.");
      return;
    }

    if (taskData.assignedTo?.length === 0) {
      setError("Task not assigned to any member");
      return;
    }

    if (taskData.todoChecklist?.length === 0) {
      setError("Add at least one todo task");
      return;
    }

    if (taskId) {
      updateTask();
      return;
    }

    createTask();
  };

  // Get Task info by ID
  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (response.data) {
        const taskInfo = response.data;

        setCurrentTask(taskInfo);

        setTaskData((prevState) => ({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist:
            taskInfo?.todoChecklist?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
        }));
      }
    } catch (error) {
      console.error("Failed to fetch task details:", error);
    }
  };

  // Delete Task
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      setOpenDeleteAlert(false);
      toast.success("Task deleted successfully");
      navigate("/admin/tasks");
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error?.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID(taskId);
    }
  }, [taskId]);
  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="form-card col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="w-5 h-5" /> Delete
                </button>
              )}
            </div>

            {/* Form starts here */}
            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Task Title
                </label>
                <input
                  placeholder="Create App UI"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={taskData.title}
                  onChange={({ target }) =>
                    handleValueChange("title", target.value)
                  }
                />
              </div>

              {/* Description Input */}
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600">
                  Description
                </label>
                <textarea
                  placeholder="Describe task"
                  className="form-input w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  value={taskData.description}
                  onChange={({ target }) =>
                    handleValueChange("description", target.value)
                  }
                />
              </div>

              {/* TODO Checklist Input */}
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600">
                  TODO Checklist
                </label>
                <TodoListInput
                  todoList={taskData?.todoChecklist}
                  setTodoList={(value) =>
                    handleValueChange("todoChecklist", value)
                  }
                />
              </div>

              {/* Add Attachments Input */}
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600">
                  Add Attachments
                </label>
                <AddAttachmentsInput
                  attachments={taskData?.attachments}
                  setAttachments={(value) =>
                    handleValueChange("attachments", value)
                  }
                />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-2">
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Priority
                  </label>
                  <SelectDropdown
                    options={PRIORITY_DATA}
                    value={taskData.priority}
                    onChange={(value) => handleValueChange("priority", value)}
                    placeholder="Select Priority"
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <div>
                    <label className="text-xs font-medium text-slate-600">
                      Due Date
                    </label>
                    <input
                      placeholder="Select date"
                      className="form-input"
                      value={taskData.dueDate}
                      onChange={({ target }) =>
                        handleValueChange("dueDate", target.value)
                      }
                      type="date"
                    />
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Assign To
                  </label>
                  <SelectUsers
                    selectedUsers={taskData.assignedTo}
                    setSelectedUsers={(value) => {
                      handleValueChange("assignedTo", value);
                    }}
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
              )}

              <div className="flex justify-end mt-7">
                <button
                  className="add-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading
                    ? "PROCESSING..."
                    : taskId
                    ? "UPDATE TASK"
                    : "CREATE TASK"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={openDeleteAlert}
        onClose={()=> setOpenDeleteAlert(false)}
        title="Delete Task">
          <DeleteAlert 
            content="Are you sure you want to delete this task?"
            onDelete={()=>deleteTask()}
          />
        </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
