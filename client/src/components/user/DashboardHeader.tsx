import React from 'react';
import { LogOut, User as UserIcon, Settings, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/auth';

interface DashboardHeaderProps {
    user: any;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
    const { logout } = useAuth();

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'skills', label: 'Skills' }
    ];

    return (
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden mb-6">
            {/* Top Bar */}
            <div className="px-8 py-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-gray-50/50 to-white">
                <div className="flex items-center gap-5">
                    <div className="relative group">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                        <p className="text-sm font-semibold text-gray-400 mt-0.5 flex items-center gap-2">
                            {user.email}
                        </p>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default DashboardHeader;
