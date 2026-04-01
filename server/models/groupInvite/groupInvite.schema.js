import mongoose from "mongoose";

const groupInviteSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "expired"],
      default: "pending",
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const GroupInvite = mongoose.model("GroupInvite", groupInviteSchema);

export default GroupInvite;
