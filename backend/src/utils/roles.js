export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  MEMBER: "MEMBER",
};

export const VALID_ROLES = Object.values(ROLES);

export const canCreateProject = (role) => [ROLES.ADMIN, ROLES.MANAGER].includes(role);

export const canManageProject = (user, project) =>
  user?.role === ROLES.ADMIN || project?.admin_id === user?.id;
