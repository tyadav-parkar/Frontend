import React from "react";
import Progress from "../layouts/Progress";
import AvatarGroup from "../layouts/AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
}) => {
  const getStatusTagColor = (status) => {
    switch (status) {
      case "in progress":
        return "text-cyan-600 bg-cyan-50 border border-cyan-200";
      case "completed":
        return "text-lime-600 bg-lime-50 border border-lime-200";
      default:
        return "text-violet-600 bg-violet-50 border border-violet-200";
    }
  };

  const getPriorityTagColor = (priority) => {
    switch (priority) {
      case "low":
        return "text-emerald-600 bg-emerald-50 border border-emerald-200";
      case "medium":
        return "text-amber-600 bg-amber-50 border border-amber-200";
      default:
        return "text-rose-600 bg-rose-50 border border-rose-200";
    }
  };

  const getCardBorderColor = (status) => {
    switch (status) {
      case "in progress":
        return "border-cyan-500";
      case "completed":
        return "border-lime-500";
      default:
        return "border-violet-500";
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Header - Tags */}
      <div className="flex items-center gap-2 p-4 pb-3">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor(status)} px-3 py-1 rounded-full capitalize`}
        >
          {status}
        </div>

        <div
          className={`text-[11px] font-medium ${getPriorityTagColor(priority)} px-3 py-1 rounded-full capitalize`}
        >
          {priority} Priority
        </div>
      </div>

      {/* Main Content - With colored left border */}
      <div
        className={`px-4 pb-4 pt-2 border-l-4 ${getCardBorderColor(status)} mx-4 mb-4`}
      >
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {description}
        </p>

        {/* Task Done Count */}
        <p className="text-xs text-gray-500 mb-3">
          Task Done:{" "}
          <span className="font-semibold text-gray-700">
            {completedTodoCount} / {todoChecklist?.length || 0}
          </span>
        </p>

        {/* Progress Bar */}
        <Progress progress={progress} status={status} />
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-3 border-t border-gray-100">
        {/* Dates */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <label className="text-[10px] text-gray-500 uppercase tracking-wide">
              Start Date
            </label>
            <p className="text-xs font-medium text-gray-700 mt-0.5">
              {moment(createdAt).format("Do MMM YYYY")}
            </p>
          </div>

          <div className="flex-1 text-right">
            <label className="text-[10px] text-gray-500 uppercase tracking-wide">
              Due Date
            </label>
            <p className="text-xs font-medium text-gray-700 mt-0.5">
              {moment(dueDate).format("Do MMM YYYY")}
            </p>
          </div>
        </div>

        {/* Avatars and Attachments */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <AvatarGroup avatars={assignedTo || []} maxVisible={4} />
          </div>

          {attachmentCount > 0 && (
            <div className="flex items-center gap-1.5 text-gray-500">
              <LuPaperclip className="text-base" />
              <span className="text-xs font-medium">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;