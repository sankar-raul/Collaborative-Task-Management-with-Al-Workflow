import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { api } from "../../utils/api";
import Button from "../shared/Button";
import Input from "../shared/Input";
import SkillsInput from "../shared/SkillsInput";
import { UserCircle, CheckCircle, X, Camera } from "lucide-react";

const UserProfileSettings = () => {
    const { member } = useAuth();
    const [formData, setFormData] = useState({
        name: member?.name || "",
        email: member?.email || "",
        skills: [] as string[],
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            if (!member?._id) return;
            try {
                const res = await api.members.getMemberById(member._id);
                if (res.success && res.data) {
                    setFormData((prev) => ({
                        ...prev,
                        name: res.data.name || prev.name,
                        skills: res.data.skills || [],
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            } finally {
                setFetching(false);
            }
        };
        fetchUserData();
    }, [member?._id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        try {
            const res = await api.members.updateMe({
                name: formData.name,
                skills: formData.skills
            });
            if (res.success) {
                setShowSuccess(true);
            } else {
                setErrorMsg("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            setErrorMsg("An error occurred while saving profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl p-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h2 className="text-3xl font-black text-foreground tracking-tight">
                        My Profile
                    </h2>
                    <p className="text-muted-foreground font-medium mt-1">Manage your personal information and expertise.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-16">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center space-y-6">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-[2rem] bg-primary/10 flex items-center justify-center border-4 border-card shadow-2xl overflow-hidden text-primary group-hover:bg-primary/20 transition-all duration-300">
                            <UserCircle className="w-24 h-24" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <button className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-3 rounded-2xl shadow-lg hover:scale-110 active:scale-90 transition-all">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>
                    
                    {member?.role && (
                        <div className="px-5 py-2 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-2xl border border-primary/20 shadow-xs">
                            {member.role}
                        </div>
                    )}
                </div>

                {/* Profile Details Form */}
                <div className="flex-1 w-full max-w-lg">
                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-black text-foreground/70 mb-2">
                                Full Name
                            </label>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                                className="w-full py-3.5 px-5 rounded-xl border-border bg-secondary/30 focus:bg-card transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-black text-foreground/70 mb-2">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                className="w-full py-3.5 px-5 rounded-xl border-border bg-secondary/10 text-muted-foreground cursor-not-allowed"
                                disabled 
                            />
                            <p className="text-[10px] text-muted-foreground/60 mt-2 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <span className="p-0.5 rounded-full bg-muted" /> Read-only for security reasons.
                            </p>
                        </div>

                        <div className="pt-2">
                            <SkillsInput
                                skills={formData.skills}
                                setSkills={(skills) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        skills,
                                    }))
                                }
                            />
                        </div>

                        {errorMsg && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                                <p className="text-xs text-rose-500 text-center font-bold uppercase tracking-wider">
                                    {errorMsg}
                                </p>
                            </div>
                        )}

                        <div className="pt-8 border-t border-border/40 flex justify-end">
                            <Button type="submit" disabled={loading} className="w-full md:w-auto px-10 py-4 font-black shadow-xl shadow-primary/20">
                                {loading ? "Saving changes..." : "Save Profile Details"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-card border border-border rounded-[3rem] w-full max-w-sm shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] p-10 text-center animate-in zoom-in-95 duration-300">
                        <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-6 border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">Profile Updated!</h3>
                        <p className="text-muted-foreground text-sm font-medium mb-8 leading-relaxed">
                            Your professional profile has been successfully updated and synced.
                        </p>
                        <Button
                            onClick={() => setShowSuccess(false)}
                            className="w-full py-4 font-black shadow-lg"
                        >
                            Got it, Thanks!
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfileSettings;
