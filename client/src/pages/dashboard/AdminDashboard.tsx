import { useState } from "react";
import { Users, FolderKanban, ClipboardList, Plus, Trash2, CheckCircle2 } from "lucide-react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"users" | "projects" | "tasks">("users");

    // Mock State
    const [users, setUsers] = useState([
        { id: 1, name: "Rahul S.", role: "developer", email: "rahul@company.com" },
        { id: 2, name: "Sneha M.", role: "manager", email: "pm@company.com" },
        { id: 3, name: "Debanjan D.", role: "developer", email: "dev@company.com" },
    ]);

    const [projects, setProjects] = useState([
        { id: 1, name: "E-Commerce Redesign", manager: "Sneha M.", status: "Active" },
        { id: 2, name: "Mobile App Beta", manager: "Sneha M.", status: "Planning" },
    ]);

    // Form states
    const [showAddUser, setShowAddUser] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "developer" });

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email) return;
        setUsers([...users, { ...newUser, id: Date.now() }]);
        setNewUser({ name: "", email: "", role: "developer" });
        setShowAddUser(false);
    };

    const removeUser = (id: number) => {
        setUsers(users.filter((user) => user.id !== id));
    };

    return (
        <div className="space-y-6">
            {/* Header and Tab Selection */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-indigo-600 space-y-4 sm:space-y-0 text-left">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">Admin Control Panel</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage users, oversee projects, and configure system settings.</p>
                </div>
                <div className="flex space-x-2">
                    {["users", "projects", "tasks"].map((tab) => (
                        <button
                            key={tab}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab === tab
                                    ? "bg-indigo-600 text-white shadow"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            onClick={() => setActiveTab(tab as any)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards Always Visible */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Total Users", value: users.length, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
                    { title: "Active Projects", value: projects.length, icon: FolderKanban, color: "text-indigo-600", bg: "bg-indigo-100" },
                    { title: "Total Tasks", value: 148, icon: ClipboardList, color: "text-emerald-600", bg: "bg-emerald-100" },
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

            {/* Dynamic Content based on Tab */}

            {/* USERS TAB */}
            {activeTab === "users" && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-gray-900">User Management</h3>
                        <button
                            onClick={() => setShowAddUser(!showAddUser)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            {showAddUser ? "Cancel" : "Add User"}
                        </button>
                    </div>

                    {showAddUser && (
                        <div className="p-4 bg-indigo-50 border-b border-indigo-100">
                            <form onSubmit={handleAddUser} className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-semibold text-indigo-900 mb-1">Full Name</label>
                                    <input required placeholder="E.g. John Doe" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="w-full text-sm p-2 rounded border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-semibold text-indigo-900 mb-1">Email</label>
                                    <input required type="email" placeholder="john@company.com" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="w-full text-sm p-2 rounded border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div className="w-full md:w-48">
                                    <label className="block text-xs font-semibold text-indigo-900 mb-1">Role</label>
                                    <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="w-full text-sm p-2 rounded border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                        <option value="developer">Developer</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-medium shadow-sm transition-colors flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Save
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <div key={user.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-4 mb-3 md:mb-0">
                                    <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                                        {user.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider
                    ${user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                            user.role === 'manager' ? 'bg-purple-100 text-purple-700' :
                                                'bg-gray-100 text-gray-700'}`}
                                    >
                                        {user.role}
                                    </span>
                                    <button onClick={() => removeUser(user.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete User">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {users.length === 0 && <div className="p-8 text-center text-gray-500">No users found</div>}
                    </div>
                </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === "projects" && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Project Oversight</h3>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map((proj) => (
                            <div key={proj.id} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-indigo-300 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900">{proj.name}</h4>
                                    <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">{proj.status}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Manager: <span className="font-medium">{proj.manager}</span></p>
                                <div className="flex justify-end border-t border-gray-50 pt-3">
                                    <button className="text-sm text-indigo-600 font-medium hover:underline">Edit Assignment &rarr;</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TASKS TAB */}
            {activeTab === "tasks" && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-8 text-center">
                    <ClipboardList className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Global Task View</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-4">As an admin, you can view all tasks organically filtering by projects and developers. (This view is under constructed demo phase).</p>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Refresh Task List
                    </button>
                </div>
            )}

        </div>
    );
}
