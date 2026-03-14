import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    colorClass: string;
    bgClass: string;
}

export const StatsCard = ({
    title,
    value,
    icon: Icon,
    colorClass,
    bgClass
}: StatsCardProps) => {
    return (
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center space-x-4 hover:shadow-md transition-all">
            <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <h3 className="text-2xl font-bold text-foreground">{value}</h3>
            </div>
        </div>
    );
};
