import { FolderKanban, ClipboardList, CheckSquare, Plus, Users } from "lucide-react";

export default function ManagerDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Project Manager Dashboard</h2>
                    <p className="text-gray-500">Oversee projects, create tasks, and manage team assignments.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        New Task
                    </button>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "My Projects", value: "3", icon: FolderKanban, color: "text-blue-600", bg: "bg-blue-100" },
                    { title: "Team Members", value: "8", icon: Users, color: "text-indigo-600", bg: "bg-indigo-100" },
                    { title: "Tasks Pending", value: "42", icon: ClipboardList, color: "text-amber-600", bg: "bg-amber-100" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Projects Overview */}
            <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">Active Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { name: "Alpha Release", progress: 75, tasks: 24 },
                    { name: "Beta Testing App", progress: 30, tasks: 45 },
                    { name: "Marketing Site", progress: 90, tasks: 12 },
                ].map((project, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-900">{project.name}</h4>
                            <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-1 rounded">Active</span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                            <span className="text-sm text-gray-500 flex items-center">
                                <CheckSquare className="w-4 h-4 mr-1.5" />
                                {project.tasks} Tasks
                            </span>
                            <button className="text-sm text-indigo-600 font-medium hover:underline">Manage Tasks</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
