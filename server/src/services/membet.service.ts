import UserModel from "@/models/user/user.model";

class MemberService {

    static async getAllMembers(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [members, total] = await Promise.all([
            UserModel.find().skip(skip).limit(limit),
            UserModel.countDocuments()
        ]);

        return {
            members,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    static async getMemberById(memberId: string) {
        const member = await UserModel.findById(memberId);
        if (!member) {
            throw new Error("Member not found");
        }
        return member;
    }

    static async searchMembers(query: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const regex = new RegExp(query, "i"); // case-insensitive search
        const [members, total] = await Promise.all([
            UserModel.find({ $or: [{ name: regex }, { email: regex }] }).skip(skip).limit(limit),
            UserModel.countDocuments({ $or: [{ name: regex }, { email: regex }] })
        ]);

        return {
            members,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
}

export default MemberService;