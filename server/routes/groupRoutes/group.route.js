import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import {
  addRegisteredMember,
  createGroup,
  getMyGroups,
  getSingleGroup,
  inviteMember,
} from "../../controller/group.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, createGroup);
router.get("/my-groups", authMiddleware, getMyGroups);
router.get("/:groupId", authMiddleware, getSingleGroup);
router.post("/:groupId/add-member", authMiddleware, addRegisteredMember);
router.post("/:groupId/invite", authMiddleware, inviteMember);

export default router;