import { Mail, Shield, User, Circle } from "lucide-react";

export const UsersRoles = () => {
    // Mock user data for the system
    const systemUsers = [
        {
            id: 1,
            name: "Alice Smith",
            email: "alice@example.com",
            role: "admin",
            status: "Active",
            joined: "2024-01-15",
        },
        {
            id: 2,
            name: "Charlie Brown",
            email: "charlie@example.com",
            role: "manager",
            status: "Active",
            joined: "2025-06-20",
        },
        {
            id: 3,
            name: "Bob Jones",
            email: "bob@example.com",
            role: "developer",
            status: "Offline",
            joined: "2026-01-10",
        },
        {
            id: 4,
            name: "Diana Prince",
            email: "diana@example.com",
            role: "developer",
            status: "Active",
            joined: "2026-02-14",
        },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Users & Roles</h1>
                <p className="text-gray-600">View all registered users in the system and their assigned roles.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {systemUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mr-3">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-gray-600 capitalize">
                                            {user.role === 'admin' && <Shield className="w-4 h-4 mr-2 text-red-500" />}
                                            {user.role === 'manager' && <User className="w-4 h-4 mr-2 text-blue-500" />}
                                            {user.role === 'developer' && <User className="w-4 h-4 mr-2 text-green-500" />}
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center w-fit px-3 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            <Circle className={`w-2 h-2 mr-2 ${user.status === 'Active' ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`} />
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {user.joined}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
