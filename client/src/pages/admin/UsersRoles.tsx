import { Mail, Shield, User } from "lucide-react";

// ...existing imports...
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useUsers } from "../../context/users";

export const UsersRoles = () => {
    const { systemUsers, isLoading: loading, error } = useUsers();
    const navigate = useNavigate();
    const { member } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

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
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Joined Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {systemUsers.filter(user => user._id !== member?.id).map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mr-3">
                                                {user.name.charAt(0).toUpperCase()}
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
                                            {user.role === 'Admin' && <Shield className="w-4 h-4 mr-2 text-red-500" />}
                                            {user.role === 'User' && <User className="w-4 h-4 mr-2 text-blue-500" />}
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString() || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => navigate(`/users/${user._id}`)}
                                            className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            View Details
                                        </button>
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
