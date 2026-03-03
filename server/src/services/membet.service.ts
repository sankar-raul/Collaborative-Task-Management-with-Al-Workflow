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
}

export default MemberService;