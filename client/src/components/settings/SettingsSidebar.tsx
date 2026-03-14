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
        <aside className="w-full md:w-72 md:h-full bg-card flex flex-col pt-8 md:overflow-y-auto border-r border-border/50">
            <div className="px-8 mb-10">
                <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                    <span className="tracking-tighter">Settings</span>
                    <span className="text-muted-foreground/30 font-thin">/</span>
                    <span className="text-sm text-primary font-bold">{activeTab}</span>
                </h2>
            </div>

            <div className="px-4 mb-4 md:mb-8">
                <p className="px-6 text-[10px] font-black text-muted-foreground/50 tracking-[0.2em] mb-4 uppercase hidden md:block">
                    Personal Settings
                </p>
                <ul className="flex overflow-x-auto md:flex-col gap-2 pb-4 md:pb-0 px-2 scrollbar-none">
                    {accountLinks.map((link) => (
                        <li key={link.name} className="flex-shrink-0 md:w-full">
                            <button
                                onClick={() => setActiveTab(link.name)}
                                className={`flex items-center w-full px-6 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === link.name
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    }`}
                            >
                                <link.icon className={`w-5 h-5 mr-4 transition-colors ${activeTab === link.name ? "text-primary-foreground" : "text-muted-foreground/60"}`} />
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
