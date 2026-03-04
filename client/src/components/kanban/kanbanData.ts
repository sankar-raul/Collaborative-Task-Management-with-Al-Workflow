// ─── Types ────────────────────────────────────────────────────────────────────

export type ColumnId = "todo" | "inProgress" | "review" | "done";

export interface TaskTag {
  label: string;
  color: TagColor;
}

export type TagColor =
  | "purple"
  | "teal"
  | "blue"
  | "orange"
  | "green"
  | "yellow"
  | "pink"
  | "indigo"
  | "red";

export interface TaskAvatar {
  initials: string;
  bg: string;
}

export type TaskStatus =
  | "not-started"
  | "in-progress"
  | "under-review"
  | "done";

export interface Task {
  id: string;
  tags: TaskTag[];
  title: string;
  status: TaskStatus;
  /** 0-100, present only when status === 'in-progress' */
  progress?: number;
  avatars: TaskAvatar[];
  extraAvatars?: number;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

export interface KanbanColumn {
  id: ColumnId;
  title: string;
  dotColor: string;
  headerBg: string;
  tasks: Task[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const COLUMNS: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    dotColor: "bg-blue-500",
    headerBg: "bg-blue-50",
    tasks: [
      {
        id: "t1",
        tags: [{ label: "ILLUSTRATION", color: "purple" }],
        title: "Add one more type of illustration on the home screen",
        status: "not-started",
        avatars: [
          { initials: "A", bg: "bg-pink-400" },
          { initials: "B", bg: "bg-yellow-400" },
          { initials: "C", bg: "bg-blue-400" },
        ],
        extraAvatars: 4,
        priority: "high",
        completed: false,
      },
      {
        id: "t2",
        tags: [{ label: "HI-FI DESIGN", color: "teal" }],
        title:
          "Create designs for admin, and for user web and android platform",
        status: "not-started",
        avatars: [
          { initials: "D", bg: "bg-green-400" },
          { initials: "E", bg: "bg-red-400" },
          { initials: "F", bg: "bg-indigo-400" },
        ],
        extraAvatars: 3,
        priority: "medium",
        completed: false,
      },
      {
        id: "t3",
        tags: [{ label: "PROTOTYPE", color: "blue" }],
        title:
          "Create prototype for admin, and for user web and android platform",
        status: "not-started",
        avatars: [
          { initials: "G", bg: "bg-orange-400" },
          { initials: "H", bg: "bg-teal-400" },
        ],
        extraAvatars: 2,
        priority: "low",
        completed: false,
      },
      {
        id: "t4",
        tags: [{ label: "RESEARCH", color: "indigo" }],
        title: "Conduct user research for new onboarding flow designs",
        status: "not-started",
        avatars: [{ initials: "I", bg: "bg-purple-400" }],
        extraAvatars: 1,
        priority: "medium",
        completed: false,
      },
    ],
  },
  {
    id: "inProgress",
    title: "In Progress",
    dotColor: "bg-yellow-400",
    headerBg: "bg-yellow-50",
    tasks: [
      {
        id: "t5",
        tags: [
          { label: "WIREFRAMES", color: "orange" },
          { label: "UX", color: "green" },
        ],
        title:
          "Create Wireframes for admin, and for user web and android platform",
        status: "in-progress",
        progress: 50,
        avatars: [
          { initials: "A", bg: "bg-pink-400" },
          { initials: "B", bg: "bg-yellow-400" },
          { initials: "C", bg: "bg-blue-400" },
        ],
        extraAvatars: 5,
        priority: "high",
        completed: false,
      },
      {
        id: "t6",
        tags: [
          { label: "IA", color: "yellow" },
          { label: "UX", color: "green" },
        ],
        title:
          "Create information architecture for admin, and for user web and android platform",
        status: "in-progress",
        progress: 60,
        avatars: [
          { initials: "D", bg: "bg-green-400" },
          { initials: "E", bg: "bg-red-400" },
          { initials: "F", bg: "bg-indigo-400" },
        ],
        extraAvatars: 3,
        priority: "medium",
        completed: false,
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    dotColor: "bg-pink-500",
    headerBg: "bg-pink-50",
    tasks: [
      {
        id: "t7",
        tags: [
          { label: "TASK FLOW", color: "pink" },
          { label: "UX", color: "green" },
        ],
        title:
          "Create Task Flow for admin, and for user web and android platform",
        status: "under-review",
        avatars: [
          { initials: "G", bg: "bg-orange-400" },
          { initials: "H", bg: "bg-teal-400" },
          { initials: "I", bg: "bg-purple-400" },
        ],
        extraAvatars: 4,
        priority: "high",
        completed: false,
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    dotColor: "bg-green-500",
    headerBg: "bg-green-50",
    tasks: [
      {
        id: "t8",
        tags: [
          { label: "USER PERSONAS", color: "green" },
          { label: "UX", color: "green" },
        ],
        title:
          "Create Personas for all type of users on the basis of research data",
        status: "done",
        avatars: [
          { initials: "A", bg: "bg-pink-400" },
          { initials: "B", bg: "bg-yellow-400" },
          { initials: "C", bg: "bg-blue-400" },
        ],
        extraAvatars: 4,
        priority: "high",
        completed: true,
      },
      {
        id: "t9",
        tags: [
          { label: "USER STORIES", color: "pink" },
          { label: "UX", color: "green" },
        ],
        title:
          "Create User Stories for admin, and for user web and android platform",
        status: "done",
        avatars: [
          { initials: "D", bg: "bg-green-400" },
          { initials: "E", bg: "bg-red-400" },
          { initials: "F", bg: "bg-indigo-400" },
        ],
        extraAvatars: 3,
        priority: "medium",
        completed: true,
      },
    ],
  },
];
