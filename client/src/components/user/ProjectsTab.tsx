import React from 'react';
import { Briefcase, ChevronRight, CheckSquare } from 'lucide-react';
import type { Project } from '../../@types/interface/ProjectInterface';
import { useNavigate } from 'react-router-dom';

interface ProjectsTabProps {
    projects: Project[];
    user: any;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects, user }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-900">Project Memberships</h3>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                    {projects.length} Active
                </span>
            </div>

            <div className="space-y-4">
                {projects.map((project) => {
                    const userMember = project.members.find((m: any) => m.user._id === user._id || m.user === user._id);

                    return (
                        <div
                            key={project._id}
                            onClick={() => navigate(`/projects/${project._id}`)}
                            className="flex items-center justify-between p-6 bg-gray-50 hover:bg-indigo-50/50 rounded-2xl transition-all border border-transparent hover:border-indigo-100 group cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-white p-3 rounded-xl shadow-sm group-hover:shadow-indigo-100 transition-all">
                                    <Briefcase className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                                        {project.projectName}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                        <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                            {userMember?.role || 'Member'}
                                        </span>
                                        • Last updated {new Date(project.updatedAt || '').toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all" title="View Tasks">
                                    <CheckSquare className="w-5 h-5" />
                                </button>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    );
                })}

                {projects.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-400 font-medium">No project memberships found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectsTab;
