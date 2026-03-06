import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import type { Member } from "../../utils/api/members/members.api";
import { ArrowLeft, Mail, Shield, User, Clock, CheckCircle, Briefcase } from "lucide-react";

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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/users')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Users
                </button>
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error || "User not found."}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/users')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-2 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-start justify-between border-b border-gray-100 pb-8 mb-8">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-3xl font-bold shadow-inner">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                            <div className="flex items-center text-gray-500 mt-2 space-x-4">
                                <span className="flex items-center">
                                    <Mail className="w-4 h-4 mr-1.5" />
                                    {user.email}
                                </span>
                                <span className="flex items-center capitalize">
                                    {user.role === 'Admin' ? <Shield className="w-4 h-4 mr-1.5 text-red-500" /> : <User className="w-4 h-4 mr-1.5 text-blue-500" />}
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                            Active Account
                        </span>
                        <p className="text-sm text-gray-500 mt-2">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Briefcase className="w-5 h-5 mr-2 text-indigo-500" />
                            Skills & Expertise
                        </h3>
                        {user.skills && user.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No skills listed.</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                            Workload Metrics
                        </h3>
                        <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 font-medium">Availability</span>
                                    <span className="text-gray-900 font-semibold">{user.availabilityHours} hrs/week</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, (user.availabilityHours / 40) * 100)}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 font-medium">Current Workload</span>
                                    <span className="text-gray-900 font-semibold">{user.currentWorkload} tasks</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
