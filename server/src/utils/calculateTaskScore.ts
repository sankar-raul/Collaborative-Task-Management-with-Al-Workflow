import { ITask } from "@/types/interface/task.interface";
import { IUser } from "@/types/interface/user.interface";

const WORK_HOURS_PER_WEEK = 40;
const MAX_WORKLOAD = 5;

export const calculateScore = (task: ITask, user: Partial<IUser>): number => {
  const priorityMap = {
    Low: 1,
    Medium: 2,
    High: 3,
    Critical: 4,
  };

  const priorityScore = priorityMap[task.priority] / 4;

  const overlap = task.requiredSkills.filter((skill) =>
    user.skills.includes(skill),
  ).length;

  const skillMatch = overlap / task.requiredSkills.length;

  const workloadScore = 1 - user.currentWorkload / MAX_WORKLOAD;

  const availabilityScore = user.availabilityHours / WORK_HOURS_PER_WEEK;
  console.log(priorityScore, skillMatch, availabilityScore, workloadScore)
  return (
    0.35 * priorityScore +
    0.4 * skillMatch +
    0.15 * workloadScore +
    0.1 * availabilityScore
  );
};
