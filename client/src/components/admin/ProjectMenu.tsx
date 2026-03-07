import { Eye, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

interface ProjectMenuProps {
    projectId: string;
    onClose: () => void;
}

export const ProjectMenu = ({ projectId, onClose }: ProjectMenuProps) => {
    const navigate = useNavigate();

    return (
        <div className="absolute right-0 bottom-full mb-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in duration-100 origin-bottom-right">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/projects/${projectId}`);
                    onClose();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
                <Eye className="w-4 h-4 mr-2" /> View
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
                <Edit2 className="w-4 h-4 mr-2" /> Edit
            </button>
            <div className="h-px bg-gray-100 my-1"></div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
            >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
            </button>
        </div>
    );
};
