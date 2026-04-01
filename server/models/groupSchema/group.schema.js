import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },

    status: {
      type: String,
      enum: ["accepted"], // only real users stored here
      default: "accepted",
    },

    memberCode: {
      type: String,
      required: true,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    groupCode: {
      type: String,
      required: true,
      unique: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [memberSchema],
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;