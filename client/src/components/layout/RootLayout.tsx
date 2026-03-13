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
                className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 transform md:static md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="h-full">
                    <Sidebar />
                </div>
            </div>

            {/* Backdrop for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={toggleSidebar}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header onMenuClick={toggleSidebar} />

                <main className="flex-1 overflow-y-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-7xl mx-auto w-full h-full">
                        {/* Renders the child route components */}
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
