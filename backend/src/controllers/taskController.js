import { prisma } from "../app.js";
import { ROLES, canManageProject } from "../utils/roles.js";

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, dueDate, priority, assignedTo } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!canManageProject(req.user, project)) {
      return res.status(403).json({ message: "Only admin can create tasks" });
    }

    // Validate assignee is a project member
    if (assignedTo) {
      const member = await prisma.projectMember.findUnique({
        where: {
          user_id_project_id: {
            user_id: assignedTo,
            project_id: parseInt(projectId),
          },
        },
      });

      if (!member) {
        return res.status(400).json({ message: "Assignee is not a member of this project" });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || "",
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || "Medium",
        status: "To Do",
        projectId: parseInt(projectId),
        assignedTo: assignedTo || null,
      },
      include: { assignee: { select: { id: true, name: true, email: true } } },
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check membership
    const member = await prisma.projectMember.findUnique({
      where: {
        user_id_project_id: {
          user_id: userId,
          project_id: parseInt(projectId),
        },
      },
    });

    if (req.user.role !== ROLES.ADMIN && !member) {
      return res.status(403).json({ message: "You are not a member of this project" });
    }

    const tasks = await prisma.task.findMany({
      where: { projectId: parseInt(projectId) },
      include: { assignee: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const { title, description, dueDate, priority, status, assignedTo } = req.body;
    const userId = req.user.id;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(taskId) },
      include: { project: true },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAdmin = canManageProject(req.user, task.project);
    const isAssignee = task.assignedTo === userId;

    // Members can only update status of their assigned tasks
    if (!isAdmin && !isAssignee) {
      return res.status(403).json({ message: "You cannot update this task" });
    }

    // Only admin can change title, description, priority, dueDate, or assignee
    if (!isAdmin && (title || description || priority || dueDate || assignedTo)) {
      return res.status(403).json({
        message: "Only admin can modify task details. Members can only change status.",
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (assignedTo !== undefined) {
      if (assignedTo) {
        const member = await prisma.projectMember.findUnique({
          where: {
            user_id_project_id: {
              user_id: assignedTo,
              project_id: task.projectId,
            },
          },
        });

        if (!member) {
          return res.status(400).json({ message: "Assignee is not a member of this project" });
        }
      }
      updateData.assignedTo = assignedTo;
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: updateData,
      include: { assignee: { select: { id: true, name: true, email: true } } },
    });

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const userId = req.user.id;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(taskId) },
      include: { project: true },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!canManageProject(req.user, task.project)) {
      return res.status(403).json({ message: "Only admin can delete tasks" });
    }

    await prisma.task.delete({
      where: { id: parseInt(taskId) },
    });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};
