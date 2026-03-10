import React, { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Task } from "../../@types/interface/TasksInterface";
import SkillsInput from "../shared/SkillsInput";
import { api } from "@/utils/api";
import type { Member } from "@/@types/interface/MembersInterface";

interface TaskModalsProps {
  project: any;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isEditTaskModalOpen: boolean;
  setIsEditTaskModalOpen: (open: boolean) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  newTask: any;
  setNewTask: (task: any) => void;
  handleCreateTask: (e: React.FormEvent) => Promise<void>;
  handleUpdateTask: (taskId: string, taskData: any) => Promise<void>;
  actionLoading: boolean;
  isManager?: boolean;
  currentUser?: any;
}

export const TaskModals: React.FC<TaskModalsProps> = ({
  project,
  isCreateModalOpen,
  setIsCreateModalOpen,
  isEditTaskModalOpen,
  setIsEditTaskModalOpen,
  selectedTask,
  setSelectedTask,
  newTask,
  setNewTask,
  handleCreateTask,
  handleUpdateTask,
  actionLoading,
  isManager,
  currentUser,
}) => {
  const [memberRanking, setMemberRanking] = useState<
    {
      user: Member;
      score: number;
      totalTasks: number;
      totalEstimatedTime: number;
    }[]
  >([]);
  const [isManualSelection, setIsManualSelection] = useState(false);
  
  const handleRanking = useCallback(
    async ({ requiredSkills, priority, eastimatedTime }: Partial<Task>) => {
      if (!project) return;
      try {
        const res = await api.tasks.getRanking(project._id, {
          eastimatedTime,
          priority,
          requiredSkills,
        });
        if (res.success) {
          setMemberRanking(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [project],
  );

  useEffect(() => {
    if (
        !newTask.priority ||
        !newTask.eastimatedTime ||
        (!newTask.requiredSkills || newTask.requiredSkills.length === 0)
    ) return;
    (async () => {
      await handleRanking({
        requiredSkills: newTask.requiredSkills,
        priority: newTask.priority,
        eastimatedTime: newTask.eastimatedTime,
      });
    })();
  }, [
    newTask.priority,
    newTask.eastimatedTime,
    newTask.requiredSkills,
    handleRanking,
  ]);

  useEffect(() => {
    // Auto-select the highest-ranked member when ranking changes (only if not manually selected)
    if (memberRanking.length > 0 && !isManualSelection) {
      setNewTask((prev: any) => ({
        ...prev,
        assignedTo: memberRanking[0].user._id,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberRanking]);

  // Reset manual selection flag when modal opens
  useEffect(() => {
    if (isCreateModalOpen) {
      setIsManualSelection(false);
    }
  }, [isCreateModalOpen]);

  return (
    <>
      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm animate-in fade-in duration-200 max-h-dvh">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-full overflow-y-auto scroll-smooth">
            <div className="px-8 sticky top-0 bg-white py-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                Create New Task
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Task Title
                </label>
                <input
                  required
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Fix Production API Errors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none h-24"
                  placeholder="Brief task overview..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        priority: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Eastimated Time (hours)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Eastimated Hours"
                    value={newTask.eastimatedTime}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        eastimatedTime: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <SkillsInput
                skills={newTask.requiredSkills || []}
                setSkills={(skills) => {
                  setNewTask((prev) => ({
                    ...prev,
                    requiredSkills: skills,
                  }));
                }}
              />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Assign To Member
                  {memberRanking.length > 0 && (
                    <span className="text-xs font-normal text-gray-500 ml-2">
                      (Ranked by AI - Best match selected)
                    </span>
                  )}
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {memberRanking.length > 0 ? (
                    memberRanking.map((ranking, index) => (
                      <label
                        key={ranking.user._id}
                        className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          newTask.assignedTo === ranking.user._id
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-300 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="assignedTo"
                          value={ranking.user._id}
                          checked={newTask.assignedTo === ranking.user._id}
                          onChange={(e) => {
                            setNewTask({ ...newTask, assignedTo: e.target.value });
                            setIsManualSelection(true);
                          }}
                          className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center gap-2">
                            {index === 0 && (
                              <span className="text-yellow-500">⭐</span>
                            )}
                            <span className="font-semibold text-gray-900">
                              {ranking.user.name}
                            </span>
                            <span className="text-sm font-bold text-indigo-600">
                              Score: {ranking.score?.toFixed(2) || 0} %
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Current Tasks: {ranking.totalTasks} | Total Est. Time: {ranking.totalEstimatedTime}h
                          </div>
                          {ranking.user.skills && ranking.user.skills.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1">
                                {ranking.user.skills.map((skill: string) => {
                                  const isMatched = newTask.requiredSkills?.includes(skill);
                                  return (
                                    <span
                                      key={skill}
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        isMatched
                                          ? "bg-green-100 text-green-700 font-semibold border border-green-300"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {isMatched && "✓ "}
                                      {skill}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                    ))
                  ) : (
                    project?.members?.map((m: any) => (
                      <label
                        key={m.user?._id}
                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          newTask.assignedTo === m.user?._id
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-300 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="assignedTo"
                          value={m.user?._id}
                          checked={newTask.assignedTo === m.user?._id}
                          onChange={(e) => {
                            setNewTask({ ...newTask, assignedTo: e.target.value });
                            setIsManualSelection(true);
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="ml-3">
                          <span className="font-semibold text-gray-900">
                            {m.user?.name}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({m.role})
                          </span>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) =>
                      setNewTask({ ...newTask, deadline: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
                >
                  {actionLoading ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditTaskModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Task</h3>
              <button
                onClick={() => {
                  setIsEditTaskModalOpen(false);
                  setSelectedTask(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updatedData = {
                  title: formData.get("title") as string,
                  description: formData.get("description") as string,
                  priority: formData.get("priority") as string,
                  status: formData.get("status") as string,
                  assignedTo: formData.get("assignedTo") as string,
                  deadline: formData.get("deadline")
                    ? new Date(formData.get("deadline") as string).toISOString()
                    : undefined,
                };
                handleUpdateTask(selectedTask._id, updatedData);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  name="title"
                  defaultValue={selectedTask.title}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={selectedTask.description}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 outline-none h-24 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    defaultValue={selectedTask.priority}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={selectedTask.status}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none"
                  >
                    <option value="To Do">To Do</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Assign To
                </label>
                <select
                  name="assignedTo"
                  defaultValue={selectedTask.assignedTo}
                  disabled={
                    isManager && selectedTask.assignedTo === currentUser?.id
                  }
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none ${isManager && selectedTask.assignedTo === currentUser?.id ? "bg-gray-50 cursor-not-allowed opacity-70" : ""}`}
                >
                  <option value="">Unassigned</option>
                  {project?.members?.map((m: any) => (
                    <option key={m.user?._id} value={m.user?._id}>
                      {m.user?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  defaultValue={
                    selectedTask.deadline
                      ? new Date(selectedTask.deadline)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditTaskModalOpen(false);
                    setSelectedTask(null);
                  }}
                  className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
