import type { ProjectStatus } from "../ProjectDTO";

  export const ProjectStatusLabels: Record<ProjectStatus, string> = {
    DRAFT: "Draft",
    OPEN: "Open",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
    STOPPED: "Stopped",
  };
