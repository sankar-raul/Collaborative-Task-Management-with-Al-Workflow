import UserModel from "@/models/user/user.model";

class MemberService {
  static async getAllMembers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [members, total] = await Promise.all([
      UserModel.find().skip(skip).limit(limit),
      UserModel.countDocuments(),
    ]);

    return {
      members,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getSkillsByMemberId(memberId: string) {
    const member = await UserModel.findById(memberId);
    if (!member) {
      throw new Error("Member not found");
    }
    return member.skills;
  }

  static async getMemberById(memberId: string) {
    const member = await UserModel.findById(memberId);
    if (!member) {
      throw new Error("Member not found");
    }
    return member;
  }

  static async searchMembers(
    query: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const regex = new RegExp(query, "i"); // case-insensitive search
    const [members, total] = await Promise.all([
      UserModel.find({ $or: [{ name: regex }, { email: regex }] })
        .skip(skip)
        .limit(limit),
      UserModel.countDocuments({ $or: [{ name: regex }, { email: regex }] }),
    ]);

    return {
      members,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateMember(
    memberId: string,
    updateData: Partial<{
      name?: string;
      email?: string;
      skills?: string[];
      availabilityHours?: number;
    }>,
  ) {
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error("No update data provided");
    }

    // Remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined),
    );

    if (Object.keys(cleanData).length === 0) {
      throw new Error("No valid update data provided");
    }

    const member = await UserModel.findByIdAndUpdate(memberId, cleanData, {
      returnDocument: "after",
    });
    if (!member) {
      throw new Error("Member not found");
    }
    return member;
  }

  static async approveUser(userId: string) {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { isApproved: true },
      { returnDocument: "after" },
    );
    if (!user) {
      throw new Error("User not found");
    } else if (user.isApproved) {
      throw new Error("User is already approved");
    }
    return user;
  }

  static async rejectUser(userId: string) {
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      throw new Error("User not found");
    } else if (user.isApproved) {
      throw new Error("Cannot reject an already approved user");
    }
  }
}

export default MemberService;
