import { useEffect } from "react";
import { useSocket } from "../context/socket";
import { useToast } from "../context/toast";
import type { Task } from "../@types/interface/TasksInterface";

interface UseProjectSocketProps {
  projectId: string | undefined;
  onTaskCreated?: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
  onTaskDeleted?: (taskId: string) => void;
  onMemberAdded?: () => void;
  onMemberRemoved?: () => void;
  onMemberRoleUpdated?: () => void;
  onProjectUpdated?: () => void;
  enableToasts?: boolean;
}

export const useProjectSocket = ({
  projectId,
  onTaskCreated,
  onTaskUpdated,
  onTaskDeleted,
  onMemberAdded,
  onMemberRemoved,
  onMemberRoleUpdated,
  onProjectUpdated,
  enableToasts = true,
}: UseProjectSocketProps) => {
  const { socket, isConnected } = useSocket();
  const { showToast } = useToast();

  useEffect(() => {
    if (!socket || !isConnected || !projectId) return;

    // Join project room
    socket.emit("joinProject", projectId);

    // Task created
    const handleTaskCreated = (task: Task) => {
      if (enableToasts) {
        showToast(`New task created: ${task.title}`, "success");
      }
      onTaskCreated?.(task);
    };

    // Task assigned
    const handleTaskAssigned = (task: Task) => {
      if (enableToasts) {
        showToast(`Task assigned: ${task.title}`, "info");
      }
      onTaskUpdated?.(task);
    };

    // Task status updated
    const handleTaskStatusUpdated = (task: Task) => {
      if (enableToasts) {
        showToast(`Task status updated: ${task.title}`, "info");
      }
      onTaskUpdated?.(task);
    };

    // Task updated
    const handleTaskUpdated = (task: Task) => {
      if (enableToasts) {
        showToast(`Task updated: ${task.title}`, "info");
      }
      onTaskUpdated?.(task);
    };

    // Task deleted
    const handleTaskDeleted = ({ taskId }: { taskId: string }) => {
      if (enableToasts) {
        showToast("Task deleted", "info");
      }
      onTaskDeleted?.(taskId);
    };

    // Member added
    const handleMemberAdded = () => {
      if (enableToasts) {
        showToast("New member added to project", "success");
      }
      onMemberAdded?.();
    };

    // Member removed
    const handleMemberRemoved = () => {
      if (enableToasts) {
        showToast("Member removed from project", "info");
      }
      onMemberRemoved?.();
    };

    // Member role updated
    const handleMemberRoleUpdated = () => {
      if (enableToasts) {
        showToast("Member role updated", "info");
      }
      onMemberRoleUpdated?.();
    };

    // Project updated
    const handleProjectUpdated = () => {
      if (enableToasts) {
        showToast("Project updated", "info");
      }
      onProjectUpdated?.();
    };

    // Project deleted
    const handleProjectDeleted = () => {
      if (enableToasts) {
        showToast("Project has been deleted", "error");
      }
    };

    // Attach listeners
    socket.on("taskCreated", handleTaskCreated);
    socket.on("taskAssigned", handleTaskAssigned);
    socket.on("taskStatusUpdated", handleTaskStatusUpdated);
    socket.on("taskUpdated", handleTaskUpdated);
    socket.on("taskDeleted", handleTaskDeleted);
    socket.on("memberAdded", handleMemberAdded);
    socket.on("memberRemoved", handleMemberRemoved);
    socket.on("memberRoleUpdated", handleMemberRoleUpdated);
    socket.on("projectUpdated", handleProjectUpdated);
    socket.on("projectDeleted", handleProjectDeleted);

    // Cleanup
    return () => {
      socket.emit("leaveProject", projectId);
      socket.off("taskCreated", handleTaskCreated);
      socket.off("taskAssigned", handleTaskAssigned);
      socket.off("taskStatusUpdated", handleTaskStatusUpdated);
      socket.off("taskUpdated", handleTaskUpdated);
      socket.off("taskDeleted", handleTaskDeleted);
      socket.off("memberAdded", handleMemberAdded);
      socket.off("memberRemoved", handleMemberRemoved);
      socket.off("memberRoleUpdated", handleMemberRoleUpdated);
      socket.off("projectUpdated", handleProjectUpdated);
      socket.off("projectDeleted", handleProjectDeleted);
    };
  }, [
    socket,
    isConnected,
    projectId,
    enableToasts,
    showToast,
    onTaskCreated,
    onTaskUpdated,
    onTaskDeleted,
    onMemberAdded,
    onMemberRemoved,
    onMemberRoleUpdated,
    onProjectUpdated,
  ]);

  return { isConnected };
};
