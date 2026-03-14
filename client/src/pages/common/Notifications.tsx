import { BellOff } from "lucide-react";

export const Notifications = () => {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-foreground tracking-tight">Notifications</h1>
                <p className="text-muted-foreground font-medium mt-1">Stay updated with your latest team activities and task changes.</p>
            </div>

            <div className="bg-card border border-border rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mb-6 border border-border/50">
                    <BellOff className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No notifications yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs font-medium">
                    When you get notifications about your tasks or projects, they will appear right here.
                </p>
            </div>
        </div>
    );
};

