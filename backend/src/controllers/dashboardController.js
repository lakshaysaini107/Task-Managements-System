import { prisma } from "../app.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all projects the user is a member of
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: { user_id: userId },
        },
      },
      select: { id: true },
    });

    const projectIds = projects.map((p) => p.id);

    // If no projects, return empty data
    if (projectIds.length === 0) {
      return res.status(200).json({
        totalTasks: 0,
        tasksByStatus: { "To Do": 0, "In Progress": 0, Done: 0 },
        tasksByUser: [],
        overdueTasks: [],
      });
    }

    // Get total tasks
    const totalTasks = await prisma.task.count({
      where: { projectId: { in: projectIds } },
    });

    // Group tasks by status
    const tasksByStatus = await prisma.task.groupBy({
      by: ["status"],
      where: { projectId: { in: projectIds } },
      _count: true,
    });

    const statusMap = {
      "To Do": 0,
      "In Progress": 0,
      Done: 0,
    };

    tasksByStatus.forEach(({ status, _count }) => {
      statusMap[status] = _count;
    });

    // Group tasks by assigned user
    const tasksByUser = await prisma.task.groupBy({
      by: ["assignedTo"],
      where: { projectId: { in: projectIds }, assignedTo: { not: null } },
      _count: true,
    });

    const tasksByUserWithNames = await Promise.all(
      tasksByUser.map(async ({ assignedTo, _count }) => {
        const user = await prisma.user.findUnique({
          where: { id: assignedTo },
          select: { id: true, name: true, email: true },
        });
        return { user, count: _count };
      })
    );

    // Get overdue tasks (dueDate < today AND status != Done)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = await prisma.task.findMany({
      where: {
        projectId: { in: projectIds },
        dueDate: { lt: today },
        status: { not: "Done" },
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: { dueDate: "asc" },
    });

    res.status(200).json({
      totalTasks,
      tasksByStatus: statusMap,
      tasksByUser: tasksByUserWithNames,
      overdueTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
  }
};
