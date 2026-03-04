import React from "react";
import { PROJECT_MEMBERSHIPS } from "../profileData";
import { TrendingUp } from "lucide-react";

interface MiniBarProps {
  pct: number;
  color: string;
}
const MiniBar: React.FC<MiniBarProps> = ({ pct, color }) => (
  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-500"
      style={{ width: `${pct}%`, background: color }}
    />
  </div>
);

const ProjectsTab: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-700">Project Membership</h3>
      <div className="flex items-center gap-2">
        <button className="text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors">✓</button>
        <button className="text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors">⌄</button>
      </div>
    </div>

    {/* Project cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {PROJECT_MEMBERSHIPS.map((p) => (
        <div
          key={p.id}
          className="flex flex-col gap-3 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: p.color }}
              />
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">{p.name}</p>
                <p className="text-xs text-gray-400">{p.role}</p>
              </div>
            </div>
            <div
              className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${p.color}20`, color: p.color }}
            >
              <TrendingUp size={11} />
              {p.pct}%
            </div>
          </div>

          <MiniBar pct={p.pct ?? 0} color={p.color} />

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Tasks · {p.taskCount}</span>
            <span className="font-medium" style={{ color: p.color }}>{p.pct}% complete</span>
          </div>
        </div>
      ))}
    </div>

    {/* Yearly completions bar chart (CSS) */}
    <div className="mt-2 p-4 rounded-xl border border-gray-100 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700">Tasks Completed</p>
          <p className="text-xs text-gray-400">2020 → 2026</p>
        </div>
        <span className="text-sm font-bold text-gray-800">49/50</span>
      </div>
      <div className="flex items-end gap-1 h-16">
        {[18, 30, 22, 38, 45, 40, 49].map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm bg-indigo-500 opacity-80 hover:opacity-100 transition-opacity"
            style={{ height: `${(v / 50) * 100}%` }}
            title={`${v} tasks`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-gray-400">
        {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => (
          <span key={y}>{y}</span>
        ))}
      </div>
    </div>
  </div>
);

export default ProjectsTab;
