import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function RootLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
                        {/* Renders the child route components */}
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
