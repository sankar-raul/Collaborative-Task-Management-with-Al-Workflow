import React from 'react';
import type { Member } from '../../@types/interface/MembersInterface';

interface DashboardHeaderProps {
    user: Member;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
    return (
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden mb-6">
            {/* Top Bar */}
            <div className="px-8 py-8 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-linear-to-r from-secondary/30 to-card">
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-3xl font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-card rounded-full shadow-sm"></div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Welcome back, {user.name}!</h1>
                        <p className="text-sm font-semibold text-muted-foreground mt-1 flex items-center gap-2">
                            {user.email}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
