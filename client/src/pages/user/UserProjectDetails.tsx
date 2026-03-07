import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../../utils/api";
import {
    ArrowLeft,
    CheckCircle2,
    Users,
    CheckCircle,
    Calendar,
    Briefcase
} from "lucide-react";
import type { Project } from "../../@types/interface/ProjectInterface";
import type { Task } from "../../@types/interface/TasksInterface";
import { useAuth } from "../../context/auth";

const UserProjectDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { member } = useAuth();

    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id || !member?.id) return;
            try {
                setLoading(true);
                const [projectRes, tasksRes] = await Promise.all([
                    api.projects.getProjectById(id),
                    member.role === "User"
                        ? api.tasks.getTasksByUser(member.id)
                        : api.tasks.getTasksByProject(id)
                ]);

                if (projectRes.success) setProject(projectRes.data);

                if (tasksRes.success) {
                    // Filter tasks by project ID if fetching by user (since getTasksByUser returns all user tasks)
                    const projectTasks = member.role === "User"
                        ? tasksRes.data.filter((t: Task) => t.projectId === id)
                        : tasksRes.data;
                    setTasks(projectTasks);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load project details");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, member?.id, member?.role]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="p-8 max-w-5xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </button>
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 italic">
                    {error || "Project not found"}
                </div>
            </div>
        );
    }

    return (
        <div className="px-8 py-3 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
            </button>

            <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-indigo-50 p-2 rounded-xl">
                                <Briefcase className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">{project.projectName}</h1>
                        </div>
                        <p className="text-gray-500 max-w-2xl">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold border border-green-100 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> {project.status || 'Active'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-8 border-t border-gray-50">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Tasks</p>
                        <p className="text-2xl font-black text-gray-900">{tasks.length}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Team Members</p>
                        <p className="text-2xl font-black text-gray-900">{project.members?.length || 0}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Created At</p>
                        <p className="text-sm font-bold text-gray-700">{new Date(project.createdAt || '').toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Visibility</p>
                        <p className="text-sm font-bold text-gray-700">Project Workspace</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-indigo-600" /> Project Tasks
                    </h2>
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div key={task._id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="mt-1">
                                            <div className="w-5 h-5 border-2 border-gray-200 rounded-md flex items-center justify-center hover:border-indigo-400 cursor-pointer transition-colors group">
                                                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-sm opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{task.title}</h4>
                                            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                                            <div className="flex items-center gap-4 mt-3">
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                                                </span>
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${task.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {task.priority} Priority
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${task.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-indigo-50 text-indigo-700'
                                        }`}>
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {tasks.length === 0 && (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-gray-400">
                                No tasks found in this project.
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600" /> Team Members
                    </h2>
                    <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 space-y-4">
                        {project.members?.map((member: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                    {member.user?.name?.charAt(0)}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-bold text-gray-900 truncate">{member.user?.name}</p>
                                    <p className="text-xs text-gray-400 capitalize">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProjectDetails;
