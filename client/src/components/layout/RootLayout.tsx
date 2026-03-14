import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function RootLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    return (
        <div className="min-h-screen bg-background flex font-sans overflow-hidden transition-colors duration-300">
            {/* Sidebar - Desktop & Mobile overlay */}
            <div
                className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 transform md:static md:translate-x-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <Sidebar 
                    collapsed={isCollapsed} 
                    onToggle={toggleCollapse}
                />
            </div>

            {/* Backdrop for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 md:hidden backdrop-blur-sm transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header onMenuClick={toggleSidebar} />

                <main className="flex-1 overflow-y-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                    <div className="max-w-7xl mx-auto w-full h-full">
                        {/* Renders the child route components */}
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
