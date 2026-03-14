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
        <div className="max-w-4xl p-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-black text-foreground mb-12 tracking-tight pb-4 border-b border-border/40">
                Notifications Hub
            </h2>

            {/* Notify me when Section */}
            <div className="mb-16">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <span className="text-xl font-bold text-foreground">Alert Protocols</span>
                        <p className="text-xs text-muted-foreground mt-1 font-medium text-wrap">Configure when you want to be notified about workspace actions.</p>
                    </div>
                    <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline whitespace-nowrap">
                        Docs
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { id: "dailyUpdate", label: "Daily productivity summaries" },
                        { id: "newEvent", label: "New team event broadcasts" },
                        { id: "addedOnTeam", label: "Instant team invitation alerts" },
                    ].map((item) => (
                        <label key={item.id} className="flex items-center p-4 bg-secondary/30 border border-border/50 rounded-2xl cursor-pointer hover:bg-secondary/50 transition-all group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={notifications[item.id as keyof typeof notifications]}
                                    onChange={() => handleNotificationChange(item.id as keyof typeof notifications)}
                                    className="peer w-6 h-6 opacity-0 absolute cursor-pointer"
                                />
                                <div className="w-6 h-6 border-2 border-border/60 rounded-lg flex items-center justify-center transition-all peer-checked:bg-primary peer-checked:border-primary">
                                    <svg className="w-4 h-4 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <span className="text-foreground/80 text-sm font-bold ml-4 group-hover:text-foreground transition-colors">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Toggle Notifications Section */}
            <div className="space-y-6 mb-16">
                <p className="text-[10px] font-black text-muted-foreground/50 tracking-[0.2em] mb-4 uppercase">Delivery Channels</p>
                
                {[
                    { id: "push", label: "Mobile Push Notifications", desc: "Native alerts on your iOS or Android devices." },
                    { id: "desktop", label: "Desktop Notifications", desc: "System-level banners even when the app is minimized." },
                    { id: "email", label: "Email Digests", desc: "Comprehensive reports delivered directly to your inbox." },
                ].map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-6 bg-card border border-border shadow-xs rounded-[1.5rem] hover:shadow-md transition-all">
                        <div className="max-w-md">
                            <h3 className="font-bold text-foreground mb-1">{item.label}</h3>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggleChange(item.id as keyof typeof toggles)}
                            className={`w-14 h-8 rounded-full transition-all relative focus:outline-none p-1.5 ${toggles[item.id as keyof typeof toggles] ? "bg-primary shadow-lg shadow-primary/20" : "bg-muted"
                                }`}
                        >
                            <span
                                className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${toggles[item.id as keyof typeof toggles] ? "translate-x-6" : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>
                ))}
            </div>

            {/* Settings Section */}
            <h2 className="text-xl font-black text-foreground mb-8 pb-4 border-b border-border/40 tracking-tight">
                Preference Engine
            </h2>

            <div className="space-y-6">
                <div className="flex justify-between items-center p-6 bg-card border border-border/60 rounded-2xl">
                    <div>
                        <h3 className="font-bold text-foreground mb-1 text-wrap">Visual Architecture</h3>
                        <p className="text-xs text-muted-foreground font-medium">
                            Adjust the global application theme density.
                        </p>
                    </div>
                    <select className="bg-secondary/50 border border-border text-foreground font-bold py-2 px-4 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer hover:bg-secondary transition-colors">
                        <option>Dark Mode (Default)</option>
                        <option>Light Aesthetics</option>
                        <option>Sync to OS</option>
                    </select>
                </div>

                <div className="flex justify-between items-center p-6 bg-card border border-border/60 rounded-2xl">
                    <div className="max-w-md">
                        <h3 className="font-bold text-foreground mb-1">Advanced Verification</h3>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                            Enhance security with Multi-Factor Authentication (MFA). 
                        </p>
                    </div>
                    <button
                        onClick={() => handleToggleChange("twoFactor")}
                        className={`w-14 h-8 rounded-full transition-all relative focus:outline-none p-1.5 ${toggles.twoFactor ? "bg-primary shadow-lg shadow-primary/20" : "bg-muted"
                            }`}
                    >
                        <span
                            className={`block w-5 h-5 rounded-full bg-white transition-all duration-300 ${toggles.twoFactor ? "translate-x-6" : "translate-x-0"
                                }`}
                        />
                    </button>
                </div>

                <div className="flex justify-between items-center p-6 bg-card border border-border/60 rounded-2xl">
                    <div>
                        <h3 className="font-bold text-foreground mb-1">Interface Language</h3>
                        <p className="text-xs text-muted-foreground font-medium">
                            Preferred language for the user interface.
                        </p>
                    </div>
                    <select className="bg-secondary/50 border border-border text-foreground font-bold py-2 px-4 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer hover:bg-secondary transition-colors">
                        <option>English (Global)</option>
                        <option>Hindi (Localized)</option>
                        <option>Spanish (ES)</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
