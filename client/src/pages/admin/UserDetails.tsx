import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { ArrowLeft, Mail, Shield, User, Clock, CheckCircle, Briefcase, Activity } from "lucide-react";
import type { Member } from "@/@types/interface/MembersInterface";

export const UserDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const response = await api.members.getMemberById(id);
                if (response.success) {
                    setUser(response.data);
                } else {
                    setError("Failed to fetch user details.");
                }
            } catch (err: any) {
                setError(err.message || "An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-b-primary"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-6">
                <button
                    onClick={() => navigate('/users')}
                    className="flex items-center text-muted-foreground hover:text-foreground font-bold text-xs uppercase tracking-widest transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Registry
                </button>
                <div className="bg-rose-500/10 text-rose-500 p-6 rounded-2xl border border-rose-500/20 font-bold">
                    {error || "Personnel file not found."}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <button
                onClick={() => navigate('/users')}
                className="flex items-center text-muted-foreground hover:text-foreground font-semibold text-sm transition-all group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to Users
            </button>

            <div className="bg-card rounded-3xl border border-border shadow-sm p-10 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between border-b border-border pb-10 mb-10 relative z-10">
                    <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                        <div className="w-24 h-24 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-4xl font-bold border border-primary/20 shadow-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">{user.name}</h1>
                            <div className="flex flex-col md:flex-row items-center text-muted-foreground font-medium text-sm gap-4 md:gap-6">
                                <span className="flex items-center">
                                    <Mail className="w-4 h-4 mr-2 text-primary/60" />
                                    {user.email}
                                </span>
                                <span className="flex items-center">
                                    {user.role === 'Admin' ? (
                                        <span className="flex items-center text-rose-600 bg-rose-500/10 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-rose-500/20">
                                            <Shield className="w-3 h-3 mr-2" />
                                            Administrator
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-primary bg-primary/10 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                                            <User className="w-3 h-3 mr-2" />
                                            Team Member
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center md:text-right mt-6 md:mt-0 space-y-2">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <CheckCircle className="w-3 h-3 mr-2" />
                            Active
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider">
                            Joined on <br />
                            <span className="text-muted-foreground/80 lowercase">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center">
                            <Briefcase className="w-4 h-4 mr-3 text-primary/60" />
                            Skills & Expertise
                        </h3>
                        {user.skills && user.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1.5 bg-muted/50 border border-border text-foreground font-semibold rounded-lg text-xs hover:border-primary/30 transition-colors">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 bg-muted/20 rounded-2xl border border-dashed border-border flex items-center justify-center">
                                <p className="text-muted-foreground text-xs font-medium italic text-center">No skills recorded for this user.</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center">
                            <Activity className="w-4 h-4 mr-3 text-primary/60" />
                            Workload Capacity
                        </h3>
                        <div className="space-y-6 bg-muted/20 p-6 rounded-2xl border border-border">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                    <span className="text-muted-foreground">Weekly Availability</span>
                                    <span className="text-foreground">{user.availabilityHours} hours</span>
                                </div>
                                <div className="w-full bg-border/40 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="bg-primary h-full rounded-full transition-all duration-1000" 
                                        style={{ width: `${Math.min(100, (user.availabilityHours / 40) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-border">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                    <span className="text-muted-foreground">Active Projects</span>
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md border border-primary/20">
                                        {user.currentWorkload} Tasks
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
