import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import {
    LayoutDashboard,
    CheckSquare,
    FolderOpen,
    MessageSquare,
    LogOut,
} from "lucide-react";

export default function Sidebar() {
    const { logout } = useAuth();

    const navLinks = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "My Tasks", path: "/tasks", icon: CheckSquare },
        { name: "Projects", path: "/projects", icon: FolderOpen },
        { name: "Messages", path: "/messages", icon: MessageSquare },
    ];

    return (
        <aside className="w-64 bg-[#f8fbff] h-screen flex flex-col border-r border-gray-100 hidden md:flex sticky top-0">
            {/* Brand logo area */}
            <div className="h-16 flex items-center px-6 border-b border-transparent">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[#1e5eb5] rounded-lg flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-[#1e5eb5]">Taskflow AI</span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? "bg-[#ebf0fa] text-[#1e5eb5]"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`
                        }
                    >
                        <link.icon className="w-5 h-5 mr-3" />
                        {link.name}
                    </NavLink>
                ))}
            </nav>

            {/* Sign Out Button */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
