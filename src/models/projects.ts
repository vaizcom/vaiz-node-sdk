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

/**
 * Get project history request
 */
export interface GetProjectHistoryRequest {
  projectId: string;
  limit?: number;
  offset?: number;
}

/**
 * Get project history response
 */
export interface GetProjectHistoryResponse {
  histories: Array<{
    id: string;
    kind: 'Project';
    action: string;
    userId: string;
    createdAt: string;
    changes?: Record<string, any>;
  }>;
  total: number;
}

