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
                        <h2 className="text-2xl font-semibold mb-6">
                            {activeTab} Settings
                        </h2>
                        <p className="text-gray-500">This section is under construction.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col md:flex-row bg-white h-full min-h-screen">
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <div className="flex-1 border-l border-gray-100 bg-gray-50/30 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default Settings;
