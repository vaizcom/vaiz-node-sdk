import { BaseAPIClient } from './base';
import {
  CreateTaskRequest,
  EditTaskRequest,
  TaskResponse,
  TaskUploadFile,
  GetHistoryRequest,
  GetHistoryResponse,
  GetTasksRequest,
  GetTasksResponse,
  TaskFile,
} from '../models';
import { existsSync } from 'fs';
import * as crypto from 'crypto';

/**
 * Tasks API Client
 */
export class TasksAPIClient extends BaseAPIClient {
  private tasksCache: Map<string, { response: GetTasksResponse; timestamp: Date }> = new Map();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Create a new task
   */
  async createTask(
    task: CreateTaskRequest,
    description?: string,
    file?: TaskUploadFile
  ): Promise<TaskResponse> {
    // Set description if provided
    if (description) {
      task.description = description;
    }

    // Handle automatic file upload if file is provided
    if (file) {
      if (!file.path) {
        throw new Error('File object must contain path property');
      }

      const filePath = file.path;
      const fileType = file.type;

      if (!existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      // Upload the file
      const uploadResponse = await this.uploadFileInternal('upload', filePath, fileType);
      const uploadedFile = uploadResponse.file;

      // Create TaskFile and add to task.files
      const taskFile: TaskFile = {
        url: uploadedFile.url,
        name: uploadedFile.name,
        ext: uploadedFile.ext,
        id: uploadedFile.id,
        type: uploadedFile.type,
        dimension: uploadedFile.dimension,
        size: uploadedFile.size,
      };

      if (!task.files) {
        task.files = [];
      }
      task.files.push(taskFile);
    }

    const response = await this.makeRequest<TaskResponse>('createTask', 'POST', task);
    return response;
  }

  /**
   * Edit an existing task
   */
  async editTask(task: EditTaskRequest): Promise<TaskResponse> {
    const response = await this.makeRequest<TaskResponse>('editTask', 'POST', task);
    return response;
  }

  /**
   * Get task information by slug
   */
  async getTask(slug: string): Promise<TaskResponse> {
    const response = await this.makeRequest<TaskResponse>('getTask', 'POST', { slug });
    return response;
  }

  /**
   * Get history for a task or other kind
   */
  async getHistory(request: GetHistoryRequest): Promise<GetHistoryResponse> {
    const response = await this.makeRequest<GetHistoryResponse>('getHistory', 'POST', request);
    return response;
  }

  /**
   * Generate cache key for the request
   */
  private getCacheKey(request: GetTasksRequest): string {
    const requestStr = JSON.stringify(request);
    const cacheStr = `${this.spaceId}:${requestStr}`;
    return crypto.createHash('md5').update(cacheStr).digest('hex');
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(cachedTime: Date): boolean {
    return Date.now() - cachedTime.getTime() < this.cacheTTL;
  }

  /**
   * Clear all cached tasks data
   */
  clearTasksCache(): void {
    this.tasksCache.clear();
    if (this.verbose) {
      console.log('Tasks cache cleared');
    }
  }

  /**
   * Get tasks with optional filtering and pagination
   * Results are automatically cached for 5 minutes
   */
  async getTasks(request: GetTasksRequest): Promise<GetTasksResponse> {
    // Generate cache key
    const cacheKey = this.getCacheKey(request);

    // Check cache
    const cached = this.tasksCache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      if (this.verbose) {
        console.log(`Cache hit for getTasks (key: ${cacheKey.substring(0, 8)}...)`);
      }
      return cached.response;
    } else if (cached) {
      // Remove expired cache entry
      this.tasksCache.delete(cacheKey);
      if (this.verbose) {
        console.log(`Cache expired for getTasks (key: ${cacheKey.substring(0, 8)}...)`);
      }
    }

    // Make API request
    if (this.verbose) {
      console.log(`Cache miss for getTasks (key: ${cacheKey.substring(0, 8)}...)`);
    }

    const response = await this.makeRequest<GetTasksResponse>('getTasks', 'POST', request);

    // Store in cache
    this.tasksCache.set(cacheKey, {
      response,
      timestamp: new Date(),
    });

    if (this.verbose) {
      console.log(`Cached getTasks response (key: ${cacheKey.substring(0, 8)}...)`);
    }

    return response;
  }
}

