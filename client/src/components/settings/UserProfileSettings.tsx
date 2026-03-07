import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { api } from "../../utils/api";
import Button from "../shared/Button";
import Input from "../shared/Input";
import SkillsInput from "../shared/SkillsInput";
import { UserCircle, CheckCircle, X } from "lucide-react";

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
            if (!member?.id) return;
            try {
                const res = await api.members.getMemberById(member.id);
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
    }, [member?.id]);

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
        <div className="max-w-4xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-8 pb-4 border-0 md:border-b">
                My Profile
            </h2>

            <div className="flex flex-col md:flex-row gap-10">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden text-indigo-500">
                        <UserCircle className="w-20 h-20" />
                    </div>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                        Change Picture
                    </button>
                    {member?.role && (
                        <div className="mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                            {member.role}
                        </div>
                    )}
                </div>

                {/* Profile Details Form */}
                <div className="flex-1 w-full max-w-lg">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                className="w-full"
                                disabled // Typically email changes might require different flow
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Email address cannot be changed directly for security reasons.
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
                            <div className="text-red-500 text-sm font-medium">
                                {errorMsg}
                            </div>
                        )}

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <Button type="submit" disabled={loading} className="w-auto px-8">
                                {loading ? "Saving changes..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Updated!</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Your profile details have been successfully saved to the database.
                        </p>
                        <Button
                            onClick={() => setShowSuccess(false)}
                            className="w-full"
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfileSettings;
