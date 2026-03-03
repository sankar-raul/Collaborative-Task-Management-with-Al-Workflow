import { Bell, Search, Menu } from "lucide-react";
import { useAuth } from "../../context/authContext";

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { member } = useAuth();

    // Format role for display (e.g., 'manager' -> 'Project Manager')
    const getDisplayRole = (role?: string) => {
        switch (role) {
            case 'manager':
                return 'Project Manager';
            case 'admin':
                return 'Administrator';
            case 'developer':
                return 'Developer';
            default:
                return 'User';
        }
    };

    return (
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sticky top-0 z-10 w-full">
            <div className="flex items-center flex-1">
                <button
                    onClick={onMenuClick}
                    className="p-2 mr-2 text-gray-500 rounded-lg hover:bg-gray-100 md:hidden"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="relative w-full max-w-md hidden sm:block">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="bg-[#f3f4f6] border-none text-gray-900 text-sm rounded-lg focus:ring-[#1e5eb5] focus:border-[#1e5eb5] block w-full pl-10 p-2.5"
                        placeholder="Search tasks, projects..."
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#00bdae] border-2 border-white rounded-full"></span>
                </button>

                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1e5eb5] to-[#14478f] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                        {member?.email?.substring(0, 2).toUpperCase() || 'U'}
                    </div>
                    <div className="hidden md:flex flex-col items-start pr-2">
                        <span className="text-sm font-bold text-gray-900 leading-tight">
                            {member?.email?.split('@')[0] || "User"}
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                            {getDisplayRole(member?.role)}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
