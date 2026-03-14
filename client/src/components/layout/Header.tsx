import { Bell, Search, Menu } from "lucide-react";
import { useAuth } from "../../context/auth";
import { useState } from "react";
import { NotificationPanel } from "./NotificationPanel";
import { useToast } from "@/context/toast";
import ThemeToggle from "../shared/ThemeToggle";

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { member } = useAuth();
    const { notifications } = useToast();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const getDisplayRole = (role?: string) => {
        switch (role) {
            case 'Admin':
                return 'Administrator';
            case 'User':
                return 'User';
            default:
                return 'User';
        }
    };

    return (
        <header className=" border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-30 w-full backdrop-blur-md bg-card/80">
            <div className="flex items-center flex-1">
                <button
                    onClick={onMenuClick}
                    className="p-2 mr-4 text-muted-foreground rounded-xl hover:bg-secondary md:hidden transition-colors"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="relative w-full max-w-sm hidden sm:block group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                        <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="bg-secondary/50 border border-transparent text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-card block w-full pl-10 p-2.5 transition-all outline-none"
                        placeholder="Search tasks, projects..."
                    />
                </div>
            </div>

            <div className="flex items-center space-x-3 md:space-x-5">
                {/* Theme Toggle Integration */}
                <ThemeToggle />

                <div className="relative">
                    <button 
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
                        aria-label="View notifications"
                    >
                        <Bell className="w-5 h-5" />
                        {notifications.length > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card ring-0" />
                        )}
                    </button>
                    <NotificationPanel 
                        isOpen={isNotificationOpen} 
                        onClose={() => setIsNotificationOpen(false)} 
                    />
                </div>

                <div className="flex items-center gap-3 pl-2 border-l border-border/50">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-bold text-foreground leading-none mb-1">
                            {member?.name || "User"}
                        </span>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            {getDisplayRole(member?.role)}
                        </span>
                    </div>
                    
                </div>
            </div>
        </header>
    );
}
