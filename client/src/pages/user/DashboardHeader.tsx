import React from 'react';
import { Linkedin, Layout, TrendingUp, CheckCircle2, Briefcase } from 'lucide-react';

interface DashboardHeaderProps {
    user: any;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, activeTab, setActiveTab }) => {
    return (
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden">
            <div className="p-8 pb-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-100">
                                {user.name?.charAt(0)}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                {user.name} <span className="text-gray-400 text-lg font-normal">(24)</span>
                            </h1>
                            <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
                                TaskFlow · {user.role === 'Admin' ? 'System Administrator' : 'Senior Software Developer'}
                            </p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-md shadow-indigo-100 active:scale-95">
                        <Linkedin className="w-5 h-5" />
                        LinkedIn Account
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'overview', label: 'Overview', icon: Layout },
                        { id: 'skills', label: 'Skills', icon: TrendingUp },
                        { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
                        { id: 'projects', label: 'Projects', icon: Briefcase },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
