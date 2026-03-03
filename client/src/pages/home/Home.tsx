import { useState } from "react";
import { useAuth } from "../../context/authContext";
import AdminDashboard from "../dashboard/AdminDashboard";
import ManagerDashboard from "../dashboard/ManagerDashboard";
import DeveloperDashboard from "../dashboard/DeveloperDashboard";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

export default function Home() {
  const { member } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderDashboard = () => {
    switch (member?.role) {
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
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden">
      {/* Sidebar - Desktop & Mobile overlay */}
      <div
        className={`${isSidebarOpen ? 'fixed inset-0 z-40 bg-black/50 md:bg-transparent md:static md:inset-auto' : 'hidden md:block'} transition-opacity`}
        onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
      >
        <div
          className="bg-white w-64 h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header onMenuClick={toggleSidebar} />

        <main className="flex-1 overflow-y-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto w-full">
            {renderDashboard()}
          </div>
        </main>
      </div>
    </div>
  );
}
