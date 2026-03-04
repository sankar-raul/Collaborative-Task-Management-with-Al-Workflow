import React from "react";
import {
  WORKLOAD_ITEMS,
  RECENT_ACTIVITY,
  PERFORMANCE_STATS,
} from "../profileData";
import type { ActivityItem } from "../profileData";
import { BarChart2, Activity, ClockIcon, MessageSquare, FileText, LogIn } from "lucide-react";

// ── Ring indicator ────────────────────────────────────────────────────────────
interface RingProps {
  pct: number;
  color: string;
  label: string;
  size?: number;
}
const Ring: React.FC<RingProps> = ({ pct, color, label, size = 64 }) => (
  <div className="relative shrink-0" style={{ width: size, height: size }}>
    <div
      className="w-full h-full rounded-full"
      style={{
        background: `conic-gradient(${color} 0% ${pct}%, #e5e7eb ${pct}% 100%)`,
      }}
    />
    <div
      className="absolute rounded-full bg-white flex flex-col items-center justify-center"
      style={{
        width: size * 0.64,
        height: size * 0.64,
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
      }}
    >
      <span className="text-xs font-bold text-gray-800 leading-none">{label}</span>
    </div>
  </div>
);

// ── Activity icon map ─────────────────────────────────────────────────────────
const ACTIVITY_ICONS: Record<ActivityItem["type"], React.ReactNode> = {
  task: <Activity size={14} className="text-indigo-500" />,
  comment: <MessageSquare size={14} className="text-yellow-500" />,
  doc: <FileText size={14} className="text-blue-500" />,
  login: <LogIn size={14} className="text-green-500" />,
};

const ACTIVITY_BG: Record<ActivityItem["type"], string> = {
  task: "bg-indigo-50",
  comment: "bg-yellow-50",
  doc: "bg-blue-50",
  login: "bg-green-50",
};

// ── Card wrapper ──────────────────────────────────────────────────────────────
const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <button className="text-gray-300 hover:text-gray-500 transition-colors">•••</button>
    </div>
    {children}
  </div>
);

// ── Workload card ─────────────────────────────────────────────────────────────
const WorkloadCard: React.FC = () => (
  <Card title="Workload & Availability">
    <div className="flex flex-col gap-4">
      {WORKLOAD_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
              <ClockIcon size={16} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 leading-tight">{item.label}</p>
              <p className="text-xs text-gray-400">{item.sub}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900 leading-none">{item.value}</p>
              <p className="text-xs text-gray-400">{item.unit}</p>
            </div>
            <Ring pct={item.ringPct} color={item.ringColor} label={`${item.ringPct}%`} size={56} />
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// ── Recent Activity card ──────────────────────────────────────────────────────
const RecentActivityCard: React.FC = () => (
  <Card title="Recent Activity">
    <ul className="flex flex-col gap-3">
      {RECENT_ACTIVITY.map((act, i) => (
        <li key={i} className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${ACTIVITY_BG[act.type]}`}>
            {ACTIVITY_ICONS[act.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 font-medium truncate">
              {act.label}
              {act.target && (
                <span className="text-indigo-500 ml-1 font-semibold">{act.target}</span>
              )}
            </p>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{act.time}</span>
        </li>
      ))}
    </ul>
  </Card>
);

// ── Performance Analytics card ────────────────────────────────────────────────
const PerformanceCard: React.FC = () => (
  <Card title="Performance Analytics">
    <div className="flex flex-col gap-4">
      {PERFORMANCE_STATS.map((s) => (
        <div key={s.label} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
              <BarChart2 size={15} className="text-gray-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{s.label}</p>
              <p className="text-xs text-gray-400 truncate">{s.sub}</p>
            </div>
          </div>
          <Ring
            pct={s.value}
            color={s.ringColor}
            label={`${s.value}${s.suffix}`}
            size={52}
          />
        </div>
      ))}
    </div>
  </Card>
);

// ── Activity Tab ──────────────────────────────────────────────────────────────
const ActivityTab: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div className="flex flex-col gap-5">
      <WorkloadCard />
      <RecentActivityCard />
    </div>
    <PerformanceCard />
  </div>
);

export default ActivityTab;
