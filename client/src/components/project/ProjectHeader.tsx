import {
    CheckCircle2,
    Users,
    CheckCircle,
    SquarePen,
    Trash2,
    Briefcase
} from "lucide-react";
import type { Project } from "../../@types/interface/ProjectInterface";

interface ProjectHeaderProps {
    project: Project;
    taskCount: number;
    onEdit?: () => void;
    onDelete?: () => void;
    showActions?: boolean;
}

export const ProjectHeader = ({
    project,
    taskCount,
    onEdit,
    onDelete,
    showActions = false
}: ProjectHeaderProps) => {
    return (
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-8 mb-8 relative">
            {showActions && (
                <div className="absolute top-8 right-8 flex gap-3">
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-sm font-semibold transition-all"
                        >
                            <SquarePen className="w-4 h-4" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-semibold transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}

            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-indigo-50 p-2 rounded-xl">
                            <Briefcase className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {project.projectName}
                        </h1>
                    </div>

                    <p className="text-base text-gray-500 mt-2 max-w-2xl">
                        {project.description || "No project description provided"}
                    </p>

                    <div className="flex items-center gap-6 mt-8 text-sm text-gray-600">
                        <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full text-green-700 font-medium border border-green-100">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="capitalize">
                                {project.status || "In Progress"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-blue-700 font-medium">
                            <Users className="w-4 h-4" />
                            <span>
                                {project.members?.length || 0} Members
                            </span>
                        </div>

                        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 font-medium">
                            <CheckCircle className="w-4 h-4" />
                            <span>
                                {taskCount} Tasks
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
