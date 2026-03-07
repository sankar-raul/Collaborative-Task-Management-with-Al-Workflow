import React from "react";
import {
    User,
    Settings,
    Sliders,
} from "lucide-react";

interface SettingsSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeTab, setActiveTab }) => {
    const accountLinks = [
        { name: "My Profile", icon: User },
        { name: "General", icon: Settings },
        { name: "Preferences", icon: Sliders }
    ];

    return (
        <aside className="w-full md:w-64 md:h-full bg-white border-r border-gray-100 flex flex-col pt-6 md:overflow-y-auto">
            <div className="px-6 mb-8">
                <h2 className="text-xl font-semibold flex items-center text-gray-900 border-b pb-4">
                    <span className="font-bold text-gray-800">Settings</span>
                    <span className="mx-2 text-gray-400 font-normal">›</span>
                    <span className="text-sm text-gray-500 font-normal">{activeTab}</span>
                </h2>
            </div>

            <div className="px-4 mb-4 md:mb-6">
                <p className="px-4 text-xs font-semibold text-gray-400 tracking-wider mb-2 uppercase hidden md:block">
                    Account
                </p>
                <ul className="flex overflow-x-auto md:flex-col md:space-y-1 pb-2 md:pb-0 hide-scrollbar">
                    {accountLinks.map((link) => (
                        <li key={link.name} className="flex-shrink-0 md:w-full">
                            <button
                                onClick={() => setActiveTab(link.name)}
                                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === link.name
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <link.icon className="w-4 h-4 mr-2 md:mr-3 text-gray-500" />
                                <span className="whitespace-nowrap">{link.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>


        </aside>
    );
};

export default SettingsSidebar;
