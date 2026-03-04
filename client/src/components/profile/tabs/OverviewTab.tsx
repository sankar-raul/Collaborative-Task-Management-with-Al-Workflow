import React from "react";
import {
  Mail, Phone, Hash, Briefcase, MapPin,
} from "lucide-react";
import type { TaskStat, ProjectMembership } from "../profileData";
import {
  EMPLOYEE_DETAIL,
  TASK_STATS,
  PROJECT_MEMBERSHIPS,
} from "../profileData";

// ── Donut helper ──────────────────────────────────────────────────────────────
interface DonutProps {
  pct: number;
  color: string;
  size?: number;
  label?: string | number;
}
const Donut: React.FC<DonutProps> = ({ pct, color, size = 80, label }) => (
  <div className="relative shrink-0" style={{ width: size, height: size }}>
    <div
      className="w-full h-full rounded-full"
      style={{
        background: `conic-gradient(${color} 0% ${pct}%, #e5e7eb ${pct}% 100%)`,
      }}
    />
    {/* inner white circle */}
    <div
      className="absolute inset-0 m-auto rounded-full bg-white flex items-center justify-center text-sm font-bold text-gray-800"
      style={{ width: size * 0.62, height: size * 0.62, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
    >
      {label}
    </div>
  </div>
);

// ── Card wrapper ──────────────────────────────────────────────────────────────
const Card: React.FC<{ title: string; action?: React.ReactNode; children: React.ReactNode }> = ({
  title, action, children,
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

// ── Employee Overview ─────────────────────────────────────────────────────────
const EmployeeOverviewCard: React.FC = () => {
  const d = EMPLOYEE_DETAIL;
  const rows = [
    { icon: <Mail size={14} />, label: d.email, sub: "Mail Address" },
    { icon: <Phone size={14} />, label: d.phone, sub: undefined },
    { icon: <Hash size={14} />, label: d.employeeId, sub: "Employee ID" },
    { icon: <Briefcase size={14} />, label: d.department, sub: d.joinDate },
    { icon: <MapPin size={14} />, label: d.location, sub: d.location },
  ];

  return (
    <Card
      title="Employee Overview"
      action={
        <button className="flex items-center gap-1 text-xs text-indigo-500 font-medium hover:text-indigo-700 transition-colors">
          ✏️ Edit
        </button>
      }
    >
      <ul className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 text-gray-400 shrink-0">{row.icon}</span>
            <div>
              <p className="text-sm text-gray-800 font-medium leading-tight">{row.label}</p>
              {row.sub && <p className="text-xs text-gray-400">{row.sub}</p>}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

// ── Task Overview ─────────────────────────────────────────────────────────────
const TaskOverviewCard: React.FC = () => (
  <Card title="Task Overview">
    <div className="flex flex-wrap gap-3 justify-around">
      {TASK_STATS.map((s: TaskStat) => (
        <div key={s.label} className="flex flex-col items-center gap-1">
          <span className={`text-xl font-bold ${s.color}`}>{s.count}</span>
          <span className="text-[11px] text-gray-500 text-center leading-tight">{s.label}</span>
        </div>
      ))}
    </div>
  </Card>
);

// ── Project Membership (donut) ────────────────────────────────────────────────
const ProjectDonutCard: React.FC = () => {
  const main = PROJECT_MEMBERSHIPS[0];
  const total = PROJECT_MEMBERSHIPS.reduce((acc: number, p: ProjectMembership) => acc + p.taskCount, 0);
  return (
    <Card title="Project Membership">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1">
          {PROJECT_MEMBERSHIPS.map((p: ProjectMembership) => (
            <div key={p.id} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: p.color }}
              />
              <div>
                <p className="text-sm font-medium text-gray-800 leading-tight">{p.name}</p>
                <p className="text-xs text-gray-400">{p.role}</p>
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-400 mt-1">Tasks · count {total}</p>
        </div>
        <Donut pct={main.pct ?? 80} color={main.color} size={88} label={total} />
      </div>
    </Card>
  );
};

// ── Overview Tab ──────────────────────────────────────────────────────────────
const OverviewTab: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <EmployeeOverviewCard />
    <div className="flex flex-col gap-5">
      <TaskOverviewCard />
      <ProjectDonutCard />
    </div>
  </div>
);

export default OverviewTab;
