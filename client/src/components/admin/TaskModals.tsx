import React, { useCallback, useEffect, useState } from "react";
import { X, ShieldCheck, Clock, AlertTriangle } from "lucide-react";
import type { Task } from "../../@types/interface/TasksInterface";
import SkillsInput from "../shared/SkillsInput";
import { api } from "@/utils/api";
import type { Member } from "@/@types/interface/MembersInterface";
import { motion, AnimatePresence } from "framer-motion";

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
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm max-h-dvh"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-card rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar border border-border/50"
            >
              <div className="px-10 py-8 sticky top-0 bg-card/80 backdrop-blur-xl z-10 border-b border-border/50 flex justify-between items-center relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                <div>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">
                    Initialize Task
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">Operational Protocol Bravo</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2.5 text-muted-foreground/40 hover:text-foreground hover:bg-secondary rounded-2xl transition-all border border-transparent hover:border-border/60"
                >
                  <X size={24} />
                </motion.button>
              </div>

            <form onSubmit={handleCreateTask} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">
                  Task Designation
                </label>
                <input
                  required
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full px-6 py-4 bg-secondary/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 font-bold text-foreground"
                  placeholder="e.g. Fix Production API Errors"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">
                  Operational Details
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full px-6 py-4 bg-secondary/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none h-32 font-bold text-foreground"
                  placeholder="Brief task overview..."
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">
                    Priority Level
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        priority: e.target.value as any,
                      })
                    }
                    className="w-full px-6 py-4 bg-secondary/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-black uppercase tracking-widest text-[10px] text-foreground"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">
                    Workload Estimate (Hrs)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Estimate"
                    value={newTask.eastimatedTime}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        eastimatedTime: e.target.value as any,
                      })
                    }
                    className="w-full px-6 py-4 bg-secondary/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-foreground"
                  />
                </div>
              </div>

              <SkillsInput
                skills={newTask.requiredSkills || []}
                setSkills={(skills) => {
                  setNewTask((prev: any) => ({
                    ...prev,
                    requiredSkills: skills,
                  }));
                }}
              />

              <div className="space-y-4">
                <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">
                  Enlist Personnel
                  {memberRanking.length > 0 && (
                    <span className="text-[10px] font-black text-primary ml-2 lowercase tracking-normal">
                      (Synthesized Intelligence Selection)
                    </span>
                  )}
                </label>
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar p-1">
                  {memberRanking.length > 0 ? (
                    memberRanking.map((ranking, index) => (
                      <label
                        key={ranking.user._id}
                        className={`flex items-start p-6 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden group ${
                          newTask.assignedTo === ranking.user._id
                            ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/5"
                            : "bg-secondary/20 border-border/40 hover:bg-secondary/40 hover:border-primary/20"
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
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20 group-hover:scale-110 transition-transform">
                                {ranking.user.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    {index === 0 && (
                                        <span className="text-[8px] font-black uppercase tracking-tighter bg-amber-500 text-white px-2 py-0.5 rounded-full">Prime Match</span>
                                    )}
                                    <span className="font-black text-foreground text-sm">
                                        {ranking.user.name}
                                    </span>
                                </div>
                                <div className="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">
                                    Compatibility: {ranking.score?.toFixed(0) || 0}%
                                </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4 py-3 border-y border-border/20">
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Active Loads</p>
                                <p className="text-xs font-black text-foreground">{ranking.totalTasks} Vectors</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Time Mass</p>
                                <p className="text-xs font-black text-foreground">{ranking.totalEstimatedTime}h</p>
                            </div>
                          </div>
                          {ranking.user.skills && ranking.user.skills.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {ranking.user.skills.map((skill: string) => {
                                  const isMatched = newTask.requiredSkills?.includes(skill);
                                  return (
                                    <span
                                      key={skill}
                                      className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-wider border transition-all ${
                                        isMatched
                                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-sm"
                                          : "bg-secondary text-muted-foreground/60 border-border/40"
                                      }`}
                                    >
                                      {skill}
                                    </span>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                        {newTask.assignedTo === ranking.user._id && (
                            <div className="absolute top-4 right-4 text-primary">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                        )}
                      </label>
                    ))
                  ) : (
                    project?.members?.map((m: any) => (
                      <label
                        key={m.user?._id}
                        className={`flex items-center p-5 rounded-[1.5rem] border transition-all cursor-pointer group ${
                          newTask.assignedTo === m.user?._id
                            ? "bg-primary/10 border-primary/40"
                            : "bg-secondary/20 border-border/40 hover:bg-secondary/40"
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
                          className="sr-only"
                        />
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20 mr-4">
                            {m.user?.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <span className="font-black text-foreground text-sm">
                            {m.user?.name}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-3">
                            {m.role}
                          </span>
                        </div>
                        {newTask.assignedTo === m.user?._id && (
                            <div className="text-primary">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                        )}
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">
                    Synchronization Deadline
                  </label>
                  <input
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) =>
                      setNewTask({ ...newTask, deadline: e.target.value })
                    }
                    className="w-full px-6 py-4 bg-secondary/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-foreground"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-2xl transition-all border border-border/50"
                >
                  Abort
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={actionLoading}
                  className="flex-[2] px-8 py-5 bg-orange-500 text-white font-bold text-[10px] uppercase tracking-widest rounded-2xl hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-orange-500/20"
                >
                  {actionLoading ? "Synchronizing..." : "Initialize Vector"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {isEditTaskModalOpen && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-card rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden p-10 border border-border/50"
            >
              <div className="flex justify-between items-center mb-8 relative">
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-r-full" />
                <div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">Modify Task</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1">Operational Update Protocol</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsEditTaskModalOpen(false);
                    setSelectedTask(null);
                }}
                className="p-2.5 text-muted-foreground/40 hover:text-foreground hover:bg-secondary rounded-2xl transition-all border border-transparent hover:border-border/60"
              >
                <X size={24} />
              </motion.button>
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
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">
                    Task Designation
                  </label>
                  <input
                    name="title"
                    defaultValue={selectedTask.title}
                    required
                    className="w-full px-6 py-4 bg-secondary/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">
                    Operational Briefing
                  </label>
                  <textarea
                    name="description"
                    defaultValue={selectedTask.description}
                    className="w-full px-6 py-4 bg-secondary/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-32 resize-none transition-all font-bold text-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">
                      Priority Level
                    </label>
                    <select
                      name="priority"
                      defaultValue={selectedTask.priority}
                      className="w-full px-6 py-4 bg-secondary/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-black uppercase tracking-widest text-[10px] text-foreground"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">
                      Mission Status
                    </label>
                    <select
                      name="status"
                      defaultValue={selectedTask.status}
                      className="w-full px-6 py-4 bg-secondary/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-black uppercase tracking-widest text-[10px] text-foreground"
                    >
                      <option value="To Do">To Do</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="In Review">In Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">
                    Personnel Assignment
                  </label>
                  <select
                    name="assignedTo"
                    defaultValue={selectedTask.assignedTo}
                    disabled={
                      isManager && selectedTask.assignedTo === currentUser?.id
                    }
                    className={`w-full px-6 py-4 rounded-2xl border transition-all font-black uppercase tracking-widest text-[10px] ${isManager && selectedTask.assignedTo === currentUser?.id ? "bg-secondary cursor-not-allowed opacity-50 border-border/50" : "bg-secondary/50 border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary"}`}
                  >
                    <option value="">Unassigned</option>
                    {project?.members?.map((m: any) => (
                      <option key={m.user?._id} value={m.user?._id}>
                        {m.user?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">
                    Timeline Deadline
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
                    className="w-full px-6 py-4 bg-secondary/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-foreground"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-8">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsEditTaskModalOpen(false);
                    setSelectedTask(null);
                  }}
                  className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-2xl transition-all border border-border/50"
                >
                  Abort
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={actionLoading}
                  className="flex-[2] py-4 bg-orange-500 text-white font-bold text-[10px] uppercase tracking-widest rounded-2xl hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-orange-500/20"
                >
                  {actionLoading ? "Synchronizing..." : "Commit Update"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
