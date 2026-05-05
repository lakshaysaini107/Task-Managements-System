import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  addMember,
  removeMember,
} from "../controllers/projectController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getAllProjects);
router.get("/:id", authMiddleware, getProjectById);
router.post("/:id/members", authMiddleware, addMember);
router.delete("/:id/members/:userId", authMiddleware, removeMember);

export default router;
