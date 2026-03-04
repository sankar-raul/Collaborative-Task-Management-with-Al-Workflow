import { useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export const AdminProjects = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Mock data representing projects assigned to managers and developers
    const [projects, setProjects] = useState([
        {
            id: 1,
            name: "Website Redesign",
            status: "In Progress",
            manager: "Alice Smith",
            developer: "Bob Jones",
            dueDate: "2026-04-15",
        },
        {
            id: 2,
            name: "Mobile App Launch",
            status: "Planning",
            manager: "Charlie Brown",
            developer: "Diana Prince",
            dueDate: "2026-05-20",
        },
        {
            id: 3,
            name: "Database Migration",
            status: "Completed",
            manager: "Alice Smith",
            developer: "Eve Server",
            dueDate: "2026-02-28",
        },
    ]);

    // Mock system users to assign
    const availableManagers = ["Alice Smith", "Charlie Brown", "Eve Server"];
    const availableDevelopers = ["Bob Jones", "Diana Prince", "Frank Castle"];

    const handleCreateProject = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newProject = {
            id: projects.length + 1,
            name: formData.get("name") as string,
            status: "Planning", // Default status
            manager: formData.get("manager") as string,
            developer: formData.get("developer") as string,
            dueDate: formData.get("dueDate") as string,
        };

        setProjects([...projects, newProject]);
        setIsCreateModalOpen(false);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Projects</h1>
                    <p className="text-gray-600">Overview of all system projects, assignments, and statuses.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-[#1e5eb5] text-white rounded-lg hover:bg-[#1a51a0] transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Project
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Project Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Manager</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Developer</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{project.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-gray-600">
                                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">
                                                {project.manager.charAt(0)}
                                            </span>
                                            <span className="whitespace-nowrap">{project.manager}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-gray-600">
                                            <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">
                                                {project.developer.charAt(0)}
                                            </span>
                                            <span className="whitespace-nowrap">{project.developer}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                            project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                'bg-orange-100 text-orange-700'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{project.dueDate}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-[#1e5eb5] mr-3 transition-colors">
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setProjects(projects.filter(p => p.id !== project.id))}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {projects.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No projects found. Click "Create Project" to add one.
                        </div>
                    )}
                </div>
            </div>

            {/* Create Project Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateProject} className="p-6 space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e5eb5] focus:border-[#1e5eb5] outline-none transition-shadow"
                                    placeholder="e.g. Website Overhaul"
                                />
                            </div>

                            <div>
                                <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">Assign Manager</label>
                                <select
                                    id="manager"
                                    name="manager"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e5eb5] outline-none bg-white"
                                >
                                    <option value="">Select a Manager</option>
                                    {availableManagers.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="developer" className="block text-sm font-medium text-gray-700 mb-1">Assign Developer</label>
                                <select
                                    id="developer"
                                    name="developer"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e5eb5] outline-none bg-white"
                                >
                                    <option value="">Select a Developer</option>
                                    {availableDevelopers.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    name="dueDate"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e5eb5] outline-none text-gray-700"
                                />
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#1e5eb5] text-white rounded-lg hover:bg-[#1a51a0] transition-colors font-medium"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
