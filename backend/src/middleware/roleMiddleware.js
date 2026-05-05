import { prisma } from "../app.js";

export const isProjectAdmin = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.admin_id !== userId) {
      return res.status(403).json({ message: "Only admin can perform this action" });
    }

    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking admin privileges", error: error.message });
  }
};

export const isProjectMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const membership = await prisma.projectMember.findUnique({
      where: {
        user_id_project_id: {
          user_id: userId,
          project_id: parseInt(projectId),
        },
      },
    });

    if (!membership) {
      return res.status(403).json({ message: "You are not a member of this project" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking project membership", error: error.message });
  }
};
