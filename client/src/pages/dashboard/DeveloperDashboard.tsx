import { CheckSquare, Clock, AlertCircle } from "lucide-react";

export default function DeveloperDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Developer Dashboard</h2>
                    <p className="text-gray-500">View your assigned tasks and update your progress.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "My Tasks", value: "12", icon: CheckSquare, color: "text-blue-600", bg: "bg-blue-100" },
                    { title: "In Progress", value: "4", icon: Clock, color: "text-indigo-600", bg: "bg-indigo-100" },
                    { title: "Overdue", value: "1", icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" },
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

            {/* Assigned Tasks */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-gray-900">My Current Tasks</h3>
                </div>
                <div className="p-4 space-y-3">
                    {[
                        { title: "Implement Auth API", project: "Alpha Release", priority: "High", status: "In Progress", due: "Today" },
                        { title: "Fix Navbar CSS Bug", project: "Marketing Site", priority: "Medium", status: "To Do", due: "Tomorrow" },
                        { title: "Setup Database Schema", project: "Beta Testing App", priority: "High", status: "To Do", due: "Friday" },
                    ].map((task, i) => (
                        <div key={i} className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-gray-900">{task.title}</h4>
                                <p className="text-xs text-gray-500 mt-1">Project: {task.project} • Due: {task.due}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className={`text-xs font-semibold px-2 py-1 rounded 
                  ${task.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                    {task.priority} Priority
                                </span>
                                <select
                                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
                                    defaultValue={task.status}
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
