import { BaseAPIClient } from './base';
import {
  ProjectResponse,
  ProjectsResponse,
  GetProjectHistoryRequest,
  GetProjectHistoryResponse,
} from '../models';

/**
 * Projects API Client
 */
export class ProjectsAPIClient extends BaseAPIClient {
  /**
   * Get all projects
   */
  async getProjects(): Promise<ProjectsResponse> {
    const response = await this.makeRequest<ProjectsResponse>('getProjects', 'POST');
    return response;
  }

  /**
   * Get a specific project by ID
   */
  async getProject(projectId: string): Promise<ProjectResponse> {
    const response = await this.makeRequest<ProjectResponse>('getProject', 'POST', { projectId });
    return response;
  }

  /**
   * Get history for a specific project
   */
  async getProjectHistory(request: GetProjectHistoryRequest): Promise<GetProjectHistoryResponse> {
    const response = await this.makeRequest<GetProjectHistoryResponse>('getHistory', 'POST', {
      kind: 'Project',
      kindId: request.projectId,
      limit: request.limit,
      offset: request.offset,
    });
    return response;
  }
}

