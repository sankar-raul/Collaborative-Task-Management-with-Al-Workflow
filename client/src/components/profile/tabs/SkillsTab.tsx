import React from "react";
import { SKILLS, SKILL_LEVEL_COLOR } from "../profileData";

const SkillsTab: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-5">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-700">Skills</h3>
      <button className="flex items-center gap-1 text-xs text-indigo-500 font-medium hover:text-indigo-700 transition-colors">
        ✏️ Edit
      </button>
    </div>

    {/* Skills list */}
    <ul className="flex flex-col gap-5">
      {SKILLS.map((skill) => (
        <li key={skill.name} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-800">{skill.name}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${SKILL_LEVEL_COLOR[skill.level]}`}
              >
                {skill.level}
              </span>
            </div>
            <span className="text-xs text-gray-400 font-medium">{skill.pct}%</span>
          </div>
          {/* Bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${skill.pct}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default SkillsTab;
