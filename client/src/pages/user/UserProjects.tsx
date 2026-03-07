import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../context/auth";
import type { Project } from "../../@types/interface/ProjectInterface";
import ProjectsTab from "../../components/user/ProjectsTab";

export default function UserProjects() {
    const { member } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!member?.id) return;
            try {
                setLoading(true);
                const [projectsRes, userRes] = await Promise.all([
                    api.members.getAssignedProjects(),
                    api.members.getMemberById(member.id)
                ]);
                if (projectsRes.success) setProjects(projectsRes.data);
                if (userRes.success) setUser(userRes.data);
            } catch (error) {
                console.error("Failed to fetch user projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [member?.id]);

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Projects</h1>
                <p className="text-gray-500 text-sm">View and manage your project memberships.</p>
            </div>
            <ProjectsTab projects={projects} user={user} />
        </div>
    );
}
