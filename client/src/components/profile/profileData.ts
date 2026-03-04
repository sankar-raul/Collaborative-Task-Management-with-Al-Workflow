// ─── Types ───────────────────────────────────────────────────────────────────

export type TabId = "overview" | "skills" | "tasks" | "projects" | "activity";

export interface ProfileUser {
  name: string;
  age: number;
  company: string;
  jobTitle: string;
  avatar: string; // initials fallback
  avatarBg: string;
  linkedIn: string;
}

export interface EmployeeDetail {
  email: string;
  phone: string;
  employeeId: string;
  department: string;
  joinDate: string;
  location: string;
}

export interface TaskStat {
  label: string;
  count: number;
  color: string;
  bg: string;
}

export interface Skill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  pct: number;
}

export interface ProjectMembership {
  id: string;
  name: string;
  role: string;
  taskCount: number;
  pct?: number;
  color: string;
}

export interface WorkloadItem {
  icon: string;
  label: string;
  sub: string;
  value: number;
  unit: string;
  ringPct: number;
  ringColor: string;
}

export interface ActivityItem {
  type: "task" | "comment" | "doc" | "login";
  label: string;
  target: string;
  time: string;
}

export interface PerformanceStat {
  label: string;
  sub: string;
  value: number;
  suffix: string;
  color: string;
  ringColor: string;
}

export interface TaskItem {
  id: string;
  title: string;
  project: string;
  status: "not-started" | "in-progress" | "under-review" | "done" | "overdue";
  priority: "high" | "medium" | "low";
  due: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const PROFILE_USER: ProfileUser = {
  name: "Jerome Bell",
  age: 24,
  company: "Coderspace",
  jobTitle: "Senior Software Developer",
  avatar: "JB",
  avatarBg: "bg-indigo-500",
  linkedIn: "#",
};

export const EMPLOYEE_DETAIL: EmployeeDetail = {
  email: "jerome.bell@example.com",
  phone: "+90 (545) 493 00 00",
  employeeId: "#12345",
  department: "Product Development",
  joinDate: "January 2024",
  location: "Istanbul, Turkey",
};

export const TASK_STATS: TaskStat[] = [
  { label: "Assigned", count: 5, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "In Progress", count: 2, color: "text-yellow-600", bg: "bg-yellow-50" },
  { label: "In Review", count: 2, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Completed", count: 4, color: "text-green-600", bg: "bg-green-50" },
  { label: "Overdue", count: 0, color: "text-red-500", bg: "bg-red-50" },
];

export const SKILLS: Skill[] = [
  { name: "React.js", level: "Advanced", pct: 85 },
  { name: "Node.js", level: "Intermediate", pct: 60 },
  { name: "MongoDB", level: "Intermediate", pct: 55 },
  { name: "UI Design", level: "Beginner", pct: 30 },
];

export const SKILL_LEVEL_COLOR: Record<Skill["level"], string> = {
  Expert: "bg-indigo-100 text-indigo-700",
  Advanced: "bg-purple-100 text-purple-700",
  Intermediate: "bg-blue-100 text-blue-700",
  Beginner: "bg-gray-100 text-gray-600",
};

export const PROJECT_MEMBERSHIPS: ProjectMembership[] = [
  { id: "p1", name: "AI Task Manager", role: "Backend Developer", taskCount: 1, pct: 80, color: "#7c3aed" },
  { id: "p2", name: "API Development", role: "Backend Developer", taskCount: 3, pct: 50, color: "#06b6d4" },
  { id: "p3", name: "CMS Redesign", role: "API Development", taskCount: 2, pct: 42, color: "#f59e0b" },
];

export const WORKLOAD_ITEMS: WorkloadItem[] = [
  {
    icon: "clock",
    label: "Active Hours",
    sub: "25 hrs/week",
    value: 4,
    unit: "Active",
    ringPct: 92,
    ringColor: "#7c3aed",
  },
  {
    icon: "layers",
    label: "Current Workload",
    sub: "Completed",
    value: 31,
    unit: "Completed",
    ringPct: 88,
    ringColor: "#06b6d4",
  },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  { type: "task", label: "Last Task Updated", target: "Dashboard API", time: "2 hours ago" },
  { type: "comment", label: "Commented on Task", target: "Analytics Endpoint", time: "3 hours ago" },
  { type: "doc", label: "Edited Document", target: "API Documentation", time: "5 hours ago" },
  { type: "login", label: "Last Login", target: "", time: "Today" },
];

export const PERFORMANCE_STATS: PerformanceStat[] = [
  { label: "Productivity Score", sub: "Dashboard CM  ·  2 hours ago", value: 88, suffix: "", color: "#10b981", ringColor: "#10b981" },
  { label: "Deadline Success", sub: "rate", value: 96, suffix: "%", color: "#f59e0b", ringColor: "#f59e0b" },
  { label: "Success Rate", sub: "On Time  Tasks 48/50", value: 96, suffix: "%", color: "#f59e0b", ringColor: "#f59e0b" },
];

export const TASKS: TaskItem[] = [
  { id: "tk1", title: "Build Dashboard API", project: "AI Task Manager", status: "in-progress", priority: "high", due: "Mar 6, 2026" },
  { id: "tk2", title: "Write API Documentation", project: "API Development", status: "done", priority: "medium", due: "Mar 2, 2026" },
  { id: "tk3", title: "Redesign CMS Editor", project: "CMS Redesign", status: "not-started", priority: "low", due: "Mar 10, 2026" },
  { id: "tk4", title: "Fix Auth Middleware Bug", project: "AI Task Manager", status: "under-review", priority: "high", due: "Mar 5, 2026" },
  { id: "tk5", title: "Analytics Endpoint", project: "API Development", status: "overdue", priority: "high", due: "Mar 1, 2026" },
];
