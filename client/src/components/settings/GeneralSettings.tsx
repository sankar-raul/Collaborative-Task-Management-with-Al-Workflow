import React, { useState } from "react";

const GeneralSettings = () => {
    const [notifications, setNotifications] = useState({
        dailyUpdate: true,
        newEvent: true,
        addedOnTeam: true,
    });

    const [toggles, setToggles] = useState({
        push: true,
        desktop: true,
        email: false,
        twoFactor: true,
    });

    const handleNotificationChange = (key: keyof typeof notifications) => {
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleToggleChange = (key: keyof typeof toggles) => {
        setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-4xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-8 pb-4 border-b">
                My Notifications
            </h2>

            {/* Notify me when Section */}
            <div className="mb-10 flex flex-col md:flex-row justify-between pr-4 items-start">
                <div className="w-full">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-gray-800">Notify me when...</span>
                        <button className="text-indigo-600 text-sm hover:underline">
                            About notifications?
                        </button>
                    </div>
                    <div className="space-y-3">
                        {[
                            { id: "dailyUpdate", label: "Daily productivity update" },
                            { id: "newEvent", label: "New event created" },
                            { id: "addedOnTeam", label: "When added on new team" },
                        ].map((item) => (
                            <label key={item.id} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifications[item.id as keyof typeof notifications]}
                                    onChange={() => handleNotificationChange(item.id as keyof typeof notifications)}
                                    className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-gray-600 text-sm">{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Toggle Notifications Section */}
            <div className="space-y-8 mb-12">
                <div className="flex justify-between items-center pr-4">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Mobile push notifications</h3>
                        <p className="text-sm text-gray-500">
                            Receive push notification whenever your organisation requires your attentions
                        </p>
                    </div>
                    {/* Toggle Button */}
                    <button
                        onClick={() => handleToggleChange("push")}
                        className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${toggles.push ? "bg-indigo-600" : "bg-gray-200"
                            }`}
                    >
                        <span
                            className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${toggles.push ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>

                <div className="flex justify-between items-center pr-4">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Desktop Notification</h3>
                        <p className="text-sm text-gray-500">
                            Receive desktop notification whenever your organisation requires your attentions
                        </p>
                    </div>
                    <button
                        onClick={() => handleToggleChange("desktop")}
                        className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${toggles.desktop ? "bg-indigo-600" : "bg-gray-200"
                            }`}
                    >
                        <span
                            className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${toggles.desktop ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>

                <div className="flex justify-between items-center pr-4">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Email Notification</h3>
                        <p className="text-sm text-gray-500">
                            Receive email whenever your organisation requires your attentions
                        </p>
                    </div>
                    <button
                        onClick={() => handleToggleChange("email")}
                        className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${toggles.email ? "bg-indigo-600" : "bg-gray-200"
                            }`}
                    >
                        <span
                            className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${toggles.email ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Settings Section */}
            <h2 className="text-xl font-bold text-gray-900 mb-8 pb-4 border-b">
                My Settings
            </h2>

            <div className="space-y-8">
                <div className="flex justify-between items-center pr-4">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Appearance</h3>
                        <p className="text-sm text-gray-500">
                            Customize how you theams looks on your device.
                        </p>
                    </div>
                    <select className="bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>Light</option>
                        <option>Dark</option>
                        <option>System</option>
                    </select>
                </div>

                <div className="flex justify-between items-center pr-4">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Two-factor authentication</h3>
                        <p className="text-sm text-gray-500">
                            Keep your account secure by enabling 2FA via SMS or using a temporary one-time passcode (TOTP).
                        </p>
                    </div>
                    <button
                        onClick={() => handleToggleChange("twoFactor")}
                        className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${toggles.twoFactor ? "bg-indigo-600" : "bg-gray-200"
                            }`}
                    >
                        <span
                            className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${toggles.twoFactor ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>

                <div className="flex justify-between items-center pr-4">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Language</h3>
                        <p className="text-sm text-gray-500">
                            Customize how you theams looks on your device.
                        </p>
                    </div>
                    <select className="bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
