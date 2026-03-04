import React from "react";
import { Linkedin, LayoutDashboard, Zap, CheckSquare, FolderKanban, Activity } from "lucide-react";
import type { TabId } from "./profileData";
import { PROFILE_USER } from "./profileData";

interface ProfileHeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={14} /> },
  { id: "skills", label: "Skills", icon: <Zap size={14} /> },
  { id: "tasks", label: "Tasks", icon: <CheckSquare size={14} /> },
  { id: "projects", label: "Projects", icon: <FolderKanban size={14} /> },
  { id: "activity", label: "Activity", icon: <Activity size={14} /> },
];

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ activeTab, onTabChange }) => {
  const u = PROFILE_USER;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Hero strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 pt-5 pb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${u.avatarBg} flex items-center justify-center text-white text-xl font-bold shrink-0 ring-4 ring-indigo-100`}
          >
            {u.avatar}
          </div>

          {/* Name / role */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
              {u.name}{" "}
              <span className="text-gray-400 font-normal text-base">({u.age})</span>
            </h2>
            <p className="text-sm text-gray-500">
              {u.company} · {u.jobTitle}
            </p>
          </div>
        </div>

        {/* LinkedIn button */}
        <a
          href={u.linkedIn}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm self-start sm:self-auto whitespace-nowrap"
        >
          <Linkedin size={15} />
          LinkedIn Account
        </a>
      </div>

      {/* Tabs */}
      <div className="px-3 pb-0 border-t border-gray-100">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-150 ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
