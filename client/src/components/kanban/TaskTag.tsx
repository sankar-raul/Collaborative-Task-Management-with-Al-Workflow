import React from "react";
import type { TagColor } from "./kanbanData";

interface TaskTagProps {
  label: string;
  color: TagColor;
}

const COLOR_MAP: Record<TagColor, string> = {
  purple: "bg-purple-100 text-purple-700",
  teal: "bg-teal-100 text-teal-700",
  blue: "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-700",
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  pink: "bg-pink-100 text-pink-700",
  indigo: "bg-indigo-100 text-indigo-700",
  red: "bg-red-100 text-red-700",
};

const TaskTag: React.FC<TaskTagProps> = ({ label, color }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${COLOR_MAP[color]}`}
  >
    {label}
  </span>
);

export default TaskTag;
