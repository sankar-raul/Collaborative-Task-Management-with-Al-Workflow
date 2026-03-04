import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
                <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
                <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 bg-[#1e5eb5] text-white rounded-lg hover:bg-[#1a51a0] transition-colors"
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
};
