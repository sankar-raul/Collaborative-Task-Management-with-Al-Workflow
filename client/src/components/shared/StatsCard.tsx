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
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-lg ${bgClass} ${colorClass}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
        </div>
    );
};
