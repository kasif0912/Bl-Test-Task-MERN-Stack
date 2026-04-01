import User from "../models/userSchema/user.schema.js";
import Group from "../models/groupSchema/group.schema.js";

export const getAllUsers = async (req, res) => {
  try {
    const { groupId, search = "" } = req.query;

    let excludedUserIds = [req.user.userId];

    if (groupId) {
      const group = await Group.findById(groupId);

      if (!group) {
        return res.status(404).json({
          success: false,
          message: "Group not found",
        });
      }

      const isMember = group.members.some(
        (member) => member.user.toString() === req.user.userId
      );

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to view users for this group",
        });
      }

      const memberIds = group.members.map((member) => member.user.toString());
      excludedUserIds = [...excludedUserIds, ...memberIds];
    }

    const query = {
      _id: { $nin: excludedUserIds },
    };

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};