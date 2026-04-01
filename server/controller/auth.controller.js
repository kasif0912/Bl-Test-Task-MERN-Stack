import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { generateMemberCode } from "../utils/generateCode.js";
import User from "../models/userSchema/user.schema.js";
import GroupInvite from "../models/groupInvite/groupInvite.schema.js";
import Group from "../models/groupSchema/group.schema.js";

export const register = async (req, res) => {
  try {
    let { name, email, phone, password, inviteToken } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    let invite = null;

    if (inviteToken) {
      invite = await GroupInvite.findOne({ token: inviteToken });

      if (!invite) {
        return res.status(400).json({
          success: false,
          message: "Invalid invite link",
        });
      }

      if (invite.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Invite already used or inactive",
        });
      }

      if (invite.expiresAt < new Date()) {
        invite.status = "expired";
        await invite.save();

        return res.status(400).json({
          success: false,
          message: "Invite link has expired",
        });
      }

      if (invite.email !== email) {
        return res.status(400).json({
          success: false,
          message: "Please register with the invited email address",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    // auto add to group if invite token exists
    if (invite) {
      const group = await Group.findById(invite.group);

      if (group) {
        const alreadyMember = group.members.some(
          (member) => member.user.toString() === user._id.toString()
        );

        if (!alreadyMember) {
          group.members.push({
            user: user._id,
            role: "member",
            memberCode: generateMemberCode(group),
          });

          await group.save();
        }

        invite.status = "accepted";
        await invite.save();
      }
    }

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: invite
        ? "Registration successful and joined group"
        : "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
