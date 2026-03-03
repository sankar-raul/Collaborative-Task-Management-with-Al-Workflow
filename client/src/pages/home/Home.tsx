import { useAuth } from "../../context/authContext";
import AdminDashboard from "../dashboard/AdminDashboard";
import ManagerDashboard from "../dashboard/ManagerDashboard";
import DeveloperDashboard from "../dashboard/DeveloperDashboard";

export default function Home() {
  const { user, logout } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case "admin":
        return <AdminDashboard />;
      case "manager":
        return <ManagerDashboard />;
      case "developer":
        return <DeveloperDashboard />;
      default:
        return (
          <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg space-y-6 border border-gray-100 text-center mx-auto mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Welcome User!</h2>
            <p className="text-gray-500 mt-2">You currently have no special assignments. Contact your administrator.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">AI TaskFlow</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-gray-900">{user?.email}</span>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{user?.role}</span>
              </div>
              <div className="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold uppercase shadow-sm border border-indigo-200">
                {user?.email?.[0] || "U"}
              </div>
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors ml-4 border-l border-gray-200 pl-4"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
}
