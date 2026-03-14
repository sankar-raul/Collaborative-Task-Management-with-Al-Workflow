import { useState, useEffect } from "react";
import { Plus, FolderOpen, Calendar, Clock, LayoutGrid, List } from "lucide-react";
import { useNavigate } from "react-router";
import { api } from "../../utils/api";
import { useUsers } from "../../context/users";
import type { Project } from "../../@types/interface/ProjectInterface";
import type { TechStack } from "../../@types/interface/StackInterface";
import { CreateProjectModal } from "../../components/admin/CreateProjectModal";

export const AdminProjects = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [techStacks, setTechStacks] = useState<TechStack[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { systemUsers, isLoading: isUsersLoading } = useUsers();
    const [selectedMembers, setSelectedMembers] = useState<{ user: string, role: string }[]>([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const projectsRes = await api.projects.getProjects(1, 100);
            const stacksRes = await api.stack.getAllStacks();

            if (projectsRes.success) setProjects(projectsRes.data);
            if (stacksRes.success) setTechStacks(stacksRes.data);

        } catch (err: any) {
            setError(err.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateProject = async (data: any) => {
        setSubmitting(true);
        try {
            const { isAI, ...projectData } = data;
            const res = isAI 
                ? await api.projects.createProjectByAI(projectData)
                : await api.projects.createProject(projectData);
            
            if (res.success) {
                await fetchData();
                setIsCreateModalOpen(false);
            } else {
                alert(res.message);
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleMemberSelection = (userId: string) => {
        setSelectedMembers(prev =>
            prev.some(m => m.user === userId)
                ? prev.filter(m => m.user !== userId)
                : [...prev, { user: userId, role: "Manager" }]
        );
    };

    const updateMemberRole = (userId: string, role: string) => {
        setSelectedMembers(prev =>
            prev.map(m => m.user === userId ? { ...m, role } : m)
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-b-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="p-6 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20 font-bold shadow-sm">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Project Control</h1>
                    <p className="text-muted-foreground font-medium italic text-sm">Comprehensive governance of organizational initiatives and resource allocation.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-500/20 font-bold uppercase tracking-[0.15em] text-[10px]"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Initiate Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="bg-card rounded-3xl border border-border p-20 text-center shadow-sm">
                    <div className="w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
                        <FolderOpen className="w-10 h-10 text-orange-500/40" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">No active projects found</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8 text-sm font-medium leading-relaxed">
                        Currently there are no active operations. Start by initiating a new project to manage your team and tasks.
                    </p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center px-8 py-3 bg-secondary text-foreground rounded-xl hover:bg-secondary/80 transition-all font-bold uppercase tracking-wider text-[10px] border border-border"
                    >
                        Create Your First Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div key={project._id}
                            onClick={(e) => { e.stopPropagation(); navigate(`/admin/projects/${project._id}`); }}
                            className="bg-card rounded-3xl border border-border hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 transition-all group cursor-pointer p-6 flex flex-col relative"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-600 border border-orange-500/20 group-hover:scale-110 transition-transform">
                                    <FolderOpen className="w-6 h-6" />
                                </div>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                                    (project.status || 'IN_PROGRESS') === 'COMPLETED' 
                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                                        : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                                }`}>
                                    {(project.status || 'IN_PROGRESS').replace("_", " ")}
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight group-hover:text-orange-600 transition-colors line-clamp-1">
                                {project.projectName}
                            </h3>
                            <p className="text-muted-foreground text-xs font-medium line-clamp-2 h-10 mb-8 leading-relaxed">
                                {project.description || "No project description available in the registry at this time."}
                            </p>

                            <div className="space-y-3 pt-6 border-t border-border">
                                <div className="flex items-center text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                    <Calendar className="w-3.5 h-3.5 mr-3 text-muted-foreground/30" />
                                    Deployment: <span className="ml-2 text-foreground/80">{new Date(project.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                    <Clock className="w-3.5 h-3.5 mr-3 text-muted-foreground/30" />
                                    Task Force: <span className="ml-2 text-foreground/80">{project.members?.length || 0} Operators</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setSelectedMembers([]);
                }}
                onSubmit={handleCreateProject}
                submitting={submitting}
                systemUsers={systemUsers}
                isUsersLoading={isUsersLoading}
                selectedMembers={selectedMembers}
                toggleMemberSelection={toggleMemberSelection}
                updateMemberRole={updateMemberRole}
                techStacks={techStacks}
            />
        </div>
    );
};
