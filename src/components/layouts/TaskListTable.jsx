
import React from "react";
import moment from "moment";

const TaskListTable = ({ tableData = [] }) => {
  const getStatusBadgeColor = (status) => {
    const s = String(status || "").toLowerCase().replace(/\s+/g, "");
    switch (s) {
      case "completed":
        return "bg-green-100 text-green-600 border border-green-200";
      case "pending":
        return "bg-purple-100 text-purple-600 border border-purple-200";
      case "inprogress":
        return "bg-cyan-100 text-cyan-600 border border-cyan-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    const p = String(priority || "").toLowerCase();
    switch (p) {
      case "high":
        return "bg-red-100 text-red-600 border border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-600 border border-orange-200";
      case "low":
        return "bg-green-100 text-green-600 border border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    return moment(iso).format("DD MMM YYYY");
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg overflow-hidden">
        <thead className="bg-slate-50">
          <tr className="">
            <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
              Name
            </th>
            <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
              Status
            </th>
            <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
              Priority
            </th>
            <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
              Created On
            </th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(tableData) && tableData.length > 0 ? (
            tableData.map((task) => (
              <tr key={task?._id} className="border-t hover:bg-slate-50">
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-gray-800">
                    {task?.title || "Untitled Task"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(
                      task?.status
                    )}`}
                  >
                    {normalizeStatusLabel(task?.status)}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(
                      task?.priority
                    )}`}
                  >
                    {capitalize(task?.priority)}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span className="text-sm text-gray-700">
                    {formatDate(task?.createdAt)}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr className="border-t">
              <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-600">
                No recent tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

/* ---------- Helpers ---------- */
// const normalizeStatusLabel = (status) => {
//   if (!status) return "-";
//   const s = status.toLowerCase().replace(/\s+/g, "");
//   if (s === "inprogress") return "In Progress";
//   if (s === "pending") return "Pending";
//   if (s === "completed") return "Completed";
//   return capitalize(status);
// };

// const capitalize = (str) => {
//   if (!str) return "-";
//   const s = String(str);
//   return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
// };

export default TaskListTable;
