import { prisma } from "../app.js";

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description || "",
        admin_id: userId,
        members: {
          create: {
            user_id: userId,
          },
        },
      },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            user_id: userId,
          },
        },
      },
      include: {
        admin: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        tasks: true,
      },
    });

    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        admin: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        tasks: { include: { assignee: { select: { id: true, name: true, email: true } } } },
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is a member
    const isMember = project.members.some((m) => m.user_id === userId);
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this project" });
    }

    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { userId, email } = req.body;
    const adminId = req.user.id;

    if (!userId && !email) {
      return res.status(400).json({ message: "User ID or email is required" });
    }

    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.admin_id !== adminId) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    const user = userId
      ? await prisma.user.findUnique({ where: { id: parseInt(userId) } })
      : await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingMember = await prisma.projectMember.findUnique({
      where: {
        user_id_project_id: {
          user_id: user.id,
          project_id: parseInt(projectId),
        },
      },
    });

    if (existingMember) {
      return res.status(409).json({ message: "User is already a member of this project" });
    }

    const member = await prisma.projectMember.create({
      data: {
        user_id: user.id,
        project_id: parseInt(projectId),
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    res.status(201).json({
      message: "Member added successfully",
      member,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding member", error: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { id: projectId, userId } = req.params;
    const adminId = req.user.id;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.admin_id !== adminId) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    const member = await prisma.projectMember.findUnique({
      where: {
        user_id_project_id: {
          user_id: parseInt(userId),
          project_id: parseInt(projectId),
        },
      },
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found in this project" });
    }

    // Unassign all tasks from this user in the project
    await prisma.task.updateMany({
      where: {
        assignedTo: parseInt(userId),
        projectId: parseInt(projectId),
      },
      data: {
        assignedTo: null,
      },
    });

    await prisma.projectMember.delete({
      where: {
        user_id_project_id: {
          user_id: parseInt(userId),
          project_id: parseInt(projectId),
        },
      },
    });

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing member", error: error.message });
  }
};
