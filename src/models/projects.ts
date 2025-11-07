/**
 * Project
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Project response
 */
export interface ProjectResponse {
  project: Project;
}

/**
 * Projects response
 */
export interface ProjectsResponse {
  projects: Project[];
}

