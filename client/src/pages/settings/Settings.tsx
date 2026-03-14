import React from "react";
import GeneralSettings from "@/components/settings/GeneralSettings";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import UserProfileSettings from "@/components/settings/UserProfileSettings";
import { useState } from "react";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("My Profile");

    const renderContent = () => {
        switch (activeTab) {
            case "My Profile":
                return <UserProfileSettings />;
            case "General":
                return <GeneralSettings />;
            default:
                return (
                    <div className="flex-1 p-8">
                        <h2 className="text-2xl font-black text-foreground mb-6 tracking-tight">
                            {activeTab} Settings
                        </h2>
                        <div className="p-12 bg-secondary/30 rounded-3xl border border-dashed border-border/60 text-center">
                            <p className="text-muted-foreground font-medium italic">This section is currently under development.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col md:flex-row bg-card h-full min-h-[calc(100vh-theme(spacing.16))] border border-border/50 rounded-3xl overflow-hidden shadow-xs">
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <div className="flex-1 border-l border-border bg-background focus:outline-none overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default Settings;
