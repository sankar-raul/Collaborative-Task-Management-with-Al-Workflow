import { ITask } from "@/types/interface/task.interface";
import { IUser } from "@/types/interface/user.interface";

const WORK_HOURS_PER_WEEK = 40;
const MAX_WORKLOAD = 5;
const PRIORITY_MAP = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};
export const calculateScore = (task: ITask, user: Partial<IUser>): number => {
  const priorityScore = PRIORITY_MAP[task.priority] / 4;
  const overlap = task.requiredSkills.filter((skill) =>
    user.skills.includes(skill),
  ).length;

  const skillMatch = overlap / task.requiredSkills.length;

  const workloadScore = 1 - user.currentWorkload / MAX_WORKLOAD;
  const availlableHours = user.availabilityHours - task.eastimatedTime;
  const availabilityScore = ( user.availabilityHours - task.eastimatedTime ) / WORK_HOURS_PER_WEEK;
  console.log(priorityScore, skillMatch, availabilityScore, workloadScore);
  return (
    0.35 * priorityScore +
    0.4 * skillMatch +
    0.15 * workloadScore +
    0.1 * availabilityScore
  );
};
