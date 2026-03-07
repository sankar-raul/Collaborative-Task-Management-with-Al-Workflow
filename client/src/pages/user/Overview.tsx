import React from 'react';
import { Mail, Phone, Hash, Briefcase, MapPin, Edit2, ChevronRight } from 'lucide-react';
import type { Task } from '../../@types/interface/TasksInterface';
import type { Project } from '../../@types/interface/ProjectInterface';

interface OverviewProps {
    user: any;
    tasks: Task[];
    projects: Project[];
    taskStats: {
        assigned: number;
        inProgress: number;
        inReview: number;
        completed: number;
        overdue: number;
    };
}

const Overview: React.FC<OverviewProps> = ({ user, tasks, projects, taskStats }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Left Column - Employee Overview */}
            <div className="lg:col-span-12 xl:col-span-5 bg-white border border-gray-100 shadow-sm rounded-3xl p-8">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900">Employee Overview</h3>
                    <button className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl text-sm font-bold transition-all">
                        <Edit2 className="w-4 h-4" /> Edit
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-gray-50 p-3 rounded-2xl">
                            <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">{user.email}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Mail Address</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-gray-50 p-3 rounded-2xl">
                            <Phone className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">+91 87054 85673</p>
                            <p className="text-xs text-gray-400 mt-0.5">Phone Number </p>
                        </div>
                    </div>


                    <div className="flex items-start gap-4">
                        <div className="bg-gray-50 p-3 rounded-2xl">
                            <Briefcase className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Product Development</p>
                            <p className="text-xs text-gray-400 mt-0.5">January 2024</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-gray-50 p-3 rounded-2xl">
                            <MapPin className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Kolkata, WB</p>
                            <p className="text-xs text-gray-400 mt-0.5">Current Location</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Stats and Projects */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                {/* Task Overview Card */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-8">Task Overview</h3>
                    <div className="grid grid-cols-5 gap-4">
                        {[
                            { label: 'Assigned', count: taskStats.assigned, color: 'text-blue-600' },
                            { label: 'In Progress', count: taskStats.inProgress, color: 'text-indigo-600' },
                            { label: 'In Review', count: taskStats.inReview, color: 'text-purple-600' },
                            { label: 'Completed', count: taskStats.completed, color: 'text-green-600' },
                            { label: 'Overdue', count: taskStats.overdue, color: 'text-red-600' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center group cursor-default">
                                <p className={`text-2xl font-black mb-1 transition-transform group-hover:scale-110 ${stat.color}`}>{stat.count}</p>
                                <p className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-tight">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Project Membership Card */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Project Membership</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6 w-full">
                            {projects.length > 0 ? (
                                projects.slice(0, 3).map((project, idx) => {
                                    const userMember = project.members.find((m: any) => m.user._id === user._id || m.user === user._id);
                                    const colors = ['bg-purple-500', 'bg-cyan-500', 'bg-orange-500'];

                                    return (
                                        <div key={project._id} className="flex items-center gap-4 group cursor-pointer">
                                            <div className={`w-2 h-2 rounded-full ${colors[idx % 3]}`}></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-800 transition-colors group-hover:text-indigo-600">{project.projectName}</p>
                                                <p className="text-xs text-gray-400 capitalize">{userMember?.role || 'Member'}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-gray-400 italic">No project memberships found.</p>
                            )}
                            <p className="text-xs text-gray-400 pt-2 border-t border-gray-50 flex items-center gap-1">
                                Tasks · count <span className="font-bold text-gray-900">{tasks.length}</span>
                            </p>
                        </div>

                        {/* Chart Placeholder */}
                        <div className="relative w-40 h-40 flex-shrink-0">
                            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 drop-shadow-sm">
                                <path
                                    className="text-gray-100"
                                    strokeDasharray="100, 100"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.8"
                                />
                                <path
                                    className="text-indigo-500"
                                    strokeDasharray={`${Math.min(100, (tasks.length / 10) * 100)}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.8"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-gray-900 leading-none">{projects.length}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
