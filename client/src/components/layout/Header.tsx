import { Bell, Search, Menu } from "lucide-react";
import { useAuth } from "../../context/auth";
import { useState } from "react";
import { NotificationPanel } from "./NotificationPanel";
import { useToast } from "@/context/toast";

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { member } = useAuth();
    const { notifications } = useToast();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const getDisplayRole = (role?: string) => {
        switch (role) {
            case 'Admin':
                return 'Administrator';
            case 'User':
                return 'User';
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
                <div className="relative">
                    <button 
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className="relative text-gray-500 md:cursor-pointer hover:text-gray-700 transition-colors"
                    >
                        <Bell className="w-6 h-6" />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {notifications.length > 9 ? '9+' : notifications.length}
                            </span>
                        )}
                    </button>
                    <NotificationPanel 
                        isOpen={isNotificationOpen} 
                        onClose={() => setIsNotificationOpen(false)} 
                    />
                </div>

                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-linear-to-br from-[#1e5eb5] to-[#14478f] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                        {member?.name?.substring(0, 2).toUpperCase() || 'U'}
                    </div>
                    <div className="hidden md:flex flex-col items-start pr-2">
                        <span className="text-sm font-bold text-gray-900 leading-tight">
                            {member?.name || "User"}
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
