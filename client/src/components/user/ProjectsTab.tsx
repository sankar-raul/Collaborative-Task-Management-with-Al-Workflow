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
        <div className="bg-card border border-border shadow-sm rounded-3xl p-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-foreground tracking-tight">Project Memberships</h3>
                <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold">
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
                            className="flex items-center justify-between p-6 bg-secondary/40 hover:bg-primary/5 rounded-2xl transition-all border border-transparent hover:border-primary/20 group cursor-pointer"
                        >
                            <div className="flex items-center gap-5">
                                <div className="bg-card p-3 rounded-xl shadow-xs group-hover:shadow-primary/10 transition-all border border-border/50">
                                    <Briefcase className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-lg">
                                        {project.projectName}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-2">
                                        <span className="font-black text-primary bg-primary/10 px-2.5 py-1 rounded-lg uppercase tracking-[0.1em] text-[10px]">
                                            {userMember?.role || 'Member'}
                                        </span>
                                        <span className="text-muted-foreground/40">•</span>
                                        <span className="font-medium">Last updated {new Date(project.updatedAt || '').toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="p-2.5 w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all" title="View Tasks">
                                    <CheckSquare className="w-5 h-5" />
                                </button>
                                <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    );
                })}

                {projects.length === 0 && (
                    <div className="text-center py-20 bg-secondary/50 rounded-3xl border border-dashed border-border/60">
                        <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">No project memberships found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectsTab;
