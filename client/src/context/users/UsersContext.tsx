import { createContext, useState, useEffect, type ReactNode } from "react";
import type { Member } from "../../@types/interface/MembersInterface";
import { api } from "../../utils/api";
import { useAuth } from "../auth";

export interface IUsersContextType {
    systemUsers: Member[];
    isLoading: boolean;
    error: string | null;
    refreshUsers: () => Promise<void>;
}

export const UsersContext = createContext<IUsersContextType | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
    const [systemUsers, setSystemUsers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { member } = useAuth(); // We need auth to fetch users

    const refreshUsers = async () => {
        // Only fetch if a user is actually logged in and is an Admin
        if (!member || member.role !== "Admin") return;

        try {
            setIsLoading(true);
            setError(null);
            // Fetch a large enough limit to get all users, or handle pagination later
            const response = await api.members.getAllMembers(1, 100);
            if (response.success) {
                setSystemUsers(response.data);
            } else {
                setError("Failed to fetch members");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching members");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUsers();
    }, [member]); // Refresh when the auth member changes (like on login)

    return (
        <UsersContext.Provider value={{ systemUsers, isLoading, error, refreshUsers }}>
            {children}
        </UsersContext.Provider>
    );
};
