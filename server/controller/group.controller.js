import crypto from "crypto";

import {
  generateGroupCode,
  generateMemberCode,
} from "../utils/generateCode.js";
import Group from "../models/groupSchema/group.schema.js";
import User from "../models/userSchema/user.schema.js";
import sendInviteEmail from "../utils/sendInviteEmail.js";
import GroupInvite from "../models/groupInvite/groupInvite.schema.js";

// ================= CREATE GROUP =================
export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Group name is required",
      });
    }

    const group = await Group.create({
      name,
      groupCode: generateGroupCode(),
      createdBy: req.user.userId,
      members: [
        {
          user: req.user.userId,
          role: "admin", // ✅ important
          memberCode: "MEM-001",
        },
      ],
    });

    const populatedGroup = await Group.findById(group._id)
      .populate("createdBy", "name email")
      .populate("members.user", "name email phone");

    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      group: populatedGroup,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET MY GROUPS =================
export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      "members.user": req.user.userId,
    })
      .populate("createdBy", "name email")
      .populate("members.user", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      groups,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE GROUP =================
export const getSingleGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate("createdBy", "name email")
      .populate("members.user", "name email phone");

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const isMember = group.members.some(
      (member) => member.user._id.toString() === req.user.userId
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    return res.status(200).json({
      success: true,
      group,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= ADD REGISTERED MEMBER =================
export const addRegisteredMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

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
        message: "Only group members can add others",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found. Use invite API.",
      });
    }

    const alreadyMember = group.members.some(
      (m) => m.user.toString() === existingUser._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: "User already in group",
      });
    }

    group.members.push({
      user: existingUser._id,
      role: "member",
      memberCode: generateMemberCode(group), // ✅ better
    });

    await group.save();

    return res.status(200).json({
      success: true,
      message: "User added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= INVITE MEMBER (NEW) =================
export const inviteMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const isMember = group.members.some(
      (m) => m.user.toString() === req.user.userId
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Only group members can invite",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 🔥 check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });

    // console.log(existingUser);
    if (existingUser) {
      const alreadyMember = group.members.some(
        (m) => m.user.toString() === existingUser._id.toString()
      );

      if (alreadyMember) {
        return res.status(400).json({
          success: false,
          message: "User already in group",
        });
      }

      group.members.push({
        user: existingUser._id,
        role: "member",
        memberCode: generateMemberCode(group),
      });

      await group.save();

      return res.status(200).json({
        success: true,
        message: "User added directly (already registered)",
      });
    }

    // 🔥 create invite
    const token = crypto.randomBytes(32).toString("hex");

    await GroupInvite.create({
      group: groupId,
      email: normalizedEmail,
      invitedBy: req.user.userId,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    const inviteLink = `https://jade-dolphin-f29338.netlify.app/signup?inviteToken=${token}`;

    await sendInviteEmail(normalizedEmail, inviteLink);

    return res.status(200).json({
      success: true,
      message: "Invite sent",
      inviteLink, // for testing
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
