import express from "express";
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:projectId/tasks", authMiddleware, createTask);
router.get("/:projectId/tasks", authMiddleware, getTasksByProject);
router.put("/task/:id", authMiddleware, updateTask);
router.delete("/task/:id", authMiddleware, deleteTask);

export default router;
