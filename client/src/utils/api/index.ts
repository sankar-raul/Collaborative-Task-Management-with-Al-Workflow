import { login, me, register } from "./auth/auth.api";
import { getAllMembers } from "./members/members.api";

export const api = {
    auth: {
        me,
        login,
        register
    },
    members: {
        getAllMembers
    }
};
